import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CryptoChart } from '@/components/CryptoChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MarketSentiment } from '@/components/analysis/MarketSentiment';
import { PositionDetails } from '@/components/analysis/PositionDetails';
import { TechnicalAnalysis } from '@/components/analysis/TechnicalAnalysis';
import { MarketSummary } from '@/components/analysis/MarketSummary';
import { useMarketData } from '@/hooks/use-market-data';

const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const investment = Number(searchParams.get('investment')) || 0;
  const leveragePreference = searchParams.get('leverage') || 'safe';
  const timeframe = searchParams.get('timeframe') || '1h';
  const tradeType = searchParams.get('tradetype') || 'Short Term';
  const riskRewardRatio = Number(searchParams.get('riskreward')) || 1.5;

  const { marketData, chartData, loading } = useMarketData(symbol, timeframe);

  const getLeverageMultiplier = (volatility: number) => {
    return leveragePreference === 'safe'
      ? Math.min(5, Math.max(2, Math.floor(volatility * 10)))
      : Math.min(50, Math.max(10, Math.floor(volatility * 20)));
  };

  const getHoldTime = () => (tradeType === 'Short Term' ? '2 to 8 hours' : '3 to 5 days');

  const calculateTPSL = (currentPrice: number, isBullish: boolean) => {
    const riskPercentage = 0.01 * riskRewardRatio;
    const rewardPercentage = 0.015 * riskRewardRatio;
    return isBullish
      ? { takeProfit: currentPrice * (1 + rewardPercentage), stopLoss: currentPrice * (1 - riskPercentage) }
      : { takeProfit: currentPrice * (1 - rewardPercentage), stopLoss: currentPrice * (1 + riskPercentage) };
  };

  if (loading || !marketData) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const isBullish = chartData[chartData.length - 1]?.close > chartData[chartData.length - 1]?.open;
  const leverageMultiplier = getLeverageMultiplier((marketData.high - marketData.low) / marketData.price);
  const { takeProfit, stopLoss } = calculateTPSL(marketData.price, isBullish);
  const potentialProfit = investment * leverageMultiplier * (Math.abs(takeProfit - marketData.price) / marketData.price);
  const maxLoss = investment * leverageMultiplier * (Math.abs(stopLoss - marketData.price) / marketData.price);
  const holdTime = getHoldTime();
  const confidence = Math.floor(Math.random() * 31) + 50;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <MarketSentiment isBullish={isBullish} confidence={confidence} />
        <CryptoChart symbol={symbol} timeframe={timeframe} data={chartData} />
        <PositionDetails marketData={marketData} leverageMultiplier={leverageMultiplier} takeProfit={takeProfit} stopLoss={stopLoss} potentialProfit={potentialProfit} maxLoss={maxLoss} holdTime={holdTime} />
        <TechnicalAnalysis marketData={marketData} />
        <MarketSummary symbol={symbol} isBullish={isBullish} leverageMultiplier={leverageMultiplier} confidence={confidence} potentialProfit={potentialProfit} marketData={marketData} holdTime={holdTime} timeframe={timeframe} />
        <Button onClick={() => navigate('/')} className="px-6 py-2">Start New Analysis</Button>
      </div>
    </div>
  );
};

export default Analysis;
