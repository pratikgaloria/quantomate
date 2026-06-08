# Roadmap & Tasks: Independent Trading Daemon & Scheduler (Quantomate Repo)

This document provides a detailed roadmap and actionable task list for migrating the paper/live trading engine into a standalone background process (Daemon) with CLI control, time-based market scheduling, and dynamic settings—all within the **quantomate** workspace.

---

## 1. Roadmap Overview

### Phase 1: Database Configuration
- Introduce schema tables `SystemSetting` and `TradingBot` in `packages/db`.
- Sync database schemas.
- Initialize default settings and seed bots.

### Phase 2: Independent Trading Daemon (`packages/trade/src/daemon.ts`)
- Build a lightweight Node process starting an Express API on port `8082`.
- Retain the active `LiveTradingEngine`, `ILiveFeed`, and `IBroker` instances.
- Ensure paper trading positions, orders, and execution logs are kept in-memory within this daemon.
- Implement API endpoints:
  - `GET /status`: Query daemon engine state, bots, in-memory positions, and orders.
  - `POST /reconcile`: Reload database configurations and start/stop engines.
  - `POST /stop`: Safely disconnect feeds and terminate the daemon process.

### Phase 3: Market Session Scheduler (`packages/trade/src/utils/market-scheduler.ts`)
- Implement session logic to monitor active market hours based on target timezones:
  - **India (NSE/BSE)**: `Asia/Kolkata` (09:15 - 15:30), Mon-Fri
  - **US (NYSE/NASDAQ)**: `America/New_York` (09:30 - 16:00), Mon-Fri
  - **Crypto**: `UTC` (24/7)
- Run a 1-minute interval checking loop inside the daemon to connect/disconnect feeds dynamically when market sessions start or end.

### Phase 4: Express Web Server Proxy (`packages/ui/server/src/routes/trade.ts`)
- Add Express API routes that act as proxies to the daemon on port `8082`.
- Provide endpoints to fetch status, positions, orders, toggle bots, and fetch/modify settings.
- Implement fallback behavior if the daemon is offline.

### Phase 5: Management CLI (`packages/trade/src/cli.ts`)
- CLI commands to control the daemon lifecycle:
  - `npm run cli start`: Detaches process, saves PID to `packages/trade/daemon.pid`, writes stdout/stderr to `packages/trade/trading.log`.
  - `npm run cli stop`: Calls daemon `/stop` endpoint or falls back to PID SIGTERM.
  - `npm run cli status`: Fetches daemon `/status` and formats active stats, positions, and logs.
  - `npm run cli config set <key> <value>`: Modifies settings directly in the database.

### Phase 6: Trading UI Client (`packages/ui/client/src/pages/TradingPage.tsx`)
- Build the `TradingPage` component.
- Display Zerodha/Broker authentication status.
- Renders live indices, active strategy bots grid with start/stop buttons, positions table, and order logs.
- Add settings section to toggle Paper/Live mode and enabled markets (US, India, Crypto).
- Link `/trade` in `Sidebar.tsx` and register in `App.tsx`.

---

## 2. Detailed Task Checklist

- [ ] **Phase 1: Database Setup**
  - [ ] Add `SystemSetting` and `TradingBot` models to `packages/db/prisma/schema.prisma`.
  - [ ] Execute `npx prisma db push` (and generate client) to sync database schema.
  - [ ] Initialize default database settings (`trading_mode: "paper"`, `enabled_markets: ["india"]`).

- [ ] **Phase 2: Trading Daemon Implementation**
  - [ ] Update `packages/trade/package.json` with dependencies (`express`, `cors`, `@quantomate/db`, `npmlog`, `dotenv`) and build commands.
  - [ ] Create `packages/trade/src/daemon.ts` with Express server on port `8082`.
  - [ ] Move `LiveTradingEngine` and feed instantiations here.
  - [ ] Store paper trading balances, positions, orders, and execution logs in-memory.
  - [ ] Implement `GET /status`, `POST /reconcile`, and `POST /stop` endpoints.

- [ ] **Phase 3: Market Hours Scheduler**
  - [ ] Create `packages/trade/src/utils/market-scheduler.ts` with timezone evaluation.
  - [ ] Integrate checking loop in the daemon to start/stop the engine for scheduled markets.

- [ ] **Phase 4: Web Server Integration & Proxy**
  - [ ] Create `packages/ui/server/src/routes/trade.ts` to proxy requests to `http://localhost:8082`.
  - [ ] Update `packages/ui/server/src/index.ts` to register the new routes.

- [ ] **Phase 5: CLI Tool**
  - [ ] Create `packages/trade/src/cli.ts` handling `start`, `stop`, `status`, and `config` actions.
  - [ ] Hook PID tracking and file logger redirections to ensure the daemon runs detached in the background.

- [ ] **Phase 6: Frontend Settings UI**
  - [ ] Create `TradingPage.tsx` and `TradingPage.scss` in `packages/ui/client/src/pages/`.
  - [ ] Add "Trade" nav item linking to `/trade` in `Sidebar.tsx`.
  - [ ] Mount `/trade` in `App.tsx`.
