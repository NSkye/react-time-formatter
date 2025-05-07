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

  const correctForFebruary = createFebruaryCorrector(from, timezoneOffsetResolver);

  let result = 0;
  let cursor = createSafeDate(new Date(from));
  let next = createSafeDate(new Date(cursor));

  /**
   * Not expected to complete even a fraction of these iterations
   * just an upper bound to avoid any potential infinite loop bugs
   */
  for (let i = 0; i <= 2e4; i++) {
    next = correctForFebruary(createSafeDate(changeToken(next, readToken(next) + 1)));

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

function createFebruaryCorrector(
  iteratedFrom: SafeDate,
  timezoneOffsetResolver: TimezoneOffsetResolver
) {
  const fromMonth = readCalendarToken(iteratedFrom, 'month', timezoneOffsetResolver(iteratedFrom));
  const fromDate = readCalendarToken(iteratedFrom, 'date', timezoneOffsetResolver(iteratedFrom));

  if (fromMonth !== 2 || fromDate !== 29) return (arrivedTo: SafeDate) => arrivedTo;

  return (arrivedTo: SafeDate): SafeDate => {
    const arrivedToMonth = readCalendarToken(
      arrivedTo,
      'month',
      timezoneOffsetResolver(iteratedFrom)
    );

    const arrivedToDate = readCalendarToken(
      arrivedTo,
      'date',
      timezoneOffsetResolver(iteratedFrom)
    );

    const shouldCorrect = arrivedToMonth === 3 && arrivedToDate === 1;
    if (!shouldCorrect) return arrivedTo;

    // set corrected month back to february
    const correctedMonth = writeCalendarToken(
      arrivedTo,
      'month',
      fromMonth,
      timezoneOffsetResolver(iteratedFrom)
    );

    // then attempt to set it to 29th
    // if we couldn't, it will just safely overflow to the 1st again
    return createSafeDate(
      writeCalendarToken(correctedMonth, 'date', fromDate, timezoneOffsetResolver(iteratedFrom))
    );
  };
}
