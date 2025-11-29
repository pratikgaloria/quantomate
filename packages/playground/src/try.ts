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

yf.historical('NVDA', { period1: '2025-11-01', period2: '2025-11-28' }).then((data) => {
    const ds = new Dataset<DQuote>(data.map(d => ({
        date: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume
    })));
    
    const sma = new SMA<DQuote>('sma14', { attribute: 'close', period: 14 });
    ds.apply(sma);
    console.log(ds.at(-1));
});
    