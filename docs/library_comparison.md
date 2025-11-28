# TypeScript/JavaScript Backtesting Libraries Comparison

## TL;DR Recommendation

**For your use case (building strategies, paper trading, research):**
1. **Best Overall: Grademark** - Mature, well-documented, TypeScript-first
2. **Runner-up: BacktestJS** - Modern, comprehensive, good UI
3. **Consider: Your Current System** - You're 80% there, might be worth finishing

---

## Top Libraries

### 1. Grademark ⭐ **RECOMMENDED**

**GitHub:** https://github.com/grademark/grademark  
**Language:** TypeScript/JavaScript  
**Status:** Mature, actively maintained

**Pros:**
- ✅ **TypeScript-first** - Excellent type safety
- ✅ **Comprehensive API** - Entry/exit rules, indicators, equity curves
- ✅ **Advanced features** - Monte Carlo simulation, walk-forward analysis
- ✅ **Built on Data-Forge** - Powerful data manipulation library
- ✅ **Visualization** - Integrates with Data-Forge Notebook
- ✅ **Intrabar features** - Stop-loss, profit targets, conditional orders
- ✅ **Well-documented** - Good examples and tutorials
- ✅ **Production-ready** - Used in real trading systems

**Cons:**
- ❌ No built-in live trading (backtesting only)
- ❌ Requires Data-Forge knowledge
- ❌ Heavier dependency footprint

**Example:**
```typescript
import { backtest } from 'grademark';

const strategy = {
    entryRule: (enterPosition, args) => {
        if (args.bar.close > args.bar.sma50) {
            enterPosition({ direction: "long" });
        }
    },
    exitRule: (exitPosition, args) => {
        if (args.bar.close < args.bar.sma50) {
            exitPosition();
        }
    },
    stopLoss: args => args.entryPrice * 0.95,  // 5% stop-loss
};

const trades = backtest(strategy, inputSeries);
```

**Best For:** Serious backtesting, research, production systems

---

### 2. BacktestJS 🚀

**Website:** https://backtestjs.com  
**GitHub:** https://github.com/backtestjs/framework  
**Language:** TypeScript/JavaScript  
**Status:** Modern, actively developed

**Pros:**
- ✅ **Modern architecture** - Clean TypeScript codebase
- ✅ **CLI + UI** - Browser-based results viewer
- ✅ **Data management** - Built-in historical data downloading
- ✅ **100+ indicators** - Via `tulind` library
- ✅ **Multi-symbol/multi-timeframe** - Test across multiple assets
- ✅ **CSV import/export** - Easy data handling
- ✅ **Fast** - Optimized for performance
- ✅ **Good DX** - Developer-friendly API

**Cons:**
- ❌ Newer project (less battle-tested)
- ❌ Documentation could be more comprehensive
- ❌ No built-in optimization features

**Example:**
```typescript
// strategies/my-strategy.ts
export default class MyStrategy {
    async run(candles, indicators) {
        const rsi = indicators.rsi(candles, 14);
        
        if (rsi < 30) return 'buy';
        if (rsi > 70) return 'sell';
        return 'hold';
    }
}
```

**Best For:** Quick prototyping, modern tooling, visual results

---

### 3. NextTrade 🤖

**GitHub:** https://github.com/Algotia/NextTrade  
**Language:** TypeScript  
**Status:** Open-source, community-driven

**Pros:**
- ✅ **Full platform** - Create, test, optimize, deploy
- ✅ **UI included** - Web interface for strategy creation
- ✅ **AI-powered** - Chat interface for simple strategies
- ✅ **Genetic algorithms** - Built-in optimization
- ✅ **TypeScript-native** - Great for TS developers

**Cons:**
- ❌ **Slow for large backtests** - Performance issues reported
- ❌ **Limited configurability** - Not ideal for complex logic
- ❌ **Opinionated** - Less flexible than libraries
- ❌ **Heavier** - Full platform vs. lightweight library

**Best For:** Beginners, visual strategy building, quick experiments

---

### 4. Grandmaster 🎯

**GitHub:** https://github.com/Grademark/grandmaster  
**Language:** Node.js  
**Status:** Mature

**Pros:**
- ✅ **Execution engine** - Not just backtesting, can trade live
- ✅ **Highly configurable** - Flexible strategy definition
- ✅ **Multiple data sources** - Extensible data integration
- ✅ **MySQL/Redis support** - Production-grade data storage

**Cons:**
- ❌ **Requires infrastructure** - MySQL, Redis setup
- ❌ **Steeper learning curve** - More complex than others
- ❌ **Less documentation** - Smaller community

**Best For:** Production trading systems, live execution

---

### 5. fugle-backtest-node 📊

**GitHub:** https://github.com/chunkai1312/fugle-backtest-node  
**Language:** TypeScript (based on Danfo.js)  
**Status:** Active

**Pros:**
- ✅ **Inspired by backtesting.py** - Familiar API if you know Python
- ✅ **Danfo.js integration** - Pandas-like data manipulation
- ✅ **Parameter optimization** - Built-in
- ✅ **TypeScript** - Type-safe

**Cons:**
- ❌ **Smaller community** - Less popular
- ❌ **Limited documentation** - Fewer examples
- ❌ **Danfo.js dependency** - Another library to learn

**Best For:** Python traders transitioning to TypeScript

---

### 6. Quantform 💎

**Website:** https://quantform.io  
**Language:** TypeScript  
**Status:** Active, crypto-focused

**Pros:**
- ✅ **Declarative approach** - Reactive programming style
- ✅ **Crypto-focused** - Built for crypto markets
- ✅ **TypeScript-first** - Modern codebase
- ✅ **Reactive** - RxJS-based architecture

**Cons:**
- ❌ **Crypto-only** - Not ideal for stocks
- ❌ **Different paradigm** - Reactive programming learning curve
- ❌ **Smaller ecosystem** - Less mature

**Best For:** Crypto trading, reactive programming enthusiasts

---

## Feature Comparison Matrix

| Feature | Grademark | BacktestJS | NextTrade | Grandmaster | Your System |
|---------|-----------|------------|-----------|-------------|-------------|
| **TypeScript** | ✅ | ✅ | ✅ | ⚠️ (JS) | ✅ |
| **Stop-Loss** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Position Sizing** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Transaction Costs** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Optimization** | ✅ | ❌ | ✅ | ⚠️ | ❌ |
| **Live Trading** | ❌ | ❌ | ⚠️ | ✅ | ❌ |
| **Visualization** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **100+ Indicators** | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ (2) |
| **Multi-Asset** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Documentation** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Community** | Large | Growing | Medium | Small | N/A |
| **Performance** | Fast | Very Fast | Slow | Fast | Fast |

---

## Decision Framework

### Choose **Grademark** if:
- ✅ You want a mature, battle-tested library
- ✅ You need advanced features (Monte Carlo, walk-forward)
- ✅ You're building a serious trading system
- ✅ You value comprehensive documentation
- ✅ You don't mind learning Data-Forge

### Choose **BacktestJS** if:
- ✅ You want modern tooling and UI
- ✅ You need quick visual feedback
- ✅ You want built-in data management
- ✅ You prefer a lighter-weight solution
- ✅ You value developer experience

### Choose **NextTrade** if:
- ✅ You're a beginner
- ✅ You want a full platform (not just a library)
- ✅ You like visual/AI-assisted strategy building
- ✅ You don't need high performance

### Choose **Grandmaster** if:
- ✅ You need live trading execution
- ✅ You have infrastructure (MySQL, Redis)
- ✅ You're building a production system
- ✅ You need maximum configurability

### Keep **Your Current System** if:
- ✅ You want full control and understanding
- ✅ You enjoy building from scratch
- ✅ You have specific requirements not met by others
- ✅ You're learning by doing
- ✅ You're 80% done already

---

## Migration Effort Estimate

### To Grademark:
**Effort:** Medium (2-3 days)
- Rewrite strategies using Grademark API
- Migrate indicators to Data-Forge format
- Learn Data-Forge data manipulation
- **Gain:** Stop-loss, optimization, visualization

### To BacktestJS:
**Effort:** Medium (2-3 days)
- Rewrite strategies in BacktestJS format
- Use tulind for indicators (or port yours)
- Set up data management
- **Gain:** UI, data management, 100+ indicators

### To NextTrade:
**Effort:** Low-Medium (1-2 days)
- Use UI to recreate strategies
- Less code, more configuration
- **Gain:** UI, optimization, easier for non-coders

### Enhance Your System:
**Effort:** Medium-High (1-2 weeks)
- Implement missing features from core_improvements.md
- Add stop-loss, position sizing, transaction costs
- Optimize performance
- **Gain:** Full control, custom features, learning

---

## Recommendation

### Option 1: Fork Grademark (RECOMMENDED)
**Why:**
- Most mature TypeScript library
- Has all the features you need (stop-loss, optimization, etc.)
- Well-documented and battle-tested
- You can still build custom strategies on top

**Migration Path:**
1. Install Grademark + Data-Forge
2. Port your Golden Cross and RSI strategies
3. Use their backtesting engine
4. Focus on strategy research, not infrastructure

**Time Saved:** 2-3 weeks of core development

### Option 2: Enhance Your System
**Why:**
- You already have 80% of what you need
- You understand it completely
- Custom features are easier to add
- Great learning experience

**Implementation Path:**
1. Follow Phase 1 from core_improvements.md
2. Add stop-loss/position sizing (1 week)
3. Add transaction costs (2 days)
4. Optimize performance (3 days)

**Time Investment:** 2 weeks to production-ready

### Option 3: Hybrid Approach (BEST OF BOTH)
**Why:**
- Use Grademark for backtesting engine
- Keep your strategy/indicator architecture
- Best of both worlds

**Implementation:**
```typescript
// Your strategy
import { GoldenCrossStrategy } from './strategies';
import { backtest } from 'grademark';

// Adapter to Grademark format
const grademarkStrategy = {
    entryRule: (enterPosition, args) => {
        const signal = goldenCross.apply(args.bar);
        if (signal.position.value === 'entry') {
            enterPosition({ direction: "long" });
        }
    },
    // ... use Grademark's stop-loss, position sizing, etc.
};
```

---

## Final Verdict

**For your goals (strategy research, paper trading):**

1. **Short-term (next 2 weeks):** Use **Grademark**
   - Fork it, port your 2 strategies
   - Focus on building more strategies
   - Leverage their optimization tools

2. **Long-term (3+ months):** Enhance your system
   - Once you have 10+ strategies working in Grademark
   - You'll know exactly what features you need
   - Build a custom system with those learnings

**You're not reinventing the wheel if:**
- You're learning (✅ you are)
- You have unique requirements (⚠️ not yet, but will)
- You want full control (✅ you do)

**You ARE reinventing if:**
- You're just rebuilding what exists (✅ stop-loss, position sizing)
- You're not adding unique value (⚠️ your strategies are unique)

**My advice:** Use Grademark for the next month. Build 5-10 strategies. Then decide if you need custom infrastructure. By then, you'll know exactly what you need.
