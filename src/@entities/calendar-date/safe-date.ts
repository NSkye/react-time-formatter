import { isValidTimestamp } from '@shared/numbers';

/**
 * Native date wrapper that enforces date to be
 * within valid timestamp bounds that are guaranteed
 * to be supported and accurately reflected when working
 * with date (between 1000 and 9999 years)
 */
export class SafeDate extends Date {
  safeDate: true;
  valid: boolean;

  constructor(baseDate: Date) {
    // const baseDate = Reflect.construct(Date, args);
    const valid = isValidTimestamp(baseDate.valueOf());
    super(valid ? baseDate : NaN);
    this.safeDate = true;
    this.valid = valid;
  }
}

const invalidDate = new Date(NaN);
export const createSafeDate = (date: Date) => new SafeDate(date);
export const createInvalidatedSafeDate = () => new SafeDate(invalidDate);
