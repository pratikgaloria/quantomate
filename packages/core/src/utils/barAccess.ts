import { Bar } from '../types';

export function sliceBarSeries(
  opens: Float64Array,
  highs: Float64Array,
  lows: Float64Array,
  closes: Float64Array,
  volumes: Float64Array,
  timestamps: Float64Array,
  length: number,
  start?: number,
  end?: number
): Bar[] {
  const s = start === undefined ? 0 : (start < 0 ? length + start : start);
  const e = end === undefined ? length : (end < 0 ? length + end : end);
  const from = Math.max(0, Math.min(length, s));
  const to = Math.max(from, Math.min(length, e));
  const result: Bar[] = [];
  for (let i = from; i < to; i++) {
    result.push({
      open: opens[i],
      high: highs[i],
      low: lows[i],
      close: closes[i],
      volume: volumes[i],
      timestamp: timestamps[i],
    });
  }
  return result;
}

export function mapBarSeries<R>(
  opens: Float64Array,
  highs: Float64Array,
  lows: Float64Array,
  closes: Float64Array,
  volumes: Float64Array,
  timestamps: Float64Array,
  length: number,
  fn: (item: Bar, index: number) => R
): R[] {
  const result: R[] = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = fn(
      {
        open: opens[i],
        high: highs[i],
        low: lows[i],
        close: closes[i],
        volume: volumes[i],
        timestamp: timestamps[i],
      },
      i
    );
  }
  return result;
}

export function getBarAt(
  idx: number,
  opens: Float64Array,
  highs: Float64Array,
  lows: Float64Array,
  closes: Float64Array,
  volumes: Float64Array,
  timestamps: Float64Array
): Bar {
  return {
    open: opens[idx],
    high: highs[idx],
    low: lows[idx],
    close: closes[idx],
    volume: volumes[idx],
    timestamp: timestamps[idx],
  };
}
