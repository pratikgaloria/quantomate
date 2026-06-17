import { OrderSide } from '../broker';

export function determineOrderSide(
  isEntry: boolean,
  isShort: boolean,
  tradeOptions: boolean
): OrderSide {
  return isEntry 
    ? ((isShort && !tradeOptions) ? 'sell' : 'buy')
    : ((isShort && !tradeOptions) ? 'buy' : 'sell');
}
