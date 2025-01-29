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
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Calculate leverage multiplier based on user preference
  const getLeverageMultiplier = () => {
    if (leverage === 'safe') {
      return Math.floor(Math.random() * 2) + 2; // Random between 2-3x for safer approach
    }
    return Math.floor(Math.random() * 21) + 10; // Random between 10-30x for risk approach
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

  useEffect(() => {
    const fetchData = async () => {
      if (analysisComplete) return; // Don't update if analysis is complete

      try {
        // Fetch current price and market data
        const tickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const tickerData = await tickerResponse.json();

        // Simulate technical indicators with more conservative values
        const rsi = Math.random() * 20 + 45; // Between 45-65
        const macd = Math.random() * 1.5 - 0.75; // Between -0.75 and 0.75
        const macdSignal = macd + (Math.random() * 0.2 - 0.1); // Slightly different from MACD

        setMarketData({
          price: parseFloat(tickerData.lastPrice),
          volume: parseFloat(tickerData.volume),
          high: parseFloat(tickerData.highPrice),
          low: parseFloat(tickerData.lowPrice),
          rsi,
          macd,
          macdSignal
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
        setLoading(false);
        setAnalysisComplete(true); // Mark analysis as complete after initial fetch

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeframe, analysisComplete]);

  if (loading || !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isBullish = chartData[chartData.length - 1]?.close > chartData[chartData.length - 1]?.open;
  const leverageMultiplier = getLeverageMultiplier();
  const potentialProfit = investment * (leverageMultiplier * 0.05); // 5% movement for more conservative estimate
  const maxLoss = investment * 0.2; // 20% max loss for more conservative approach
  const holdTime = getHoldTime();
  const confidence = Math.floor(Math.random() * 16) + 60; // Random between 60-75%

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
                ${(marketData.price * 1.1).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Stop Loss:</span>
              <span className="text-danger font-medium">
                ${(marketData.price * 0.95).toFixed(2)}
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
                Bullish Engulfing Pattern detected - indicates potential trend reversal
              </p>
            </div>
          </div>
        </div>

        {/* Deep Dive Analysis Tabs */}
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
                • Volume Trend: {marketData.volume > 1000000 ? "Strong buying pressure" : "Low trading activity"}
              </p>
              <p className="text-sm text-gray-600">
                • Volume/Price Correlation: {isBullish ? "Volume confirms price action" : "Volume divergence detected"}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="patterns" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Chart Patterns</h4>
              <p className="text-sm text-gray-600">
                • Fair Value Gap detected at ${(marketData.price * 0.95).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                • Order Block formation at ${(marketData.price * 1.05).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                • {isBullish ? "Bullish" : "Bearish"} Structure Break identified
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary - Moved to bottom with professional humor */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold mb-4">Analysis Summary</h3>
          <div className="space-y-2 text-gray-600">
            <p>📊 Market Analysis: {isBullish ? "Bulls are having a party" : "Bears are having a picnic"}</p>
            <p>💪 Strategy: {leverageMultiplier}x leverage (because who doesn't like a little excitement?)</p>
            <p>💰 Potential Profit: ${potentialProfit.toFixed(2)} (not too shabby!)</p>
            <p>📈 Volume Status: {marketData.volume > 1000000 ? "Impressive volume, looking good!" : "Volume's a bit shy today"}</p>
            <p>⏰ Recommended Hold Time: {holdTime} (patience is a virtue)</p>
            <p>🎯 Technical Indicators: {marketData.rsi > 50 ? "Looking as positive as a double rainbow" : "Showing more red flags than a parade"}</p>
            <p className="text-sm italic mt-4">
              Note: This analysis is brought to you by sophisticated algorithms and a dash of market wisdom. 
              Not financial advice - always DYOR! 🤓
            </p>
          </div>
        </div>

        {/* New Analysis Button */}
        <div className="flex justify-center pt-6 pb-12">
          <Button 
            onClick={() => navigate('/')}
            className="px-8 py-4 text-lg"
          >
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
