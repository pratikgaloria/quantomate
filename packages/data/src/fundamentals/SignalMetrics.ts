export interface RawMetrics {
  ticker: string;
  timestamp: number;
  price?: number;
  change_pct?: number;
  momentum?: {
    return_1m?: number;
    return_3m?: number;
    return_6m?: number;
    momentum_raw?: number;
    volume_ratio?: number;
  };
  valuation?: {
    pe_ratio?: number;
    forward_pe?: number;
    price_to_sales?: number;
    ev_to_ebitda?: number;
    fcf_yield?: number;
  };
  growth?: {
    revenue_growth_yoy?: number;
    eps_growth_yoy?: number;
    forward_eps_growth?: number;
  };
  risk?: {
    position_52w?: number;
    drawdown?: number;
  };
}

export class SignalMetrics {
  /**
   * Calculates momentum metrics based on historical price data
   */
  static calculateMomentum(
    currentPrice: number, 
    history: { date: Date | string | number; close: number; volume?: number }[], 
    options: { useVolumeConfirmation?: boolean; maxVolumeMultiplier?: number } = {}
  ) {
    if (!history || history.length < 20) return null;

    // Assuming history is sorted by date ascending
    const latest = history[history.length - 1].close;
    
    // Find price 1m, 3m, 6m ago (approximate by trading days: 21, 63, 126)
    const price_1m = history[history.length - 21]?.close;
    const price_3m = history[history.length - 63]?.close;
    const price_6m = history[history.length - 126]?.close;

    const return_1m = price_1m ? (latest - price_1m) / price_1m : undefined;
    const return_3m = price_3m ? (latest - price_3m) / price_3m : undefined;
    const return_6m = price_6m ? (latest - price_6m) / price_6m : undefined;

    // Weighted raw momentum
    let momentum_raw = 0;
    let weightSum = 0;

    if (return_1m !== undefined) { momentum_raw += 0.5 * return_1m; weightSum += 0.5; }
    if (return_3m !== undefined) { momentum_raw += 0.3 * return_3m; weightSum += 0.3; }
    if (return_6m !== undefined) { momentum_raw += 0.2 * return_6m; weightSum += 0.2; }

    momentum_raw = weightSum > 0 ? momentum_raw / weightSum : 0;

    // Volume confirmation
    let volume_ratio: number | undefined = undefined;
    const validVolumeData = history.filter(h => h.volume !== undefined);
    
    if (validVolumeData.length >= 60) {
      const avg_vol_20 = validVolumeData.slice(-20).reduce((sum, v) => sum + (v.volume || 0), 0) / 20;
      const avg_vol_60 = validVolumeData.slice(-60).reduce((sum, v) => sum + (v.volume || 0), 0) / 60;
      volume_ratio = avg_vol_20 / avg_vol_60;

      if (options.useVolumeConfirmation && volume_ratio !== undefined) {
        const multiplier = Math.min(volume_ratio, options.maxVolumeMultiplier || 1.5);
        momentum_raw = momentum_raw * multiplier;
      }
    }

    return {
      return_1m,
      return_3m,
      return_6m,
      momentum_raw,
      volume_ratio
    };
  }

  /**
   * Calculates position relative to 52-week high/low
   */
  static calculatePosition52w(currentPrice: number, high52w: number, low52w: number) {
    if (high52w === undefined || low52w === undefined || high52w <= low52w) return undefined;
    return Math.max(0, Math.min(1, (currentPrice - low52w) / (high52w - low52w)));
  }

  /**
   * Calculates drawdown from recent high
   */
  static calculateDrawdown(currentPrice: number, history: { close: number }[]) {
    if (!history || history.length === 0) return undefined;
    const maxPrice = Math.max(...history.map(h => h.close));
    if (maxPrice === 0) return 0;
    return (currentPrice - maxPrice) / maxPrice;
  }

  /**
   * Calculates percentile rank of a value within a peer group
   */
  static calculatePercentile(value: number, allValues: number[]) {
    if (!allValues || allValues.length <= 1) return 0.5;
    const sorted = [...allValues].sort((a, b) => a - b);
    const index = sorted.findIndex(v => v >= value);
    if (index === -1) return 1;
    return index / (sorted.length - 1);
  }

  /**
   * Calculates valuation score based on multiple metrics
   */
  static calculateValuationScore(
    valuation: RawMetrics['valuation'], 
    benchmarks: { pe?: number[], ps?: number[], evEbitda?: number[], fcfYield?: number[] }
  ) {
    if (!valuation) return undefined;
    const valSubscores: number[] = [];
    
    if (valuation.pe_ratio !== undefined && valuation.pe_ratio > 0 && benchmarks.pe) {
      valSubscores.push(1 - this.calculatePercentile(valuation.pe_ratio, benchmarks.pe));
    }
    if (valuation.price_to_sales !== undefined && benchmarks.ps) {
      valSubscores.push(1 - this.calculatePercentile(valuation.price_to_sales, benchmarks.ps));
    }
    if (valuation.ev_to_ebitda !== undefined && benchmarks.evEbitda) {
      valSubscores.push(1 - this.calculatePercentile(valuation.ev_to_ebitda, benchmarks.evEbitda));
    }
    if (valuation.fcf_yield !== undefined && benchmarks.fcfYield) {
      valSubscores.push(this.calculatePercentile(valuation.fcf_yield, benchmarks.fcfYield));
    }
    
    return valSubscores.length > 0 ? valSubscores.reduce((a, b) => a + b, 0) / valSubscores.length : undefined;
  }

  /**
   * Calculates growth score based on multiple metrics
   */
  static calculateGrowthScore(
    growth: RawMetrics['growth'], 
    benchmarks: { revenueGrowth?: number[], epsGrowth?: number[] }
  ) {
    if (!growth) return undefined;
    const growthSubscores: { value: number; weight: number }[] = [];
    
    if (growth.revenue_growth_yoy !== undefined && benchmarks.revenueGrowth) {
      growthSubscores.push({ 
        value: this.calculatePercentile(growth.revenue_growth_yoy, benchmarks.revenueGrowth),
        weight: 0.7 
      });
    }
    if (growth.eps_growth_yoy !== undefined && benchmarks.epsGrowth) {
      growthSubscores.push({ 
        value: this.calculatePercentile(growth.eps_growth_yoy, benchmarks.epsGrowth),
        weight: 0.3 
      });
    }
    
    if (growthSubscores.length > 0) {
      const totalWeight = growthSubscores.reduce((sum, s) => sum + s.weight, 0);
      return growthSubscores.reduce((sum, s) => sum + s.value * s.weight, 0) / totalWeight;
    }
    
    return undefined;
  }
}
