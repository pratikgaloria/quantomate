import { OptionSelector } from '@quantomate/core';

export class TradierInstrumentMapper {
  static async findATMOption(
    underlying: string,
    optionType: 'CE' | 'PE',
    underlyingPrice: number,
    accessToken?: string,
    useSandbox?: boolean,
    selector?: OptionSelector
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

      // Select expiration based on selector criteria
      let targetExpiry = expirations[0];

      if (selector) {
        if (selector.expiryMode === 'dte') {
          const minDte = selector.minDte ?? 0;
          const maxDte = selector.maxDte ?? 365;
          const nowMs = Date.now();
          const matchedExpirations = expirations.filter(exp => {
            const expMs = new Date(exp).getTime();
            const dte = (expMs - nowMs) / (1000 * 60 * 60 * 24);
            return dte >= minDte && dte <= maxDte;
          });
          if (matchedExpirations.length > 0) {
            targetExpiry = matchedExpirations[0];
          }
        } else if (selector.expiryMode === 'monthly') {
          const matched = expirations.filter(exp => {
            const date = new Date(exp);
            // Third Friday: Friday is day 5, date is between 15 and 21
            return date.getDay() === 5 && date.getDate() >= 15 && date.getDate() <= 21;
          });
          if (matched.length > 0) {
            targetExpiry = matched[0];
          }
        }
      }

      // 2. Fetch options chain
      const chainUrl = `${baseUrl}/markets/options/chains?symbol=${symbol}&expiration=${targetExpiry}`;
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

      const tradierOptionType = optionType === 'CE' ? 'call' : 'put';
      const matchingType = options.filter((opt) => opt.option_type === tradierOptionType);
      if (matchingType.length === 0) {
        console.warn(`[TradierInstrumentMapper] No matching option type (${tradierOptionType}) for ${symbol}`);
        return undefined;
      }

      // 3. Resolve Strike
      const uniqueStrikes = Array.from(new Set(matchingType.map((opt) => Number(opt.strike)))).sort((a, b) => a - b);
      
      let atmStrike = uniqueStrikes[0];
      let minDiff = Math.abs(atmStrike - underlyingPrice);
      for (const strike of uniqueStrikes) {
        const diff = Math.abs(strike - underlyingPrice);
        if (diff < minDiff) {
          minDiff = diff;
          atmStrike = strike;
        }
      }

      let selectedStrike = atmStrike;

      if (selector && selector.strikeMode === 'offset' && selector.strikeOffset) {
        const atmIndex = uniqueStrikes.indexOf(atmStrike);
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

      const closestOption = matchingType.find((opt) => Number(opt.strike) === selectedStrike) || matchingType[0];

      console.log(
        `[TradierInstrumentMapper] Found matching option for ${symbol} @ strike ${closestOption.strike} (expiry: ${closestOption.expiration_date}): ${closestOption.symbol}`
      );

      return {
        symbol: closestOption.symbol,
        strike: Number(closestOption.strike),
        expiry: closestOption.expiration_date,
      };
    } catch (error: any) {
      console.error(`[TradierInstrumentMapper] Error resolving option for ${symbol}:`, error.message);
      return undefined;
    }
  }
}
