import React from 'react';

export const PositionDetails = ({ marketData }: any) => {
  const stopLoss = marketData.price - marketData.atr * 1.5; // ATR-based SL
  const leverageMultiplier = marketData.suggestedLeverage;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">Position Details</h3>
      <p>📌 Current Price: ${marketData.price.toFixed(2)}</p>
      <p>⚡ Suggested Leverage: {leverageMultiplier}x</p>
      <p>🛑 Stop Loss (ATR-based): ${stopLoss.toFixed(2)}</p>
    </div>
  );
};
