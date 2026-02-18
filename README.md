# 📈 @Quantomate

**Quantomate** is a powerful algorithmic trading framework designed for building, testing, and automating trading strategies. It provides a modular ecosystem of libraries to handle everything from technical indicators to full-scale backtesting and future automated execution.

---

## 🏗 Project Architecture

This is an NPM workspace (Monorepo) consisting of several specialized packages:

### 1. [@quantomate/core](./packages/core)
The engine of the framework. It contains the fundamental classes for:
- **`Dataset`**: Efficient columnar storage for market data using typed arrays.
- **`Quote`**: Data wrapper for OHLCV and calculated values.
- **`Indicator`**: Base class for technical analysis tools with support for **incremental (O(1)) calculations**.
- **`Strategy`**: Base class for trading logic (Entry, Exit, Stop Loss, Take Profit).
- **`Backtest`**: Engine to evaluate strategy performance over historical data.

### 2. [@quantomate/indicators](./packages/indicators)
A rich library of technical indicators rebuilt on top of the core framework.
- Examples: SMA, EMA, RSI, Bollinger Bands, MACD, ATR, CCI, Stochastic, etc.
- All indicators are optimized for performance using the core's incremental calculation engine.

### 3. [@quantomate/strategies](./packages/strategies)
A collection of ready-to-use trading strategies.
- Examples: Golden Cross, RSI Mean Reversion, Bollinger Band Breakout, MACD Crossovers.
- These serve as both functional tools and examples of how to build complex logic.

### 4. [@quantomate/ui](./packages/ui)
The client interface and server for visualizing trading data and backtest results.
- **Client**: Vite + React based dashboard.
- **Server**: Node.js server for data fetching and strategy execution.

---

## 🚀 Key Features

- **Performance First**: Uses columnar storage and typed arrays to handle large datasets efficiently.
- **Incremental Calculation**: Indicators can update in O(1) time as new data arrives, crucial for real-time applications.
- **Modular Components**: Easily plug in new indicators or strategies without modifying the core engine.
- **Flexible Data Types**: Supports both simple number series and complex OHLCV objects via Generics.

---

## 🛠 Getting Started

### Installation

```bash
# Install dependencies for all packages
yarn install
```

### Running the UI

```bash
cd packages/ui
npm run dev
```

This will start both the client and the server concurrently.

### Experimenting in Playground

Use the `@quantomate/playground` to test strategies or indicators with real data (e.g., from Yahoo Finance).

```bash
cd packages/playground
# Modify src/try.ts and run
npm run start
```

---

## 📝 Usage Example: Creating a Simple Strategy

```typescript
import { Strategy, Quote } from '@quantomate/core';
import { SMA } from '@quantomate/indicators';

const myStrategy = new Strategy('SMA Cross', {
  indicators: [
    new SMA('sma5', { period: 5 }),
    new SMA('sma20', { period: 20 })
  ],
  entryWhen: (quote) => {
    return quote.getIndicator('sma5') > quote.getIndicator('sma20');
  },
  exitWhen: (quote) => {
    return quote.getIndicator('sma5') < quote.getIndicator('sma20');
  }
});
```

---

## 🗺 Roadmap

- [x] Core Backtesting Engine
- [x] Basic Technical Indicators
- [x] Visualization Dashboard (Alpha)
- [ ] Advanced Strategy Builder UI
- [ ] Real-time Data Adapters (Websockets)
- [ ] Live Trading Execution (Brokers Integration)