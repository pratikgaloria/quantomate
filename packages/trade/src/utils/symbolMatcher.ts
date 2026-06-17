/**
 * Determines if a trade symbol (either equity, index, or option contract)
 * matches or is an option derivative of the given underlying asset.
 */
export function isSymbolOrOptionOf(symbol: string, underlying: string): boolean {
  const sym = symbol.toUpperCase().trim();
  const und = underlying.toUpperCase().trim();

  // Direct match
  if (sym === und) return true;

  // Zerodha Nifty 50 mappings: Underlying is 'NIFTY 50' or 'NIFTY', options start with 'NIFTY'
  if ((und === 'NIFTY 50' || und === 'NIFTY') && sym.startsWith('NIFTY')) {
    return true;
  }

  // Zerodha Bank Nifty mappings: Underlying is 'NIFTY BANK' or 'BANKNIFTY', options start with 'BANKNIFTY' or 'NIFTYBANK'
  if (
    (und === 'NIFTY BANK' || und === 'BANKNIFTY') &&
    (sym.startsWith('BANKNIFTY') || sym.startsWith('NIFTYBANK'))
  ) {
    return true;
  }

  // Generic prefix matching for options contracts (e.g. underlying 'AAPL' -> option 'AAPL_CE_150')
  if (sym.startsWith(und)) {
    return true;
  }

  return false;
}

/**
 * Checks if a trade symbol matches any of the targets (directly or as an option).
 */
export function matchAnySymbolOrOption(tradeSymbol: string, targets: string[]): boolean {
  return targets.some((target) => isSymbolOrOptionOf(tradeSymbol, target));
}
