import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MarketSentimentProps {
  isBullish: boolean;
  confidence: number;
}

export const MarketSentiment: React.FC<MarketSentimentProps> = ({ isBullish, confidence }) => {
  return (
    <div className={`p-4 rounded-lg ${isBullish ? 'bg-success/10' : 'bg-danger/10'} flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        {isBullish ? <ArrowUp className="text-success" /> : <ArrowDown className="text-danger" />}
        <span className="font-semibold">
          Market is {isBullish ? 'Bullish' : 'Bearish'} - Recommended Position: {isBullish ? 'LONG' : 'SHORT'}
        </span>
      </div>
      <div className="text-sm">
        Confidence: <span className="font-semibold">{confidence}%</span>
      </div>
    </div>
  );
};