import { Dataset } from "@quantomate/core";
import { SMA } from "@quantomate/indicators";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance();

type DQuote = {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

yf.chart('NVDA', { period1: '2025-11-01', period2: '2025-11-28', interval: '1d', return: 'array' }).then((data) => {
    const ds = new Dataset<DQuote>(data.quotes.map(d => ({
        date: d.date,
        open: d.open as number,
        high: d.high as number,
        low: d.low as number,
        close: d.close as number,
        volume: d.volume as number
    })));
    
    const sma = new SMA<DQuote>('sma14', { attribute: 'close', period: 14 });
    ds.apply(sma);
    console.log(ds.at(-1));
});
    