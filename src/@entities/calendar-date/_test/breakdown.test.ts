import {
  inferSafeDateFromCalendarDateBreakdown,
  isValidCalendarDateBreakdown,
} from '@entities/calendar-date/breakdown';

describe('inferSafeDateFromCalendarDateBreakdown', () => {
  test('constructs correct local date', () => {
    const d = inferSafeDateFromCalendarDateBreakdown({
      year: 2025,
      month: 4,
      date: 20,
      hours: 10,
      minutes: 30,
    });

    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(3); // April is 3
    expect(d.getDate()).toBe(20);
  });

  test('constructs correct UTC date', () => {
    const d = inferSafeDateFromCalendarDateBreakdown({
      year: 2025,
      month: 4,
      date: 20,
      hours: 10,
      minutes: 30,
      timezoneOffset: 0,
    });

    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth()).toBe(3);
    expect(d.getUTCDate()).toBe(20);
    expect(d.getUTCHours()).toBe(10);
  });

  test('applies custom numeric timezone offset', () => {
    const d = inferSafeDateFromCalendarDateBreakdown({
      year: 2025,
      month: 4,
      date: 20,
      hours: 10,
      minutes: 0,
      timezoneOffset: -60,
    });

    expect(d.getUTCHours()).toBe(9);
  });

  test('custom numeric timezone offset is consistent with Date.prototype.getTimezoneOffset', () => {
    /**
     * Not bulletproof against running test in timezone matching UTC.
     * But we can't gaslight computer into thinking of a different timezone from here, sadly.
     */
    const localDate = new Date();

    const d = inferSafeDateFromCalendarDateBreakdown({
      // apply offset as specified by date
      timezoneOffset: localDate.getTimezoneOffset(),

      year: localDate.getFullYear(),
      // 1-indexed month
      month: localDate.getMonth() + 1,
      date: localDate.getDate(),
      hours: localDate.getHours(),
      minutes: localDate.getMinutes(),
      seconds: localDate.getSeconds(),
      milliseconds: localDate.getMilliseconds(),
    });

    expect(d.valueOf()).toBe(localDate.valueOf());
  });

  test('creates invalidated safe date from unsafe input', () => {
    const d = inferSafeDateFromCalendarDateBreakdown({
      year: 10000,
      timezoneOffset: 0,
    });

    expect(d.getUTCHours()).toBeNaN();
  });

  test('creates invalidated safe date from gibberish input', () => {
    const d = inferSafeDateFromCalendarDateBreakdown('foo');
    expect(d.getUTCHours()).toBeNaN();
  });
});

describe('isValidCalendarDateBreakdown', () => {
  test.each([
    { year: 2025 },
    { year: 2025, month: 10 },
    { year: 2025, month: 10, date: 12 },
    { year: 2025, month: 10, date: 12, hours: 15 },
    { year: 2025, month: 10, date: 12, hours: 15, minutes: 15, seconds: 15, milliseconds: 10 },
  ])('defining sensible dates resolves to true', date => {
    expect(isValidCalendarDateBreakdown(date)).toBe(true);
  });

  test.each([
    // UTC
    { year: 2025, timezoneOffset: 0 },
    // Local
    { year: 2025 },
    { year: 2025, timezoneOffset: +180 },
    { year: 2025, timezoneOffset: -180 },
  ])('correctly asserts timezone offset', date => {
    expect(isValidCalendarDateBreakdown(date)).toBe(true);
  });

  test.each([
    { year: 2025, timezoneOffset: +841 },
    { year: 2025, timezoneOffset: -841 },
  ])('correctly invalidates on invalid timezoneOffset', date => {
    expect(isValidCalendarDateBreakdown(date)).toBe(false);
  });

  test.each([
    { milliseconds: 10 },
    { milliseconds: 10, seconds: 15 },
    { milliseconds: 10, seconds: 15, minutes: 15 },
    { milliseconds: 10, seconds: 15, minutes: 15, year: 2025 },
  ])('defining dates in nonsensical ways  resolves to false', date => {
    expect(isValidCalendarDateBreakdown(date)).toBe(false);
  });

  test.each([
    { year: NaN },
    { year: 2025, month: {} },
    { year: 2025, month: -Infinity },
    { year: 2025, month: Infinity, date: 12 },
    { year: 2025, month: 10, date: null, hours: 15 },
    {
      year: 2025,
      month: undefined,
      date: 12,
      hours: 15,
      minutes: 15,
      seconds: 15,
      milliseconds: 10,
    },
    { year: 2025, timezoneOffset: NaN },
    { year: 2025, timezoneOffset: Infinity },
    { year: 2025, timezoneOffset: -Infinity },
    { year: 2025, timezoneOffset: null },
  ])('having junk in date-token fileds resolves to false', date => {
    expect(isValidCalendarDateBreakdown(date)).toBe(false);
  });

  test.each([() => {}, 10, null, NaN, undefined])(
    'passing entirely wrong type resolves to false',
    date => {
      expect(isValidCalendarDateBreakdown(date)).toBe(false);
    }
  );
});
