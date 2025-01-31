import React from 'react';

interface LiquidityPoolsProps {
  chartData: { close: number; volume: number }[];
}

export const LiquidityPools: React.FC<LiquidityPoolsProps> = ({ chartData }) => {
  const detectLiquidityPools = (candles: { close: number; volume: number }[]) => {
    // Sort by highest volume levels and select top liquidity zones
    return candles
      .map(candle => ({ price: candle.close, volume: candle.volume }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5); // Select top 5 liquidity zones
  };

  const liquidityPools = detectLiquidityPools(chartData);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">📊 Liquidity Pools</h3>
      {liquidityPools.length > 0 ? (
        <ul className="list-disc list-inside">
          {liquidityPools.map((pool, index) => (
            <li key={index} className="text-sm text-gray-700">
              High liquidity at <span className="text-blue-500 font-semibold">${pool.price.toFixed(2)}</span> (Volume: <span className="font-semibold">{pool.volume.toFixed(0)}</span>)
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No significant liquidity pools detected.</p>
      )}
    </div>
  );
};
