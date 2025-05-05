import {
  RELATIVE_TIME_UNITS,
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  RelativeTimeUnit,
} from '@entities/relative-time';

import { stringifyInteger } from '@shared/stringify-integer';
import { DAY, HOUR, MILLISECOND, MINUTE, MONTH, SECOND, WEEK, YEAR } from '@shared/time-primitives';

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

export type DurationOutput = RelativeTimeBreakdown &
  Record<TotalsAlias, number> &
  Record<FormatAlias, string>;
export type DurationAccessed = Record<keyof DurationOutput, boolean>;

export const breakdownToOutput = (ms: number, breakdown: RelativeTimeBreakdown): DurationOutput => {
  const output: Partial<DurationOutput> = { ...breakdown };

  [output.Y, output.YY] = stringifyInteger(breakdown.years);
  [output.M, output.MM] = stringifyInteger(breakdown.months);
  [output.W, output.WW] = stringifyInteger(breakdown.weeks);
  [output.D, output.DD] = stringifyInteger(breakdown.days);
  [output.H, output.HH] = stringifyInteger(breakdown.hours);
  [output.m, output.mm] = stringifyInteger(breakdown.minutes);
  [output.s, output.ss] = stringifyInteger(breakdown.seconds);
  [, , output.SSS] = stringifyInteger(breakdown.milliseconds);

  output.totalYears = Math.trunc(ms / YEAR);
  output.totalMonths = Math.trunc(ms / MONTH);
  output.totalWeeks = Math.trunc(ms / WEEK);
  output.totalDays = Math.trunc(ms / DAY);
  output.totalHours = Math.trunc(ms / HOUR);
  output.totalMinutes = Math.trunc(ms / MINUTE);
  output.totalSeconds = Math.trunc(ms / SECOND);
  output.totalMilliseconds = Math.trunc(ms / MILLISECOND);

  return output as DurationOutput;
};

export const accessedToConfig = (accessed: DurationAccessed): RelativeTimeConfig => {
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
