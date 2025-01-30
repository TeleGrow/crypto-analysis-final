import React from 'react';

interface TechnicalAnalysisProps {
  marketData: {
    volume: number;
    rsi: number;
    macd: number;
    macdSignal: number;
  };
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ marketData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Technical Indicators</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>RSI (14):</span>
              <span className={`font-medium ${marketData.rsi > 70 ? 'text-danger' : marketData.rsi < 30 ? 'text-success' : 'text-primary'}`}>
                {marketData.rsi.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>MACD:</span>
              <span className={`font-medium ${marketData.macd > marketData.macdSignal ? 'text-success' : 'text-danger'}`}>
                {marketData.macd.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Volume Analysis</h4>
          <p className="text-sm text-gray-600">
            24h Volume: {marketData.volume.toFixed(2)} USDT
          </p>
        </div>
      </div>
    </div>
  );
};