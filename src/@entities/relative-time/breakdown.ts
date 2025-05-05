import { isValidNumber } from '@shared/numbers';
import { AtLeastOneKeyFrom } from '@shared/type-helpers';

import { RELATIVE_TIME_UNITS, RelativeTimeUnit, relativeTimeUnitToMs } from './units';

/**
 * Base entities
 */

export type RelativeTimeBreakdown = Record<RelativeTimeUnit, number>;
export type RelativeTimeConfig = Record<keyof RelativeTimeBreakdown, boolean>;

/**
 * Input subset
 */

export type RelativeTimeBreakdownInput = AtLeastOneKeyFrom<RelativeTimeBreakdown>;

/** Normalizers */

/**
 * Returns either valid relative timestamp or NaN
 * @param value
 * @returns
 */
export const validateRelativeTimstamp = (value: unknown): number => {
  if (!isValidNumber(value)) return NaN;
  const truncated = Math.trunc(value);
  if (!Number.isSafeInteger(truncated)) return NaN;
  return truncated;
};

export const normalizeRelativeTimeBreakdown = (
  breakdown: RelativeTimeBreakdownInput
): RelativeTimeBreakdown => {
  const entries = RELATIVE_TIME_UNITS.map(
    unit =>
      [unit, typeof breakdown[unit] === 'number' ? breakdown[unit] : 0] satisfies [
        RelativeTimeUnit,
        number,
      ]
  );

  return Object.fromEntries(entries) as RelativeTimeBreakdown;
};

export const normalizeRelativeTimeConfig = (config: RelativeTimeConfig): RelativeTimeConfig => {
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
  breakdownA: RelativeTimeBreakdown | RelativeTimeBreakdownInput,
  breakdownB: RelativeTimeBreakdown | RelativeTimeBreakdownInput
) => {
  for (const unit of RELATIVE_TIME_UNITS) {
    if ((breakdownA[unit] ?? 0) !== (breakdownB[unit] ?? 0)) return false;
  }

  return true;
};

/** Conversions */

export const relativeTimeBreakdownToMilliseconds = (input: unknown): number => {
  if (typeof input !== 'object') return NaN;
  if (input === null) return NaN;

  // treat object as input
  const breakdown = input as RelativeTimeBreakdownInput;

  let sum = 0;
  let hasAnyUnitKey = false;
  for (const unit of RELATIVE_TIME_UNITS) {
    if (!Object.prototype.hasOwnProperty.call(breakdown, unit)) {
      continue;
    }

    hasAnyUnitKey = true;

    const value = breakdown[unit] ?? 0;

    if (!isValidNumber(value)) return NaN;

    const truncatedValue = Math.trunc(value);
    if (!Number.isSafeInteger(truncatedValue)) return NaN;

    // safeguard against negative zero
    const normalizedValue = truncatedValue === 0 ? 0 : truncatedValue;

    const multiplier = relativeTimeUnitToMs(unit);
    sum += normalizedValue * multiplier;
  }

  // If no single unit was present, treat input as an arbitrary foreign object
  if (!hasAnyUnitKey) return NaN;

  if (!Number.isSafeInteger(sum)) return NaN;

  return sum;
};
