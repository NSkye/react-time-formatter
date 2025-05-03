import {
  readCalendarToken,
  writeCalendarToken,
} from "@entities/date-time/read-write";
import {
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  relativeTimeUnitToMs,
  STABLE_TIME_UNITS,
} from "@entities/relative-time";
import { TimezoneOffsetResolver } from "@entities/timezone";

export const breakdownInterval = (
  dates: [Date | number, Date | number],
  config: RelativeTimeConfig,
  timezoneOffsetResolver: TimezoneOffsetResolver,
) => {
  const [from, to] = dates
    .map((date) => (date instanceof Date ? date.valueOf() : date))
    .sort((a, b) => a - b);

  const changeYear = (date: Date, year: number) =>
    writeCalendarToken(date, "year", year, timezoneOffsetResolver(date));

  const readYear = (date: Date) =>
    readCalendarToken(date, "year", timezoneOffsetResolver(date));

  const changeMonth = (date: Date, monthIndex: number) =>
    writeCalendarToken(date, "month", monthIndex, timezoneOffsetResolver(date));

  const readMonth = (date: Date) =>
    readCalendarToken(date, "month", timezoneOffsetResolver(date));

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

  let cursor = new Date(from);

  if (config.years) {
    let next = new Date(cursor);
    const isOverflow = () => next.valueOf() > to;

    while (!isOverflow()) {
      next = changeYear(next, readYear(next) + 1);

      if (!isOverflow()) {
        cursor = next;
        next = new Date(cursor);
        result.years++;
      }
    }
  }

  if (config.months) {
    let next = new Date(cursor);
    const isOverflow = () => next.valueOf() > to;

    while (!isOverflow()) {
      next = changeMonth(next, readMonth(next) + 1);

      if (!isOverflow()) {
        cursor = next;
        next = new Date(cursor);
        result.months++;
      }
    }
  }

  let remainder = to - cursor.valueOf();
  for (const unit of STABLE_TIME_UNITS) {
    if (config[unit]) {
      result[unit] = Math.floor(remainder / relativeTimeUnitToMs(unit));
      remainder = remainder % relativeTimeUnitToMs(unit);
    }
  }

  return result;
};
