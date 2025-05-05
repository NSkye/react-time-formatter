import { SafeDate, createSafeDate } from '@entities/calendar-date';
import {
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  STABLE_TIME_UNITS,
  relativeTimeUnitToMs,
} from '@entities/relative-time';
import { TimezoneOffsetResolver } from '@entities/timezone';

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

  if (config.years) {
    const [years, nextCursor] = calendarDistance([cursor, to], 'year', timezoneOffsetResolver);
    result.years = years;
    cursor = nextCursor;
  }

  if (config.months) {
    const [months, nextCursor] = calendarDistance([cursor, to], 'month', timezoneOffsetResolver);
    result.months = months;
    cursor = nextCursor;
  }

  let remainder = to.valueOf() - cursor.valueOf();
  for (const unit of STABLE_TIME_UNITS) {
    if (config[unit]) {
      result[unit] = Math.floor(remainder / relativeTimeUnitToMs(unit));
      remainder = remainder % relativeTimeUnitToMs(unit);
    }
  }

  return result;
};
