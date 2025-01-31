import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  const navigate = useNavigate();
  const [symbol, setSymbol] = React.useState("BTCUSDT");
  const [investment, setInvestment] = React.useState("");

  const handleStartAnalysis = () => {
    if (!investment) return;
    navigate(`/analysis?symbol=${symbol}&investment=${investment}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4 text-center">Crypto Trade Analysis</h1>

        {/* Symbol Input */}
        <label className="block text-sm font-medium text-gray-700">Crypto Symbol</label>
        <Input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter crypto symbol (e.g., BTCUSDT)"
          className="mb-4"
        />

        {/* Investment Input */}
        <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
        <Input
          type="number"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="Enter investment amount"
          className="mb-6"
        />

        {/* Start Analysis Button */}
        <Button onClick={handleStartAnalysis} className="w-full">
          Start Analysis
        </Button>
      </div>
    </div>
  );
};

export default Index;
