import { OptionPricer } from '../src/OptionPricer';
import {
  CoveredCallStrategy,
  BullCallSpreadStrategy,
  BearPutSpreadStrategy,
  LongStraddleStrategy,
  LongStrangleStrategy,
  VwapRvolOptionStrategy,
  VsaClimacticOptionStrategy,
  WeeklyAvwapOptionStrategy,
  ChandelierTrendOptionStrategy
} from '@quantomate/library';
import { Dataset, Quote } from '@quantomate/core';

describe('OptionPricer Mathematical Tests', () => {
  it('should compute cumulative normal distribution (normalCDF) correctly', () => {
    // Normal CDF properties
    expect(OptionPricer.normalCDF(0)).toBeCloseTo(0.50, 4);
    expect(OptionPricer.normalCDF(1.96)).toBeCloseTo(0.975, 3);
    expect(OptionPricer.normalCDF(-1.96)).toBeCloseTo(0.025, 3);
  });

  it('should price call options correctly under Black-Scholes model', () => {
    // S = 100, K = 100, T = 1 year, r = 5%, vol = 20%
    const callPrice = OptionPricer.blackScholes(100, 100, 1, 0.05, 0.20, 'call');
    // Standard BS price is ~10.4506
    expect(callPrice).toBeCloseTo(10.45, 1);

    // Call price should be greater when underlying stock is high (ITM)
    const itmCall = OptionPricer.blackScholes(120, 100, 1, 0.05, 0.20, 'call');
    expect(itmCall).toBeGreaterThan(callPrice);

    // Call price should decrease when T goes to 0 (expired)
    const expiredCall = OptionPricer.blackScholes(105, 100, 0, 0.05, 0.20, 'call');
    expect(expiredCall).toBe(5); // Intrinsic value
  });

  it('should price put options correctly under Black-Scholes model', () => {
    // S = 100, K = 100, T = 1 year, r = 5%, vol = 20%
    const putPrice = OptionPricer.blackScholes(100, 100, 1, 0.05, 0.20, 'put');
    // Standard BS price is ~5.5735
    expect(putPrice).toBeCloseTo(5.57, 1);

    // Put price should be higher when stock is low (ITM)
    const itmPut = OptionPricer.blackScholes(80, 100, 1, 0.05, 0.20, 'put');
    expect(itmPut).toBeGreaterThan(putPrice);

    // Put price should match intrinsic value at expiration
    const expiredPut = OptionPricer.blackScholes(95, 100, 0, 0.05, 0.20, 'put');
    expect(expiredPut).toBe(5); // Intrinsic value
  });

  it('should compute historical volatility correctly', () => {
    const prices = [100, 101, 102, 101, 103, 104, 102, 103, 105];
    const vol = OptionPricer.calculateVolatility(prices, 252);
    expect(vol).toBeGreaterThan(0.05);
    expect(vol).toBeLessThan(1.0);
  });
});

describe('Options Strategies Library Initialization Tests', () => {
  it('should initialize CoveredCallStrategy with tradeOptions metadata', () => {
    const strat = new CoveredCallStrategy('CC_Test', { strikeOffset: 1 });
    expect(strat.name).toBe('CC_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.optionSelector?.strikeMode).toBe('offset');
    expect(strat.options.optionSelector?.strikeOffset).toBe(1);
    expect(strat.options.direction).toBe('long');
  });

  it('should initialize BullCallSpreadStrategy with tradeOptions metadata', () => {
    const strat = new BullCallSpreadStrategy('BCS_Test', { strikeOffset: 2 });
    expect(strat.name).toBe('BCS_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.optionSelector?.strikeOffset).toBe(2);
    expect(strat.options.direction).toBe('long');
  });

  it('should initialize BearPutSpreadStrategy with tradeOptions metadata', () => {
    const strat = new BearPutSpreadStrategy('BPS_Test', { strikeOffset: 2 });
    expect(strat.name).toBe('BPS_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.optionSelector?.strikeOffset).toBe(2);
    expect(strat.options.direction).toBe('short');
  });

  it('should initialize LongStraddleStrategy with tradeOptions metadata', () => {
    const strat = new LongStraddleStrategy('Straddle_Test');
    expect(strat.name).toBe('Straddle_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.optionSelector?.strikeMode).toBe('atm');
    expect(strat.options.direction).toBe('long');
  });

  it('should initialize LongStrangleStrategy with tradeOptions metadata', () => {
    const strat = new LongStrangleStrategy('Strangle_Test', { strikeOffset: 2 });
    expect(strat.name).toBe('Strangle_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.optionSelector?.strikeMode).toBe('offset');
    expect(strat.options.optionSelector?.strikeOffset).toBe(2);
    expect(strat.options.direction).toBe('long');
  });

  it('should initialize VwapRvolOptionStrategy with tradeOptions metadata', () => {
    const strat = new VwapRvolOptionStrategy('VwapRvol_Test', { rvolThreshold: 2.5 });
    expect(strat.name).toBe('VwapRvol_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.direction).toBe('both');
  });

  it('should initialize VsaClimacticOptionStrategy with tradeOptions metadata', () => {
    const strat = new VsaClimacticOptionStrategy('VsaClimactic_Test', { rvolThreshold: 1.8 });
    expect(strat.name).toBe('VsaClimactic_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.direction).toBe('both');
  });

  it('should initialize WeeklyAvwapOptionStrategy with tradeOptions metadata', () => {
    const strat = new WeeklyAvwapOptionStrategy('WeeklyAvwap_Test', { volumeSmaPeriod: 15 });
    expect(strat.name).toBe('WeeklyAvwap_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.direction).toBe('both');
  });

  it('should initialize ChandelierTrendOptionStrategy with tradeOptions metadata', () => {
    const strat = new ChandelierTrendOptionStrategy('ChandelierTrend_Test', { rvolThreshold: 1.5 });
    expect(strat.name).toBe('ChandelierTrend_Test');
    expect(strat.options.tradeOptions).toBe(true);
    expect(strat.options.direction).toBe('both');
  });
});
