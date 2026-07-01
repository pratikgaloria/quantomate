# Workspace Rules

- **No Ad-Hoc Ticker Mappings**: Never implement ad-hoc ticker symbol mappings (such as mapping broker/index symbols to Yahoo Finance symbols or parsing string formats to guess markets/exchanges) in the codebase. Use clean data routing and data provider abstractions based on native symbols.
