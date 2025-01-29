import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

interface CryptoChartProps {
  symbol: string;
  timeframe: string;
  data: any[];
}

export const CryptoChart: React.FC<CryptoChartProps> = ({ symbol, timeframe, data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
      });

      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(data);

      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [data]);

  return (
    <div className="w-full">
      <div className="text-lg font-semibold mb-2">
        {symbol} - {timeframe} Chart
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};