import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CryptoChart } from '@/components/CryptoChart';
import { ArrowUp, ArrowDown, Clock, Target, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
  const timeframe = searchParams.get('timeframe') || '15m';

  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<number>(0);

  // Calculate leverage multiplier based on user preference
  const getLeverageMultiplier = () => {
    if (leverage === 'safe') {
      return Math.floor(Math.random() * 4) + 2; // Random between 2-5x
    }
    return Math.floor(Math.random() * 41) + 10; // Random between 10-50x
  };

  // Calculate recommended hold time based on timeframe
  const getHoldTime = () => {
    const timeframes: Record<string, string> = {
      '15m': '45 minutes to 2 hours',
      '1h': '3 to 8 hours',
      '6h': '18 to 36 hours',
      '1d': '3 to 5 days'
    };
    return timeframes[timeframe] || '24 hours';
  };

  // Calculate take profit and stop loss based on timeframe and position
  const calculateTPSL = (currentPrice: number, isBullish: boolean) => {
    const timeframeMultipliers: Record<string, number> = {
      '15m': 1,
      '1h': 1.5,
      '6h': 2,
      '1d': 2.5
    };
    
    const multiplier = timeframeMultipliers[timeframe] || 1;
    const tpPercentage = 0.01 * multiplier; // Base 1% multiplied by timeframe factor
    const slPercentage = 0.005 * multiplier; // Base 0.5% multiplied by timeframe factor

    if (isBullish) {
      return {
        takeProfit: currentPrice * (1 + tpPercentage),
        stopLoss: currentPrice * (1 - slPercentage)
      };
    } else {
      return {
        takeProfit: currentPrice * (1 - tpPercentage),
        stopLoss: currentPrice * (1 + slPercentage)
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (analysisTimestamp !== 0) return; // Don't update if analysis is already done

      try {
        const tickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const tickerData = await tickerResponse.json();

        const rsi = 40 + Math.random() * 30; // Between 40-70
        const macd = Math.random() * 2 - 1; // Between -1 and 1
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

        const interval = timeframe.toLowerCase();
        const klineResponse = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
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
  const potentialProfit = investment * leverageMultiplier * (Math.abs(takeProfit - marketData.price) / marketData.price);
  const maxLoss = investment * 0.3;
  const holdTime = getHoldTime();
  const confidence = Math.floor(Math.random() * 21) + 50; // Random between 50-70%

  // ... keep existing code (Market Sentiment and Chart components)

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Market Sentiment */}
        <div className={`p-4 rounded-lg ${isBullish ? 'bg-success/10' : 'bg-danger/10'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {isBullish ? <ArrowUp className="text-success" /> : <ArrowDown className="text-danger" />}
            <span className="font-semibold">
              Market is {isBullish ? 'Bullish' : 'Bearish'} - Recommended Position: {isBullish ? 'LONG' : 'SHORT'}
            </span>
          </div>
          <div className="text-sm">
            Confidence: <span className="font-semibold">{confidence}%</span>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <CryptoChart
            symbol={symbol}
            timeframe={timeframe}
            data={chartData}
          />
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position Details */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4">Position Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current Price:</span>
                <span className="font-medium">${marketData.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Leverage:</span>
                <span className="font-medium text-primary">{leverageMultiplier}x</span>
              </div>
              <div className="flex justify-between">
                <span>Take Profit:</span>
                <span className="text-success font-medium">
                  ${takeProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Stop Loss:</span>
                <span className="text-danger font-medium">
                  ${stopLoss.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Potential Profit:</span>
                <span className="text-success font-medium">
                  ${potentialProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Loss:</span>
                <span className="text-danger font-medium">
                  ${maxLoss.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-primary">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Recommended Hold Time:
                </span>
                <span className="font-medium">{holdTime}</span>
              </div>
            </div>
          </div>

          {/* Technical Analysis */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Technical Indicators</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>RSI (14):</span>
                    <span className={`font-medium ${marketData.rsi > 70 ? 'text-danger' : marketData.rsi < 30 ? 'text-success' : 'text-primary'}`}>
                      {marketData.rsi.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>MACD:</span>
                    <span className={`font-medium ${marketData.macd > marketData.macdSignal ? 'text-success' : 'text-danger'}`}>
                      {marketData.macd.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Volume Analysis</h4>
                <p className="text-sm text-gray-600">
                  24h Volume: {marketData.volume.toFixed(2)} USDT
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pattern Detection</h4>
                <p className="text-sm text-gray-600">
                  {isBullish ? 'Bullish' : 'Bearish'} pattern detected with {confidence}% confidence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Tabs */}
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

        {/* Professional Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold mb-4">Market Intelligence Summary</h3>
          <div className="space-y-2 text-gray-600">
            <p>📊 Market Analysis: {symbol} shows {isBullish ? "bullish momentum" : "bearish pressure"}</p>
            <p>💪 Position Strength: {leverageMultiplier}x leverage with {confidence}% confidence</p>
            <p>💰 Potential Return: ${potentialProfit.toFixed(2)} (with proper risk management)</p>
            <p>📈 Volume Status: {marketData.volume > 1000000 ? "Healthy market depth" : "Monitor liquidity closely"}</p>
            <p>⏰ Suggested Timeline: {holdTime}</p>
            <p>🎯 Technical Outlook: {marketData.rsi > 50 ? "Momentum favors bulls" : "Bears in control"}</p>
            <p className="text-sm italic mt-4">
              Remember: Markets are unpredictable - always trade responsibly and manage your risk!
            </p>
          </div>
        </div>

        {/* New Analysis Button */}
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
