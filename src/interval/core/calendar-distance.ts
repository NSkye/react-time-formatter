import {
  SafeDate,
  createSafeDate,
  readCalendarToken,
  writeCalendarToken,
} from '@entities/calendar-date';
import { TimezoneOffsetResolver } from '@entities/timezone';

/**
 * Computes calendar distance from dates and returns a remainder
 * @param dates
 * @param timezoneOffsetResolver
 */
export const calendarDistance = (
  fromTo: [SafeDate, SafeDate],
  // no point for anything besides year and month
  unit: 'year' | 'month',
  timezoneOffsetResolver: TimezoneOffsetResolver
): [number, SafeDate, SafeDate] => {
  const [from, to] = fromTo;

  if (!from.valid || !to.valid) return [NaN, from, to];

  const changeToken = (date: Date, value: number) =>
    writeCalendarToken(date, unit, value, timezoneOffsetResolver(date));

  const readToken = (date: Date) => readCalendarToken(date, unit, timezoneOffsetResolver(date));

  let result = 0;
  let cursor = createSafeDate(new Date(from));
  let next = createSafeDate(new Date(cursor));

  /**
   * Not expected to complete even a fraction of these iterations
   * just an upper bound to avoid any potential infinite loop bugs
   */
  for (let i = 0; i <= 2e4; i++) {
    next = createSafeDate(changeToken(next, readToken(next) + 1));

    if (next.valueOf() <= to.valueOf()) {
      cursor = next;
      next = createSafeDate(new Date(cursor));
      result++;
      continue;
    }

    break;
  }

  return [result, cursor, to];
};
