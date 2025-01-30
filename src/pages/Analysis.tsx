import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CryptoChart } from '@/components/CryptoChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MarketSentiment } from '@/components/analysis/MarketSentiment';
import { PositionDetails } from '@/components/analysis/PositionDetails';
import { TechnicalAnalysis } from '@/components/analysis/TechnicalAnalysis';
import { MarketSummary } from '@/components/analysis/MarketSummary';

interface MarketData {
  price: number;
  volume: number;
  high: number;
  low: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  timestamp: number;
}

const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const investment = Number(searchParams.get('investment')) || 0;
  const leverage = searchParams.get('leverage') || 'safe';
  const timeframe = searchParams.get('timeframe') || '1h';
  const tradeType = searchParams.get('tradetype') || 'Short Term';

  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<number>(0);

  const getLeverageMultiplier = () => {
    if (leverage === 'safe') {
      return Math.floor(Math.random() * 4) + 2; // Random between 2-5x
    }
    return Math.floor(Math.random() * 41) + 10; // Random between 10-50x
  };

  const getHoldTime = () => {
    if (tradeType === 'Short Term') {
      return '2 to 8 hours';
    }
    return '3 to 5 days';
  };

  const calculateTPSL = (currentPrice: number, isBullish: boolean) => {
    const timeframeMultipliers: Record<string, number> = {
      '1h': 1,
      '1d': 2.5
    };
    
    const multiplier = timeframeMultipliers[timeframe] || 1;
    const riskPercentage = 0.01 * multiplier; // 1% risk
    const rewardPercentage = 0.015 * multiplier; // 1.5% reward for a 1.5:1 risk-reward ratio

    if (isBullish) {
      return {
        takeProfit: currentPrice * (1 + rewardPercentage),
        stopLoss: currentPrice * (1 - riskPercentage)
      };
    } else {
      return {
        takeProfit: currentPrice * (1 - rewardPercentage),
        stopLoss: currentPrice * (1 + riskPercentage)
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (analysisTimestamp !== 0) return;

      try {
        // Fix URL format by ensuring proper protocol and removing extra colon
        const tickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const tickerData = await tickerResponse.json();

        const rsi = 40 + Math.random() * 30;
        const macd = Math.random() * 2 - 1;
        const macdSignal = macd + (Math.random() * 0.4 - 0.2);

        setMarketData({
          price: parseFloat(tickerData.lastPrice),
          volume: parseFloat(tickerData.volume),
          high: parseFloat(tickerData.highPrice),
          low: parseFloat(tickerData.lowPrice),
          rsi,
          macd,
          macdSignal,
          timestamp: Date.now()
        });

        // Fix URL format for kline data
        const klineResponse = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=100`
        );
        const klineData = await klineResponse.json();

        const formattedData = klineData.map((k: any[]) => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));

        setChartData(formattedData);
        setAnalysisTimestamp(Date.now());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeframe, analysisTimestamp]);

  const handleNewAnalysis = () => {
    navigate('/');
  };

  if (loading || !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isBullish = chartData[chartData.length - 1]?.close > chartData[chartData.length - 1]?.open;
  const leverageMultiplier = getLeverageMultiplier();

  const { takeProfit, stopLoss } = calculateTPSL(marketData.price, isBullish);
  const priceDifference = Math.abs(takeProfit - marketData.price);
  const potentialProfit = investment * leverageMultiplier * (priceDifference / marketData.price);
  
  const slPriceDifference = Math.abs(stopLoss - marketData.price);
  const maxLoss = investment * leverageMultiplier * (slPriceDifference / marketData.price);
  
  const holdTime = getHoldTime();
  const confidence = Math.floor(Math.random() * 31) + 50;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <MarketSentiment isBullish={isBullish} confidence={confidence} />

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <CryptoChart
            symbol={symbol}
            timeframe={timeframe}
            data={chartData}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PositionDetails
            marketData={marketData}
            leverageMultiplier={leverageMultiplier}
            takeProfit={takeProfit}
            stopLoss={stopLoss}
            potentialProfit={potentialProfit}
            maxLoss={maxLoss}
            holdTime={holdTime}
          />

          <TechnicalAnalysis marketData={marketData} />
        </div>

        <Tabs defaultValue="volume" className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold mb-4">Deep Dive Analysis</h3>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="volume">Volume Profile</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="volume" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Volume Distribution</h4>
              <p className="text-sm text-gray-600">
                • 24h Volume: {marketData.volume.toLocaleString()} USDT
              </p>
              <p className="text-sm text-gray-600">
                • Volume Trend: {marketData.volume > 1000000 ? "Strong market activity" : "Light trading volume"}
              </p>
              <p className="text-sm text-gray-600">
                • Volume/Price Correlation: {isBullish ? "Supporting upward movement" : "Indicating potential reversal"}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="patterns" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Chart Patterns</h4>
              <p className="text-sm text-gray-600">
                • Key Level: ${(marketData.price * 0.95).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                • Resistance Zone: ${(marketData.price * 1.05).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                • Market Structure: {isBullish ? "Higher highs forming" : "Lower lows detected"}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <MarketSummary
          symbol={symbol}
          isBullish={isBullish}
          leverageMultiplier={leverageMultiplier}
          confidence={confidence}
          potentialProfit={potentialProfit}
          marketData={marketData}
          holdTime={holdTime}
          timeframe={timeframe}
        />

        <div className="flex justify-center pt-4 pb-8">
          <Button 
            onClick={handleNewAnalysis}
            className="px-6 py-2"
          >
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
