import React from 'react';

interface ICTFairValueGapsProps {
  chartData: { high: number; low: number }[];
}

export const ICTFairValueGaps: React.FC<ICTFairValueGapsProps> = ({ chartData }) => {
  const detectFVG = (candles: { high: number; low: number }[]) => {
    let gaps: { high: number; low: number }[] = [];

    for (let i = 0; i < candles.length - 2; i++) {
      const firstCandle = candles[i];
      const thirdCandle = candles[i + 2];

      // Fair Value Gap Condition: Middle candle's high is lower than the first candle's low
      // and middle candle's low is higher than the third candle's high
      if (candles[i + 1].high < firstCandle.low && candles[i + 1].low > thirdCandle.high) {
        gaps.push({
          high: firstCandle.low,
          low: thirdCandle.high
        });
      }
    }

    return gaps;
  };

  const fairValueGaps = detectFVG(chartData);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">📉 Fair Value Gaps (FVGs)</h3>
      {fairValueGaps.length > 0 ? (
        <ul className="list-disc list-inside">
          {fairValueGaps.map((gap, index) => (
            <li key={index} className="text-sm text-gray-700">
              FVG detected between <span className="text-red-500 font-semibold">${gap.high.toFixed(2)}</span> and <span className="text-green-500 font-semibold">${gap.low.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No Fair Value Gaps detected in the recent price action.</p>
      )}
    </div>
  );
};
