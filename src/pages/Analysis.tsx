import React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoChart } from '@/components/CryptoChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketSentiment } from '@/components/analysis/MarketSentiment';
import { PositionDetails } from '@/components/analysis/PositionDetails';
import { TechnicalAnalysis } from '@/components/analysis/TechnicalAnalysis';
import { MarketSummary } from '@/components/analysis/MarketSummary';
import { ICTFairValueGaps } from '@/components/analysis/ICTFairValueGaps';
import { LiquidityPools } from '@/components/analysis/LiquidityPools';

const Analysis = () => {
  const symbol = "BTCUSDT"; // Default symbol (can be made dynamic)
  const timeframe = "1h"; // Default timeframe

  const { marketData, chartData, loading } = useMarketData(symbol, timeframe);

  if (loading || !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Market Sentiment */}
        <MarketSentiment isBullish={marketData.orderFlow > 0} confidence={75} />

        {/* Crypto Chart */}
        <CryptoChart symbol={symbol} timeframe={timeframe} data={chartData} />

        {/* Tabs for Different Analysis Sections */}
        <Tabs defaultValue="analysis">
          <TabsList>
            <TabsTrigger value="analysis">Technical Analysis</TabsTrigger>
            <TabsTrigger value="ict">ICT Patterns</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
          </TabsList>

          {/* Technical Analysis Section */}
          <TabsContent value="analysis">
            <TechnicalAnalysis marketData={marketData} chartData={chartData} />
          </TabsContent>

          {/* ICT Patterns Section */}
          <TabsContent value="ict">
            <ICTFairValueGaps chartData={chartData} />
            <LiquidityPools chartData={chartData} />
          </TabsContent>

          {/* Risk Management Section */}
          <TabsContent value="risk">
            <PositionDetails marketData={marketData} />
          </TabsContent>
        </Tabs>

        {/* Market Summary (Includes Risk Advice & Disclaimer) */}
        <MarketSummary />
      </div>
    </div>
  );
};

export default Analysis;
