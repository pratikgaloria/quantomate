import { BotConfig } from '../engine/LiveTradingEngine';
import { ExecutorConfig } from '../executor';
import { instantiateStrategy } from './strategyInstantiator';

export function mapBotsConfig(openBots: any[], defaultCandleInterval: string): BotConfig[] {
  return openBots.map((bot) => {
    const stratType = bot.customStrategy?.baseType || bot.strategy;
    const parameters = (bot.customStrategy?.parameters || bot.parameters) as any || {};
    const interval = bot.customStrategy?.interval || defaultCandleInterval;

    const strategy = instantiateStrategy(stratType, bot.name, bot.symbol, parameters);
    const isOptionStrat = stratType.includes("Option") || parameters.tradeOptions === true;
    const executorConfig: ExecutorConfig = {
      tradeOptions: isOptionStrat,
      optionSelector: parameters.optionSelector || undefined,
      allocationSessionId: bot.allocationSessionId || undefined,
      allocationRatio: isOptionStrat ? 0.05 : 0.95
    };

    const symbols = (bot.symbol || "")
      .split(",")
      .map((s: string) => s.trim().toUpperCase())
      .filter(Boolean);

    return {
      id: bot.id,
      strategy,
      symbol: bot.symbol,
      symbols,
      interval,
      executorConfig
    };
  });
}
