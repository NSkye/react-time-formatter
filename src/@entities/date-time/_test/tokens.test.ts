import { describe, expect, test } from "vitest";
import { CALENDAR_TOKENS, isCalendarToken } from "@entities/date-time";

describe("isCalendarToken consistent with CALENDAR_TOKENS", () => {
  test.each(CALENDAR_TOKENS)(
    'token "%s" should pass isCalendarToken',
    (token) => {
      expect(isCalendarToken(token)).toBe(true);
    },
  );

  test("non-calendar tokens return false", () => {
    expect(isCalendarToken("foo")).toBe(false);
    expect(isCalendarToken("time")).toBe(false);
    expect(isCalendarToken("")).toBe(false);
  });
});
