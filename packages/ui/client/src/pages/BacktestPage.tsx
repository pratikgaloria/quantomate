import { useBacktest } from './backtest/useBacktest';
import { BacktestControls } from './backtest/BacktestControls';
import { BacktestResults } from './backtest/BacktestResults';
import './BacktestPage.scss';

export function BacktestPage() {
  const state = useBacktest();

  return (
    <div className="backtest-page">
      <BacktestControls state={state} />
      <BacktestResults state={state} />
    </div>
  );
}
