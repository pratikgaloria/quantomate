/**
 * OptionPricer helper implementing Black-Scholes formulas for theoretical options valuation.
 */

export class OptionPricer {
  /**
   * Cumulative Standard Normal Distribution (CDF) approximation.
   * Accurate to 7 decimal places.
   */
  public static normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422804;
    const p = d * Math.exp(-0.5 * x * x) * t * (
      0.31938153 + t * (
        -0.356563782 + t * (
          1.781477937 + t * (
            -1.821255978 + t * 1.330274429
          )
        )
      )
    );
    return x >= 0 ? 1 - p : p;
  }

  /**
   * Calculates Black-Scholes option pricing.
   * 
   * @param S - Current underlying asset price
   * @param K - Strike price of the option contract
   * @param T - Time to expiration in years (DTE / 365)
   * @param r - Risk-free interest rate (e.g. 0.05 for 5%)
   * @param sigma - Implied or historical volatility (e.g. 0.20 for 20%)
   * @param type - Option contract type ('call' | 'put')
   * @returns The theoretical option price (premium)
   */
  public static blackScholes(
    S: number,
    K: number,
    T: number,
    r: number,
    sigma: number,
    type: 'call' | 'put'
  ): number {
    // Boundary check for expired option
    if (T <= 0.00001) {
      if (type === 'call') {
        return Math.max(0, S - K);
      } else {
        return Math.max(0, K - S);
      }
    }

    // Prevent volatility from being zero to avoid division by zero
    const vol = Math.max(0.0001, sigma);

    const d1 = (Math.log(S / K) + (r + (vol * vol) / 2) * T) / (vol * Math.sqrt(T));
    const d2 = d1 - vol * Math.sqrt(T);

    if (type === 'call') {
      const c = S * OptionPricer.normalCDF(d1) - K * Math.exp(-r * T) * OptionPricer.normalCDF(d2);
      return Math.max(0, c);
    } else {
      const p = K * Math.exp(-r * T) * OptionPricer.normalCDF(-d2) - S * OptionPricer.normalCDF(-d1);
      return Math.max(0, p);
    }
  }

  /**
   * Computes annualized historical volatility of underlying prices.
   * 
   * @param prices - Array of historical underlying prices (ordered chronologically)
   * @param annualizedFactor - Number of periods per year (default 252 for Daily, or 252 * 26 for 15m)
   * @returns Annualized historical volatility percentage (e.g. 0.22 for 22%)
   */
  public static calculateVolatility(prices: number[], annualizedFactor: number = 252): number {
    if (prices.length < 5) {
      return 0.20; // Default fallback to 20%
    }

    const logReturns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1] > 0) {
        logReturns.push(Math.log(prices[i] / prices[i - 1]));
      }
    }

    if (logReturns.length === 0) {
      return 0.20;
    }

    const mean = logReturns.reduce((sum, val) => sum + val, 0) / logReturns.length;
    const sqDiffSum = logReturns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    const variance = sqDiffSum / (logReturns.length - 1);
    const stdDev = Math.sqrt(variance);

    // Annualize the standard deviation
    const vol = stdDev * Math.sqrt(annualizedFactor);
    
    // Bounds check to keep volatility reasonable (5% to 150%)
    return Math.max(0.05, Math.min(1.5, vol));
  }
}
