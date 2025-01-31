export const calculateATR = (candles: any[], period = 14) => {
  const atrValues = candles.slice(1).map((candle, i) => {
    return Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - candles[i].close),
      Math.abs(candle.low - candles[i].close)
    );
  });

  return atrValues.slice(-period).reduce((a, b) => a + b) / period;
};

export const detectLiquidityPools = (candles: any[]) => {
  return candles
    .map(c => ({ price: c.close, volume: c.volume }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);
};

export const getOrderFlow = async (symbol: string) => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/aggTrades?symbol=${symbol}`);
    const trades = await response.json();

    const buyVolume = trades.filter((t: any) => t.m === false).reduce((sum, t) => sum + parseFloat(t.q), 0);
    const sellVolume = trades.filter((t: any) => t.m === true).reduce((sum, t) => sum + parseFloat(t.q), 0);

    return buyVolume - sellVolume;
  } catch (error) {
    console.error('Error fetching order flow:', error);
    return 0;
  }
};

export const suggestLeverage = (atr: number) => {
  return atr > 20 ? 5 : 10;
};
