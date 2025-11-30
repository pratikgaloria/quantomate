# Backtest Visualization Project

## Overview

A browser-based application for visualizing backtest results with dynamic strategy selection and configuration. Users can select stocks, strategies, configure parameters, and view comprehensive backtest analytics.

## Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React)                      │
│  - Strategy selector with dynamic params                │
│  - Stock selector                                       │
│  - Charts (AnyChart)                                    │
│  - Metrics dashboard                                    │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP
┌─────────────────────────────────────────────────────────┐
│              Express Server (Node.js)                   │
│  - Fetch stock data (yahoo-finance2)                    │
│  - Load strategies from workspace                       │
│  - Run backtests                                        │
│  - Return BacktestReport                                │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Workspace Packages                         │
│  - @quantomate/core                                     │
│  - @quantomate/strategies                               │
│  - @quantomate/indicators                               │
└─────────────────────────────────────────────────────────┘
```

## Package Structure

```
packages/ui/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── StrategySelector.tsx
│   │   │   ├── StockSelector.tsx
│   │   │   ├── ParameterForm.tsx
│   │   │   ├── Charts/
│   │   │   │   ├── PriceChart.tsx
│   │   │   │   ├── EquityCurve.tsx
│   │   │   │   └── DrawdownChart.tsx
│   │   │   └── Metrics/
│   │   │       ├── MetricsDashboard.tsx
│   │   │       ├── TradeList.tsx
│   │   │       └── RiskMetrics.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── strategies.ts
│   │   │   ├── stocks.ts
│   │   │   └── backtest.ts
│   │   ├── services/
│   │   │   ├── strategyLoader.ts
│   │   │   ├── stockDataFetcher.ts
│   │   │   └── backtestRunner.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── scripts/
│   └── fetch-strategies.ts    # Generate strategies.json
├── strategies.json            # Auto-generated strategy metadata
├── package.json               # Workspace root
└── README.md
```

## Strategy Discovery System

### Strategy Metadata Format

Each strategy must export metadata:

```typescript
// In @quantomate/strategies
export const RSIStrategy = {
  name: 'RSI Mean Reversion',
  description: 'Buy when RSI < 30, sell when RSI > 70',
  parameters: [
    {
      name: 'rsiPeriod',
      type: 'number',
      default: 14,
      min: 2,
      max: 50,
      description: 'RSI calculation period'
    },
    {
      name: 'oversoldThreshold',
      type: 'number',
      default: 30,
      min: 0,
      max: 50,
      description: 'RSI oversold level'
    },
    {
      name: 'overboughtThreshold',
      type: 'number',
      default: 70,
      min: 50,
      max: 100,
      description: 'RSI overbought level'
    }
  ],
  create: (params: any) => new Strategy('RSI', { /* ... */ })
};
```

### Generated strategies.json

```json
{
  "strategies": [
    {
      "id": "rsi-mean-reversion",
      "name": "RSI Mean Reversion",
      "description": "Buy when RSI < 30, sell when RSI > 70",
      "parameters": [
        {
          "name": "rsiPeriod",
          "type": "number",
          "default": 14,
          "min": 2,
          "max": 50,
          "description": "RSI calculation period"
        }
      ]
    }
  ]
}
```

### Build Script: `npm run fetch-strategies`

```typescript
// scripts/fetch-strategies.ts
import * as strategies from '@quantomate/strategies';
import fs from 'fs';

const metadata = Object.entries(strategies)
  .filter(([key, value]) => value.name && value.parameters)
  .map(([key, strategy]) => ({
    id: key,
    name: strategy.name,
    description: strategy.description,
    parameters: strategy.parameters
  }));

fs.writeFileSync(
  'strategies.json',
  JSON.stringify({ strategies: metadata }, null, 2)
);
```

## API Endpoints

### GET /api/strategies
Returns list of available strategies from `strategies.json`

**Response:**
```json
{
  "strategies": [
    {
      "id": "rsi-mean-reversion",
      "name": "RSI Mean Reversion",
      "parameters": [...]
    }
  ]
}
```

### GET /api/stocks/search?q=AAPL
Search for stock symbols

**Response:**
```json
{
  "results": [
    { "symbol": "AAPL", "name": "Apple Inc." }
  ]
}
```

### POST /api/backtest
Run backtest with selected strategy and stock

**Request:**
```json
{
  "strategyId": "rsi-mean-reversion",
  "parameters": {
    "rsiPeriod": 14,
    "oversoldThreshold": 30,
    "overboughtThreshold": 70
  },
  "stock": {
    "symbol": "AAPL",
    "startDate": "2023-01-01",
    "endDate": "2024-01-01"
  },
  "config": {
    "capital": 10000
  }
}
```

**Response:**
```json
{
  "report": {
    "initialCapital": 10000,
    "finalCapital": 12500,
    "returns": 2500,
    "returnsPercentage": 25,
    "numberOfTrades": 15,
    "winningRate": 0.6,
    "trades": [...],
    "riskMetrics": {...}
  },
  "chartData": {
    "prices": [...],
    "equity": [...],
    "trades": [...]
  }
}
```

## UI Components

### 1. Strategy Selector
- Dropdown with all available strategies
- Shows strategy description
- Dynamically loads parameters when strategy selected

### 2. Parameter Form
- Renders input fields based on strategy parameters
- Number inputs with min/max validation
- Shows parameter descriptions as tooltips

### 3. Stock Selector
- Autocomplete search for stock symbols
- Date range picker (start/end dates)
- Capital input

### 4. Charts (AnyChart)

**Price Chart:**
- Candlestick/OHLC chart
- Entry markers (green arrows)
- Exit markers (red arrows, color-coded by reason)
- Indicator overlays (RSI, SMA, etc.)

**Equity Curve:**
- Line chart showing capital over time
- Drawdown shading

**Drawdown Chart:**
- Area chart showing drawdown percentage
- Max drawdown highlighted

### 5. Metrics Dashboard

**Performance Metrics:**
- Initial/Final Capital
- Total Returns ($, %)
- Number of Trades
- Win Rate
- Profit Factor

**Risk Metrics:**
- Stop-Loss Exits (count, %)
- Take-Profit Exits (count, %)
- Strategy Exits (count, %)
- Average Stop-Loss %
- Max Drawdown

**Trade List:**
- Table with all trades
- Columns: Entry Date, Entry Price, Exit Date, Exit Price, P&L, Exit Reason
- Sortable and filterable

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **SCSS** for styling
- **AnyChart** for charting
- **Axios** for API calls
- **React Hook Form** for parameter forms
- **Vite** for build tooling

### Backend
- **Express** for HTTP server
- **yahoo-finance2** for stock data
- **TypeScript**
- **ts-node** for development

## Development Workflow

1. **Add new strategy to @quantomate/strategies**
   - Export strategy with metadata
   - Include parameter definitions

2. **Run `npm run fetch-strategies` in ui package**
   - Scans strategies package
   - Generates `strategies.json`

3. **Restart server**
   - Server reads updated `strategies.json`
   - New strategy available in UI

4. **UI automatically shows new strategy**
   - No code changes needed
   - Dynamic parameter form generated

## Implementation Phases

### Phase 1: Project Setup
- Create ui package structure
- Setup React + TypeScript + Vite
- Setup Express server
- Install dependencies

### Phase 2: Strategy Discovery
- Create strategy metadata format
- Build fetch-strategies script
- Test with existing strategies

### Phase 3: Backend API
- Implement /api/strategies endpoint
- Implement stock data fetching
- Implement backtest runner
- Test with sample data

### Phase 4: Frontend Core
- Strategy selector component
- Dynamic parameter form
- Stock selector with date range
- API integration

### Phase 5: Visualization
- Price chart with entry/exit markers
- Equity curve chart
- Drawdown chart
- Metrics dashboard

### Phase 6: Polish
- Error handling
- Loading states
- Responsive design
- Documentation

## NPM Scripts

```json
{
  "scripts": {
    "fetch-strategies": "ts-node scripts/fetch-strategies.ts",
    "dev:server": "ts-node server/src/index.ts",
    "dev:client": "cd client && vite",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "build": "npm run fetch-strategies && cd client && vite build"
  }
}
```

## Configuration

### Server Port
- Server: `http://localhost:3001`
- Client: `http://localhost:5173` (Vite default)

### CORS
- Allow localhost:5173 in development

## Future Enhancements

- Save/load backtest configurations
- Compare multiple strategies side-by-side
- Export reports as PDF
- Advanced filtering for trade list
- Custom date ranges with presets (1Y, 6M, etc.)
- Multiple stock comparison
- Strategy optimization (parameter sweep)
