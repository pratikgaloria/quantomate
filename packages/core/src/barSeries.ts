import { Bar } from './types';
import { Series } from './series';
import { sliceBarSeries, mapBarSeries, getBarAt } from './utils/barAccess';
import { initializeBarBuffers, pushBar } from './utils/barMutation';

export class BarSeries extends Series<Bar> {
  private _opens!: Float64Array;
  private _highs!: Float64Array;
  private _lows!: Float64Array;
  private _closes!: Float64Array;
  private _volumes!: Float64Array;
  private _timestamps!: Float64Array;
  private _capacity!: number;

  constructor(initialItems: Bar[] = []) {
    super([], false);
    this._length = initialItems.length;
    this._capacity = Math.max(initialItems.length, 1024);
    const bufs = initializeBarBuffers(initialItems, this._capacity);
    this._opens = bufs.opens;
    this._highs = bufs.highs;
    this._lows = bufs.lows;
    this._closes = bufs.closes;
    this._volumes = bufs.volumes;
    this._timestamps = bufs.timestamps;
  }

  get opens(): Float64Array { return this._opens.subarray(0, this._length); }
  get highs(): Float64Array { return this._highs.subarray(0, this._length); }
  get lows(): Float64Array { return this._lows.subarray(0, this._length); }
  get closes(): Float64Array { return this._closes.subarray(0, this._length); }
  get volumes(): Float64Array { return this._volumes.subarray(0, this._length); }
  get timestamps(): Float64Array { return this._timestamps.subarray(0, this._length); }

  getPriceColumn(field: 'open' | 'high' | 'low' | 'close' | 'volume' | 'timestamp'): Float64Array {
    return (this as any)[`${field}s`] as Float64Array;
  }

  override push(b: Bar): void {
    const res = pushBar(b, this._length, this._capacity, this._opens, this._highs, this._lows, this._closes, this._volumes, this._timestamps);
    this._opens = res.opens;
    this._highs = res.highs;
    this._lows = res.lows;
    this._closes = res.closes;
    this._volumes = res.volumes;
    this._timestamps = res.timestamps;
    this._capacity = res.capacity;
    this._length++;
  }

  override at(index: number): Bar | undefined {
    const idx = index < 0 ? this._length + index : index;
    return idx >= 0 && idx < this._length
      ? getBarAt(idx, this._opens, this._highs, this._lows, this._closes, this._volumes, this._timestamps)
      : undefined;
  }

  override set(index: number, b: Bar): void {
    const idx = index < 0 ? this._length + index : index;
    if (idx >= 0 && idx < this._length) {
      this._opens[idx] = b.open;
      this._highs[idx] = b.high;
      this._lows[idx] = b.low;
      this._closes[idx] = b.close;
      this._volumes[idx] = b.volume;
      this._timestamps[idx] = b.timestamp;
    }
  }

  override slice(start?: number, end?: number): Bar[] {
    return sliceBarSeries(this._opens, this._highs, this._lows, this._closes, this._volumes, this._timestamps, this._length, start, end);
  }

  override toArray(): Bar[] {
    return sliceBarSeries(this._opens, this._highs, this._lows, this._closes, this._volumes, this._timestamps, this._length);
  }

  override map<R>(fn: (item: Bar, index: number) => R): R[] {
    return mapBarSeries(this._opens, this._highs, this._lows, this._closes, this._volumes, this._timestamps, this._length, fn);
  }
}
