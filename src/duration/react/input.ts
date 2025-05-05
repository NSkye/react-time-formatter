import {
  relativeTimeBreakdownToMilliseconds,
  validateRelativeTimstamp,
} from '@entities/relative-time';

export const useNormalizedDurationInput = (value: unknown): number => {
  if (typeof value === 'number') return validateRelativeTimstamp(value);

  // All other entities attempt to safely parse
  return relativeTimeBreakdownToMilliseconds(value);
};
