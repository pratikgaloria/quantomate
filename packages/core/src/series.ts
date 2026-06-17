import { growTypedArray } from './utils/arrayUtils';

export class Series<T> {
  protected _data: T[] | Float64Array;
  protected _length: number;

  constructor(initialItems: T[] | Float64Array = [], useTypedArray?: boolean) {
    if (initialItems instanceof Float64Array) {
      this._data = initialItems;
      this._length = initialItems.length;
    } else {
      const isNumeric = useTypedArray ?? (initialItems.length > 0 && typeof initialItems[0] === 'number');
      if (isNumeric) {
        const capacity = Math.max(initialItems.length, 1024);
        const buffer = new Float64Array(capacity);
        for (let i = 0; i < initialItems.length; i++) {
          buffer[i] = initialItems[i] as any;
        }
        this._data = buffer;
        this._length = initialItems.length;
      } else {
        this._data = [...initialItems];
        this._length = initialItems.length;
      }
    }
  }

  get length(): number {
    return this._length;
  }

  push(item: T): void {
    if (this._data instanceof Float64Array) {
      if (this._length >= this._data.length) {
        this._data = growTypedArray(this._data, this._data.length * 2);
      }
      this._data[this._length] = item as any;
    } else {
      this._data.push(item);
    }
    this._length++;
  }

  at(index: number): T | undefined {
    const idx = index < 0 ? this._length + index : index;
    if (idx >= 0 && idx < this._length) {
      return this._data[idx] as any;
    }
    return undefined;
  }

  set(index: number, item: T): void {
    const idx = index < 0 ? this._length + index : index;
    if (idx >= 0 && idx < this._length) {
      this._data[idx] = item as any;
    }
  }

  slice(start?: number, end?: number): T[] {
    const s = start === undefined ? 0 : (start < 0 ? this._length + start : start);
    const e = end === undefined ? this._length : (end < 0 ? this._length + end : end);
    const from = Math.max(0, Math.min(this._length, s));
    const to = Math.max(from, Math.min(this._length, e));
    if (this._data instanceof Float64Array) {
      return Array.from(this._data.subarray(from, to)) as any;
    }
    return this._data.slice(from, to);
  }

  toArray(): T[] {
    if (this._data instanceof Float64Array) {
      return Array.from(this._data.subarray(0, this._length)) as any;
    }
    return [...this._data];
  }

  map<R>(fn: (item: T, index: number) => R): R[] {
    const result: R[] = new Array(this._length);
    if (this._data instanceof Float64Array) {
      for (let i = 0; i < this._length; i++) {
        result[i] = fn(this._data[i] as any, i);
      }
    } else {
      for (let i = 0; i < this._length; i++) {
        result[i] = fn(this._data[i], i);
      }
    }
    return result;
  }
}
