import { OptionSelector } from '@quantomate/core';
import { KiteInstrumentMapper, TradierInstrumentMapper } from '@quantomate/data';
import { getMarketForSymbol } from '../utils/market';

export async function resolveOptionSymbol(
  underlying: string,
  optionType: 'CE' | 'PE',
  underlyingPrice: number,
  selector: OptionSelector | undefined,
  tradierApiKey: string | undefined
): Promise<string | undefined> {
  const market = getMarketForSymbol(underlying);
  if (market === "india") {
    const opt = KiteInstrumentMapper.findATMOption(
      underlying,
      optionType,
      underlyingPrice,
      selector as any
    );
    return opt?.tradingsymbol;
  } else if (market === "us" && tradierApiKey) {
    const useSandbox = process.env.TRADIER_ENV !== "production";
    const opt = await TradierInstrumentMapper.findATMOption(
      underlying,
      optionType,
      underlyingPrice,
      tradierApiKey,
      useSandbox,
      selector as any
    );
    return opt?.symbol;
  }
  return undefined;
}
