export type TickCallback = (quote: {
  symbol: string;
  price: number;
  bid?: number;
  ask?: number;
  volume: number;
  timestamp: number;
}) => void;

export interface ILiveFeed {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(symbols: string[], callback: TickCallback): void;
  unsubscribe(symbols: string[]): void;
  onDisconnect(callback: () => void): void;
}
