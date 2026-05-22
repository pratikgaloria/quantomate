## Indicators Required

You already support indicators, so implement these:

1) Anchored VWAP (daily reset)

Session VWAP

2) EMA 20

Intraday momentum

3) Higher timeframe trend filter

Daily EMA 50

4) Relative Volume

Current volume vs 20-day average same minute

5) ATR (for stops)

14 period on 5min

## Strategy Definition — Pullback Continuation

Timeframe: 5 minute candles
Session: US market hours only

Higher timeframe bias (daily)

Long allowed only if:

Close > Daily EMA50
AND
Daily EMA50 slope > 0


(No shorts yet — asymmetry improves win rate)

## Intraday Trend Detection

Market is trending if:

Price above VWAP
AND
EMA20 above VWAP

## Entry Condition (the edge)

We wait for pullback:

Price pulls back toward VWAP

Candle closes back above EMA20

Volume spike > 1.2x relative volume

Distance to VWAP < 0.5 ATR

ENTER LONG at close

### Stop loss
Stop = Entry - 1 ATR

### Take Profit

Two targets:

TP1 = 1R (50% position)
TP2 = 2R (rest)


No trailing stop yet.

## Why this works (important)

We are modeling institutional execution:

Trend exists

Late profit takers sell

VWAP buyers step in

Momentum resumes

This repeats daily.

## Step 4 — Backtesting Rules (IMPORTANT)

You must enforce:

No lookahead bias

Use only candle-closed data.

Commission & slippage

Add:

slippage = 0.02%
commission = 0.005/share equivalent


Otherwise results are fantasy.