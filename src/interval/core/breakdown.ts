import {
  SafeDate,
  createSafeDate,
  readCalendarToken,
  writeCalendarToken,
} from '@entities/calendar-date';
import {
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  STABLE_TIME_UNITS,
  relativeTimeUnitToMs,
} from '@entities/relative-time';
import { TimezoneOffsetResolver } from '@entities/timezone';

import { DAY, X4YEARS, X400YEARS } from '@shared/time-primitives';

import { calendarDistance } from './calendar-distance';

export const breakdownInterval = (
  fromTo: [SafeDate, SafeDate],
  config: RelativeTimeConfig,
  timezoneOffsetResolver: TimezoneOffsetResolver
) => {
  const [from, to] = [...fromTo].sort((a, b) => a.valueOf() - b.valueOf());

  const result: RelativeTimeBreakdown = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  };

  let cursor = createSafeDate(new Date(from));

  // count of chunks of 400 years travelled,
  // where value of each 400-year chunk is exact = X400YEARS;
  const x400Years = Math.floor((to.valueOf() - cursor.valueOf()) / X400YEARS);

  // travel all full chunks of 400 years into the future at once safely
  cursor = createSafeDate(
    writeCalendarToken(
      cursor,
      'year',
      readCalendarToken(cursor, 'year', timezoneOffsetResolver(cursor)) + x400Years * 400,
      timezoneOffsetResolver(cursor)
    )
  );

  // for remaining distance find how many days we need to subtract to account
  // for the years divisible by 100 (technically leap but with no additional day)
  // and years divisible by 400 (counted as standard leap years)
  const fromYear = readCalendarToken(cursor, 'year', timezoneOffsetResolver(cursor));
  const toYear = readCalendarToken(to, 'year', timezoneOffsetResolver(to));

  const yearsDivisibleBy100 = Math.floor((toYear - 1) / 100) - Math.floor((fromYear - 1) / 100);
  const yearsDivisibleBy400 = Math.floor((toYear - 1) / 400) - Math.floor((fromYear - 1) / 400);
  const daysOffset = yearsDivisibleBy100 - yearsDivisibleBy400;

  // count of chunks of 4 years travelled
  // where value of each 4-year chunk is exact = X4YEARS (thanks to correction with daysOffset)
  const x4Years = Math.floor((to.valueOf() - cursor.valueOf() - daysOffset * DAY) / X4YEARS);

  cursor = createSafeDate(
    writeCalendarToken(
      cursor,
      'year',
      readCalendarToken(cursor, 'year', timezoneOffsetResolver(cursor)) + x4Years * 4,
      timezoneOffsetResolver(cursor)
    )
  );

  let unrecordedX400Years = x400Years;
  let unrecordedX4Years = x4Years;

  if (config.years) {
    // "walk" remaining part year by year now, calendarDistance is iterative
    const [years, nextCursor] = calendarDistance([cursor, to], 'year', timezoneOffsetResolver);
    result.years = years + unrecordedX4Years * 4 + unrecordedX400Years * 400;
    cursor = nextCursor;

    // just counted them in
    unrecordedX4Years = 0;
    unrecordedX400Years = 0;
  }

  if (config.months) {
    // "walk" remaining part month by month now, calendarDistance is iterative
    const [months, nextCursor] = calendarDistance([cursor, to], 'month', timezoneOffsetResolver);
    result.months = months + unrecordedX4Years * 4 * 12 + unrecordedX400Years * 400 * 12;
    cursor = nextCursor;

    // just counted them in
    unrecordedX4Years = 0;
    unrecordedX400Years = 0;
  }

  let remainder =
    // remaining cursor distance
    to.valueOf() -
    cursor.valueOf() +
    // distance already covered by jumps, resolved separately to avoid approximating 1 year to 365
    (unrecordedX4Years * X4YEARS + unrecordedX400Years * X400YEARS);

  // remaining units counted by simple division
  for (const unit of STABLE_TIME_UNITS) {
    if (config[unit]) {
      result[unit] = Math.floor(remainder / relativeTimeUnitToMs(unit));
      remainder = remainder % relativeTimeUnitToMs(unit);
    }
  }

  return result;
};
