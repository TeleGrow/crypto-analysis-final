import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SymbolSearch } from '@/components/SymbolSearch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const timeframes = ['15m', '1h', '6h', '1d'];

const Index = () => {
  const navigate = useNavigate();
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [investment, setInvestment] = useState('');
  const [leverage, setLeverage] = useState<'safe' | 'risk'>('safe');
  const [timeframe, setTimeframe] = useState('15m');

  const handleAnalyze = () => {
    if (!selectedSymbol || !investment || !timeframe) {
      return;
    }
    navigate(`/analysis?symbol=${selectedSymbol}&investment=${investment}&leverage=${leverage}&timeframe=${timeframe}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Crypto Futures Analysis</h1>
        
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm border">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trading Pair
            </label>
            <SymbolSearch onSelect={setSelectedSymbol} />
            {selectedSymbol && (
              <p className="mt-2 text-sm text-primary">Selected: {selectedSymbol}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount (USDT)
            </label>
            <Input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              placeholder="Enter amount in USDT"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leverage Strategy
            </label>
            <div className="flex gap-4">
              <Button
                variant={leverage === 'safe' ? 'default' : 'outline'}
                onClick={() => setLeverage('safe')}
                className="flex-1"
              >
                Safe (2x-5x)
              </Button>
              <Button
                variant={leverage === 'risk' ? 'default' : 'outline'}
                onClick={() => setLeverage('risk')}
                className="flex-1"
              >
                Risk (10x-50x)
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Timeframe
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? 'default' : 'outline'}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            className="w-full"
            disabled={!selectedSymbol || !investment || !timeframe}
          >
            Analyze
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;