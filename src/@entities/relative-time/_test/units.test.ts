import { describe, expect, test } from "vitest";
import {
  RELATIVE_TIME_UNITS,
  RelativeTimeUnit,
  STABLE_TIME_UNITS,
  VARIABLE_TIME_UNITS,
  isRelativeTimeUnit,
  isStableTimeUnit,
  relativeTimeUnitToMs,
} from "@entities/relative-time";
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

describe("isRelativeTimeUnit consistent with RELATIVE_TIME_UNITS", () => {
  test.each(RELATIVE_TIME_UNITS)(
    'unit "%s" should pass isRelativeTimeUnit',
    (unit) => {
      expect(isRelativeTimeUnit(unit)).toBe(true);
    },
  );

  test("non-relative units return false", () => {
    expect(isRelativeTimeUnit("foo")).toBe(false);
    expect(isRelativeTimeUnit("time")).toBe(false);
    expect(isRelativeTimeUnit("")).toBe(false);
  });
});

describe("isStableTimeUnit consistent with STABLE_TIME_UNITS", () => {
  test.each(STABLE_TIME_UNITS)(
    'unit "%s" should pass isStableTimeUnit',
    (unit) => {
      expect(isStableTimeUnit(unit)).toBe(true);
    },
  );

  test.each(VARIABLE_TIME_UNITS)(
    'unit "%s" should not pass isStableTimeUnit',
    (unit) => {
      expect(isStableTimeUnit(unit)).toBe(false);
    },
  );

  test("non-stable units return false", () => {
    expect(isStableTimeUnit("foo")).toBe(false);
    expect(isStableTimeUnit("")).toBe(false);
  });
});

describe("relativeTimeUnitToMs returns correct values", () => {
  const expectations = {
    years: YEAR,
    months: MONTH,
    weeks: WEEK,
    days: DAY,
    hours: HOUR,
    minutes: MINUTE,
    seconds: SECOND,
    milliseconds: MILLISECOND,
  };

  test.each(Object.entries(expectations))(
    'unit "%s" should equal %d ms',
    (unit, expected) => {
      expect(relativeTimeUnitToMs(unit as RelativeTimeUnit)).toBe(expected);
    },
  );
});
