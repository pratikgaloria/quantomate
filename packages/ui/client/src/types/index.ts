export interface StrategyParameter {
  name: string;
  type: 'number' | 'boolean' | 'string';
  default: any;
  min?: number;
  max?: number;
  description: string;
}

export interface StrategyMetadata {
  id: string;
  name: string;
  description: string;
  parameters: StrategyParameter[];
}

export interface BacktestRequest {
  strategyId: string;
  parameters: Record<string, any>;
  stock: {
    symbol: string;
    startDate: string;
    endDate: string;
  };
  config: {
    capital: number;
  };
}

export interface BacktestResponse {
  report: {
    initialCapital: number;
    finalCapital: number;
    returns: number;
    returnsPercentage: number;
    numberOfTrades: number;
    numberOfWinningTrades: number;
    numberOfLosingTrades: number;
    winningRate: number;
    profit: number;
    loss: number;
    stopLossExits: number;
    takeProfitExits: number;
    strategyExits: number;
    trades: any[];
  };
  chartData: {
    prices: any[];
    equity: any[];
    trades: any[];
  };
}
