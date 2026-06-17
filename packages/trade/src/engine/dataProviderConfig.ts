import { DataService, KiteDataProvider, TradierDataProvider, RoutingDataProvider } from '@quantomate/data';
import { LiveEngineConfig } from './engineTypes';

export function configureDataProvider(feedName: string, config: LiveEngineConfig): void {
  if (feedName === 'KiteLiveFeed') {
    DataService.provider = new KiteDataProvider(
      config.kiteApiKey || process.env.ZERODHA_API_KEY || '',
      config.kiteAccessToken || ''
    );
  } else if (feedName === 'TradierLiveFeed') {
    DataService.provider = new TradierDataProvider(
      config.tradierAccessToken || process.env.TRADIER_API_KEY || '',
      config.tradierUseSandbox !== undefined ? config.tradierUseSandbox : (process.env.TRADIER_ENV !== 'production')
    );
  } else if (feedName === 'CompositeLiveFeed') {
    DataService.provider = new RoutingDataProvider({
      kite: new KiteDataProvider(config.kiteApiKey || process.env.ZERODHA_API_KEY || '', config.kiteAccessToken || ''),
      tradier: new TradierDataProvider(config.tradierAccessToken || process.env.TRADIER_API_KEY || '', config.tradierUseSandbox !== undefined ? config.tradierUseSandbox : (process.env.TRADIER_ENV !== 'production'))
    });
  }
}
