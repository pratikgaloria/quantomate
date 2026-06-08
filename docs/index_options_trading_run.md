# Nifty & NiftyBank Index Options Paper Trading Run Roadmap

This document outlines the roadmap to implement, backtest, and run index options paper-trading on Nifty and NiftyBank before the Indian market opens (09:15 IST).

---

## 1. Goal
Deploy a resilient automated paper-trading configuration that:
- Monitors the **Nifty 50** (`NIFTY 50`) and **Nifty Bank** (`NIFTY BANK`) underlying index feeds.
- Dynamically maps index-level buy/sell signals to the corresponding **At-The-Money (ATM)** weekly options contracts (`CE` for bullish, `PE` for bearish).
- Executes paper trades on `PaperBroker` tracking INR P/L and spreads.

---

## 2. Option Strategies (Implemented under `@quantomate/library`)

### Strategy A: `IndexOptionMomentum`
- **Underlying Indicators**: EMA 9, EMA 20 on the index.
- **Trigger**:
  - **Bullish**: EMA 9 crosses above EMA 20 $\rightarrow$ Buy ATM Call (`CE`) option. Exit active Put (`PE`).
  - **Bearish**: EMA 9 crosses below EMA 20 $\rightarrow$ Buy ATM Put (`PE`) option. Exit active Call (`CE`).

### Strategy B: `IndexOptionRsiReversion`
- **Underlying Indicators**: RSI 14 on the index.
- **Trigger**:
  - **Oversold (Bullish Reversion)**: RSI < 30 $\rightarrow$ Buy ATM Call (`CE`) option.
  - **Overbought (Bearish Reversion)**: RSI > 70 $\rightarrow$ Buy ATM Put (`PE`) option.
  - **Exit**: Close the trade when RSI crosses back to 50.

---

## 3. Option Mapping Architecture

Since index spot prices are not directly tradable, the system will execute options based on spot triggers:

```
+------------------+         Index Tick         +---------------------+
|  KiteLiveFeed    | -------------------------> |  LiveTradingEngine  |
| (Index Spot Tick)|                            | (Calculates Signals)|
+------------------+                            +---------------------+
                                                           |
                                                           | Signal (Entry/Exit)
                                                           v
+------------------+     ATM Option Ticker      +---------------------+
|   PaperBroker    | <------------------------- |   Option Mapper     |
| (Fills contract) |                            | (ATM CE/PE Weekly)  |
+------------------+                            +---------------------+
```

### Dynamic ATM Selection Helper
We will add `KiteInstrumentMapper.findATMOption(underlyingSymbol, optionType, currentPrice)`:
1. Identify the closest strike price:
   - **Nifty**: rounded to nearest 50 (e.g. `Math.round(price / 50) * 50`).
   - **BankNifty**: rounded to nearest 100 (e.g. `Math.round(price / 100) * 100`).
2. Search the master list (`instruments.json` loaded from Zerodha):
   - Match `name === 'NIFTY'` or `'BANKNIFTY'`
   - Match `exchange === 'NFO'`
   - Match `instrument_type === CE | PE`
   - Match `strike === calculatedStrike`
3. Sort matching instruments by `expiry` ascending.
4. Return the first element (the nearest weekly option contract!).

---

## 4. Backtesting Plan
1. Create a script `packages/playground/src/backtest_index_options.ts`.
2. Load historical daily/hourly candle data of Nifty and NiftyBank.
3. Simulate `IndexOptionMomentum` and `IndexOptionRsiReversion` signals.
4. Calculate net profit, win rate, and drawdown.
5. Select the best performing parameters and strategies to activate.

---

## 5. Timeline (Before Market Open)

| Time | Task | Owner | Status |
| --- | --- | --- | --- |
| **02:00 - 02:30** | Create Strategies under `packages/library` | Agent | Pending |
| **02:30 - 03:00** | Implement ATM Option Mapping | Agent | Pending |
| **03:00 - 03:45** | Historical Backtesting & Strategy Selection | Agent | Pending |
| **03:45 - 04:15** | Register strategies on Portfolio dashboard | Agent | Pending |
| **04:15 - 05:00** | Verify OAuth credentials and Standby | User/Agent | Pending |
