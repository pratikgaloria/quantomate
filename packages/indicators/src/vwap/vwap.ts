import { Indicator, Dataset, Quote } from '@quantomate/core';

export interface IIndicatorParamsVWAP<T> {
    attribute?: T extends object ? keyof T : string;
    volume?: T extends object ? keyof T : string;
}

/**
 * Volume Weighted Average Price (VWAP)
 * Resets at the start of each new trading session (day).
 *
 * Formula: Cumulative(Price * Volume) / Cumulative(Volume)
 */
export class VWAP<T = number> extends Indicator<IIndicatorParamsVWAP<T>, T> {
    constructor(name = 'VWAP', params: IIndicatorParamsVWAP<T> = {}) {
        const { attribute, volume = 'volume' } = params;

        super(
            name,
            function (this: VWAP<T>, dataset: Dataset<T>) {
                const currentIndex = dataset.length - 1;

                const sumPVName = `${this.name}_sumPV`;
                const sumVName = `${this.name}_sumV`;

                const price = this.getPrice(dataset, currentIndex, attribute as string);
                const vol = dataset.valueAt(currentIndex, volume as string);

                if (currentIndex === 0) {
                    dataset.mutateAt(currentIndex, dataset.at(currentIndex)!.setIndicator(sumPVName, price * vol).setIndicator(sumVName, vol));
                    return price;
                }

                const currentQuote = dataset.at(currentIndex)!;
                const prevQuote = dataset.at(currentIndex - 1)!;

                // Detect new session (day change)
                const isNewSession = this.checkNewSession(currentQuote, prevQuote);

                let currentSumPV = price * vol;
                let currentSumV = vol;

                if (!isNewSession) {
                    const prevSumPV = prevQuote.getIndicator(sumPVName) || 0;
                    const prevSumV = prevQuote.getIndicator(sumVName) || 0;
                    currentSumPV += prevSumPV;
                    currentSumV += prevSumV;
                }

                // Store for incremental/next calls
                dataset.mutateAt(currentIndex, currentQuote.setIndicator(sumPVName, currentSumPV).setIndicator(sumVName, currentSumV));

                return currentSumV === 0 ? price : currentSumPV / currentSumV;
            },
            {
                params,
                beforeCalculate: (dataset: Dataset<T>) => {
                    const sumPVName = `${this.name}_sumPV`;
                    const sumVName = `${this.name}_sumV`;

                    for (let i = 0; i < dataset.length; i++) {
                        const quote = dataset.at(i)!;
                        // Only calculate if not already present
                        if (quote.getIndicator(sumPVName) === undefined) {
                            const price = this.getPrice(dataset, i, attribute as string);
                            const vol = dataset.valueAt(i, volume as string);

                            let currentSumPV = price * vol;
                            let currentSumV = vol;

                            if (i > 0) {
                                const prevQuote = dataset.at(i - 1)!;
                                if (!this.checkNewSession(quote, prevQuote)) {
                                    currentSumPV += prevQuote.getIndicator(sumPVName) || 0;
                                    currentSumV += prevQuote.getIndicator(sumVName) || 0;
                                }
                            }

                            quote.setIndicator(sumPVName, currentSumPV);
                            quote.setIndicator(sumVName, currentSumV);
                            dataset.mutateAt(i, quote);
                        }
                    }
                },
            }
        );

        this.withIncremental((prev: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
            const sumPVName = `${this.name}_sumPV`;
            const sumVName = `${this.name}_sumV`;
            const currentIndex = dataset.length - 1;

            const price = this.getPrice(dataset, currentIndex, attribute as string);
            const vol = dataset.valueAt(currentIndex, volume as string);

            if (currentIndex === 0) {
                newQuote.setIndicator(sumPVName, price * vol);
                newQuote.setIndicator(sumVName, vol);
                return price;
            }

            const prevQuote = dataset.at(currentIndex - 1)!;
            const isNewSession = this.checkNewSession(newQuote, prevQuote);

            let currentSumPV = price * vol;
            let currentSumV = vol;

            if (!isNewSession) {
                currentSumPV += prevQuote.getIndicator(sumPVName) || 0;
                currentSumV += prevQuote.getIndicator(sumVName) || 0;
            }

            newQuote.setIndicator(sumPVName, currentSumPV);
            newQuote.setIndicator(sumVName, currentSumV);

            return currentSumV === 0 ? price : currentSumPV / currentSumV;
        });
    }

    private getPrice(dataset: Dataset<T>, index: number, attribute: string): number {
        const attr = attribute || 'close';
        if (attr === 'hlc3') {
            const h = dataset.valueAt(index, 'high');
            const l = dataset.valueAt(index, 'low');
            const c = dataset.valueAt(index, 'close');
            return (h + l + c) / 3;
        }
        return dataset.valueAt(index, attr);
    }

    private checkNewSession(current: Quote<T>, previous: Quote<T>): boolean {
        if (current.timestamp === undefined || previous.timestamp === undefined) {
            return false;
        }
        const d1 = new Date(current.timestamp);
        const d2 = new Date(previous.timestamp);
        return (
            d1.getFullYear() !== d2.getFullYear() ||
            d1.getMonth() !== d2.getMonth() ||
            d1.getDate() !== d2.getDate()
        );
    }
}
