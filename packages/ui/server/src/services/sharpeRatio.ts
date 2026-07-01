export function calculateSharpeRatio(equityCurve: { date: Date; value: number }[]): number {
  if (equityCurve.length < 2) return 0;

  // Group equity values by calendar date (YYYY-MM-DD) to get daily closes
  const dailyEquity = new Map<string, number>();
  for (const item of equityCurve) {
    const d = new Date(item.date);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dailyEquity.set(dateStr, item.value);
  }

  const dailyValues = Array.from(dailyEquity.values());
  if (dailyValues.length < 2) return 0;

  // Compute daily returns
  const returns: number[] = [];
  for (let i = 1; i < dailyValues.length; i++) {
    const prev = dailyValues[i - 1];
    if (prev > 0) {
      returns.push((dailyValues[i] - prev) / prev);
    }
  }

  if (returns.length === 0) return 0;

  // Compute mean return
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;

  // Compute standard deviation
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (returns.length === 1 ? 1 : returns.length - 1);
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Daily Sharpe Ratio
  const dailySharpe = mean / stdDev;

  // Annualized Sharpe Ratio (assuming 252 trading days in a year)
  return Math.sqrt(252) * dailySharpe;
}
