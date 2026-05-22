import { Indicator, Dataset } from '@quantomate/core';

export interface IIndicatorParamsRVOL<T> {
    period?: number; // Number of days to average
    volume?: T extends object ? keyof T : string;
}

/**
 * Relative Volume (RVOL)
 * Compares the current volume against the average volume for the same time of day over a specific period.
 *
 * Formula: Current Volume / Average Volume(same time of day over last N days)
 */
export class RVOL<T = number> extends Indicator<IIndicatorParamsRVOL<T>, T> {
    constructor(name = 'RVOL', params: IIndicatorParamsRVOL<T> = {}) {
        const { period = 20, volume = 'volume' } = params;

        super(
            name,
            function (this: RVOL<T>, dataset: Dataset<T>) {
                const currentIndex = dataset.length - 1;
                const currentQuote = dataset.at(currentIndex);

                if (!currentQuote || currentQuote.timestamp === undefined) {
                    return NaN;
                }

                const currentTimestamp = currentQuote.timestamp;
                const currentDate = new Date(currentTimestamp);
                const currentHour = currentDate.getHours();
                const currentMinute = currentDate.getMinutes();

                const historicalVolumes: number[] = [];

                // Traverse backwards to find the same time of day in previous sessions
                // We limit the search to avoid extreme performance hits on very large datasets
                // Though for 5m candles and 20 days, it's about 1560-2000 quotes.
                for (let i = currentIndex - 1; i >= 0 && historicalVolumes.length < period; i--) {
                    const quote = dataset.at(i);
                    if (quote && quote.timestamp !== undefined) {
                        const date = new Date(quote.timestamp);
                        if (
                            date.getHours() === currentHour &&
                            date.getMinutes() === currentMinute
                        ) {
                            const vol = dataset.valueAt(i, volume as string);
                            if (!isNaN(vol)) {
                                historicalVolumes.push(vol);
                            }
                        }
                    }
                }

                const currentVolume = dataset.valueAt(currentIndex, volume as string);
                if (historicalVolumes.length === 0) {
                    return isNaN(currentVolume) ? NaN : 1.0;
                }

                const avgVolume =
                    historicalVolumes.reduce((sum, v) => sum + v, 0) /
                    historicalVolumes.length;

                return currentVolume / avgVolume;
            },
            { params }
        );
    }
}
