import { Indicator, Dataset } from '@quantomate/core';

function getCalendarWeek(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export class WeeklyAVWAP<T = number> extends Indicator<any, T> {
  constructor(name = 'WeeklyAVWAP') {
    super(
      name,
      function (this: WeeklyAVWAP<T>, dataset: Dataset<T>) {
        const len = dataset.length;
        if (len === 0) return NaN;

        const currentQuote = dataset.at(len - 1)!;
        const currentDate = new Date(currentQuote.timestamp || Date.now());
        
        let anchorIndex = len - 1;
        for (let i = len - 2; i >= 0; i--) {
          const q = dataset.at(i)!;
          const qDate = new Date(q.timestamp || Date.now());
          
          const week1 = getCalendarWeek(currentDate);
          const week2 = getCalendarWeek(qDate);
          if (week1 !== week2 || currentDate.getFullYear() !== qDate.getFullYear()) {
            anchorIndex = i + 1;
            break;
          }
        }

        let sumPV = 0;
        let sumV = 0;
        for (let i = anchorIndex; i < len; i++) {
          const close = Number(dataset.valueAt(i, 'close'));
          const vol = Number(dataset.valueAt(i, 'volume') || 0);
          sumPV += close * vol;
          sumV += vol;
        }

        return sumV === 0 ? Number(dataset.valueAt(len - 1, 'close')) : sumPV / sumV;
      }
    );
  }
}
