# Backtest Visualization UI - Setup Instructions

## Installation

```bash
# From project root
cd packages/ui

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..

# Generate strategies.json
npm run fetch-strategies
```

## Running the Application

```bash
# From packages/ui directory

# Run both client and server
npm run dev

# Or run separately:
npm run dev:server  # Server on http://localhost:3001
npm run dev:client  # Client on http://localhost:5173
```

## Usage

1. Open http://localhost:5173 in your browser
2. Select a strategy from the dropdown
3. Configure strategy parameters
4. Enter stock symbol and date range
5. Set initial capital
6. Click "Run Backtest"
7. View results and metrics

## Current Features

- ✅ Dynamic strategy selection
- ✅ Auto-generated parameter forms
- ✅ Stock data fetching from Yahoo Finance
- ✅ Backtest execution with risk management
- ✅ Metrics dashboard
- ⏳ Charts (Phase 4 - next session)

## Adding New Strategies

1. Add strategy to `@quantomate/strategies` package
2. Update `scripts/fetch-strategies.ts` to include new strategy
3. Run `npm run fetch-strategies`
4. Restart server
5. Strategy appears in UI automatically

## Next Steps (Phase 4)

- Add price chart with AnyChart
- Add equity curve visualization
- Add drawdown chart
- Add entry/exit markers on charts
