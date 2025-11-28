// import '@types/jest';
import { Indicator, Dataset } from '../src';
import { sampleIndicatorFn } from './mocks/mock-data';

interface SampleIndicatorParams {
  period?: number;
}

describe('Indicator', () => {
  describe('constructor', () => {
    it('Should create a valid Indicator object.', () => {
      const mockFn = jest.fn();
      const indicator = new Indicator('add1', mockFn);

      expect(indicator).toHaveProperty('name');
      expect(indicator.name).toBe('add1');
      expect(indicator).toHaveProperty('calculate');

      const ds = new Dataset([1]);
      indicator.calculate(new Dataset([1]));
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith(ds);
    });

    it('Should create a valid Indicator object with options.', () => {
      const indicator = new Indicator<SampleIndicatorParams>(
        'sma5',
        function(this: Indicator<SampleIndicatorParams>, ds: Dataset) {
          const { period = 10 } = this.params as SampleIndicatorParams;

          return ds.valueAt(-1) / period;
        },
        { params: { period: 5 } }
      );

      expect(indicator).toHaveProperty('params');
      expect(indicator.params).toHaveProperty('period');

      expect(indicator.name).toBe('sma5');
      expect(indicator.calculate(new Dataset([1]))).toBe(0.2);
    });
  });

  describe('params', () => {
    it('Should return undefined if params are not provided.', () => {
      const mockFn = jest.fn();
      const indicator = new Indicator<SampleIndicatorParams>('add1', mockFn);

      expect(indicator).toHaveProperty('params');
      expect(indicator.params).toBeUndefined();
    });
  });

  describe('Spread', () => {
    it('Should spread the indicator through-out the dataset', () => {
      const dataset = new Dataset([1, 2]);
      const multi5 = new Indicator(
        'multi5',
        sampleIndicatorFn
      );

      multi5.spread(dataset);

      expect(dataset).toBeInstanceOf(Dataset);
      expect(dataset.at(0)?.getIndicator('multi5')).toBe(5);
      expect(dataset.at(1)?.getIndicator('multi5')).toBe(10);
    });

    it('Should call beforeCalculate() if defined with options while spreading.', () => {
      const dataset = new Dataset([1, 2]);
      const mockBeforeCalculateFn = jest.fn();
      const multi5 = new Indicator(
        'multi5',
        sampleIndicatorFn,
        {
          beforeCalculate: mockBeforeCalculateFn,
        }
      );

      multi5.spread(dataset);
      expect(mockBeforeCalculateFn).toHaveBeenCalled();
    });

    it('Should handle empty dataset', () => {
      const dataset = new Dataset<number>([]);
      const multi5 = new Indicator('multi5', sampleIndicatorFn);

      multi5.spread(dataset);

      expect(dataset.length).toBe(0);
    });

    it('Should handle single quote dataset', () => {
      const dataset = new Dataset([5]);
      const multi5 = new Indicator('multi5', sampleIndicatorFn);

      multi5.spread(dataset);

      expect(dataset.at(0)?.getIndicator('multi5')).toBe(25);
    });

    it('Should preserve existing indicators on quotes', () => {
      const dataset = new Dataset([1, 2]);
      const multi5 = new Indicator('multi5', sampleIndicatorFn);
      const add10 = new Indicator('add10', (ds) => ds.valueAt(-1) + 10);

      // Apply first indicator
      add10.spread(dataset);
      expect(dataset.at(0)?.getIndicator('add10')).toBe(11);
      expect(dataset.at(1)?.getIndicator('add10')).toBe(12);

      // Apply second indicator - should preserve first
      multi5.spread(dataset);
      expect(dataset.at(0)?.getIndicator('add10')).toBe(11);
      expect(dataset.at(0)?.getIndicator('multi5')).toBe(5);
      expect(dataset.at(1)?.getIndicator('add10')).toBe(12);
      expect(dataset.at(1)?.getIndicator('multi5')).toBe(10);
    });

    it('Should work with large datasets', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => i + 1);
      const dataset = new Dataset(largeData);
      const multi5 = new Indicator('multi5', sampleIndicatorFn);

      multi5.spread(dataset);

      expect(dataset.length).toBe(1000);
      expect(dataset.at(0)?.getIndicator('multi5')).toBe(5);
      expect(dataset.at(999)?.getIndicator('multi5')).toBe(5000);
    });

    it('Should work with object-based quotes', () => {
      const dataset = new Dataset<{ close: number }>([
        { close: 10 },
        { close: 20 },
        { close: 30 },
      ]);
      const indicator = new Indicator<unknown, { close: number }>(
        'closeValue',
        (ds) => ds.valueAt(-1, 'close')
      );

      indicator.spread(dataset);

      expect(dataset.at(0)?.getIndicator('closeValue')).toBe(10);
      expect(dataset.at(1)?.getIndicator('closeValue')).toBe(20);
      expect(dataset.at(2)?.getIndicator('closeValue')).toBe(30);
    });

    it('Should return the same dataset instance', () => {
      const dataset = new Dataset([1, 2, 3]);
      const multi5 = new Indicator('multi5', sampleIndicatorFn);

      const result = multi5.spread(dataset);

      expect(result).toBe(dataset);
    });

    it('Should calculate indicator correctly for incremental datasets', () => {
      const dataset = new Dataset([1, 2, 3, 4, 5]);
      // Indicator that sums all values in dataset
      const sumIndicator = new Indicator('sum', (ds) => {
        let sum = 0;
        for (let i = 0; i < ds.length; i++) {
          sum += ds.valueAt(i);
        }
        return sum;
      });

      sumIndicator.spread(dataset);

      expect(dataset.at(0)?.getIndicator('sum')).toBe(1); // [1]
      expect(dataset.at(1)?.getIndicator('sum')).toBe(3); // [1, 2]
      expect(dataset.at(2)?.getIndicator('sum')).toBe(6); // [1, 2, 3]
      expect(dataset.at(3)?.getIndicator('sum')).toBe(10); // [1, 2, 3, 4]
      expect(dataset.at(4)?.getIndicator('sum')).toBe(15); // [1, 2, 3, 4, 5]
    });
  });
});
