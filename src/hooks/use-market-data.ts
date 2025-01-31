import { useEffect, useState } from 'react';
import { calculateATR, detectLiquidityPools, getOrderFlow, suggestLeverage } from '@/lib/utils';

export const useMarketData = (symbol: string, timeframe: string) => {
  const [marketData, setMarketData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=100`);
        const data = await response.json();

        const formattedData = data.map((k: any[]) => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
          volume: parseFloat(k[5])
        }));

        const atr = calculateATR(formattedData);
        const liquidityPools = detectLiquidityPools(formattedData);
        const orderFlow = await getOrderFlow(symbol);
        const suggestedLeverage = suggestLeverage(atr);

        setMarketData({
          price: formattedData[formattedData.length - 1].close,
          atr,
          liquidityPools,
          orderFlow,
          suggestedLeverage
        });

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeframe]);

  return { marketData, chartData, loading };
};
