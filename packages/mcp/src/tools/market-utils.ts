/**
 * Shared market schedule data — inlined to avoid cross-package dependency
 * on @quantomate/trade which is not in scope for the MCP server.
 */
export interface MarketSchedule {
  name: string;
  timeZone: string;
  openTime: string;
  closeTime: string;
  weekdaysOnly: boolean;
}

export const MARKET_SCHEDULES: Record<string, MarketSchedule> = {
  india: {
    name: "India (NSE/BSE)",
    timeZone: "Asia/Kolkata",
    openTime: "09:15",
    closeTime: "15:30",
    weekdaysOnly: true,
  },
  us: {
    name: "United States (NYSE/NASDAQ)",
    timeZone: "America/New_York",
    openTime: "09:30",
    closeTime: "16:00",
    weekdaysOnly: true,
  },
  crypto: {
    name: "Crypto (24/7)",
    timeZone: "UTC",
    openTime: "00:00",
    closeTime: "23:59",
    weekdaysOnly: false,
  },
};
