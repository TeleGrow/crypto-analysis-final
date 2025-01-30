import React from 'react';

interface MarketSummaryProps {
  symbol: string;
  isBullish: boolean;
  leverageMultiplier: number;
  confidence: number;
  potentialProfit: number;
  marketData: {
    volume: number;
  };
  holdTime: string;
  timeframe: string;
}

export const MarketSummary: React.FC<MarketSummaryProps> = ({
  symbol,
  isBullish,
  leverageMultiplier,
  confidence,
  potentialProfit,
  marketData,
  holdTime,
  timeframe,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">Market Intelligence Summary</h3>
      <div className="space-y-2 text-gray-600">
        <p>📊 Market Analysis: {symbol} shows {isBullish ? "bullish momentum" : "bearish pressure"} (Based on {timeframe} chart)</p>
        <p>💪 Position Strength: {leverageMultiplier}x leverage with {confidence}% confidence</p>
        <p>💰 Potential Return: ${potentialProfit.toFixed(2)} (with proper risk management)</p>
        <p>📈 Volume Status: {marketData.volume > 1000000 ? "Healthy market depth" : "Monitor liquidity closely"}</p>
        <p>⏰ Suggested Timeline: {holdTime}</p>
        <p>🎯 Technical Outlook: {isBullish ? "Momentum favors bulls" : "Bears in control"}</p>
        <p className="text-sm mt-4 text-warning">
          Do not invest your entire amount in a single trade. Always keep liquidity in hand for future trades and averaging.
        </p>
        <p className="text-sm italic mt-4 text-muted-foreground">
          This app is for educational purposes only and does not provide financial advice. Cryptocurrency trading involves risk, and past performance does not guarantee future results. Users should conduct their own research and trade at their own discretion. The app is not responsible for any losses incurred while using it.
        </p>
      </div>
    </div>
  );
};