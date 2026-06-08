# Live-Trading Architecture Flow

This document details the current runtime architecture of the `quantomate` live trading system, detailing how components interact from startup through live tick processing to execution.

---

## 1. Component Relationship

The following architecture diagram represents the relationship between the Express Server, the Database, the `LiveTradingManager` orchestrator, and the core components of the trading loop:

```mermaid
graph TD
    subgraph "Express Backend"
        index["server/index.ts"] -->|initialize| LTM["LiveTradingManager"]
        routes["server/routes.ts"] -->|reconcile request| LTM
    end

    subgraph "Database (PostgreSQL)"
        DB[("Prisma DB")] <-->|Read Active Bots / Read Session| LTM
    end

    subgraph "Core Trading Loop"
        LTM -->|Spawns / Configures| LTE["LiveTradingEngine"]
        LTM -->|Creates| KLF["KiteLiveFeed"]
        LTM -->|Creates| PB["PaperBroker"]

        LTE -->|Subscribes to Ticks| KLF
        LTE -->|Executes Orders| PB
        
        KLF -->|Pipes WebSocket Ticks| LTE
        LTE -->|Feeds ticks & evaluates signals| Trader["Trader / Strategy"]
        
        Trader -->|Triggers Entry/Exit| LTE
        LTE -->|Queries Option Contract| KIM["KiteInstrumentMapper"]
        KIM -->|ATM CE/PE Symbol| LTE
    end

    subgraph "Zerodha APIs"
        KLF <-->|WebSocket Connection| ZWS["Kite WebSocket API"]
        PB <-->|LTP / Margins| ZREST["Kite REST API"]
    end
```

---

## 2. Startup & Reconciliation Sequence

When the server starts or the user triggers a toggle on the UI dashboard, the system reconciles the active trading engines:

```mermaid
sequenceDiagram
    autonumber
    participant Client as Web Frontend
    participant Server as Express Server
    participant LTM as LiveTradingManager
    participant DB as Prisma DB
    participant LTE as LiveTradingEngine
    participant KLF as KiteLiveFeed

    Client->>Server: Toggle Bot Active/Inactive
    Server->>DB: Update Bot Active State
    Server->>LTM: reconcile()
    LTM->>DB: Query Active Bots & Session Token
    DB-->>LTM: Return active bots & token
    
    alt No Active Bots OR Invalid Token
        LTM->>LTM: stopEngine()
        LTM-->>Server: Done (State: Idle)
    else Active Bots & Valid Token Present
        LTM->>LTM: stopEngine() (Ensure clean slate)
        LTM->>KLF: New instance with API Key & Token
        LTM->>LTE: New instance with Feed & Broker
        LTM->>LTE: start()
        LTE->>KLF: connect()
        KLF->>KLF: Establish WebSocket Handshake
        LTE->>KLF: subscribe(symbols)
        LTE-->>LTM: Success
        LTM-->>Server: Done (State: Running)
    end
    Server-->>Client: Return current status
```

---

## 3. Live Tick Processing & Order Execution Loop

Once running, ticks stream asynchronously from the websocket feed. The engine enqueues them sequentially to maintain strict state consistency:

```mermaid
sequenceDiagram
    autonumber
    participant KLF as KiteLiveFeed
    participant LTE as LiveTradingEngine
    participant PB as PaperBroker
    participant Trader as Trader & Strategy
    participant KIM as KiteInstrumentMapper

    KLF->>LTE: onTick(symbol, price)
    Note over LTE: Sequential promise chain queue (enqueueTick)
    LTE->>PB: setLastPrice(symbol, price) (Update mock bid/ask)
    
    loop For Each Bot Strategy
        LTE->>Trader: tick(price)
        Note over Trader: Update Indicators (EMA/RSI)<br/>Evaluate Conditions
        Trader-->>LTE: Return signal (entry / exit / none)
        
        alt Signal == entry
            LTE->>KIM: findATMOption(symbol, optionType, underlyingPrice)
            KIM-->>LTE: Option Trading Symbol (e.g. NIFTY2660421000CE)
            LTE->>PB: getPositions()
            
            alt Not Already in Position
                LTE->>PB: getAccountInfo() (Check balance)
                Note over LTE: Compute position size (5% allocation)
                LTE->>PB: placeOrder(BUY, OptionSymbol, Qty)
                PB-->>LTE: Order Success (ID)
            end
            
        else Signal == exit
            LTE->>PB: getPositions()
            Note over LTE: Find active CE/PE option contract position
            
            alt Open Position Exists
                LTE->>PB: placeOrder(SELL, OptionSymbol, PositionQty)
                PB-->>LTE: Order Success (ID)
            end
        end
    end
```

---

## 4. Key Areas to Target for Refactoring

During our review, we should keep the following aspects of the current system in mind:

1. **State Preservation (Hot Reloading)**:
   - *Current issue*: When the server restarts (e.g. via nodemon), `LiveTradingEngine` is recreated. This resets all `Dataset` history (EMA and RSI values are lost until enough ticks arrive to recompute them).
   - *Improvement*: Persist recent indicator values or historical ticks in the DB/Redis to hot-start datasets on initialization.
2. **WebSocket Threading / Worker Process**:
   - *Current issue*: The websocket runs inside the main Express single thread. A CPU-heavy operation on the server can delay tick consumption.
   - *Improvement*: Spawn the `LiveTradingEngine` in a separate Node `Worker Thread` or process, communicating state back to the main thread via IPC.
3. **Paper Order Matching Accuracy**:
   - *Current issue*: `PaperBroker` simulates market orders by matching them at the last traded price of the underlying or the option contract.
   - *Improvement*: Introduce slippage models or bid/ask spread margins to backtests and paper execution to match live trading environments.
