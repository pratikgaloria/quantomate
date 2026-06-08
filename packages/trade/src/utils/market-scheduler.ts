export interface MarketSchedule {
  name: string;
  timeZone: string;
  openTime: string; // HH:MM
  closeTime: string; // HH:MM
  weekdaysOnly: boolean;
}

export const MARKET_SCHEDULES: Record<string, MarketSchedule> = {
  india: {
    name: 'India',
    timeZone: 'Asia/Kolkata',
    openTime: '09:15',
    closeTime: '15:30',
    weekdaysOnly: true,
  },
  us: {
    name: 'US',
    timeZone: 'America/New_York',
    openTime: '09:30',
    closeTime: '16:00',
    weekdaysOnly: true,
  },
  crypto: {
    name: 'Crypto',
    timeZone: 'UTC',
    openTime: '00:00',
    closeTime: '23:59',
    weekdaysOnly: false,
  },
};

/**
 * Checks if a specific market is open at the given date/time
 */
export function isMarketOpen(marketKey: string, time: Date = new Date()): boolean {
  const schedule = MARKET_SCHEDULES[marketKey.toLowerCase()];
  if (!schedule) {
    return false;
  }

  if (marketKey.toLowerCase() === 'crypto') {
    return true; // Crypto is 24/7
  }

  // Get date parts in market's time zone
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: schedule.timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(time);
    const dateParts: Record<string, string> = {};
    for (const part of parts) {
      dateParts[part.type] = part.value;
    }

    const hour = parseInt(dateParts.hour, 10);
    const minute = parseInt(dateParts.minute, 10);

    if (schedule.weekdaysOnly) {
      const weekdayStr = new Intl.DateTimeFormat('en-US', {
        timeZone: schedule.timeZone,
        weekday: 'long',
      }).format(time);

      if (weekdayStr === 'Saturday' || weekdayStr === 'Sunday') {
        return false;
      }
    }

    const [openH, openM] = schedule.openTime.split(':').map((s) => parseInt(s, 10));
    const [closeH, closeM] = schedule.closeTime.split(':').map((s) => parseInt(s, 10));

    const currentMinutes = hour * 60 + minute;
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } catch (err) {
    console.error(`Error calculating market hours for ${marketKey}:`, err);
    return false;
  }
}

/**
 * Returns the list of currently open markets from a given list of market keys
 */
export function getOpenMarkets(marketKeys: string[], time: Date = new Date()): string[] {
  return marketKeys.filter((key) => isMarketOpen(key, time));
}
