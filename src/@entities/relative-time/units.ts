import {
  YEAR,
  MONTH,
  WEEK,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
} from "@shared/time-primitives";

export const VARIABLE_TIME_UNITS = ["years", "months"] as const;
export const STABLE_TIME_UNITS = [
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
] as const;
export const RELATIVE_TIME_UNITS = [
  ...VARIABLE_TIME_UNITS,
  ...STABLE_TIME_UNITS,
] as const;

export type VariableTimeUnit = (typeof VARIABLE_TIME_UNITS)[number];
export type StableTimeUnit = (typeof STABLE_TIME_UNITS)[number];
export type RelativeTimeUnit = (typeof RELATIVE_TIME_UNITS)[number];

const UNIT_TO_MS = {
  years: YEAR, // approximated 365 days
  months: MONTH, // approximated to 30 days
  weeks: WEEK,
  days: DAY,
  hours: HOUR,
  minutes: MINUTE,
  seconds: SECOND,
  milliseconds: MILLISECOND,
} as const satisfies Record<RelativeTimeUnit, number>;

export const relativeTimeUnitToMs = (unit: RelativeTimeUnit) =>
  UNIT_TO_MS[unit];

export const isStableTimeUnit = (value: string): value is StableTimeUnit =>
  Array.prototype.includes.call(STABLE_TIME_UNITS, value);

export const isRelativeTimeUnit = (value: string): value is RelativeTimeUnit =>
  Array.prototype.includes.call(RELATIVE_TIME_UNITS, value);
