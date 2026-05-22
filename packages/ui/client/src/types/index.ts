export interface StrategyParameter {
  name: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  default: any;
  min?: number;
  max?: number;
  options?: string[];
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
    interval?: string;
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
    totalCommissions: number;
    totalSlippage: number;
    trades: any[];
  };
  chartData: {
    prices: any[];
    equity: any[];
    trades: any[];
  };
}
export interface ScanResult {
  symbol: string;
  hasSignal: boolean;
  signalDate?: string;
  direction?: 'long' | 'short';
  entryPrice?: number;
  currentPrice?: number;
  movePercentage?: number;
  barsSinceSignal?: number;
  lastClose?: number;
  error?: string;
}

export type ScanResponse = ScanResult[];
