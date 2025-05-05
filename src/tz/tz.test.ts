import GMT from '@/tz/GMT';
import Local from '@/tz/Local';
import UTC from '@/tz/UTC';
import { createTimezone } from '@/tz/createTimezone';

describe('Default timezone modules', () => {
  it('UTC returns valid offset', () => {
    const offset = UTC();
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('GMT returns valid offset', () => {
    const offset = GMT();
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Local returns valid offset', () => {
    const offset = Local(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });
});

describe('Timezone factory', () => {
  it('Creates valid UTC timezone', () => {
    const offset = createTimezone('UTC')(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).not.toBeNaN();
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Creates valid IANA timezone', () => {
    const offset = createTimezone('Asia/Istanbul')(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).not.toBeNaN();
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Creates invalid timezone that resolves to NaN offset', () => {
    const offset = createTimezone('Ayy/Lmao')(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeNaN();
  });
});
