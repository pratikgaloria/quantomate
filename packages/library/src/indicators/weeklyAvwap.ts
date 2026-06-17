import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

function getCalendarWeek(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export class WeeklyAVWAP extends IndicatorBase<any, number> {
  constructor(name = 'WeeklyAVWAP') {
    super(name, {});
  }

  calculate(series: BarSeries): Series<number> {
    const result: number[] = [];

    for (let i = 0; i < series.length; i++) {
      const bar = series.at(i)!;
      const barDate = new Date(bar.timestamp);
      const barWeek = getCalendarWeek(barDate);
      const barYear = barDate.getFullYear();

      // Find the anchor index (the first bar of the current week)
      let anchorIndex = 0;
      for (let j = i - 1; j >= 0; j--) {
        const q = series.at(j)!;
        const qDate = new Date(q.timestamp);
        const qWeek = getCalendarWeek(qDate);
        const qYear = qDate.getFullYear();

        if (barWeek !== qWeek || barYear !== qYear) {
          anchorIndex = j + 1;
          break;
        }
      }

      // Calculate AVWAP from anchorIndex to i
      let sumPV = 0;
      let sumV = 0;
      for (let j = anchorIndex; j <= i; j++) {
        const b = series.at(j)!;
        sumPV += b.close * b.volume;
        sumV += b.volume;
      }

      const avwap = sumV === 0 ? bar.close : sumPV / sumV;
      result.push(avwap);
    }

    return new Series(result);
  }
}
