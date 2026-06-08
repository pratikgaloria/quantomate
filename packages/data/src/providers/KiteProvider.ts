import axios from 'axios';
import papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export interface KiteInstrument {
  instrument_token: number;
  exchange_token: number;
  tradingsymbol: string;
  name: string;
  last_price: number;
  expiry: string;
  strike: number;
  tick_size: number;
  lot_size: number;
  instrument_type: string;
  segment: string;
  exchange: string;
}

export class KiteInstrumentMapper {
  private static instrumentsMap = new Map<string, number>(); // symbol -> token
  private static tokenToSymbolMap = new Map<number, string>(); // token -> symbol
  private static cacheFile = path.resolve(__dirname, '../../instruments.json');

  static async load(apiKey: string) {
    if (this.instrumentsMap.size > 0) return;

    // Try reading from local cache file first
    if (fs.existsSync(this.cacheFile)) {
      const stats = fs.statSync(this.cacheFile);
      const now = new Date();
      // Cache valid for 24 hours
      if (now.getTime() - stats.mtime.getTime() < 24 * 60 * 60 * 1000) {
        try {
          const cachedData = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
          for (const item of cachedData) {
            const symbolKey = `${item.exchange}:${item.tradingsymbol}`.toUpperCase();
            this.instrumentsMap.set(symbolKey, item.instrument_token);
            // Default mappings without exchange name if NSE
            if (item.exchange === 'NSE' || item.exchange === 'BSE' || item.exchange === 'NFO') {
              this.instrumentsMap.set(item.tradingsymbol.toUpperCase(), item.instrument_token);
            }
            this.tokenToSymbolMap.set(item.instrument_token, item.tradingsymbol);
          }
          console.log(`Loaded ${this.instrumentsMap.size} instruments from local cache.`);
          return;
        } catch (err) {
          console.warn('Failed to parse cached instruments, fetching fresh list...');
        }
      }
    }

    console.log('Fetching master instruments list from Zerodha Kite...');
    try {
      const response = await axios.get('https://api.kite.trade/instruments');
      const csvData = response.data;
      
      const parsed = papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });

      const list = parsed.data as any[];
      fs.writeFileSync(this.cacheFile, JSON.stringify(list));

      for (const item of list) {
        const symbolKey = `${item.exchange}:${item.tradingsymbol}`.toUpperCase();
        this.instrumentsMap.set(symbolKey, item.instrument_token);
        if (item.exchange === 'NSE' || item.exchange === 'BSE' || item.exchange === 'NFO') {
          this.instrumentsMap.set(item.tradingsymbol.toUpperCase(), item.instrument_token);
        }
        this.tokenToSymbolMap.set(item.instrument_token, item.tradingsymbol);
      }
      console.log(`Successfully mapped ${this.instrumentsMap.size} instruments.`);
    } catch (error) {
      console.error('Failed to load Zerodha instruments list:', error);
    }
  }

  static getInstrumentToken(symbol: string): number | undefined {
    return this.instrumentsMap.get(symbol.toUpperCase());
  }

  static getSymbolFromToken(token: number): string | undefined {
    return this.tokenToSymbolMap.get(token);
  }

  private static cachedList: any[] | null = null;

  static getCachedList(): any[] {
    if (this.cachedList) return this.cachedList;
    if (fs.existsSync(this.cacheFile)) {
      try {
        this.cachedList = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
        return this.cachedList!;
      } catch (err) {
        console.error('Failed to read instruments.json cache', err);
      }
    }
    return [];
  }

  static findATMOption(underlying: string, optionType: 'CE' | 'PE', underlyingPrice: number): any | undefined {
    let name = underlying.toUpperCase();
    if (name.includes('NIFTY 50') || name === 'NIFTY') {
      name = 'NIFTY';
    } else if (name.includes('BANK') || name.includes('NIFTYBANK') || name === 'BANKNIFTY') {
      name = 'BANKNIFTY';
    }

    const interval = name === 'NIFTY' ? 50 : 100;
    const strike = Math.round(underlyingPrice / interval) * interval;

    const list = this.getCachedList();
    const matching = list.filter(item => 
      item.name === name &&
      item.exchange === 'NFO' &&
      item.instrument_type === optionType &&
      item.strike === strike
    );

    if (matching.length === 0) return undefined;

    // Sort by expiry date ascending
    matching.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

    return matching[0];
  }
}
