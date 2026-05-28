import { prisma } from '@quantomate/db';
import { DataService } from '../DataService';
import { SignalMetrics, RawMetrics } from './SignalMetrics';
import { DEFAULT_CONFIG, ScoringConfig } from './config';


export class FundamentalService {
  /**
   * Fetch raw metrics and calculate scores/recommendations for a group of symbols.
   */
  static async refreshSignals(
    symbols: { ticker: string; sector?: string; name?: string }[],
    config: ScoringConfig = DEFAULT_CONFIG,
    cachedOnly = false
  ): Promise<any[]> {
    const now = Date.now();
    const yahooSymbols = symbols.map(s => s.ticker);

    // 1. Fetch current quotes from Yahoo Finance
    const quotesMap = new Map<string, any>();
    if (!cachedOnly) {
      try {
        const quotes = await DataService.provider.getQuotes(yahooSymbols);
        if (quotes) {
          for (const [sym, quote] of quotes.entries()) {
            quotesMap.set(sym, quote);
          }
        }
      } catch (e) {
        console.warn("FundamentalService: Failed to fetch current quotes:", (e as Error).message);
      }
    }

    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    // 2. Refresh cache for requested symbols if they are missing or expired
    if (!cachedOnly) {
      for (const s of symbols) {
        const symbolId = s.ticker;
        try {
          const dbSymbol = await prisma.symbol.findUnique({
            where: { id: symbolId },
            include: { metrics: true }
          });

          const isExpired = !dbSymbol?.metrics || (now - dbSymbol.metrics.updatedAt.getTime() > CACHE_TTL);

          if (isExpired) {
            console.log(`Fundamental cache missing/expired for ${symbolId}. Fetching from Yahoo Finance...`);
            try {
              const summary = await DataService.provider.getFundamentals(symbolId);

              const peRatio = summary.peRatio ?? undefined;
              const forwardPe = summary.forwardPe ?? undefined;
              const priceToSales = summary.priceToSales ?? undefined;
              const evToEbitda = summary.evToEbitda ?? undefined;
              const fcfYield = summary.fcfYield ?? undefined;
              const revGrowth = summary.revGrowth ?? undefined;
              const epsGrowth = summary.epsGrowth ?? undefined;

              const name = summary.name || dbSymbol?.name || s.name || symbolId;
              const sector = summary.sector || dbSymbol?.sector || s.sector || "Unknown";
              const industry = summary.industry || dbSymbol?.industry || "Unknown";

              // Upsert symbol metadata
              await prisma.symbol.upsert({
                where: { id: symbolId },
                create: { id: symbolId, name, sector, industry },
                update: { name, sector, industry }
              });

              // Upsert metrics
              await prisma.fundamentalMetric.upsert({
                where: { symbolId },
                create: {
                  symbolId,
                  peRatio,
                  forwardPe,
                  priceToSales,
                  evToEbitda,
                  fcfYield,
                  revGrowth,
                  epsGrowth
                },
                update: {
                  peRatio,
                  forwardPe,
                  priceToSales,
                  evToEbitda,
                  fcfYield,
                  revGrowth,
                  epsGrowth
                }
              });
            } catch (err) {
              console.warn(`Failed to fetch fundamental summary for ${symbolId}:`, (err as Error).message);
              try {
                await prisma.fundamentalMetric.upsert({
                  where: { symbolId },
                  create: { symbolId },
                  update: { updatedAt: new Date() }
                });
              } catch (dbErr) {
                console.error(`Failed to create fallback metric record for ${symbolId}:`, dbErr);
              }
            }
          }
        } catch (err) {
          console.error(`Error refreshing cache for ${symbolId}:`, err);
        }
      }
    }

    // 3. Gather data for ALL symbols in the database to build a complete benchmark group
    const dbSymbolsWithMetrics = await prisma.symbol.findMany({
      include: { metrics: true }
    });

    // Fetch all historical prices in one query to optimize performance
    const allPrices = await prisma.historicalPrice.findMany({
      orderBy: { date: "asc" }
    });

    // Group historical prices by symbolId
    const pricesMap = new Map<string, any[]>();
    for (const p of allPrices) {
      if (!pricesMap.has(p.symbolId)) {
        pricesMap.set(p.symbolId, []);
      }
      pricesMap.get(p.symbolId)!.push(p);
    }

    const rawMetricsList: any[] = [];

    for (const symbol of dbSymbolsWithMetrics) {
      const symbolId = symbol.id;
      try {
        let history = pricesMap.get(symbolId) || [];
        const isRequested = yahooSymbols.includes(symbolId);

        // For requested symbols, if not cachedOnly, call DataService to ensure we sync missing incremental data first
        if (isRequested && !cachedOnly) {
          history = await DataService.getHistoricalData(symbolId);
        }

        if (history.length === 0) {
          continue;
        }

        const peRatio = symbol.metrics?.peRatio ?? undefined;
        const forwardPe = symbol.metrics?.forwardPe ?? undefined;
        const priceToSales = symbol.metrics?.priceToSales ?? undefined;
        const evToEbitda = symbol.metrics?.evToEbitda ?? undefined;
        const fcfYield = symbol.metrics?.fcfYield ?? undefined;
        const revGrowth = symbol.metrics?.revGrowth ?? undefined;
        const epsGrowth = symbol.metrics?.epsGrowth ?? undefined;

        const name = symbol.name || symbolId;
        const sector = symbol.sector || "Unknown";
        const industry = symbol.industry || "Unknown";

        // Get quote details if available (for requested symbols)
        const quote = quotesMap.get(symbolId);

        const latestPriceInHistory = history.length > 0 ? history[history.length - 1].close : 0;
        const currentPrice = quote?.price ?? latestPriceInHistory;
        const changePct = quote?.changePercent ?? 0;

        let high52 = quote?.fiftyTwoWeekHigh ?? 0;
        let low52 = quote?.fiftyTwoWeekLow ?? 0;

        if (!quote && history.length > 0) {
          const oneYearAgo = new Date();
          oneYearAgo.setDate(oneYearAgo.getDate() - 365);
          const recentHistory = history.filter(h => new Date(h.date) >= oneYearAgo);
          if (recentHistory.length > 0) {
            high52 = Math.max(...recentHistory.map(h => h.high));
            low52 = Math.min(...recentHistory.map(h => h.low));
          } else {
            high52 = latestPriceInHistory;
            low52 = latestPriceInHistory;
          }
        }

        // Calculate momentum
        const momentum = SignalMetrics.calculateMomentum(
          currentPrice,
          history,
          {
            useVolumeConfirmation: config.momentum.use_volume_confirmation,
            maxVolumeMultiplier: config.momentum.max_volume_multiplier
          }
        ) ?? undefined;

        // Calculate risk metrics
        const position_52w = SignalMetrics.calculatePosition52w(currentPrice, high52, low52);
        const drawdown = SignalMetrics.calculateDrawdown(currentPrice, history);

        rawMetricsList.push({
          ticker: symbolId,
          name,
          sector,
          industry,
          timestamp: now,
          price: currentPrice,
          change_pct: changePct,
          momentum,
          risk: {
            position_52w,
            drawdown
          },
          valuation: {
            pe_ratio: peRatio,
            forward_pe: forwardPe,
            price_to_sales: priceToSales,
            ev_to_ebitda: evToEbitda,
            fcf_yield: fcfYield
          },
          growth: {
            revenue_growth_yoy: revGrowth,
            eps_growth_yoy: epsGrowth
          }
        });
      } catch (err) {
        console.error(`Error processing fundamentals for ${symbolId}:`, err);
      }
    }

    // 4. Compute rankings/percentiles and recommendations across the entire benchmark group
    const scoredList = this.scoreAndRecommend(rawMetricsList, config);

    // 5. Filter the results to only return the requested symbols
    return scoredList.filter(item => yahooSymbols.includes(item.ticker));
  }

  private static scoreAndRecommend(metricsList: any[], config: ScoringConfig): any[] {
    // Generate benchmarks for group
    const bench = {
      momentum: metricsList.map(m => m.momentum?.momentum_raw).filter(v => v !== undefined) as number[],
      position_52w: metricsList.map(m => m.risk?.position_52w).filter(v => v !== undefined) as number[],
      drawdown: metricsList.map(m => m.risk?.drawdown).filter(v => v !== undefined) as number[],
      pe: metricsList.map(m => m.valuation?.pe_ratio).filter(v => v !== undefined) as number[],
      ps: metricsList.map(m => m.valuation?.price_to_sales).filter(v => v !== undefined) as number[],
      evEbitda: metricsList.map(m => m.valuation?.ev_to_ebitda).filter(v => v !== undefined) as number[],
      fcfYield: metricsList.map(m => m.valuation?.fcf_yield).filter(v => v !== undefined) as number[],
      revenueGrowth: metricsList.map(m => m.growth?.revenue_growth_yoy).filter(v => v !== undefined) as number[],
      epsGrowth: metricsList.map(m => m.growth?.eps_growth_yoy).filter(v => v !== undefined) as number[]
    };

    // Benchmark grouping by sector for sector-specific scores
    const sectorGroups = new Map<string, any[]>();
    for (const m of metricsList) {
      if (!sectorGroups.has(m.sector)) {
        sectorGroups.set(m.sector, []);
      }
      sectorGroups.get(m.sector)!.push(m);
    }

    const sectorBenchmarks = new Map<string, any>();
    for (const [sec, list] of sectorGroups.entries()) {
      sectorBenchmarks.set(sec, {
        momentum: list.map(m => m.momentum?.momentum_raw).filter(v => v !== undefined),
        position_52w: list.map(m => m.risk?.position_52w).filter(v => v !== undefined),
        drawdown: list.map(m => m.risk?.drawdown).filter(v => v !== undefined),
        pe: list.map(m => m.valuation?.pe_ratio).filter(v => v !== undefined),
        ps: list.map(m => m.valuation?.price_to_sales).filter(v => v !== undefined),
        evEbitda: list.map(m => m.valuation?.ev_to_ebitda).filter(v => v !== undefined),
        fcfYield: list.map(m => m.valuation?.fcf_yield).filter(v => v !== undefined),
        revenueGrowth: list.map(m => m.growth?.revenue_growth_yoy).filter(v => v !== undefined),
        epsGrowth: list.map(m => m.growth?.eps_growth_yoy).filter(v => v !== undefined)
      });
    }

    const results: any[] = [];

    for (const m of metricsList) {
      const calculateScopeScores = (b: any) => {
        const scores: any = {};
        if (m.momentum?.momentum_raw !== undefined) {
          scores.momentum = SignalMetrics.calculatePercentile(m.momentum.momentum_raw, b.momentum);
        }
        if (m.risk?.position_52w !== undefined) {
          scores.position_52w = SignalMetrics.calculatePercentile(m.risk.position_52w, b.position_52w);
        }
        if (m.risk?.drawdown !== undefined) {
          scores.drawdown = SignalMetrics.calculatePercentile(m.risk.drawdown, b.drawdown);
        }
        scores.valuation = SignalMetrics.calculateValuationScore(m.valuation, b);
        scores.growth = SignalMetrics.calculateGrowthScore(m.growth, b);
        scores.composite = this.calculateComposite(scores, config);
        return scores;
      };

      const portfolioScores = calculateScopeScores(bench);
      const sectorScores = calculateScopeScores(sectorBenchmarks.get(m.sector) || bench);

      // Determine which scores to use as the primary score based on config and peer count
      const preferredGroup = config.ranking?.preferred_peer_group || "sector";
      const fallbackGroup = config.ranking?.fallback_peer_group || "portfolio";
      const minCount = config.ranking?.minimum_peer_count || 5;

      let mainScores = portfolioScores;
      if (preferredGroup === "sector") {
        const sectorPeersCount = sectorBenchmarks.get(m.sector)?.momentum?.length || 0;
        if (sectorPeersCount >= minCount) {
          mainScores = sectorScores;
        } else if (fallbackGroup === "sector") {
          mainScores = sectorScores;
        } else {
          mainScores = portfolioScores;
        }
      } else {
        mainScores = portfolioScores;
      }

      const recommendation = this.getRecommendation(mainScores.composite, config);

      results.push({
        ticker: m.ticker,
        name: m.name,
        sector: m.sector,
        industry: m.industry,
        metrics: {
          ticker: m.ticker,
          timestamp: m.timestamp,
          price: m.price,
          change_pct: m.change_pct,
          momentum: m.momentum,
          risk: m.risk,
          valuation: m.valuation,
          growth: m.growth
        },
        scores: {
          ...mainScores,
          portfolio: portfolioScores,
          sector: sectorScores
        },
        recommendation
      });
    }

    return results;
  }

  private static calculateComposite(scores: any, config: ScoringConfig): number {
    const profile = config.composite.default_profile || "balanced";
    const weights = config.composite.profiles[profile];
    let composite = 0;
    let weightSum = 0;

    for (const [key, weight] of Object.entries(weights)) {
      if (scores[key] !== undefined) {
        composite += (weight as number) * scores[key];
        weightSum += (weight as number);
      }
    }

    return weightSum > 0 ? composite / weightSum : 0;
  }

  private static getRecommendation(composite: number | undefined, config: ScoringConfig) {
    const thresholds = config.actions.score_thresholds;
    if (composite === undefined) return { action: "Hold", reason: "Insufficient data for recommendation." };

    let action = "Hold";
    if (composite >= thresholds.strong_buy) action = "Strong Buy";
    else if (composite >= thresholds.buy) action = "Buy";
    else if (composite >= thresholds.hold) action = "Hold";
    else if (composite >= thresholds.trim) action = "Trim";
    else action = "Sell";

    let reason = "Consolidating trend with neutral risk-reward balance.";
    if (action.includes("Buy")) {
      reason = "Positive relative performance and technical strength support accumulation.";
    } else if (action === "Sell" || action === "Trim") {
      reason = "Underperformance relative to peers or elevated risk suggests caution.";
    }

    return { action, reason };
  }
}
