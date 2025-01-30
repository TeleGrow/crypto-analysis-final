import React from 'react';
import { Clock } from 'lucide-react';

interface PositionDetailsProps {
  marketData: {
    price: number;
  };
  leverageMultiplier: number;
  takeProfit: number;
  stopLoss: number;
  potentialProfit: number;
  maxLoss: number;
  holdTime: string;
}

export const PositionDetails: React.FC<PositionDetailsProps> = ({
  marketData,
  leverageMultiplier,
  takeProfit,
  stopLoss,
  potentialProfit,
  maxLoss,
  holdTime,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">Position Details</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Current Price:</span>
          <span className="font-medium">${marketData.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Leverage:</span>
          <span className="font-medium text-primary">{leverageMultiplier}x</span>
        </div>
        <div className="flex justify-between">
          <span>Take Profit:</span>
          <span className="text-success font-medium">
            ${takeProfit.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Stop Loss:</span>
          <span className="text-danger font-medium">
            ${stopLoss.toFixed(2)}
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
        <div className="flex justify-between items-center text-primary">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Recommended Hold Time:
          </span>
          <span className="font-medium">{holdTime}</span>
        </div>
      </div>
    </div>
  );
};