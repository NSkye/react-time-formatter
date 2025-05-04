import { CALENDAR_TOKENS, DateTimeBreakdown, readCalendarToken } from '@entities/date-time';

export const breakdownDateTime = (date: Date, timezoneOffset: number) => {
  const breakdownResult: Partial<DateTimeBreakdown> = {
    timezoneOffset,
  };

  for (const token of CALENDAR_TOKENS) {
    const tokenValue = readCalendarToken(date, token, timezoneOffset);
    breakdownResult[token] = tokenValue;
  }

  return breakdownResult as DateTimeBreakdown;
};
