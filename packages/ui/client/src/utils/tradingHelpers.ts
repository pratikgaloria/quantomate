export const getMarketForSymbol = (symbol: string): string => {
  const sym = (symbol || '').toUpperCase().trim();
  const cryptoAssets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'DOGE', 'XRP'];
  if (cryptoAssets.some(c => sym.startsWith(c) || sym.endsWith(c) || sym.includes('/USD') || sym.includes('-USD'))) {
    return 'crypto';
  }
  if (
    sym.startsWith('NIFTY') || sym.startsWith('BANKNIFTY') || sym.startsWith('^NSE') ||
    sym.endsWith('.NS') || sym.includes('NSEI') || sym.includes('NSEBANK') ||
    sym.startsWith('NSE:') || sym.startsWith('NFO:') ||
    ['SBIN', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'].includes(sym)
  ) {
    return 'india';
  }
  return 'us';
};

export const getOptionType = (symbol: string): 'Call' | 'Put' | '-' => {
  const sym = (symbol || '').toUpperCase().trim();
  if (/P\d{8}$/i.test(sym) || sym.endsWith('PE')) return 'Put';
  if (/C\d{8}$/i.test(sym) || sym.endsWith('CE')) return 'Call';
  return '-';
};

export const getCurrencySymbol = (market: string): string => {
  return market === 'india' ? '₹' : '$';
};

export const getAccountMarket = (account: any): string => {
  const markets = account?.enabledMarkets;
  if (Array.isArray(markets) && markets.length > 0) return markets[0];
  // Fallback by provider
  if (account?.provider === 'zerodha') return 'india';
  if (account?.provider === 'tradier') return 'us';
  return 'us';
};

export const formatPrice = (symbol: string, price: number | null | undefined): string => {
  if (price === null || price === undefined) return 'Awaiting...';
  const market = getMarketForSymbol(symbol);
  const currencySymbol = getCurrencySymbol(market);
  return `${currencySymbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatCurrency = (amount: number, market: string): string => {
  const sym = getCurrencySymbol(market);
  return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatPL = (amount: number, market: string): string => {
  const sym = getCurrencySymbol(market);
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const symbolMatchesBot = (tradeSymbol: string, botSym: string): boolean => {
  const tSym = tradeSymbol.toUpperCase();
  const bSymbols = botSym.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  return bSymbols.some(bSym => {
    if (tSym === bSym) return true;
    if (bSym === 'NIFTY 50' && tSym.startsWith('NIFTY')) return true;
    if (bSym === 'NIFTY BANK' && tSym.startsWith('BANKNIFTY')) return true;
    return tSym.startsWith(bSym);
  });
};

export const getBotOrders = (botSymbol: string, orders: any[]): any[] => {
  return orders.filter(o => o.symbol && symbolMatchesBot(o.symbol, botSymbol));
};

export const getBotPositions = (botSymbol: string, positions: any[]): any[] => {
  return positions.filter(p => symbolMatchesBot(p.symbol, botSymbol));
};

export const calculateBotPL = (botSymbol: string, orders: any[], positions: any[]) => {
  const botOrders = orders.filter(o => o.symbol && symbolMatchesBot(o.symbol, botSymbol) && o.status.toLowerCase() === 'filled');
  let realizedPL = 0;
  let currentQty = 0;
  let avgCost = 0;
  const sortedOrders = [...botOrders].sort((a, b) => new Date(a.filledAt || '').getTime() - new Date(b.filledAt || '').getTime());
  for (const ord of sortedOrders) {
    const isBuy = ord.side?.toLowerCase().startsWith('buy');
    const price = ord.filledPrice || ord.avgFillPrice || 0;
    const qty = ord.filledQty || ord.qty || 0;
    const commission = ord.commissionPaid || 0;
    if (isBuy) {
      if (currentQty >= 0) {
        const newQty = currentQty + qty;
        avgCost = newQty > 0 ? (currentQty * avgCost + qty * price) / newQty : 0;
        currentQty = newQty;
      } else {
        const closedQty = Math.min(Math.abs(currentQty), qty);
        realizedPL += closedQty * (avgCost - price) - commission;
        currentQty += qty;
        if (currentQty > 0) avgCost = price;
      }
    } else {
      if (currentQty <= 0) {
        const newQty = currentQty - qty;
        avgCost = newQty < 0 ? (Math.abs(currentQty) * avgCost + qty * price) / Math.abs(newQty) : 0;
        currentQty = newQty;
      } else {
        const closedQty = Math.min(currentQty, qty);
        realizedPL += closedQty * (price - avgCost) - commission;
        currentQty -= qty;
        if (currentQty < 0) avgCost = price;
      }
    }
  }
  const botPositions = positions.filter(p => symbolMatchesBot(p.symbol, botSymbol));
  const unrealizedPL = botPositions.reduce((sum, pos) => sum + (pos.marketPrice - (pos.avgEntryPrice || pos.entryPrice)) * pos.qty, 0);
  return { realizedPL, unrealizedPL, totalPL: realizedPL + unrealizedPL };
};

export const calculateAccountPL = (account: any, bots: any[], orders: any[], positions: any[]) => {
  const accountBots = bots.filter(b => b.allocationSessionId === account.id);
  let totalRealizedPL = 0;
  let totalUnrealizedPL = 0;
  for (const bot of accountBots) {
    const botPL = calculateBotPL(bot.symbol, orders, positions);
    totalRealizedPL += botPL.realizedPL;
    totalUnrealizedPL += botPL.unrealizedPL;
  }
  const totalPL = totalRealizedPL + totalUnrealizedPL;
  const currentValue = account.capital + totalPL;
  const totalPLPct = account.capital > 0 ? (totalPL / account.capital) * 100 : 0;
  return { currentValue, totalPL, totalPLPct, realizedPL: totalRealizedPL, unrealizedPL: totalUnrealizedPL };
};

/** Group orders into trade cycles (entry + exit pairs) for a given bot symbol */
export const groupOrdersIntoTrades = (botSymbol: string, orders: any[], positions: any[]) => {
  const botOrders = orders
    .filter(o => o.symbol && symbolMatchesBot(o.symbol, botSymbol) && o.status?.toLowerCase() === 'filled')
    .sort((a, b) => new Date(a.filledAt || '').getTime() - new Date(b.filledAt || '').getTime());

  const trades: { symbol: string; entryOrder: any; exitOrder: any | null; qty: number; entryPrice: number; exitPrice: number | null; pnl: number | null; isOpen: boolean }[] = [];
  const openEntries: any[] = [];

  for (const ord of botOrders) {
    const isBuy = ord.side?.toLowerCase().startsWith('buy');
    const price = ord.filledPrice || ord.avgFillPrice || 0;
    const qty = ord.filledQty || ord.qty || 0;

    if (isBuy) {
      // Check if this closes a short position
      const shortIdx = openEntries.findIndex(e => e.symbol === ord.symbol && !e.side?.toLowerCase().startsWith('buy'));
      if (shortIdx >= 0) {
        const entry = openEntries.splice(shortIdx, 1)[0];
        const entryPrice = entry.filledPrice || entry.avgFillPrice || 0;
        trades.push({
          symbol: ord.symbol,
          entryOrder: entry,
          exitOrder: ord,
          qty,
          entryPrice,
          exitPrice: price,
          pnl: (entryPrice - price) * qty,
          isOpen: false,
        });
      } else {
        openEntries.push(ord);
      }
    } else {
      // Sell — check if this closes a long position
      const longIdx = openEntries.findIndex(e => e.symbol === ord.symbol && e.side?.toLowerCase().startsWith('buy'));
      if (longIdx >= 0) {
        const entry = openEntries.splice(longIdx, 1)[0];
        const entryPrice = entry.filledPrice || entry.avgFillPrice || 0;
        trades.push({
          symbol: ord.symbol,
          entryOrder: entry,
          exitOrder: ord,
          qty,
          entryPrice,
          exitPrice: price,
          pnl: (price - entryPrice) * qty,
          isOpen: false,
        });
      } else {
        openEntries.push(ord);
      }
    }
  }

  // Remaining open entries become open trades
  for (const entry of openEntries) {
    const entryPrice = entry.filledPrice || entry.avgFillPrice || 0;
    const pos = positions.find(p => symbolMatchesBot(p.symbol, entry.symbol));
    const marketPrice = pos ? (pos.marketPrice || pos.entryPrice) : entryPrice;
    const isBuy = entry.side?.toLowerCase().startsWith('buy');
    const qty = entry.filledQty || entry.qty || 0;
    trades.push({
      symbol: entry.symbol,
      entryOrder: entry,
      exitOrder: null,
      qty,
      entryPrice,
      exitPrice: null,
      pnl: isBuy ? (marketPrice - entryPrice) * qty : (entryPrice - marketPrice) * qty,
      isOpen: true,
    });
  }

  return trades;
};
