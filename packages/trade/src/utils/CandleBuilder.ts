export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

export function intervalToMs(interval: string): number {
  const match = interval.match(/^(\d+)([mhd])$/);
  if (!match) {
    throw new Error(`Unsupported interval format: ${interval}`);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: throw new Error(`Unsupported interval unit: ${unit}`);
  }
}

export class CandleBuilder {
  private currentCandles = new Map<string, {
    candle: Candle;
    lastCumulativeVolume?: number;
    startCumulativeVolume?: number;
  }>();

  constructor(
    private intervalMs: number,
    private volumeMode: 'delta' | 'cumulative' = 'delta'
  ) {}

  /**
   * Process a new tick update and returns the current candle and optionally the closed candle if crossed boundary.
   */
  public processTick(
    symbol: string,
    price: number,
    volume: number,
    timestamp: number
  ): { closedCandle?: Candle; currentCandle: Candle } {
    const candleStart = Math.floor(timestamp / this.intervalMs) * this.intervalMs;
    const state = this.currentCandles.get(symbol);

    if (!state) {
      // First tick for this symbol
      const newCandle: Candle = {
        open: price,
        high: price,
        low: price,
        close: price,
        volume: this.volumeMode === 'cumulative' ? 0 : volume,
        timestamp: candleStart,
      };
      this.currentCandles.set(symbol, {
        candle: newCandle,
        lastCumulativeVolume: volume,
        startCumulativeVolume: volume,
      });
      return { currentCandle: newCandle };
    }

    const { candle } = state;

    if (candleStart > candle.timestamp) {
      // Crossed into a new candle interval
      const closedCandle = { ...candle };

      // Initialize the new candle
      let newVolume = 0;
      let startCumVol = state.lastCumulativeVolume ?? volume;
      if (this.volumeMode === 'cumulative') {
        const delta = volume >= startCumVol ? volume - startCumVol : volume;
        newVolume = delta;
        startCumVol = volume;
      } else {
        newVolume = volume;
      }

      const newCandle: Candle = {
        open: price,
        high: price,
        low: price,
        close: price,
        volume: newVolume,
        timestamp: candleStart,
      };

      this.currentCandles.set(symbol, {
        candle: newCandle,
        lastCumulativeVolume: volume,
        startCumulativeVolume: startCumVol,
      });

      return { closedCandle, currentCandle: newCandle };
    } else if (candleStart < candle.timestamp) {
      // Out-of-order tick, ignore to protect candle integrity
      return { currentCandle: candle };
    } else {
      // Within the same candle interval
      candle.high = Math.max(candle.high, price);
      candle.low = Math.min(candle.low, price);
      candle.close = price;

      if (this.volumeMode === 'cumulative') {
        const startCumVol = state.startCumulativeVolume ?? volume;
        const delta = volume >= startCumVol ? volume - startCumVol : volume;
        candle.volume = delta;
        state.lastCumulativeVolume = volume;
      } else {
        candle.volume += volume;
      }

      return { currentCandle: candle };
    }
  }

  public getCandle(symbol: string): Candle | undefined {
    return this.currentCandles.get(symbol)?.candle;
  }
}
