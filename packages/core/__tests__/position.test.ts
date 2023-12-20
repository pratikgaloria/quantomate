// import '@types/jest';
import { TradePosition } from '../src/position';

describe('Position', () => {
  describe('constructor', () => {
    it('Should return a valid Position object.', () => {
      const position = new TradePosition('idle');

      expect(position).toHaveProperty('value');
      expect(position.value).toBe('idle');
    });

    it('Should return a valid Position object with options.', () => {
      const position = new TradePosition('idle', {
        short: true,
        stoploss: 500,
      });

      expect(position).toHaveProperty('value');
      expect(position.value).toBe('idle');
      expect(position.options?.short).toBeTruthy();
      expect(position.options?.stoploss).toBe(500);
    });
  });

  describe('update', () => {
    describe('Should update the correct position', () => {
      describe('if current position is idle', () => {
        it('and new position is entry', () => {
          expect(
            TradePosition.update(
              new TradePosition('idle'),
              new TradePosition('entry')
            ).value
          ).toBe('entry');
        });

        it('and new position is other than entry', () => {
          expect(
            TradePosition.update(
              new TradePosition('idle'),
              new TradePosition('idle')
            ).value
          ).toBe('idle');
          expect(
            TradePosition.update(
              new TradePosition('idle'),
              new TradePosition('exit')
            ).value
          ).toBe('idle');
          expect(
            TradePosition.update(
              new TradePosition('idle'),
              new TradePosition('hold')
            ).value
          ).toBe('idle');
        });
      });

      describe('if current position is entry', () => {
        it('and new position is exit', () => {
          expect(
            TradePosition.update(
              new TradePosition('entry'),
              new TradePosition('exit')
            ).value
          ).toBe('exit');
        });

        it('and new position is other than exit', () => {
          expect(
            TradePosition.update(
              new TradePosition('entry'),
              new TradePosition('idle')
            ).value
          ).toBe('hold');
          expect(
            TradePosition.update(
              new TradePosition('entry'),
              new TradePosition('entry')
            ).value
          ).toBe('hold');
          expect(
            TradePosition.update(
              new TradePosition('entry'),
              new TradePosition('hold')
            ).value
          ).toBe('hold');
        });
      });

      describe('if current position is hold', () => {
        it('and new position is exit', () => {
          expect(
            TradePosition.update(
              new TradePosition('hold'),
              new TradePosition('exit')
            ).value
          ).toBe('exit');
        });

        it('and new position is other than exit', () => {
          expect(
            TradePosition.update(
              new TradePosition('hold'),
              new TradePosition('idle')
            ).value
          ).toBe('hold');
          expect(
            TradePosition.update(
              new TradePosition('hold'),
              new TradePosition('entry')
            ).value
          ).toBe('hold');
          expect(
            TradePosition.update(
              new TradePosition('hold'),
              new TradePosition('hold')
            ).value
          ).toBe('hold');
        });
      });

      describe('if current position is exit', () => {
        it('and new position is entry', () => {
          expect(
            TradePosition.update(
              new TradePosition('exit'),
              new TradePosition('entry')
            ).value
          ).toBe('entry');
        });

        it('and new position is other than entry', () => {
          expect(
            TradePosition.update(
              new TradePosition('exit'),
              new TradePosition('idle')
            ).value
          ).toBe('idle');
          expect(
            TradePosition.update(
              new TradePosition('exit'),
              new TradePosition('exit')
            ).value
          ).toBe('idle');
          expect(
            TradePosition.update(
              new TradePosition('exit'),
              new TradePosition('hold')
            ).value
          ).toBe('idle');
        });
      });

      describe('options', () => {
        it('it retains old position options', () => {
          const updatedPosition = TradePosition.update<{ stoploss?: number }>(
            new TradePosition('entry', { stoploss: 500 }),
            new TradePosition('hold')
          );
          expect(updatedPosition.options?.stoploss).toBe(500);
        });

        it('it assigns new position options', () => {
          const updatedPosition = TradePosition.update<{ target?: number }>(
            new TradePosition('entry'),
            new TradePosition('hold', { target: 500 })
          );
          expect(updatedPosition.options?.target).toBe(500);
        });

        it('it overrides new position options', () => {
          const updatedPosition = TradePosition.update<{ stoploss?: number }>(
            new TradePosition('entry', { stoploss: 500 }),
            new TradePosition('hold', { stoploss: 520 })
          );
          expect(updatedPosition.options?.stoploss).toBe(520);
        });
      });
    });
  });
});
