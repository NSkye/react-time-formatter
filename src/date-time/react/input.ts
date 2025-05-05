import {
  CalendarDateBreakdownInput,
  SafeDate,
  createSafeDate,
  inferSafeDateFromCalendarDateBreakdown,
} from '@entities/calendar-date';

type Input = Date | CalendarDateBreakdownInput | string | number;

export const useNormalizedDateInput = (input: Input): SafeDate => {
  if (input instanceof Date) return createSafeDate(input);
  if (typeof input === 'number') return createSafeDate(new Date(input));
  if (typeof input === 'string') return createSafeDate(new Date(input));
  return inferSafeDateFromCalendarDateBreakdown(input);
};
