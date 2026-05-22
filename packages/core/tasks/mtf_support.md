# Task: Multi-Timeframe (MTF) Support

## Overview
Enable trading strategies to define conditions based on multiple datasets (different timeframes) simultaneously. This is a fundamental shift from single-dataset logic to a synchronized multi-dataset architecture.

- [x] **Multi-Dataset Strategy**:
    - Update `Strategy` to hold references to secondary datasets. (Handled via passing to `prepare` and `apply`)
    - Enhance `StrategyOptions` to support MTF rules. (Rules now accept `StrategyContext`)
- [x] **Execution Context**:
    - Introduce `StrategyContext` passed to `apply()`, `entryWhen()`, `exitWhen()`, etc.
    - Context provides `getQuote(datasetName)` for synchronized access.

### Phase 3: Backtest Synchronization ✅
- [x] **Backtest Engine Update**:
    - Coordinate primary and secondary datasets during the run.
    - Ensure all datasets are properly "spread" (indicators calculated) before execution.
- [x] **Look-ahead Guard**:
    - Verified: `sync(timestamp)` returns the last candle *at or before* the current primary timestamp.

### Phase 4: Performance & Scalability ⚡
- [ ] **Lookup Optimization**:
    - For backtesting, implement a "sliding window" or index-based sync to achieve O(1) lookups during the main loop instead of O(log N).
- [ ] **Benchmark**:
    - Compare single-timeframe vs multi-timeframe performance impact.

## Questions & Considerations
1. **Timestamp Precision**: Should we enforce Unix timestamps (ms) for all synchronizations?
2. **Missing Data**: How to handle cases where a higher timeframe candle is missing due to market holidays or data gaps? (Current approach: return last available).
3. **Primary Timeframe**: Does the strategy always tick on the lowest timeframe dataset? (Usually yes).

## Approach Suggestion
Instead of modifying the core `Strategy.apply` signature immediately, we might want to introduce a `MultiFrameStrategy` that extends the base `Strategy` to maintain backward compatibility during transition. However, a lean unified API is preferred if we can handle the breaking change in one go.
