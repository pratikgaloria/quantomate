import { Candle } from './candleTypes';

export { Candle } from './candleTypes';
export { intervalToMs } from './intervalParser';

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

  public processTick(
    symbol: string,
    price: number,
    volume: number,
    timestamp: number
  ): { closedCandle?: Candle; currentCandle: Candle } {
    const candleStart = Math.floor(timestamp / this.intervalMs) * this.intervalMs;
    const state = this.currentCandles.get(symbol);

    if (!state) {
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
      const closedCandle = { ...candle };
      let newVolume = 0;
      let startCumVol = state.lastCumulativeVolume ?? volume;
      if (this.volumeMode === 'cumulative') {
        newVolume = volume >= startCumVol ? volume - startCumVol : volume;
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
      return { currentCandle: candle };
    } else {
      candle.high = Math.max(candle.high, price);
      candle.low = Math.min(candle.low, price);
      candle.close = price;

      if (this.volumeMode === 'cumulative') {
        const startCumVol = state.startCumulativeVolume ?? volume;
        candle.volume = volume >= startCumVol ? volume - startCumVol : volume;
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
