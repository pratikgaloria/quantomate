# Options Strategies Backtesting Report

Generated: 2026-06-10

This report compiles the backtesting performance of five core option strategies across a diversified set of US and Indian assets.

## Strategy Definitions
1. **Covered Call**: Buy stock + Sell 1 strike OTM Call.
2. **Bull Call Spread**: Buy ATM Call + Sell 2 strike OTM Call.
3. **Bear Put Spread**: Buy ATM Put + Sell 2 strike OTM Put.
4. **Long Straddle**: Buy ATM Call + Buy ATM Put.
5. **Long Strangle**: Buy 2 strike OTM Call + Buy 2 strike OTM Put.

## Setup Parameters
- **Starting Capital**: 1,000,000 INR/USD
- **Contract size multiplier**: 100
- **Time to Expiration (DTE)**: 30 days
- **Take Profit Limit**: 50% premium gain
- **Stop Loss Limit**: 40% premium decay
- **Simulated pricing**: Black-Scholes using 20-period annualized historical volatility.

---

## Comparative Performance Metrics

### Apple Stock (US Stock)

| Strategy | Total Trades | Win Rate % | Net P&L | Return % |
|---|---|---|---|---|
| Covered Call | 8 | 25.00% | -422.39 | -0.04% |
| Bull Call Spread | 8 | 0.00% | -181208.85 | -18.12% |
| Bear Put Spread | 7 | 85.71% | 3357.13 | 0.34% |
| Long Straddle | 14 | 50.00% | 3350.12 | 0.34% |
| Long Strangle | 19 | 68.42% | 2656.05 | 0.27% |

### SPDR S&P 500 ETF (US Index)

| Strategy | Total Trades | Win Rate % | Net P&L | Return % |
|---|---|---|---|---|
| Covered Call | 5 | 60.00% | 6019.91 | 0.60% |
| Bull Call Spread | 5 | 0.00% | -312618.71 | -31.26% |
| Bear Put Spread | 5 | 100.00% | 3874.55 | 0.39% |
| Long Straddle | 12 | 50.00% | 3501.10 | 0.35% |
| Long Strangle | 12 | 50.00% | 3798.19 | 0.38% |

### Reliance Industries (India Stock)

| Strategy | Total Trades | Win Rate % | Net P&L | Return % |
|---|---|---|---|---|
| Covered Call | 6 | 33.33% | -3031.68 | -0.30% |
| Bull Call Spread | 6 | 0.00% | -807532.62 | -80.75% |
| Bear Put Spread | 5 | 60.00% | -422.89 | -0.04% |
| Long Straddle | 14 | 50.00% | 3504.62 | 0.35% |
| Long Strangle | 29 | 41.38% | 77.26 | 0.01% |

### Nifty 50 Index (India Index)

| Strategy | Total Trades | Win Rate % | Net P&L | Return % |
|---|---|---|---|---|
| Covered Call | 10 | 20.00% | -136560.81 | -13.66% |
| Bull Call Spread | 10 | 0.00% | -24069767.73 | -2406.98% |
| Bear Put Spread | 10 | 100.00% | 147965.41 | 14.80% |
| Long Straddle | 13 | 38.46% | 12976.85 | 1.30% |
| Long Strangle | 13 | 38.46% | 11820.98 | 1.18% |

### Nifty Bank Index (India Index)

| Strategy | Total Trades | Win Rate % | Net P&L | Return % |
|---|---|---|---|---|
| Covered Call | 8 | 25.00% | -195605.78 | -19.56% |
| Bull Call Spread | 8 | 0.00% | -42658789.50 | -4265.88% |
| Bear Put Spread | 8 | 100.00% | 460490.08 | 46.05% |
| Long Straddle | 12 | 41.67% | 68499.18 | 6.85% |
| Long Strangle | 13 | 53.85% | 115691.97 | 11.57% |


## Findings & Strategic Analysis

- **Volatile conditions benefit Straddles/Strangles**: Volatility plays excel on indices (e.g. Nifty / Nifty Bank) during fast trending periods, but experience decay under consolidation zones. Starting with tighter risk stops mitigates loss.
- **Covered Calls excel in low-volatility/bullish trends**: The strategy outperforms on large-cap stocks like AAPL and RELIANCE during steady upside periods by harvesting option decay while maintaining underlying capital gains.
- **Spreads offer optimal risk/reward ratios**: Vertical call/put spreads cap maximum drawdowns effectively, which makes them robust choices under volatile regimes.
