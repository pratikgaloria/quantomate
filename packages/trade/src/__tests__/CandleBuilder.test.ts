import { CandleBuilder } from '../utils/CandleBuilder';

describe('CandleBuilder', () => {
  it('should construct aligned intervals correctly', () => {
    // 5 minutes = 300,000 ms
    const builder = new CandleBuilder(300000, 'delta');
    
    // Tick at 10:01:30
    const time1 = new Date('2026-06-15T10:01:30.000Z').getTime();
    const result1 = builder.processTick('AAPL', 100, 10, time1);
    
    expect(result1.closedCandle).toBeUndefined();
    expect(result1.currentCandle).toEqual({
      open: 100,
      high: 100,
      low: 100,
      close: 100,
      volume: 10,
      timestamp: new Date('2026-06-15T10:00:00.000Z').getTime()
    });

    // Tick at 10:04:59 (same candle)
    const time2 = new Date('2026-06-15T10:04:59.000Z').getTime();
    const result2 = builder.processTick('AAPL', 102, 15, time2);
    
    expect(result2.closedCandle).toBeUndefined();
    expect(result2.currentCandle).toEqual({
      open: 100,
      high: 102,
      low: 100,
      close: 102,
      volume: 25,
      timestamp: new Date('2026-06-15T10:00:00.000Z').getTime()
    });

    // Tick at 10:05:00 (new candle boundary)
    const time3 = new Date('2026-06-15T10:05:00.000Z').getTime();
    const result3 = builder.processTick('AAPL', 101, 5, time3);
    
    // Should return closed candle representing 10:00
    expect(result3.closedCandle).toEqual({
      open: 100,
      high: 102,
      low: 100,
      close: 102,
      volume: 25,
      timestamp: new Date('2026-06-15T10:00:00.000Z').getTime()
    });
    // Current candle is now 10:05
    expect(result3.currentCandle).toEqual({
      open: 101,
      high: 101,
      low: 101,
      close: 101,
      volume: 5,
      timestamp: new Date('2026-06-15T10:05:00.000Z').getTime()
    });
  });

  it('should handle cumulative volume correctly', () => {
    // cumulative volume mode (like Zerodha)
    const builder = new CandleBuilder(300000, 'cumulative');

    const t1 = new Date('2026-06-15T10:01:00.000Z').getTime();
    const r1 = builder.processTick('AAPL', 100, 1000, t1); // start cumulative volume = 1000
    expect(r1.currentCandle.volume).toBe(0);

    const t2 = new Date('2026-06-15T10:03:00.000Z').getTime();
    const r2 = builder.processTick('AAPL', 101, 1200, t2); // volume delta is 200
    expect(r2.currentCandle.volume).toBe(200);

    // New candle at 10:05
    const t3 = new Date('2026-06-15T10:05:30.000Z').getTime();
    const r3 = builder.processTick('AAPL', 102, 1500, t3);
    
    expect(r3.closedCandle?.volume).toBe(200);
    expect(r3.currentCandle.volume).toBe(300);
  });

  it('should ignore out-of-order ticks to protect candle integrity', () => {
    const builder = new CandleBuilder(300000, 'delta');

    const t1 = new Date('2026-06-15T10:06:00.000Z').getTime();
    builder.processTick('AAPL', 105, 10, t1); // Candle 10:05

    const t2 = new Date('2026-06-15T10:02:00.000Z').getTime(); // Out of order (belongs to 10:00)
    const r2 = builder.processTick('AAPL', 100, 10, t2);

    // Should not return closed candle, and should return the current candle (10:05) unmodified
    expect(r2.closedCandle).toBeUndefined();
    expect(r2.currentCandle.timestamp).toBe(new Date('2026-06-15T10:05:00.000Z').getTime());
  });
});
