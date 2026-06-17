import { Bar } from '../types';
import { growTypedArray } from './arrayUtils';

export function initializeBarBuffers(initialItems: Bar[], capacity: number) {
  const opens = new Float64Array(capacity);
  const highs = new Float64Array(capacity);
  const lows = new Float64Array(capacity);
  const closes = new Float64Array(capacity);
  const volumes = new Float64Array(capacity);
  const timestamps = new Float64Array(capacity);
  for (let i = 0; i < initialItems.length; i++) {
    const b = initialItems[i];
    opens[i] = b.open;
    highs[i] = b.high;
    lows[i] = b.low;
    closes[i] = b.close;
    volumes[i] = b.volume;
    timestamps[i] = b.timestamp;
  }
  return { opens, highs, lows, closes, volumes, timestamps };
}

export function pushBar(
  b: Bar,
  length: number,
  capacity: number,
  opens: Float64Array,
  highs: Float64Array,
  lows: Float64Array,
  closes: Float64Array,
  volumes: Float64Array,
  timestamps: Float64Array
) {
  let currentCapacity = capacity;
  let newOpens = opens;
  let newHighs = highs;
  let newLows = lows;
  let newCloses = closes;
  let newVolumes = volumes;
  let newTimestamps = timestamps;

  if (length >= capacity) {
    currentCapacity *= 2;
    newOpens = growTypedArray(opens, currentCapacity);
    newHighs = growTypedArray(highs, currentCapacity);
    newLows = growTypedArray(lows, currentCapacity);
    newCloses = growTypedArray(closes, currentCapacity);
    newVolumes = growTypedArray(volumes, currentCapacity);
    newTimestamps = growTypedArray(timestamps, currentCapacity);
  }

  newOpens[length] = b.open;
  newHighs[length] = b.high;
  newLows[length] = b.low;
  newCloses[length] = b.close;
  newVolumes[length] = b.volume;
  newTimestamps[length] = b.timestamp;

  return {
    opens: newOpens,
    highs: newHighs,
    lows: newLows,
    closes: newCloses,
    volumes: newVolumes,
    timestamps: newTimestamps,
    capacity: currentCapacity,
  };
}
