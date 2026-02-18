import { Indicator, Dataset, Quote } from '@quantomate/core';

export interface IIndicatorParamsAVWAP<T> {
    anchorIndex: number;
    attribute?: T extends object ? keyof T : string;
    volume?: T extends object ? keyof T : string;
}

/**
 * Anchored Volume Weighted Average Price (AVWAP)
 * Calculates the volume-weighted average price starting from a specific anchor index.
 * 
 * Formula: Cumulative(Price * Volume) / Cumulative(Volume) starting from anchor.
 */
export class AVWAP<T = number> extends Indicator<IIndicatorParamsAVWAP<T>, T> {
    constructor(name = 'AVWAP', params: IIndicatorParamsAVWAP<T>) {
        const { anchorIndex, attribute, volume = 'volume' } = params;

        super(
            name,
            function (this: AVWAP<T>, dataset: Dataset<T>) {
                const currentIndex = dataset.length - 1;

                if (currentIndex < anchorIndex) {
                    return NaN;
                }

                const sumPVName = `${this.name}_sumPV`;
                const sumVName = `${this.name}_sumV`;

                // Check if we have previous sums stored in the previous quote
                if (currentIndex > anchorIndex) {
                    const prevQuote = dataset.at(currentIndex - 1);
                    const prevSumPV = prevQuote?.getIndicator(sumPVName);
                    const prevSumV = prevQuote?.getIndicator(sumVName);

                    if (
                        prevSumPV !== undefined &&
                        !isNaN(prevSumPV) &&
                        prevSumV !== undefined &&
                        !isNaN(prevSumV)
                    ) {
                        const price = dataset.valueAt(currentIndex, attribute as string);
                        const vol = dataset.valueAt(currentIndex, volume as string);

                        const currentSumPV = prevSumPV + price * vol;
                        const currentSumV = prevSumV + vol;

                        return currentSumPV / currentSumV;
                    }
                }

                // Full calculation fallback (starts from anchorIndex)
                let sumPV = 0;
                let sumV = 0;
                for (let i = anchorIndex; i <= currentIndex; i++) {
                    const price = dataset.valueAt(i, attribute as string);
                    const vol = dataset.valueAt(i, volume as string);
                    sumPV += price * vol;
                    sumV += vol;
                }

                return sumV === 0 ? dataset.valueAt(currentIndex, attribute as string) : sumPV / sumV;
            },
            {
                params,
                beforeCalculate: (dataset: Dataset<T>) => {
                    const sumPVName = `${this.name}_sumPV`;
                    const sumVName = `${this.name}_sumV`;

                    // Pre-calculate cumulative sums for the dataset to enable O(1) calculate() calls
                    for (let i = anchorIndex; i < dataset.length; i++) {
                        const quote = dataset.at(i)!;

                        if (quote.getIndicator(sumPVName) === undefined) {
                            const price = dataset.valueAt(i, attribute as string);
                            const vol = dataset.valueAt(i, volume as string);

                            let currentSumPV = price * vol;
                            let currentSumV = vol;

                            if (i > anchorIndex) {
                                const prevQuote = dataset.at(i - 1)!;
                                currentSumPV += prevQuote.getIndicator(sumPVName) || 0;
                                currentSumV += prevQuote.getIndicator(sumVName) || 0;
                            }

                            quote.setIndicator(sumPVName, currentSumPV);
                            quote.setIndicator(sumVName, currentSumV);
                            dataset.mutateAt(i, quote);
                        }
                    }
                }
            }
        );

        // Add optimized incremental calculation for realtime/sequential additions
        this.withIncremental((prev: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
            const currentIndex = dataset.length - 1;

            if (currentIndex < anchorIndex) {
                return NaN;
            }

            const sumPVName = `${this.name}_sumPV`;
            const sumVName = `${this.name}_sumV`;
            const price = dataset.valueAt(currentIndex, attribute as string);
            const vol = dataset.valueAt(currentIndex, volume as string);

            if (currentIndex === anchorIndex) {
                newQuote.setIndicator(sumPVName, price * vol);
                newQuote.setIndicator(sumVName, vol);
                return price;
            }

            const prevQuote = dataset.at(currentIndex - 1)!;
            const prevSumPV = prevQuote.getIndicator(sumPVName);
            const prevSumV = prevQuote.getIndicator(sumVName);

            if (
                prevSumPV !== undefined &&
                !isNaN(prevSumPV) &&
                prevSumV !== undefined &&
                !isNaN(prevSumV)
            ) {
                const currentSumPV = prevSumPV + price * vol;
                const currentSumV = prevSumV + vol;

                newQuote.setIndicator(sumPVName, currentSumPV);
                newQuote.setIndicator(sumVName, currentSumV);

                return currentSumPV / currentSumV;
            }

            // Fallback to full calculation if previous state is missing
            return this.calculate(dataset);
        });
    }
}
