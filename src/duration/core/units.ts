import {
  RELATIVE_TIME_UNITS,
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  RelativeTimeUnit,
} from '@entities/relative-time';

import { stringifyNumber } from '@shared/stringify-number';
import { DAY, HOUR, MILLISECOND, MINUTE, MONTH, SECOND, WEEK, YEAR } from '@shared/time-primitives';

export const TOTALS = [
  'totalYears',
  'totalMonths',
  'totalWeeks',
  'totalDays',
  'totalHours',
  'totalMinutes',
  'totalSeconds',
  'totalMilliseconds',
] as const;

export const FORMATTING_ALIASES = [
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

export type TotalUnit = (typeof TOTALS)[number];
export type FormattingAlias = (typeof FORMATTING_ALIASES)[number];

export type AliasesExtension = Record<FormattingAlias, string>;
export type TotalsExtension = Record<TotalUnit, number>;

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
} satisfies Record<FormattingAlias, RelativeTimeUnit>;

export type DurationBreakdownOutput = RelativeTimeBreakdown & AliasesExtension & TotalsExtension;
export type DurationOutputAccessed = Record<keyof DurationBreakdownOutput, boolean>;

export const extendBreakdown = (
  ms: number,
  breakdown: RelativeTimeBreakdown
): DurationBreakdownOutput => {
  const extended: Partial<DurationBreakdownOutput> = { ...breakdown };

  [extended.Y, extended.YY] = stringifyNumber(breakdown.years);
  [extended.M, extended.MM] = stringifyNumber(breakdown.months);
  [extended.W, extended.WW] = stringifyNumber(breakdown.weeks);
  [extended.D, extended.DD] = stringifyNumber(breakdown.days);
  [extended.H, extended.HH] = stringifyNumber(breakdown.hours);
  [extended.m, extended.mm] = stringifyNumber(breakdown.minutes);
  [extended.s, extended.ss] = stringifyNumber(breakdown.seconds);
  [extended.SSS, extended.SSS] = stringifyNumber(breakdown.milliseconds);

  extended.totalYears = Math.floor(ms / YEAR);
  extended.totalMonths = Math.floor(ms / MONTH);
  extended.totalWeeks = Math.floor(ms / WEEK);
  extended.totalDays = Math.floor(ms / DAY);
  extended.totalHours = Math.floor(ms / HOUR);
  extended.totalMinutes = Math.floor(ms / MINUTE);
  extended.totalSeconds = Math.floor(ms / SECOND);
  extended.totalMilliseconds = Math.floor(ms / MILLISECOND);

  return extended as DurationBreakdownOutput;
};

export const configFromAccessed = (accessed: DurationOutputAccessed): RelativeTimeConfig => {
  const config: Partial<RelativeTimeConfig> = {};

  // copy all explicitly accessed values
  for (const unit of RELATIVE_TIME_UNITS) {
    config[unit] = accessed[unit];
  }

  // copy from aliases
  for (const alias of FORMATTING_ALIASES) {
    const unit = ALIAS_TO_UNIT[alias];

    if (accessed[alias] === true) {
      config[unit] = true;
    }
  }

  return config as RelativeTimeConfig;
};
