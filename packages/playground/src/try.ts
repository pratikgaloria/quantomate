import { Dataset } from "@quantomate/core";
import { SMA } from "@quantomate/library";
import { DataService } from "@quantomate/data";

type DQuote = {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

async function run() {
  const data = await DataService.getHistoricalData('NVDA', undefined, '1d');
  const ds = new Dataset<DQuote>(data.map(d => ({
      date: new Date(d.date),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume
  })));
  
  const sma = new SMA<DQuote>('sma14', { attribute: 'close', period: 14 });
  ds.apply(sma);
  console.log(ds.at(-1));
}

run().catch(console.error);
    