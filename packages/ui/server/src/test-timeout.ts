import YahooFinance from 'yahoo-finance2';

const instance = new YahooFinance();
console.log("instance._opts:", (instance as any)._opts);
(instance as any)._opts.queue = { timeout: 3000 };
console.log("Updated instance._opts:", (instance as any)._opts);
