import axios from 'axios';
import papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { OptionSelector } from '@quantomate/core';

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
    if (this.instrumentsMap.size === 0) {
      const cached = this.getCachedList();
      for (const item of cached) {
        const symbolKey = `${item.exchange}:${item.tradingsymbol}`.toUpperCase();
        this.instrumentsMap.set(symbolKey, item.instrument_token);
        if (item.exchange === 'NSE' || item.exchange === 'BSE' || item.exchange === 'NFO') {
          this.instrumentsMap.set(item.tradingsymbol.toUpperCase(), item.instrument_token);
        }
        this.tokenToSymbolMap.set(item.instrument_token, item.tradingsymbol);
      }
    }
    return this.instrumentsMap.get(symbol.toUpperCase());
  }

  static getSymbolFromToken(token: number): string | undefined {
    if (this.tokenToSymbolMap.size === 0) {
      // Trigger lazy load
      this.getInstrumentToken('');
    }
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

  static findATMOption(
    underlying: string,
    optionType: 'CE' | 'PE',
    underlyingPrice: number,
    selector?: OptionSelector
  ): any | undefined {
    let name = underlying.toUpperCase();
    if (name.includes('NIFTY 50') || name === 'NIFTY' || name === '^NSEI' || name === 'NSEI') {
      name = 'NIFTY';
    } else if (name.includes('BANK') || name.includes('NIFTYBANK') || name === 'BANKNIFTY' || name === '^NSEBANK' || name === 'NSEBANK') {
      name = 'BANKNIFTY';
    }

    const list = this.getCachedList();
    if (list.length === 0) return undefined;

    // Filter list for matching underlying name, NFO exchange, and option type
    const matchingInstruments = list.filter(item => 
      item.name === name &&
      item.exchange === 'NFO' &&
      item.instrument_type === optionType
    );

    if (matchingInstruments.length === 0) return undefined;

    // 1. Filter by Expiration / DTE
    const uniqueExpirations = Array.from(new Set(matchingInstruments.map(item => item.expiry))).sort();
    let targetExpiry = uniqueExpirations[0]; // default to nearest

    if (selector) {
      if (selector.expiryMode === 'dte') {
        const minDte = selector.minDte ?? 0;
        const maxDte = selector.maxDte ?? 365;
        const nowMs = Date.now();
        const matchedExpirations = uniqueExpirations.filter(exp => {
          const expMs = new Date(exp).getTime();
          const dte = (expMs - nowMs) / (1000 * 60 * 60 * 24);
          return dte >= minDte && dte <= maxDte;
        });
        if (matchedExpirations.length > 0) {
          targetExpiry = matchedExpirations[0];
        }
      } else if (selector.expiryMode === 'monthly') {
        const expsByMonth: Record<string, string[]> = {};
        for (const exp of uniqueExpirations) {
          const monthKey = exp.substring(0, 7); // YYYY-MM
          if (!expsByMonth[monthKey]) expsByMonth[monthKey] = [];
          expsByMonth[monthKey].push(exp);
        }
        const monthlyExpirations = Object.values(expsByMonth).map(exps => exps[exps.length - 1]);
        if (monthlyExpirations.length > 0) {
          targetExpiry = monthlyExpirations[0];
        }
      }
    }

    // Filter instruments by target expiry
    const chain = matchingInstruments.filter(item => item.expiry === targetExpiry);
    if (chain.length === 0) return undefined;

    // 2. Select Strike
    const uniqueStrikes = Array.from(new Set(chain.map(item => Number(item.strike)))).sort((a, b) => a - b);
    const interval = name === 'NIFTY' ? 50 : 100;
    const atmStrike = Math.round(underlyingPrice / interval) * interval;
    
    let selectedStrike = atmStrike;

    if (selector && selector.strikeMode === 'offset' && selector.strikeOffset) {
      let atmIndex = uniqueStrikes.indexOf(atmStrike);
      if (atmIndex === -1) {
        let minDiff = Math.abs(uniqueStrikes[0] - atmStrike);
        atmIndex = 0;
        for (let i = 1; i < uniqueStrikes.length; i++) {
          const diff = Math.abs(uniqueStrikes[i] - atmStrike);
          if (diff < minDiff) {
            minDiff = diff;
            atmIndex = i;
          }
        }
      }

      if (atmIndex !== -1) {
        let offsetIndex = atmIndex;
        if (optionType === 'CE') {
          offsetIndex += selector.strikeOffset;
        } else {
          offsetIndex -= selector.strikeOffset;
        }
        const targetIndex = Math.max(0, Math.min(uniqueStrikes.length - 1, offsetIndex));
        selectedStrike = uniqueStrikes[targetIndex];
      }
    }

    return chain.find(item => Number(item.strike) === selectedStrike);
  }
}
