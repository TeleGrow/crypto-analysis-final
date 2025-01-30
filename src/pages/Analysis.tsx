import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CryptoChart } from '@/components/CryptoChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MarketSentiment } from '@/components/analysis/MarketSentiment';
import { PositionDetails } from '@/components/analysis/PositionDetails';
import { TechnicalAnalysis } from '@/components/analysis/TechnicalAnalysis';
import { MarketSummary } from '@/components/analysis/MarketSummary';

interface MarketData {
  price: number;
  volume: number;
  high: number;
  low: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  sma: number;
  ema: number;
  bollingerUpper: number;
  bollingerLower: number;
  timestamp: number;
}

const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const investment = Number(searchParams.get('investment')) || 0;
  const leveragePreference = searchParams.get('leverage') || 'safe';
  const timeframe = searchParams.get('timeframe') || '1h';
  const tradeType = searchParams.get('tradetype') || 'Short Term';
  const riskRewardRatio = Number(searchParams.get('riskreward')) || 1.5;

  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<number>(0);

  const getLeverageMultiplier = (volatility: number) => {
    if (leveragePreference === 'safe') {
      return Math.min(5, Math.max(2, Math.floor(volatility * 10)));
    }
    return Math.min(50, Math.max(10, Math.floor(volatility * 20)));
  };

  const getHoldTime = () => (tradeType === 'Short Term' ? '2 to 8 hours' : '3 to 5 days');

  const calculateTPSL = (currentPrice: number, isBullish: boolean) => {
    const riskPercentage = 0.01 * riskRewardRatio;
    const rewardPercentage = 0.015 * riskRewardRatio;
    return isBullish
      ? { takeProfit: currentPrice * (1 + rewardPercentage), stopLoss: currentPrice * (1 - riskPercentage) }
      : { takeProfit: currentPrice * (1 - rewardPercentage), stopLoss: currentPrice * (1 + riskPercentage) };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (analysisTimestamp !== 0) return;
      setLoading(true);
      try {
        const [tickerResponse, klineResponse, indicatorsResponse] = await Promise.all([
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`),
          fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=100`),
          fetch(`https://api.binance.com/api/v3/technicalIndicators?symbol=${symbol}&interval=${timeframe}`)
        ]);

        if (!tickerResponse.ok || !klineResponse.ok || !indicatorsResponse.ok) {
          throw new Error('Failed to fetch data from Binance API');
        }

        const tickerData = await tickerResponse.json();
        const klineData = await klineResponse.json();
        const indicatorsData = await indicatorsResponse.json();

        const volatility = Math.abs(parseFloat(tickerData.highPrice) - parseFloat(tickerData.lowPrice)) / parseFloat(tickerData.lastPrice);

        setMarketData({
          price: parseFloat(tickerData.lastPrice),
          volume: parseFloat(tickerData.volume),
          high: parseFloat(tickerData.highPrice),
          low: parseFloat(tickerData.lowPrice),
          rsi: parseFloat(indicatorsData.rsi),
          macd: parseFloat(indicatorsData.macd),
          macdSignal: parseFloat(indicatorsData.macdSignal),
          sma: parseFloat(indicatorsData.sma),
          ema: parseFloat(indicatorsData.ema),
          bollingerUpper: parseFloat(indicatorsData.bollingerUpper),
          bollingerLower: parseFloat(indicatorsData.bollingerLower),
          timestamp: Date.now()
        });

        setChartData(klineData.map(k => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4])
        })));
        setAnalysisTimestamp(Date.now());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol, timeframe, analysisTimestamp]);

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
