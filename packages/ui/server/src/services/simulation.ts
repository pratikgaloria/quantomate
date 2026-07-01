import { BarSeries, StrategyContext } from '@quantomate/core';

export function runSimulation(
  series: BarSeries, strategy: any, context: StrategyContext, initialCapital: number | undefined,
  commissionRate: number, slippageRate: number, parameters: Record<string, any>, startTs?: number
) {
  const latestPrice = series.at(series.length - 1)?.close || 100;
  const orderSize = 100;
  const capitalRequired = orderSize * latestPrice;
  const resolvedInitialCapital = initialCapital !== undefined ? initialCapital : capitalRequired;

  let capital = resolvedInitialCapital, shares = 0, status: 'idle' | 'long' | 'short' = 'idle', entryPrice = 0, entryIndex = -1;
  let stopLossExits = 0, takeProfitExits = 0, strategyExits = 0, totalCommissions = 0, totalSlippage = 0;
  let entryDate: Date | null = null;
  let highestPriceSinceEntry = 0, lowestPriceSinceEntry = Infinity;
  let positionMetadata: Record<string, any> = {};
  const trades: any[] = [];

  for (let i = 0; i < series.length; i++) {
    const bar = series.at(i)!;
    context.getPositionStatus = () => status;
    context.getPosition = () => ({
      status,
      entryPrice,
      entryTime: entryDate ? entryDate.getTime() : undefined,
      metadata: positionMetadata
    });
    const signal = strategy.evaluate(series, i, context);

    if (status === 'idle') {
      if (signal.action === 'entry') {
        if (startTs && bar.timestamp < startTs) continue;
        const price = bar.close;
        const isShort = signal.direction === 'short';
        entryDate = new Date(bar.timestamp);
        status = isShort ? 'short' : 'long';
        entryIndex = i;
        highestPriceSinceEntry = bar.high;
        lowestPriceSinceEntry = bar.low;
        positionMetadata = signal.metadata || {};

        const slipCost = price * slippageRate;
        const fillPrice = isShort ? price - slipCost : price + slipCost;
        shares = orderSize;
        const commCost = shares * commissionRate;

        totalCommissions += commCost;
        totalSlippage += (shares * slipCost);
        entryPrice = fillPrice;
        capital = isShort ? capital + (shares * fillPrice) - commCost : capital - (shares * fillPrice) - commCost;

        trades.push({
          type: 'entry', date: entryDate, tradedValue: fillPrice, shares, short: isShort,
          currentCapital: capital, commission: commCost, slippage: slipCost * shares
        });
      }
    } else {
      highestPriceSinceEntry = Math.max(highestPriceSinceEntry, bar.high);
      lowestPriceSinceEntry = Math.min(lowestPriceSinceEntry, bar.low);

      let shouldExit = signal.action === 'exit', reason: 'stop-loss' | 'take-profit' | 'strategy' = 'strategy';

      let sl = 0;
      let tp = 0;

      const stopLossType = parameters.stopLossType ?? (strategy.name === 'StrongPullback' ? 'fixed-atr' : 'none');
      if (stopLossType !== 'none') {
        const atr = context.getIndicatorSeries('atr')?.at(entryIndex) || 0;
        const currentAtr = context.getIndicatorSeries('atr')?.at(i) || atr;
        const mult = parameters.stopLossMultiplier ?? parameters.atrMultiplier ?? 2.0;

        if (stopLossType === 'fixed-atr') {
          sl = status === 'short' ? entryPrice + atr * mult : entryPrice - atr * mult;
        } else if (stopLossType === 'trailing-atr') {
          sl = status === 'short' ? lowestPriceSinceEntry + currentAtr * mult : highestPriceSinceEntry - currentAtr * mult;
        } else if (stopLossType === 'pivot') {
          if (entryIndex > 0) {
            const prevBar = series.at(entryIndex - 1)!;
            const pivot = (prevBar.high + prevBar.low + prevBar.close) / 3;
            sl = status === 'short' ? 2 * pivot - prevBar.low : 2 * pivot - prevBar.high;
          }
        }

        if (sl > 0) {
          if (status === 'short' ? bar.close >= sl : bar.close <= sl) {
            shouldExit = true;
            reason = 'stop-loss';
          }
        }
      }

      if (strategy.name === 'StrongPullback' && reason !== 'stop-loss') {
        const atr = context.getIndicatorSeries('atr')?.at(entryIndex) || 0, mult = parameters.atrMultiplier ?? 1.0, tpR = parameters.tp1_R ?? 1.0;
        tp = status === 'short' ? entryPrice - atr * mult * tpR : entryPrice + atr * mult * tpR;
        if (status === 'short' ? bar.close <= tp : bar.close >= tp) { shouldExit = true; reason = 'take-profit'; }
      }

      const isLast = i === series.length - 1;
      if (shouldExit || isLast) {
        if (isLast && !shouldExit) reason = 'strategy';
        if (reason === 'stop-loss') stopLossExits++;
        else if (reason === 'take-profit') takeProfitExits++;
        else strategyExits++;

        let price = bar.close;
        const isShort = status === 'short';

        if (reason === 'stop-loss' && sl > 0) {
          if (isShort) {
            price = bar.open >= sl ? bar.open : sl;
          } else {
            price = bar.open <= sl ? bar.open : sl;
          }
        } else if (reason === 'take-profit' && tp > 0) {
          if (isShort) {
            price = bar.open <= tp ? bar.open : tp;
          } else {
            price = bar.open >= tp ? bar.open : tp;
          }
        }

        const slipCost = price * slippageRate, fillPrice = isShort ? price + slipCost : price - slipCost, commCost = shares * commissionRate;

        totalCommissions += commCost;
        totalSlippage += (shares * slipCost);
        const priceChange = isShort ? entryPrice - fillPrice : fillPrice - entryPrice;
        const exitContext = {
          entryPrice, exitPrice: fillPrice, entryDate: entryDate!, exitDate: new Date(bar.timestamp),
          holdDuration: bar.timestamp - entryDate!.getTime(), priceChange, priceChangePercent: (priceChange / entryPrice) * 100
        };

        capital = isShort ? capital - (shares * fillPrice + commCost) : capital + (shares * fillPrice - commCost);
        trades.push({
          type: 'exit', date: new Date(bar.timestamp), tradedValue: fillPrice, shares, short: isShort,
          currentCapital: capital, exitReason: reason, exitContext, commission: commCost, slippage: slipCost * shares
        });
        shares = 0;
        status = 'idle';
      }
    }
  }

  const returns = capital - resolvedInitialCapital;
  return {
    initialCapital: resolvedInitialCapital, finalCapital: capital, returns, returnsPercentage: (returns / resolvedInitialCapital) * 100,
    stopLossExits, takeProfitExits, strategyExits, totalCommissions, totalSlippage, trades
  };
}
