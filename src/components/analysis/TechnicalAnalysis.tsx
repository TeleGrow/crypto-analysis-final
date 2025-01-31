import React from 'react';

export const TechnicalAnalysis = ({ marketData, chartData }: any) => {
  return (
    <div className="bg-white p-4">
      <h3 className="text-lg font-semibold">Technical Analysis</h3>
      <p>📈 ATR (Volatility Indicator): {marketData.atr.toFixed(2)}</p>
      <p>📉 Order Flow: {marketData.orderFlow > 0 ? 'More Buyers' : 'More Sellers'}</p>

      <h4 className="mt-4 font-semibold">Liquidity Pools</h4>
      {marketData.liquidityPools.map((pool: any, i: number) => (
        <p key={i}>Liquidity Pool at {pool.price} (Volume: {pool.volume})</p>
      ))}
    </div>
  );
};
