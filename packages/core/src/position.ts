import { TradeSignal, Bar } from './types';

export type PositionStatus = 'idle' | 'long' | 'short';

export interface PositionState {
  status: PositionStatus;
  entryPrice?: number;
  entryTime?: number;
  metadata?: Record<string, any>;
}

export interface PositionTransition {
  type: 'entry' | 'exit';
  direction: 'long' | 'short';
  price: number;
  time: number;
}

export class PositionManager {
  private state: PositionState;

  constructor(initialState?: PositionState) {
    this.state = initialState || { status: 'idle' };
  }

  getState(): PositionState {
    return { ...this.state };
  }

  processSignal(signal: TradeSignal, bar: Bar): PositionTransition | null {
    const currentStatus = this.state.status;

    if (currentStatus === 'idle') {
      if (signal.action === 'entry') {
        const nextStatus: PositionStatus = signal.direction === 'short' ? 'short' : 'long';
        this.state = {
          status: nextStatus,
          entryPrice: bar.close,
          entryTime: bar.timestamp,
          metadata: signal.metadata,
        };
        return {
          type: 'entry',
          direction: signal.direction || 'long',
          price: bar.close,
          time: bar.timestamp,
        };
      }
    } else {
      if (signal.action === 'exit') {
        const transition: PositionTransition = {
          type: 'exit',
          direction: currentStatus === 'long' ? 'long' : 'short',
          price: bar.close,
          time: bar.timestamp,
        };
        this.state = { status: 'idle' };
        return transition;
      }
    }

    return null;
  }
}
