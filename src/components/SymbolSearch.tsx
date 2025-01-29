import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SymbolSearchProps {
  onSelect: (symbol: string) => void;
}

export const SymbolSearch: React.FC<SymbolSearchProps> = ({ onSelect }) => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filteredSymbols, setFilteredSymbols] = useState<string[]>([]);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const data = await response.json();
        const usdtPairs = data.symbols
          .filter((s: any) => s.quoteAsset === 'USDT' && s.status === 'TRADING')
          .map((s: any) => s.symbol);
        setSymbols(usdtPairs);
        setFilteredSymbols(usdtPairs);
      } catch (error) {
        console.error('Error fetching symbols:', error);
      }
    };

    fetchSymbols();
  }, []);

  useEffect(() => {
    const filtered = symbols.filter(symbol => 
      symbol.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSymbols(filtered);
  }, [search, symbols]);

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search USDT pairs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      {search && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSymbols.map((symbol) => (
            <button
              key={symbol}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                onSelect(symbol);
                setSearch('');
              }}
            >
              {symbol}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};