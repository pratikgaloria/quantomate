import { Indicator, Dataset } from '@quantomate/core';

export interface IIndicatorParamsSlope<T> {
    period?: number; // default 1
    attribute?: T extends object ? keyof T : string;
}

/**
 * Slope Indicator
 * Calculates the difference between the current value and the value N periods ago.
 * 
 * Formula: value[t] - value[t-period]
 */
export class Slope<T = number> extends Indicator<IIndicatorParamsSlope<T>, T> {
    constructor(name = 'Slope', params: IIndicatorParamsSlope<T> = {}) {
        const { period = 1, attribute } = params;

        super(
            name,
            (dataset: Dataset<T>) => {
                const currentIndex = dataset.length - 1;
                if (currentIndex < period) {
                    return NaN;
                }

                const currentValue = dataset.valueAt(currentIndex, attribute as string);
                const prevValue = dataset.valueAt(currentIndex - period, attribute as string);

                return currentValue - prevValue;
            },
            { params }
        );
    }
}
