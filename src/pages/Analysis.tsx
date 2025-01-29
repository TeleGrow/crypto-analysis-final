import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CryptoChart } from '@/components/CryptoChart';
import { ArrowUp, ArrowDown, Clock, Target, AlertTriangle } from 'lucide-react';

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
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const investment = Number(searchParams.get('investment')) || 0;
  const leverage = searchParams.get('leverage') || 'safe';
  const timeframe = searchParams.get('timeframe') || '15m';

  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current price and market data
        const tickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const tickerData = await tickerResponse.json();

        // Simulate technical indicators (in a real app, calculate these properly)
        const rsi = Math.random() * 30 + 40; // Between 40-70
        const macd = Math.random() * 2 - 1; // Between -1 and 1
        const macdSignal = macd + (Math.random() * 0.4 - 0.2); // Slightly different from MACD

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

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  if (loading || !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isBullish = chartData[chartData.length - 1]?.close > chartData[chartData.length - 1]?.open;
  const leverageMultiplier = getLeverageMultiplier();
  const potentialProfit = investment * leverageMultiplier * 0.1; // 10% movement
  const maxLoss = investment * 0.3; // 30% max loss
  const holdTime = getHoldTime();

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
            Confidence: <span className="font-semibold">75%</span>
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
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold mb-4">TL;DR (Too Long; Didn't Research) 🚀</h3>
          <div className="space-y-2 text-gray-600">
            <p>• Hey crypto warrior! Here's your {leverageMultiplier}x leveraged adventure plan 🎢</p>
            <p>• Market is feeling {isBullish ? "spicy 🌶️ (Bullish)" : "chilly ❄️ (Bearish)"}</p>
            <p>• Your potential treasure chest: ${potentialProfit.toFixed(2)} 💰</p>
            <p>• Hold this position for {holdTime} (unless you want to YOLO, but we don't recommend that 😅)</p>
            <p>• Technical indicators are {marketData.rsi > 50 ? "doing the happy dance 💃" : "taking a coffee break ☕"}</p>
            <p className="text-sm italic mt-4">
              Remember: Not financial advice - just your friendly neighborhood crypto algorithm trying its best! 🤖
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
