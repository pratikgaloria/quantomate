# @quantomate/indicators

@quantomate/indicators provide ready-to-use technical indicators for your trading setup. The library leverages powerful fundamentals of [@quantomate/core](https://www.npmjs.com/package/@quantomate/core) to build the indicators with Typescript.

# Available indicators

The package currently supports the following indicators:

### Moving Averages
- **Simple Moving Average (SMA)**: Calculates the average of a selected range of prices, usually closing prices, by the number of periods in that range.
- **Exponential Moving Average (EMA)**: Similar to SMA but places a greater weight and significance on the most recent data points.
- **Weighted Moving Average (WMA)**: A moving average where each observation in the period is assigned a weight, with the most recent data points having the highest weight.
- **Double Exponential Moving Average (DEMA)**: Reduces the lag of a traditional EMA, making it more responsive to market changes.
- **Triple Exponential Moving Average (TEMA)**: Reduces lag even further than DEMA, providing a very fast-reacting moving average.

### Momentum & Trend
- **Relative Strength Index (RSI)**: Measures the speed and change of price movements to identify overbought or oversold conditions.
- **Moving Average Convergence Divergence (MACD)**: A trend-following momentum indicator that shows the relationship between two moving averages of a security's price.
- **Rate of Change (ROC)**: A momentum oscillator that measures the percentage change in price between the current price and the price a certain number of periods ago.
- **Momentum (MOM)**: Measures the amount that a security's price has changed over a given time span.
- **Average True Range (ATR)**: A market volatility indicator derived from the 14-day moving average of a series of true range indicators.
- **Commodity Channel Index (CCI)**: A momentum-based oscillator used to help determine when an investment vehicle is reaching a condition of being overbought or oversold.
- **Stochastic Oscillator**: A momentum indicator comparing a particular closing price of a security to a range of its prices over a certain period of time.
- **Williams %R**: A momentum indicator that measures overbought and oversold levels.
- **Pivot Trend**: Identifies trend direction based on pivot points.

### Volatility
- **Bollinger Bands (BB)**: A set of trendlines plotted two standard deviations (positively and negatively) away from a simple moving average (SMA) of a security's price.

## Usage

```typescript
import { Dataset } from '@quantomate/core';
import { SMA, RSI } from '@quantomate/indicators';

const dataset = new Dataset([...quotes]);

// Calculate single value
const sma = new SMA('sma', { period: 14 });
const value = sma.calculate(dataset);

// Apply to dataset (adds indicator to all quotes)
dataset.apply(sma);

// Incremental updates
dataset.add(newQuote); // Automatically updates SMA
```
