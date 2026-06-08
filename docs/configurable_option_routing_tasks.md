# Task List - Configurable Option Routing and Contract Selection

Checklist for implementing strategy-level options routing and dynamic option contract mapping based on expiration DTE and strike offset.

## Tasks

- [ ] **1. Define Interface Types**
  - Add `OptionSelector` interface in `packages/core/src/strategy.ts` or custom types.
  - Update `StrategyOptions` in `packages/core/src/strategy.ts` to include:
    - `tradeOptions?: boolean;`
    - `optionSelector?: OptionSelector;`

- [ ] **2. Refactor Instrument Mappers**
  - **Kite Options Mapper (`KiteProvider.ts`):**
    - Refactor `findATMOption` to accept `selector?: OptionSelector`.
    - Filter expirations list matching `minDte` / `maxDte` window if DTE is requested.
    - Locate sorted unique strikes, find ATM strike index, and offset selection if `strikeOffset` is provided.
  - **Tradier Options Mapper (`TradierInstrumentMapper.ts`):**
    - Refactor `findATMOption` to accept `selector?: OptionSelector`.
    - Fetch and filter `/expirations` list matching `minDte` / `maxDte` DTE constraints.
    - Fetch options chain for matching expiration.
    - Sort strikes, identify ATM index, and offset contract selection matching `strikeOffset`.

- [ ] **3. Update Execution Engine (`liveEngine.ts`)**
  - Refactor `resolveOptionSymbol` engine configuration signature to support passing `selector?: OptionSelector`.
  - In `executeEntry` and `executeExit`:
    - Lookup active strategy properties: `tradeOptions` and `optionSelector`.
    - Skip options resolution entirely if `tradeOptions` is false.
    - Set execution sizing capital allocation dynamically: `1.0` (100%) for equities, `0.05` (5%) for options.
    - Use the option premium price if `tradeOptions` is true and stock price if false.
    - Pass option selector to `resolveOptionSymbol`.

- [ ] **4. Update Daemon Startup (`daemon.ts`)**
  - Read `tradeOptions` and `optionSelector` from database `bot.parameters` JSON object.
  - Attach those parameters dynamically to the instantiated `strategy.options`.
  - Pass `selector` parameter inside `resolveOptionSymbol` engine-callback to option mappers.

- [ ] **5. Verification and Validation**
  - Run full typescript compilation: `npm run build` from root.
  - Seed test bots with:
    - Bot A: Equity strategy (AAPL stock).
    - Bot B: Option strategy (SPY options with offset).
  - Verify executions via `npm run cli status` and tailing logs.
