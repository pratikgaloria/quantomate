# Tasks: Session-Based Capital Allocation & Virtual Accounts

This document outlines the detailed development steps to implement the session-based capital allocation and risk management model in Quantomate.

## Phase 1: Database & Schema
- [ ] Update `prisma.schema` to introduce the `AllocationSession` model.
- [ ] Add `allocationSessionId` relation field in `TradingBot` model.
- [ ] Generate and run Prisma migrations.
- [ ] Seed default allocation sessions for India, US, and Crypto markets.

## Phase 2: Daemon Session Manager & Sizing Logic
- [ ] Implement a `SessionManager` module in `@quantomate/trade` that:
  - Loads and caches active `AllocationSession` configurations.
  - Maintains in-memory virtual capital ledgers (checking starting capital, debits from trades, and credits from closed P&L).
- [ ] Refactor order sizing in `liveEngine.ts` (`executeEntry`):
  - Identify the bot's parent `AllocationSession`.
  - Calculate sizing relative to the session's virtual capital (instead of total physical account balance).
- [ ] Implement session-level safety and risk checks:
  - Block entries if they exceed virtual cash balance.
  - Block entries if session-level max drawdown threshold is hit.
  - Check broker physical capital availability as the final gateway.

## Phase 3: UI Dashboard Refactoring
- [ ] Refactor UI to show the list of Allocation Sessions with their starting capital and real-time virtual balance/drawdown metrics.
- [ ] Add a modal dialog to create/edit Allocation Sessions.
- [ ] Update the "+ Add Bot" form to require selecting a target `AllocationSession`.
- [ ] Render bots grouped by their assigned Allocation Session.

## Phase 4: Verification & Testing
- [ ] Create unit tests in `@quantomate/trade` verifying virtual cash debit/credit logic and risk limit blocks.
- [ ] Manually test concurrent paper trading of multiple bots under different sessions and verify capital isolation.
