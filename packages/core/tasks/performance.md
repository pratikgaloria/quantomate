# Core Performance Improvements

## Phase 1: Critical Performance Fixes (Week 1)

### 1. Optimize Dataset.add() - O(n²) → O(1) ✅ COMPLETE
- [x] Add incremental indicator calculation support
- [x] Implement `calculateIncremental()` method in Indicator interface
- [x] Update Dataset.add() to use incremental when available
- [x] Benchmark: **10x+ speedup achieved**

**Results:**
- Before: O(n) per quote (recalculates entire dataset)
- After: O(1) per quote (incremental update)
- All 81 tests pass ✅
- Backward compatible (falls back to full calculation if incremental not available)

### 2. Remove Object.assign() Overhead
- [ ] Replace Object.assign in Quote.setIndicator()
- [ ] Replace Object.assign in Quote.setStrategy()
- [ ] Direct property assignment instead
- [ ] Benchmark: 5% speedup expected

### 3. Array Iteration Optimization
- [ ] Replace forEach with for-loops in Backtest.run()
- [ ] Replace forEach in Dataset hot paths
- [ ] Benchmark: 20% speedup expected

## Phase 2: Memory Optimization (Week 2)

### 4. Columnar Storage for Indicators
- [ ] Design columnar storage architecture
- [ ] Implement Float64Array storage for indicator values
- [ ] Migrate existing indicators
- [ ] Benchmark: 3x memory reduction expected

### 5. Windowed Calculations
- [ ] Add windowSize to Indicator interface
- [ ] Implement windowed calculation support
- [ ] Update indicators to use windows
- [ ] Benchmark: Process less data, faster calculations

## Phase 3: Essential Features (Week 3)

### 6. Stop-Loss Support
- [ ] Add RiskManagementOptions to TradePositionOptions
- [ ] Implement shouldStopOut() in TradePosition
- [ ] Implement shouldTakeProfit() in TradePosition
- [ ] Update Strategy.apply() to check stop-loss first
- [ ] Add tests

### 7. Position Sizing
- [ ] Add PositionSizingOptions to BacktestConfiguration
- [ ] Implement Kelly Criterion calculator
- [ ] Update BacktestReport.markEntry() for partial positions
- [ ] Add tests

### 8. Transaction Costs
- [ ] Add TransactionCosts to BacktestConfiguration
- [ ] Implement commission calculation
- [ ] Implement slippage modeling
- [ ] Update BacktestReport for realistic fills
- [ ] Add tests

## Benchmarks

Target improvements:
- **Speed:** 10-15x faster (500ms → 50ms for 100k quotes)
- **Memory:** 3x reduction (50MB → 15MB for 100k quotes)
- **Features:** Stop-loss, position sizing, transaction costs
