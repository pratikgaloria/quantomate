import { Request, Response } from 'express';
import { KiteInstrumentMapper, TradierDataProvider, YahooFinanceProvider } from '@quantomate/data';

export async function searchSymbolsHandler(req: Request, res: Response) {
  try {
    const { market, query } = req.query;
    if (!query || typeof query !== "string") {
      return res.json({ success: true, data: [] });
    }
    const q = query.trim();
    if (q.length === 0) {
      return res.json({ success: true, data: [] });
    }

    if (market === "india") {
      const list = KiteInstrumentMapper.getCachedList();
      const queryUpper = q.toUpperCase();
      const matches: any[] = [];
      const seen = new Set<string>();

      const indices = [
        { symbol: 'NIFTY 50', name: 'Nifty 50 Index' },
        { symbol: 'NIFTY BANK', name: 'Nifty Bank Index' }
      ];
      for (const idx of indices) {
        if (idx.symbol.includes(queryUpper) || idx.name.toUpperCase().includes(queryUpper)) {
          matches.push({ ...idx, exchange: 'NSE', market: 'india' });
          seen.add(idx.symbol);
        }
      }

      for (const item of list) {
        if (matches.length >= 30) break;
        const isNseEq = item.exchange === 'NSE' && item.instrument_type === 'EQ';
        const isNfo = item.exchange === 'NFO';
        
        if (isNseEq) {
          const symbol = item.tradingsymbol;
          if (!seen.has(symbol)) {
            const name = item.name || '';
            if (symbol.toUpperCase().includes(queryUpper) || name.toUpperCase().includes(queryUpper)) {
              matches.push({ symbol, name: name || symbol, exchange: 'NSE', market: 'india' });
              seen.add(symbol);
            }
          }
        } else if (isNfo) {
          const symbol = item.name;
          if (symbol && !seen.has(symbol)) {
            if (symbol.toUpperCase().includes(queryUpper)) {
              matches.push({ symbol, name: `${symbol} (Derivatives)`, exchange: 'NFO', market: 'india' });
              seen.add(symbol);
            }
          }
        }
      }
      return res.json({ success: true, data: matches });
    } else if (market === "us" || market === "yf") {
      let rawResults: any[] = [];
      const token = process.env.TRADIER_API_KEY;
      if (token && market !== "yf") {
        const useSandbox = process.env.TRADIER_ENV !== "production";
        const provider = new TradierDataProvider(token, useSandbox);
        rawResults = await provider.search(q);
      } else {
        const provider = new YahooFinanceProvider();
        rawResults = await provider.search(q);
      }
      const matches = (rawResults || []).map((item: any) => ({
        symbol: item.symbol,
        name: item.shortname || item.longname || item.name || item.symbol,
        exchange: item.exchange || (market === 'yf' ? 'YF' : 'US'),
        market: market
      }));
      return res.json({ success: true, data: matches });
    }

    return res.json({ success: true, data: [] });
  } catch (error: any) {
    console.error("[SearchSymbols] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
