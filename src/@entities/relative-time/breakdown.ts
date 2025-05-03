import {
  RELATIVE_TIME_UNITS,
  RelativeTimeUnit,
  relativeTimeUnitToMs,
} from "./units";

/**
 * Base entities
 */

export type RelativeTimeBreakdown = Record<RelativeTimeUnit, number>;
export type RelativeTimeConfig = Record<keyof RelativeTimeBreakdown, boolean>;

/**
 * Output superset
 */

export type RelativeTimeTotals = {
  totalYears: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalMilliseconds: number;
};
export type RelativeTimeBreakdownOutput = RelativeTimeBreakdown &
  RelativeTimeTotals;

/**
 * Input subset
 */

export type RelativeTimeBreakdownInput = Partial<RelativeTimeBreakdown>;

/** Normalizers */

export const normalizeRelativeTimeBreakdown = (
  breakdown: RelativeTimeBreakdownInput,
): RelativeTimeBreakdown => {
  const entries = RELATIVE_TIME_UNITS.map(
    (unit) =>
      [
        unit,
        typeof breakdown[unit] === "number" ? breakdown[unit] : 0,
      ] satisfies [RelativeTimeUnit, number],
  );

  return Object.fromEntries(entries) as RelativeTimeBreakdown;
};

export const normalizeRelativeTimeConfig = (
  config: RelativeTimeConfig,
): RelativeTimeConfig => {
  // 1. Among enabled units find unit of the lowest rank
  // 2. Enable all units with a rank lower than his
  //
  // Doesn't affect calculation results but makes it very predictable
  // and enables lazy evaluation option

  let smallestUnitIndex = null;
  for (let i = 0; i < RELATIVE_TIME_UNITS.length; i++) {
    const unit = RELATIVE_TIME_UNITS[i];
    if (config[unit]) smallestUnitIndex = i;
  }

  if (smallestUnitIndex === null) return config;
  if (smallestUnitIndex + 1 >= RELATIVE_TIME_UNITS.length) return config;

  const normalized = { ...config };

  for (let i = smallestUnitIndex + 1; i < RELATIVE_TIME_UNITS.length; i++) {
    const unit = RELATIVE_TIME_UNITS[i];
    normalized[unit] = true;
  }

  return normalized;
};

/** Comparisons */

export const relativeTimeBreakdownsAreEqual = (
  breakdownA:
    | RelativeTimeBreakdown
    | RelativeTimeBreakdownOutput
    | RelativeTimeBreakdownInput,
  breakdownB:
    | RelativeTimeBreakdown
    | RelativeTimeBreakdownOutput
    | RelativeTimeBreakdownInput,
) => {
  if (
    Object.prototype.hasOwnProperty.call(breakdownA, "totalMilliseconds") &&
    Object.prototype.hasOwnProperty.call(breakdownB, "totalMilliseconds")
  )
    return (
      (breakdownA as RelativeTimeBreakdownOutput).totalMilliseconds ===
      (breakdownB as RelativeTimeBreakdownOutput).totalMilliseconds
    );

  for (const unit of RELATIVE_TIME_UNITS) {
    if ((breakdownA[unit] ?? 0) !== (breakdownB[unit] ?? 0)) return false;
  }

  return true;
};

/** Conversions */

export const relativeTimeBreakdownToMilliseconds = (
  breakdown:
    | RelativeTimeBreakdown
    | RelativeTimeBreakdownOutput
    | RelativeTimeBreakdownInput,
) => {
  if (Object.prototype.hasOwnProperty.call(breakdown, "totalMilliseconds")) {
    return (breakdown as RelativeTimeBreakdownOutput).totalMilliseconds;
  }

  let sum = 0;
  for (const unit of RELATIVE_TIME_UNITS) {
    const value = breakdown[unit] ?? 0;
    const multiplier = relativeTimeUnitToMs(unit);
    sum += value * multiplier;
  }

  return sum;
};
