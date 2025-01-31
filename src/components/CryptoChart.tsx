import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

interface CryptoChartProps {
  symbol: string;
  timeframe: string;
  data: any[];
}

export const CryptoChart: React.FC<CryptoChartProps> = ({ symbol, timeframe, data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });

      const series = chart.addCandlestickSeries();
      series.setData(data);

      return () => chart.remove();
    }
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};
