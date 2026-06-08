import { ILiveFeed, TickCallback } from './ILiveFeed';

export class CompositeLiveFeed implements ILiveFeed {
  constructor(
    private feeds: {
      feed: ILiveFeed;
      matches: (symbol: string) => boolean;
    }[]
  ) {}

  async connect(): Promise<void> {
    await Promise.all(this.feeds.map((f) => f.feed.connect()));
  }

  async disconnect(): Promise<void> {
    await Promise.all(this.feeds.map((f) => f.feed.disconnect()));
  }

  subscribe(symbols: string[], callback: TickCallback): void {
    const groups = new Map<any, string[]>();
    for (const symbol of symbols) {
      const match = this.feeds.find((f) => f.matches(symbol));
      if (match) {
        if (!groups.has(match.feed)) {
          groups.set(match.feed, []);
        }
        groups.get(match.feed)!.push(symbol);
      }
    }

    for (const [feed, syms] of groups.entries()) {
      feed.subscribe(syms, callback);
    }
  }

  unsubscribe(symbols: string[]): void {
    const groups = new Map<any, string[]>();
    for (const symbol of symbols) {
      const match = this.feeds.find((f) => f.matches(symbol));
      if (match) {
        if (!groups.has(match.feed)) {
          groups.set(match.feed, []);
        }
        groups.get(match.feed)!.push(symbol);
      }
    }

    for (const [feed, syms] of groups.entries()) {
      feed.unsubscribe(syms);
    }
  }

  onDisconnect(callback: () => void): void {
    for (const f of this.feeds) {
      f.feed.onDisconnect(callback);
    }
  }
}
