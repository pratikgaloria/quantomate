# Checklist: Indicator Visualization Feature

- [x] **1. Backend Routes**
  - [x] Implement `GET /api/trade/historical-prices` to retrieve historical quotes.
  - [x] Implement `POST /api/trade/calculate-indicators` to calculate active indicators on raw data.
  - [x] Verify endpoint responses with a backend test script/unit test.

- [x] **2. Frontend Core Page and Routing**
  - [x] Add the `/indicators` route in `App.tsx`.
  - [x] Add sidebar link for "Indicators" in `Sidebar.tsx`.
  - [x] Create `IndicatorVisualizationPage.tsx` layout and styling stylesheet.

- [x] **3. Active Indicator State and Configuration**
  - [x] Implement symbol search with autocomplete (US & India markets).
  - [x] Define library indicators schema (types, default values, min/max limits, visual overlay categories).
  - [x] Add selection panel to toggle indicators on/off.
  - [x] Render configuration form inputs to edit params and update state.

- [x] **4. Chart Component Development**
  - [x] Implement `IndicatorChart.tsx` wrapper for `anychart.stock()`.
  - [x] Bind historical OHLCV quotes to main price plot.
  - [x] Overlay indicators on main plot (SMA, EMA, WMA, DEMA, TEMA, BB, VWAP, AVWAP, PivotTrend).
  - [x] Append sub-plots dynamically for separate pane indicators (RSI, MACD, Stochastic, ATR, CCI, ROC, MOM, WilliamsR, RVOL, Slope).
  - [x] Set level markers and colors (e.g. 30/70 dash lines for RSI).

- [x] **5. Verification & Testing**
  - [x] Verify TypeScript and Vite server compile successfully without warnings.
  - [x] Verify backend calculation outputs are aligned and correct.
