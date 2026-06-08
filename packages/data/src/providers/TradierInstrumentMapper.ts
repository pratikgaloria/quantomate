export class TradierInstrumentMapper {
  static async findATMOption(
    underlying: string,
    optionType: 'CE' | 'PE',
    underlyingPrice: number,
    accessToken?: string,
    useSandbox?: boolean
  ): Promise<{ symbol: string; strike: number; expiry: string } | undefined> {
    const symbol = underlying.toUpperCase();
    const token = accessToken || process.env.TRADIER_API_KEY || '';
    const sandbox = useSandbox !== undefined ? useSandbox : process.env.TRADIER_ENV !== 'production';
    const baseUrl = sandbox ? 'https://sandbox.tradier.com/v1' : 'https://api.tradier.com/v1';

    if (!token) {
      console.error('[TradierInstrumentMapper] TRADIER_API_KEY is not defined.');
      return undefined;
    }

    try {
      // 1. Fetch expirations
      const expUrl = `${baseUrl}/markets/options/expirations?symbol=${symbol}`;
      const expResponse = await fetch(expUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!expResponse.ok) {
        throw new Error(`Failed to fetch expirations for ${symbol}: ${expResponse.statusText}`);
      }

      const expData = (await expResponse.json()) as any;
      const rawExpirations = expData.expirations?.date;
      if (!rawExpirations) {
        console.warn(`[TradierInstrumentMapper] No expirations found for ${symbol}`);
        return undefined;
      }

      const expirations: string[] = Array.isArray(rawExpirations) ? rawExpirations : [rawExpirations];
      if (expirations.length === 0) {
        return undefined;
      }

      // Select the nearest expiration date
      const nearestExpiration = expirations[0];

      // 2. Fetch options chain
      const chainUrl = `${baseUrl}/markets/options/chains?symbol=${symbol}&expiration=${nearestExpiration}`;
      const chainResponse = await fetch(chainUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!chainResponse.ok) {
        throw new Error(`Failed to fetch options chain for ${symbol}: ${chainResponse.statusText}`);
      }

      const chainData = (await chainResponse.json()) as any;
      const rawOptions = chainData.options?.option;
      if (!rawOptions) {
        console.warn(`[TradierInstrumentMapper] No option contracts found in chain for ${symbol}`);
        return undefined;
      }

      const options: any[] = Array.isArray(rawOptions) ? rawOptions : [rawOptions];
      if (options.length === 0) {
        return undefined;
      }

      // Option type in Tradier is 'call' or 'put'
      const tradierOptionType = optionType === 'CE' ? 'call' : 'put';

      // Filter by type
      const matchingType = options.filter((opt) => opt.option_type === tradierOptionType);
      if (matchingType.length === 0) {
        console.warn(`[TradierInstrumentMapper] No matching option type (${tradierOptionType}) for ${symbol}`);
        return undefined;
      }

      // Find the option with strike closest to underlyingPrice
      let closestOption = matchingType[0];
      let minDiff = Math.abs(Number(closestOption.strike) - underlyingPrice);

      for (const opt of matchingType) {
        const diff = Math.abs(Number(opt.strike) - underlyingPrice);
        if (diff < minDiff) {
          minDiff = diff;
          closestOption = opt;
        }
      }

      console.log(
        `[TradierInstrumentMapper] Found ATM option for ${symbol} @ strike ${closestOption.strike}: ${closestOption.symbol}`
      );

      return {
        symbol: closestOption.symbol, // E.g., "AAPL260619C00150000"
        strike: Number(closestOption.strike),
        expiry: closestOption.expiration_date,
      };
    } catch (error: any) {
      console.error(`[TradierInstrumentMapper] Error resolving ATM option for ${symbol}:`, error.message);
      return undefined;
    }
  }
}
