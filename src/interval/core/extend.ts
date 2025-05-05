import {
  RELATIVE_TIME_UNITS,
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  RelativeTimeUnit,
} from '@entities/relative-time';
import { TimezoneOffsetResolver } from '@entities/timezone';

import { stringifyInteger } from '@shared/stringify-integer';
import { DAY, HOUR, MILLISECOND, MINUTE, SECOND, WEEK } from '@shared/time-primitives';

import { calendarDistance } from './calendar-distance';

export const TOTALS_ALIASES = [
  'totalYears',
  'totalMonths',
  'totalWeeks',
  'totalDays',
  'totalHours',
  'totalMinutes',
  'totalSeconds',
  'totalMilliseconds',
] as const;

export const FORMAT_ALIASES = [
  'Y',
  'YY',
  'M',
  'MM',
  'W',
  'WW',
  'D',
  'DD',
  'H',
  'HH',
  'm',
  'mm',
  's',
  'ss',
  'SSS',
] as const;

export type TotalsAlias = (typeof TOTALS_ALIASES)[number];
export type FormatAlias = (typeof FORMAT_ALIASES)[number];

export const ALIAS_TO_UNIT = {
  Y: 'years',
  YY: 'years',
  M: 'months',
  MM: 'months',
  W: 'weeks',
  WW: 'weeks',
  D: 'days',
  DD: 'days',
  H: 'hours',
  HH: 'hours',
  m: 'minutes',
  mm: 'minutes',
  s: 'seconds',
  ss: 'seconds',
  SSS: 'milliseconds',
} satisfies Record<FormatAlias, RelativeTimeUnit>;

export type IntervalOutput = RelativeTimeBreakdown &
  Record<TotalsAlias, number> &
  Record<FormatAlias, string>;
export type IntervalAccessed = Record<keyof IntervalOutput, boolean>;

export const breakdownToOutput = (
  fromTo: [Date, Date],
  breakdown: RelativeTimeBreakdown,
  timezoneOffsetResolver: TimezoneOffsetResolver
): IntervalOutput => {
  const [from, to] = fromTo;
  const output: Partial<IntervalOutput> = { ...breakdown };

  [output.Y, output.YY] = stringifyInteger(breakdown.years);
  [output.M, output.MM] = stringifyInteger(breakdown.months);
  [output.W, output.WW] = stringifyInteger(breakdown.weeks);
  [output.D, output.DD] = stringifyInteger(breakdown.days);
  [output.H, output.HH] = stringifyInteger(breakdown.hours);
  [output.m, output.mm] = stringifyInteger(breakdown.minutes);
  [output.s, output.ss] = stringifyInteger(breakdown.seconds);
  [output.SSS, output.SSS] = stringifyInteger(breakdown.milliseconds);

  [output.totalYears] = calendarDistance(fromTo, 'year', timezoneOffsetResolver);
  [output.totalMonths] = calendarDistance(fromTo, 'month', timezoneOffsetResolver);

  output.totalWeeks = Math.floor(to.valueOf() - from.valueOf() / WEEK);
  output.totalDays = Math.floor(to.valueOf() - from.valueOf() / DAY);
  output.totalHours = Math.floor(to.valueOf() - from.valueOf() / HOUR);
  output.totalMinutes = Math.floor(to.valueOf() - from.valueOf() / MINUTE);
  output.totalSeconds = Math.floor(to.valueOf() - from.valueOf() / SECOND);
  output.totalMilliseconds = Math.floor(to.valueOf() - from.valueOf() / MILLISECOND);

  return output as IntervalOutput;
};

export const accessedToConfig = (accessed: IntervalAccessed): RelativeTimeConfig => {
  const config: Partial<RelativeTimeConfig> = {};

  // units that were accessed directly
  for (const unit of RELATIVE_TIME_UNITS) config[unit] = accessed[unit];

  // units that were accessed with aliases
  for (const alias of FORMAT_ALIASES) {
    if (accessed[alias] === true) {
      config[ALIAS_TO_UNIT[alias]] = true;
    }
  }

  return config as RelativeTimeConfig;
};

export const generateInvalidatedOutput = () => {
  const numericals = [...RELATIVE_TIME_UNITS, ...TOTALS_ALIASES].map(key => [key, NaN]);
  const strings = FORMAT_ALIASES.map(key => [key, `${key}-Invalid`]);

  return Object.fromEntries([...numericals, ...strings]) as IntervalOutput;
};
