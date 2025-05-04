import { readCalendarToken, writeCalendarToken } from '@entities/calendar-date';
import { TimezoneOffsetResolver } from '@entities/timezone';

/**
 * Computes calendar distance from dates and returns a remainder
 * @param dates
 * @param timezoneOffsetResolver
 */
export const calendarDistance = (
  fromTo: [Date, Date],
  unit: 'year' | 'month',
  timezoneOffsetResolver: TimezoneOffsetResolver
): [number, Date, Date] => {
  const [from, to] = fromTo;

  const changeToken = (date: Date, value: number) =>
    writeCalendarToken(date, unit, value, timezoneOffsetResolver(date));

  const readToken = (date: Date) => readCalendarToken(date, unit, timezoneOffsetResolver(date));

  let result = 0;
  let cursor = new Date(from);
  let next = new Date(cursor);

  while (true) {
    next = changeToken(next, readToken(next) + 1);

    if (next.valueOf() <= to.valueOf()) {
      cursor = next;
      next = new Date(cursor);
      result++;
      continue;
    }

    break;
  }

  return [result, cursor, to];
};
