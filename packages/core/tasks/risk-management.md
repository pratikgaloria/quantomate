# Risk Management: Stop-Loss & Take-Profit Implementation

## Overview

Implement functional stop-loss and take-profit support using `stopLossWhen()` and `takeProfitWhen()` functions. This approach provides maximum flexibility while maintaining clear separation between risk management and strategy logic.

## Context & Rationale

**Why functional approach over declarative?**

1. **Maximum Flexibility**: Users can implement ANY stop-loss logic (time-based, indicator-based, conditional, etc.)
2. **API Consistency**: Matches existing `entryWhen()`/`exitWhen()` pattern
3. **No Type Explosion**: Don't need to extend types for every new stop-loss variant
4. **Advanced Use Cases**: Complex conditions like "stop if RSI > 80 AND price < entry - 2%" are trivial
5. **Trailing Stops via Indicators**: Users can define trailing stops as indicators for full flexibility

**Execution Priority**: Risk checks happen BEFORE strategy exit conditions:
1. Check `stopLossWhen()` (highest priority)
2. Check `takeProfitWhen()`
3. Check `exitWhen()` (lowest priority)

## Implementation Plan

### Phase 1: Core Types & Interfaces

#### 1.1 Define Risk Function Type

**File**: `packages/core/src/strategy.ts`

```typescript
type RiskFn = <T>(quote: Quote<T>, position: TradePosition) => boolean;
```

#### 1.2 Update Strategy Options

**File**: `packages/core/src/strategy.ts`

```typescript
type StrategyCommonOptions<P, T> = {
  indicators?: Indicator<P, T>[];
  onTrigger?: (positionType: TradePositionType, quote: Quote<T>) => void;
  
  // NEW: Functional risk management
  stopLossWhen?: RiskFn;
  takeProfitWhen?: RiskFn;
};

type LongPositionOptions<P, T> = {
  entryWhen: positionFn;
  exitWhen: positionFn;
} & StrategyCommonOptions<P, T>;

type ShortPositionOptions<P, T> = {
  entryShortWhen: positionFn;
  exitShortWhen: positionFn;
} & StrategyCommonOptions<P, T>;

export type StrategyOptions<P, T> =
  | LongPositionOptions<P, T>
  | ShortPositionOptions<P, T>;
```

#### 1.3 Extend TradePositionOptions for Entry Tracking

**File**: `packages/core/src/position.ts`

```typescript
type TradePositionOptions<O> = O & {
  short?: boolean;
  entryPrice?: number;      // NEW - Automatically set on entry
  entryDate?: Date;         // NEW - Automatically set on entry
  exitReason?: 'stop-loss' | 'take-profit' | 'strategy';  // NEW - Track why position exited
};
```

### Phase 2: Entry Price Tracking

#### 2.1 Add Entry Price Configuration

**File**: `packages/core/src/backtest.ts`

```typescript
export interface BacktestConfiguration {
  capital: number;
  name?: string;
  
  // NEW: Configure which field to use as entry price
  entryPriceField?: 'close' | 'open' | 'high' | 'low' | ((quote: Quote<T>) => number);
}
```

#### 2.2 Auto-Set Entry Price on Position Entry

**File**: `packages/core/src/strategy.ts`

```typescript
export class Strategy<P = unknown, T = number, O = unknown> {
  // ... existing code ...
  
  /**
   * Extracts entry price from quote based on configuration.
   */
  private getEntryPrice(quote: Quote<T>, config?: any): number {
    // If custom function provided, use it
    if (typeof config?.entryPriceField === 'function') {
      return config.entryPriceField(quote);
    }
    
    // If quote is a number, use it directly
    if (typeof quote.value === 'number') {
      return quote.value;
    }
    
    // If quote is OHLC object, use configured field (default: close)
    if (typeof quote.value === 'object' && quote.value !== null) {
      const field = config?.entryPriceField || 'close';
      if (field in quote.value) {
        return quote.value[field] as number;
      }
    }
    
    throw new Error('Cannot determine entry price from quote');
  }
}
```

### Phase 3: Strategy Integration

#### 3.1 Update Strategy.apply() to Check Risk First

**File**: `packages/core/src/strategy.ts`

```typescript
export class Strategy<P = unknown, T = number, O = unknown> {
  // ... existing code ...

  apply(
    quote: Quote<T>,
    position: TradePosition<O> = new TradePosition<O>('idle')
  ) {
    // STEP 1: Check stop-loss FIRST (highest priority)
    if ((position.value === 'hold' || position.value === 'entry') && 
        this._options.stopLossWhen?.(quote, position)) {
      return new StrategyValue(
        new TradePosition('exit', {
          ...position.options,
          exitReason: 'stop-loss',
        })
      );
    }
    
    // STEP 2: Check take-profit
    if ((position.value === 'hold' || position.value === 'entry') && 
        this._options.takeProfitWhen?.(quote, position)) {
      return new StrategyValue(
        new TradePosition('exit', {
          ...position.options,
          exitReason: 'take-profit',
        })
      );
    }
    
    // STEP 3: Check strategy exit conditions (lower priority)
    let newPositionValue: TradePositionType = 'idle';

    let entryFn: positionFn, exitFn: positionFn;
    if (isShortPosition(position, this._options)) {
      entryFn = this._options.entryShortWhen;
      exitFn = this._options.exitShortWhen;
    } else {
      entryFn = this._options.entryWhen;
      exitFn = this._options.exitWhen;
    }

    if (
      (position.value === 'hold' || position.value === 'entry') &&
      exitFn(quote)
    ) {
      newPositionValue = 'exit';
    } else if (entryFn(quote)) {
      newPositionValue = 'entry';
    }

    const updatedPosition = TradePosition.update(
      position,
      new TradePosition(newPositionValue, {
        ...position.options,
        exitReason: newPositionValue === 'exit' ? 'strategy' : undefined,
      })
    );

    this._options.onTrigger?.(updatedPosition.value, quote);
    return new StrategyValue(updatedPosition);
  }
}
```

#### 3.2 Set Entry Price When Position Enters

**File**: `packages/core/src/backtest.ts`

```typescript
export class Backtest<P = unknown, T = number, O = unknown> {
  // ... existing code ...

  run({ config, onEntry, onExit }: BacktestRunner<T>) {
    const report = new BacktestReport<T>(config.capital);

    for (let i = 0; i < this._dataset.length; i++) {
      const quote = this._dataset.at(i)!;
      const position = quote.getStrategy(this.strategy.name).position;

      if (
        i === this._dataset.length - 1 &&
        (position.value === 'entry' || position.value === 'hold')
      ) {
        report.markExit(onExit(quote, i, []), quote);
      } else {
        if (position.value === 'entry') {
          // NEW: Set entry price and date automatically
          const entryPrice = this.getEntryPrice(quote, config);
          const positionWithEntry = new TradePosition(position.value, {
            ...position.options,
            entryPrice,
            entryDate: new Date(quote.value.timestamp || Date.now()),
          });
          
          // Update the quote's strategy with entry tracking
          quote.setStrategy(
            this.strategy.name,
            new StrategyValue(positionWithEntry)
          );
          
          report.markEntry(onEntry(quote, i, []), quote);
        } else if (position.value === 'exit') {
          report.markExit(onExit(quote, i, []), quote);
        }
      }
    }

    return report;
  }
  
  private getEntryPrice(quote: Quote<T>, config: BacktestConfiguration): number {
    // If custom function provided, use it
    if (typeof config.entryPriceField === 'function') {
      return config.entryPriceField(quote);
    }
    
    // If quote is a number, use it directly
    if (typeof quote.value === 'number') {
      return quote.value;
    }
    
    // If quote is OHLC object, use configured field (default: close)
    if (typeof quote.value === 'object' && quote.value !== null) {
      const field = config.entryPriceField || 'close';
      if (field in quote.value) {
        return quote.value[field] as number;
      }
    }
    
    throw new Error('Cannot determine entry price from quote');
  }
}
```

### Phase 4: Exit Context Tracking for Analytics

#### 4.1 Add Rich Exit Context

**File**: `packages/core/src/backtestReport.ts`

```typescript
interface ExitContext {
  entryPrice: number;
  exitPrice: number;
  entryDate: Date;
  exitDate: Date;
  holdDuration: number;  // milliseconds
  priceChange: number;   // absolute
  priceChangePercent: number;  // percentage
  indicators: { [key: string]: number };  // All indicator values at exit
}

type BacktestReportTrades<T> = {
  type: 'entry' | 'exit';
  quote: Quote<T>;
  tradedValue: number;
  shares?: number;
  currentCapital: number;
  exitReason?: 'stop-loss' | 'take-profit' | 'strategy';
  exitContext?: ExitContext;  // NEW - Rich context for analytics
};
```

#### 4.2 Track Exit Reasons and Context

**File**: `packages/core/src/backtestReport.ts`

```typescript
export class BacktestReport<T = number> {
  // ... existing fields ...
  
  // NEW: Exit reason tracking
  stopLossExits: number;
  takeProfitExits: number;
  strategyExits: number;

  constructor(initialCapital: number) {
    // ... existing initialization ...
    
    this.stopLossExits = 0;
    this.takeProfitExits = 0;
    this.strategyExits = 0;
  }

  markExit(tradedValue: number, quote: Quote<T>, strategyName: string) {
    const position = quote.getStrategy(strategyName).position;
    const exitReason = position.options?.exitReason;
    
    // Track exit reason counts
    if (exitReason === 'stop-loss') {
      this.stopLossExits++;
    } else if (exitReason === 'take-profit') {
      this.takeProfitExits++;
    } else if (exitReason === 'strategy') {
      this.strategyExits++;
    }
    
    // Build exit context for analytics
    const exitContext = this.buildExitContext(quote, position, tradedValue);
    
    // Calculate proceeds from selling all shares
    const proceeds = this.sharesOwned * tradedValue;
    this.finalCapital = proceeds;
    
    this.trades.push({
      type: 'exit',
      quote,
      tradedValue,
      shares: this.sharesOwned,
      currentCapital: this.finalCapital,
      exitReason,
      exitContext,  // NEW
    });
    
    // ... rest of existing logic ...
  }
  
  private buildExitContext<T>(
    quote: Quote<T>,
    position: TradePosition,
    exitPrice: number
  ): ExitContext | undefined {
    const entryPrice = position.options?.entryPrice;
    const entryDate = position.options?.entryDate;
    
    if (!entryPrice || !entryDate) {
      return undefined;
    }
    
    const exitDate = new Date(quote.value.timestamp || Date.now());
    const holdDuration = exitDate.getTime() - entryDate.getTime();
    const priceChange = exitPrice - entryPrice;
    const priceChangePercent = (priceChange / entryPrice) * 100;
    
    // Capture all indicator values at exit
    const indicators: { [key: string]: number } = {};
    try {
      // Try to get common indicators (will fail silently if not present)
      const indicatorNames = ['rsi', 'atr', 'sma', 'ema', 'macd', 'bb'];
      indicatorNames.forEach(name => {
        try {
          indicators[name] = quote.getIndicator(name);
        } catch {
          // Indicator not present, skip
        }
      });
    } catch {
      // No indicators available
    }
    
    return {
      entryPrice,
      exitPrice,
      entryDate,
      exitDate,
      holdDuration,
      priceChange,
      priceChangePercent,
      indicators,
    };
  }

  /**
   * Get risk/reward metrics for analysis.
   */
  getRiskMetrics() {
    return {
      totalExits: this.stopLossExits + this.takeProfitExits + this.strategyExits,
      stopLossExits: this.stopLossExits,
      takeProfitExits: this.takeProfitExits,
      strategyExits: this.strategyExits,
      stopLossRate: this.numberOfTrades > 0 ? this.stopLossExits / this.numberOfTrades : 0,
      takeProfitRate: this.numberOfTrades > 0 ? this.takeProfitExits / this.numberOfTrades : 0,
      strategyExitRate: this.numberOfTrades > 0 ? this.strategyExits / this.numberOfTrades : 0,
    };
  }
  
  /**
   * Analyze stop-loss exits for insights.
   */
  analyzeStopLossExits() {
    const stopLossTrades = this.trades.filter(t => t.exitReason === 'stop-loss');
    
    if (stopLossTrades.length === 0) {
      return null;
    }
    
    const avgLoss = stopLossTrades.reduce((sum, t) => 
      sum + (t.exitContext?.priceChangePercent || 0), 0
    ) / stopLossTrades.length;
    
    const avgHoldTime = stopLossTrades.reduce((sum, t) => 
      sum + (t.exitContext?.holdDuration || 0), 0
    ) / stopLossTrades.length;
    
    return {
      count: stopLossTrades.length,
      avgLossPercent: avgLoss,
      avgHoldTimeMs: avgHoldTime,
      trades: stopLossTrades,
    };
  }
}
```

### Phase 5: Testing

#### 5.1 Unit Tests for Risk Functions

**File**: `packages/core/tests/strategy-risk.test.ts` (create new)

Test cases:
- ✅ stopLossWhen() triggers before exitWhen()
- ✅ takeProfitWhen() triggers before exitWhen()
- ✅ exitWhen() triggers when no risk functions defined
- ✅ Entry price is automatically set on position entry
- ✅ Entry date is automatically set on position entry
- ✅ Exit reason is tracked correctly (stop-loss)
- ✅ Exit reason is tracked correctly (take-profit)
- ✅ Exit reason is tracked correctly (strategy)
- ✅ Short positions work with risk functions
- ✅ Custom entryPriceField configuration works

#### 5.2 Integration Tests for Backtest

**File**: `packages/core/tests/backtest-risk.test.ts` (create new)

Test cases:
- ✅ Backtest report tracks exit reasons correctly
- ✅ Stop-loss exits counted separately
- ✅ Take-profit exits counted separately
- ✅ Strategy exits counted separately
- ✅ Exit context is populated correctly
- ✅ getRiskMetrics() returns correct data
- ✅ analyzeStopLossExits() provides insights
- ✅ Indicator values captured at exit
- ✅ Hold duration calculated correctly

#### 5.3 Advanced Use Case Tests

**File**: `packages/core/tests/strategy-advanced-risk.test.ts` (create new)

Test cases:
- ✅ Time-based stop-loss works
- ✅ Indicator-based stop-loss works
- ✅ Conditional stop-loss (e.g., "if profit > 10%, tighten stop")
- ✅ Trailing stop via indicator works
- ✅ Complex multi-condition stop-loss works

## Implementation Checklist

### Core Implementation
- [ ] Add `RiskFn` type to `strategy.ts`
- [ ] Add `stopLossWhen` and `takeProfitWhen` to `StrategyOptions`
- [ ] Add `entryPrice`, `entryDate`, `exitReason` to `TradePositionOptions`
- [ ] Add `entryPriceField` to `BacktestConfiguration`
- [ ] Update `Strategy.apply()` to check risk functions first
- [ ] Implement automatic entry price/date setting in `Backtest.run()`
- [ ] Implement `getEntryPrice()` helper

### Exit Context Tracking
- [ ] Add `ExitContext` interface to `backtestReport.ts`
- [ ] Add `exitContext` to `BacktestReportTrades`
- [ ] Add exit reason counters to `BacktestReport`
- [ ] Implement `buildExitContext()` in `BacktestReport`
- [ ] Update `markExit()` to track exit reasons and context
- [ ] Implement `getRiskMetrics()` in `BacktestReport`
- [ ] Implement `analyzeStopLossExits()` in `BacktestReport`

### Testing
- [ ] Unit tests for stopLossWhen/takeProfitWhen execution priority
- [ ] Unit tests for entry price/date auto-setting
- [ ] Unit tests for exit reason tracking
- [ ] Integration tests for backtest analytics
- [ ] Advanced use case tests (time-based, indicator-based stops)
- [ ] Test short position risk management
- [ ] Test custom entryPriceField configuration

## Success Criteria

✅ Stop-loss and take-profit can be defined as functions
✅ Risk checks execute before strategy exit conditions
✅ Entry price and date are automatically tracked
✅ Exit reasons are tracked separately (stop-loss, take-profit, strategy)
✅ Exit context provides rich analytics data
✅ Users can analyze stop-loss exits with full quote snapshots
✅ All existing tests still pass
✅ New tests achieve >90% coverage of new code

## Usage Examples

### Basic Stop-Loss/Take-Profit

```typescript
const strategy = new Strategy('RSI Mean Reversion', {
  entryWhen: (quote) => quote.getIndicator('rsi') < 30,
  exitWhen: (quote) => quote.getIndicator('rsi') > 70,
  
  stopLossWhen: (quote, position) => {
    const currentPrice = quote.value.close;
    const entryPrice = position.options?.entryPrice ?? 0;
    return currentPrice < entryPrice * 0.98;  // 2% stop
  },
  
  takeProfitWhen: (quote, position) => {
    const currentPrice = quote.value.close;
    const entryPrice = position.options?.entryPrice ?? 0;
    return currentPrice > entryPrice * 1.06;  // 6% target
  },
});
```

### Trailing Stop via Indicator

```typescript
const trailingStop = new Indicator('trailingStop', {
  calculate: (dataset) => {
    const quote = dataset.at(-1);
    const position = quote.getStrategy('MyStrategy').position;
    
    if (position.value !== 'hold' && position.value !== 'entry') {
      return NaN;
    }
    
    const currentPrice = quote.value.close;
    const prevStop = dataset.at(-2)?.getIndicator('trailingStop') ?? currentPrice * 0.97;
    
    // Only move stop up (for longs)
    return Math.max(prevStop, currentPrice * 0.97);
  }
});

const strategy = new Strategy('Momentum', {
  indicators: [rsi, trailingStop],
  entryWhen: (quote) => quote.getIndicator('rsi') < 30,
  exitWhen: (quote) => quote.getIndicator('rsi') > 70,
  stopLossWhen: (quote) => quote.value.close < quote.getIndicator('trailingStop'),
});
```

### Analytics

```typescript
const report = backtest.run({ config, onEntry, onExit });

// Get risk metrics
const metrics = report.getRiskMetrics();
console.log(`Stop-loss exits: ${metrics.stopLossExits} (${metrics.stopLossRate * 100}%)`);

// Analyze stop-loss exits
const stopLossAnalysis = report.analyzeStopLossExits();
console.log(`Average stop-loss: ${stopLossAnalysis.avgLossPercent}%`);

// Inspect individual exits
report.trades
  .filter(t => t.exitReason === 'stop-loss')
  .forEach(exit => {
    console.log(`Exit at ${exit.exitContext.exitPrice}`);
    console.log(`RSI: ${exit.exitContext.indicators.rsi}`);
  });
```

## Future Enhancements

- Portfolio-level risk management
- Position sizing based on risk
- Multiple concurrent positions
- Partial exits / scaling out
