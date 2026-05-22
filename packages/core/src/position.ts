export type TradePositionType = 'idle' | 'entry' | 'exit' | 'hold';

export const newTradingPositionMap: {
  [currentTradingPosition in TradePositionType]: {
    [newTradingPosition in TradePositionType]: TradePositionType;
  };
} = {
  idle: {
    idle: 'idle',
    entry: 'entry',
    exit: 'idle',
    hold: 'idle',
  },
  entry: {
    idle: 'hold',
    entry: 'hold',
    exit: 'exit',
    hold: 'hold',
  },
  exit: {
    idle: 'idle',
    entry: 'entry',
    exit: 'idle',
    hold: 'idle',
  },
  hold: {
    idle: 'hold',
    entry: 'hold',
    exit: 'exit',
    hold: 'hold',
  },
};

type TradePositionOptions<O> = O & {
  short?: boolean;
  entryPrice?: number;
  entryDate?: Date;
  exitReason?: 'stop-loss' | 'take-profit' | 'strategy';
  exitRatio?: number; // 0 to 1, default is 1 (100%)
};

export class TradePosition<O = unknown> {
  private _value: TradePositionType;
  private _options?: TradePositionOptions<O>;

  constructor(value: TradePositionType, options?: TradePositionOptions<O>) {
    this._value = value;
    this._options = options;
  }

  get value() {
    return this._value;
  }

  get options() {
    return this._options;
  }

  static update<O = unknown>(oldPosition: TradePosition<O>, newPosition: TradePosition<O>) {
    const mergedOptions = {
      ...oldPosition._options,
      ...newPosition.options,
    } as TradePositionOptions<O>;

    let nextValue = newTradingPositionMap[oldPosition.value][newPosition.value];

    // Support partial exits: if we just exited partially, we should remain in 'hold' state
    if (oldPosition.value === 'exit' && (oldPosition.options?.exitRatio ?? 1.0) < 1.0) {
      if (newPosition.value === 'hold' || newPosition.value === 'idle') {
        nextValue = 'hold';
      }
    }

    return new TradePosition<O>(nextValue, mergedOptions);
  }
}
