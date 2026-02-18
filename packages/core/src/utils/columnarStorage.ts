import { StrategyValue } from '../strategy';

export class ColumnarStorage<T = number> {
  private numericValues: Float64Array;
  private timestamps: Float64Array;
  private objectValues: T[];
  private isNumeric: boolean = true; // Assume numeric by default until object seen
  private indicators: Map<string, Float64Array>;
  private strategies: Map<string, StrategyValue[]>;
  private capacity: number;
  private _length: number;

  constructor(initialCapacity: number = 1000) {
    this.capacity = initialCapacity;
    this._length = 0;
    this.numericValues = new Float64Array(initialCapacity);
    this.timestamps = new Float64Array(initialCapacity);
    this.timestamps.fill(NaN);
    this.objectValues = [];
    this.indicators = new Map();
    this.strategies = new Map();
  }

  /**
   * Add a value to the storage
   */
  addValue(value: T, timestamp?: number): void {
    if (this._length >= this.capacity) {
      this.resize();
    }

    if (typeof value === 'number') {
      this.numericValues[this._length] = value;
    } else {
      // If we encounter a non-number, switch/use object storage
      this.isNumeric = false;
      this.objectValues[this._length] = value;
    }

    if (timestamp !== undefined) {
      this.timestamps[this._length] = timestamp;
    }

    this._length++;
  }

  /**
   * Get value at index
   */
  getValue(index: number): T {
    const actualIndex = index < 0 ? this._length + index : index;

    if (this.isNumeric) {
      return this.numericValues[actualIndex] as unknown as T;
    } else {
      if (this.objectValues[actualIndex] !== undefined) {
        return this.objectValues[actualIndex];
      }
      return this.numericValues[actualIndex] as unknown as T;
    }
  }

  /**
   * Get timestamp at index
   */
  getTimestamp(index: number): number {
    const actualIndex = index < 0 ? this._length + index : index;
    return this.timestamps[actualIndex];
  }

  /**
   * Get all timestamps
   */
  getTimestamps(): Float64Array {
    return this.timestamps.subarray(0, this._length);
  }

  /**
   * Get all values as array
   */
  getValues(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this._length; i++) {
      result.push(this.getValue(i));
    }
    return result;
  }

  /**
   * Add indicator column if it doesn't exist
   */
  ensureIndicatorColumn(name: string): void {
    if (!this.indicators.has(name)) {
      const column = new Float64Array(this.capacity);
      // Initialize with NaN
      column.fill(NaN);
      this.indicators.set(name, column);
    }
  }

  /**
   * Set indicator value at index
   */
  setIndicator(index: number, name: string, value: number): void {
    this.ensureIndicatorColumn(name);
    const actualIndex = index < 0 ? this._length + index : index;
    this.indicators.get(name)![actualIndex] = value;
  }

  /**
   * Get indicator value at index
   */
  getIndicator(index: number, name: string): number {
    const actualIndex = index < 0 ? this._length + index : index;
    const column = this.indicators.get(name);
    return column ? column[actualIndex] : NaN;
  }

  /**
   * Get all indicator names
   */
  getIndicatorNames(): string[] {
    return Array.from(this.indicators.keys());
  }

  /**
   * Ensure strategy column exists
   */
  ensureStrategyColumn(name: string): void {
    if (!this.strategies.has(name)) {
      this.strategies.set(name, []);
    }
  }

  /**
   * Set strategy value at index
   */
  setStrategy(index: number, name: string, value: StrategyValue): void {
    this.ensureStrategyColumn(name);
    const actualIndex = index < 0 ? this._length + index : index;
    const column = this.strategies.get(name)!;
    column[actualIndex] = value;
  }

  /**
   * Get strategy value at index
   */
  getStrategy(index: number, name: string): StrategyValue | undefined {
    const actualIndex = index < 0 ? this._length + index : index;
    const column = this.strategies.get(name);
    return column ? column[actualIndex] : undefined;
  }

  /**
   * Get all strategy names
   */
  getStrategyNames(): string[] {
    return Array.from(this.strategies.keys());
  }

  /**
   * Resize all arrays when capacity is exceeded
   */
  private resize(): void {
    const newCapacity = this.capacity * 2;

    // Resize numeric values
    const newNumericValues = new Float64Array(newCapacity);
    newNumericValues.set(this.numericValues);
    this.numericValues = newNumericValues;

    // Resize timestamps
    const newTimestamps = new Float64Array(newCapacity);
    newTimestamps.set(this.timestamps);
    newTimestamps.fill(NaN, this._length);
    this.timestamps = newTimestamps;

    // Object values array grows automatically, but we update capacity
    // (no action needed for objectValues array itself as it's a JS array)

    // Resize indicator columns
    for (const [name, column] of this.indicators) {
      const newColumn = new Float64Array(newCapacity);
      newColumn.set(column);
      newColumn.fill(NaN, this._length); // Fill new space with NaN
      this.indicators.set(name, newColumn);
    }

    // Strategy arrays grow automatically

    this.capacity = newCapacity;
  }

  /**
   * Get current length
   */
  get length(): number {
    return this._length;
  }

  /**
   * Mutate value at index
   */
  mutateValue(index: number, value: T, timestamp?: number): void {
    const actualIndex = index < 0 ? this._length + index : index;

    if (typeof value === 'number') {
      this.numericValues[actualIndex] = value;
    } else {
      this.isNumeric = false;
      this.objectValues[actualIndex] = value;
    }

    if (timestamp !== undefined) {
      this.timestamps[actualIndex] = timestamp;
    }
  }
}
