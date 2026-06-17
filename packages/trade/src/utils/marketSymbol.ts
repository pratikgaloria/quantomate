export function getMarketForSymbol(symbol: string): "india" | "us" | "crypto" {
  const sym = symbol.toUpperCase().trim();

  if (
    sym.includes("/USD") ||
    sym.includes("-USD") ||
    sym.endsWith("USDT") ||
    sym.endsWith("USDC")
  ) {
    return "crypto";
  }

  if (
    sym.startsWith("NSE:") ||
    sym.startsWith("NFO:") ||
    sym.endsWith(".NS") ||
    sym.includes("NSEI") ||
    sym.includes("NSEBANK") ||
    /^(NIFTY|BANKNIFTY)/.test(sym)
  ) {
    return "india";
  }

  return "us";
}
