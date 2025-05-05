import {
  CALENDAR_TOKENS,
  CalendarDateBreakdown,
  SafeDate,
  readCalendarToken,
} from '@entities/calendar-date';

export const breakdownDateTime = (date: SafeDate, timezoneOffset: number) => {
  const breakdownResult: Partial<CalendarDateBreakdown> = {
    timezoneOffset,
  };

  for (const token of CALENDAR_TOKENS) {
    const tokenValue = readCalendarToken(date, token, timezoneOffset);
    breakdownResult[token] = tokenValue;
  }

  return breakdownResult as CalendarDateBreakdown;
};
