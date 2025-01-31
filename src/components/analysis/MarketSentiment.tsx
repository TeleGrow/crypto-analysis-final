import React from 'react';

interface MarketSentimentProps {
  isBullish: boolean;
  confidence: number;
  volumeTrend: string;
}

export const MarketSentiment: React.FC<MarketSentimentProps> = ({ isBullish, confidence, volumeTrend }) => {
  return (
    <div className={`p-4 rounded-lg ${isBullish ? 'bg-success/10' : 'bg-danger/10'} flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <span className="font-semibold">
          Market is {isBullish ? 'Bullish' : 'Bearish'} - Recommended Position: {isBullish ? 'LONG' : 'SHORT'}
        </span>
      </div>
      <div className="text-sm">
        Confidence: <span className="font-semibold">{confidence}%</span> | Volume Trend: <span className="font-medium">{volumeTrend}</span>
      </div>
    </div>
  );
};
