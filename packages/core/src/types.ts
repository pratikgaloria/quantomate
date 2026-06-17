export interface Bar {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number; // Unix timestamp in milliseconds
}

export interface TradeSignal {
  action: 'entry' | 'exit' | 'idle';
  direction?: 'long' | 'short';
}

export interface OptionSelector {
  strikeMode: 'atm' | 'offset' | 'delta';
  strikeOffset?: number;
  targetDelta?: number;
  expiryMode: 'nearest' | 'dte' | 'monthly';
  minDte?: number;
  maxDte?: number;
}

