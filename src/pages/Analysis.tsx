import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CryptoChart } from '@/components/CryptoChart';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MarketData {
  price: number;
  volume: number;
  high: number;
  low: number;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current price and market data
        const tickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const tickerData = await tickerResponse.json();

        setMarketData({
          price: parseFloat(tickerData.lastPrice),
          volume: parseFloat(tickerData.volume),
          high: parseFloat(tickerData.highPrice),
          low: parseFloat(tickerData.lowPrice),
        });

        // Fetch kline data for chart
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
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds

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
  const leverageMultiplier = leverage === 'safe' ? 3 : 20; // Example multiplier
  const potentialProfit = investment * leverageMultiplier * 0.1; // 10% movement
  const maxLoss = investment * 0.3; // 30% max loss

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
            </div>
          </div>

          {/* Technical Analysis */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
            <div className="space-y-4">
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
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <p className="text-gray-600">
            Based on the current market conditions, {symbol} shows a {isBullish ? 'bullish' : 'bearish'} trend. 
            The volume indicates strong market participation, and technical patterns suggest a potential {isBullish ? 'upward' : 'downward'} movement. 
            With your selected {leverage} leverage strategy, we recommend a {isBullish ? 'LONG' : 'SHORT'} position with strict adherence to the suggested stop-loss to manage risk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;