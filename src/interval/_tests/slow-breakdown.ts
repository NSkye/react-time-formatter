import { SafeDate, createSafeDate } from '../../@entities/calendar-date';
import {
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  STABLE_TIME_UNITS,
  relativeTimeUnitToMs,
} from '../../@entities/relative-time';
import { TimezoneOffsetResolver } from '../../@entities/timezone';
import { calendarDistance } from '../core/calendar-distance';

const DEOPTIMIZED_breakdownInterval = (
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

//
// Create test cases results
//
const tests = [
  ['Regular leap year jump', '2020-02-29T00:00:00Z', '2021-02-28T00:00:00Z'],
  ['Fake leap year (1900 is not leap)', '1896-02-29T00:00:00Z', '1900-02-28T00:00:00Z'],
  ['Real century leap year (2000 is leap)', '1996-02-29T00:00:00Z', '2000-02-29T00:00:00Z'],
  ['Crossing leap cycle', '1999-01-01T00:00:00Z', '2004-01-01T00:00:00Z'],
  ['Exact 400-year jump', '1600-01-01T00:00:00Z', '2000-01-01T00:00:00Z'],
  ['Pre-leap full year', '2022-03-01T00:00:00Z', '2023-03-01T00:00:00Z'],
  ['Reverse chronological order', '2023-01-01T00:00:00Z', '2000-01-01T00:00:00Z'],
  ['High-end precision edge', '9998-12-31T00:00:00Z', '9999-12-31T00:00:00Z'],
  ['Earliest supported range test', '1000-01-01T00:00:00Z', '1004-01-01T00:00:00Z'],
  ['Same date zero-diff', '2020-01-01T00:00:00Z', '2020-01-01T00:00:00Z'],
  ['Leap second-ish range', '2000-01-01T23:59:59Z', '2000-01-02T00:00:01Z'],
];

export const deoptimizedTestCases = tests.map(([title, from, to]) => {
  const fromDate = createSafeDate(new Date(from));
  const toDate = createSafeDate(new Date(to));

  const yearsMonthsDaysBreakdown = DEOPTIMIZED_breakdownInterval(
    [fromDate, toDate],
    {
      years: true,
      months: true,
      weeks: false,
      days: true,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: false,
    },
    () => 0
  );

  const daysBreakdown = DEOPTIMIZED_breakdownInterval(
    [fromDate, toDate],
    {
      years: false,
      months: false,
      weeks: false,
      days: true,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: false,
    },
    () => 0
  );

  return { title, from, to, yearsMonthsDaysBreakdown, daysBreakdown };
});
