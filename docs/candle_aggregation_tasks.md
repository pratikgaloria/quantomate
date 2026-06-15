# Task: Candle-Based Streaming & Execution in Live/Paper Trading Engine

This document details the research, suggestions, and step-by-step task list for shifting the live/paper trading engine from a tick-by-tick calculation loop to a reliable candle-based execution model.

---

## 1. Research & Findings

### 1.1 The Issue with Tick-Based Strategy Execution
Currently, the `LiveTradingEngine` listens to WebSocket tick events and immediately forwards each tick price to the strategy's `Dataset` as a new data point:
```typescript
// LiveTradingEngine
this.feed.subscribe(this.config.symbols, (tick) => {
  this.enqueueTick(tick);
});
```
This causes:
1. **Performance Bottleneck**: High-frequency streaming ticks (especially during volatile market hours) trigger continuous strategy and indicator recalculations.
2. **Indicator Contamination**: The `Dataset` is warmed up using historical 5-minute candles, but live ticks append individual sub-second or 1-second price ticks. Mixing 5-minute bars with 1-second ticks corrupts period-based indicators (e.g., a 14-period RSI calculates over 14 ticks = 14 seconds instead of 14 bars = 70 minutes).
3. **Overtrading & Fees Overburn**: Price noise within a single candle causes indicators to fluctuate rapidly, triggering multiple buy/sell signals within seconds, leading to excessive orders and high transaction costs.

### 1.2 Provider Capabilities (KiteConnect & Tradier)
* **KiteConnect (Zerodha)**:
  * **WebSocket API (`KiteTicker`)**: Only streams raw ticks (last traded price, volume, bid/ask depth). It does *not* support streaming pre-built candles.
  * **REST API**: Provides historical candle data (`1m`, `5m`, etc.) but has a strict rate limit (3 requests per second) and is unsuitable for continuous real-time polling.
* **Tradier**:
  * **WebSocket API**: Streams individual trade and quote events. It does *not* stream real-time candles.
  * **REST API**: Exposes endpoints for historical bars but is rate-limited and latency-sensitive.

**Conclusion**: Since neither provider streams pre-aggregated candles, we **must compute and aggregate candles (OHLCV) on our side** using the real-time WebSocket tick stream.

---

## 2. Proposed Solution: Validated Hybrid Approach

To resolve both the rate-limiting bottlenecks and the risk of execution on corrupted local candles, we propose a **Validated Hybrid Approach**:

```
[WebSocket Ticks] -> [Local Candle Builder] -> [Local Strategy Evaluation]
                                                     |
                                            {Signal Triggered?}
                                            /                  \
                                         [Yes]                 [No]
                                           |                     |
                              [Query official REST Candle]   [Do Nothing]
                                           |
                              [Re-evaluate Strategy]
                                           |
                                  {Still Valid?}
                                  /            \
                              [Yes]            [No]
                                |                |
                          [Execute Order]  [Discard Signal]
```

### 2.1 Core Benefits
1. **100% Signal Match with Broker**: Because order entry/exit is double-checked against the broker's official REST candle before placement, we eliminate the risk of executing on incomplete or corrupted local data.
2. **Zero Rate Limit Overload**: We only query the REST API for historical candles when a trade is triggered. Since trade setups occur infrequently, our REST requests are extremely minimal, safely below any rate limit.
3. **Low Latency**: The REST validation request takes ~100–200ms, which is negligible compared to the multi-second delays introduced by polling dozens of symbols sequentially.
4. **Continuous Background Sync**: We stagger slow, low-priority REST checks for non-triggering symbols over the course of the minute to keep the historical datasets fully aligned.

---

## 3. Step-by-Step Task List

### Phase 1: Implement `CandleBuilder`
- [ ] Create `CandleBuilder` class under `packages/data/src/utils/CandleBuilder.ts`.
- [ ] Write unit tests for `CandleBuilder` to verify correct candle formation, interval boundary crossing, and volume delta aggregation.
- [ ] Expose `Candle` interface from `@quantomate/data` or `@quantomate/core`.

### Phase 2: Update `LiveTradingEngine` & `Dataset` Warmup
- [ ] Modify the warmup logic in `LiveTradingEngine.ts` to construct `Dataset<Candle>` instead of `Dataset<number>`, mapping historical data to OHLCV object quotes.
- [ ] Modify `trader.tick` to support appending/updating `Candle` objects in the dataset.
- [ ] Integrate `CandleBuilder` into `LiveTradingEngine`. Initialize a builder for each symbol based on the bot's configured interval (e.g., `5m`).

### Phase 3: Implement Validated Hybrid Execution
- [ ] Implement local strategy evaluation on local candle-close in `LiveTradingEngine`.
- [ ] Implement **Trigger Validation via REST**:
  - When a local signal is triggered, pause the order flow.
  - Query the REST API for the official candle of that symbol.
  - Overwrite the local candle in the dataset with official values and re-run strategy logic.
  - If the signal remains valid, execute the order; otherwise, log and discard.
- [ ] Implement a **Signal Cooldown / Throttle** to prevent multiple orders within the same candle period.

### Phase 4: Implement Gap Recovery & Background Sync
- [ ] Create a `backfillGap` helper in `LiveTradingEngine` to query REST historical data for any missing candles on startup or feed reconnection.
- [ ] Implement a background queue to stagger low-priority REST updates for inactive symbols to reconcile their local datasets.

### Phase 5: Integration & Verification
- [ ] Verify using live-feed playground tests (`verify_zerodha_live.ts` / `verify_tradier_live.ts`).
- [ ] Mock a local data discrepancy (e.g. inject a false trade signal) and verify that REST validation correctly catches and discards it.
- [ ] Monitor CPU and network overhead.
