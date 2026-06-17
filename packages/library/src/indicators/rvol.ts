import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

export interface RVOLParams {
  period?: number;
  volumeField?: 'volume';
}

export class RVOL extends IndicatorBase<RVOLParams, number> {
  constructor(name = 'RVOL', params: RVOLParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 20;
    const volumeField = this.params.volumeField || 'volume';
    const result: number[] = [];

    for (let i = 0; i < series.length; i++) {
      const currentBar = series.at(i)!;
      const currentVolume = currentBar[volumeField] || 0;

      const currentTimestamp = currentBar.timestamp;
      const currentDate = new Date(currentTimestamp);
      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();

      const historicalVolumes: number[] = [];

      for (let j = i - 1; j >= 0 && historicalVolumes.length < period; j--) {
        const bar = series.at(j)!;
        const date = new Date(bar.timestamp);
        if (date.getHours() === currentHour && date.getMinutes() === currentMinute) {
          const vol = bar[volumeField] || 0;
          historicalVolumes.push(vol);
        }
      }

      if (historicalVolumes.length === 0) {
        result.push(1.0);
      } else {
        const sum = historicalVolumes.reduce((acc, v) => acc + v, 0);
        const avgVolume = sum / historicalVolumes.length;
        result.push(currentVolume / avgVolume);
      }
    }

    return new Series(result);
  }
}
