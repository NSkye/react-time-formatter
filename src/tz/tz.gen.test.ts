import { describe, expect, it } from 'vitest';

import Africa_Abidjan from '@/tz/Africa/Abidjan';
import Africa_Cairo from '@/tz/Africa/Cairo';
import Africa_Ceuta from '@/tz/Africa/Ceuta';
import Africa_Johannesburg from '@/tz/Africa/Johannesburg';
import Africa_Nairobi from '@/tz/Africa/Nairobi';
import Africa_Tunis from '@/tz/Africa/Tunis';
import America_Argentina_Buenos_Aires from '@/tz/America/Argentina/Buenos_Aires';
import America_Asuncion from '@/tz/America/Asuncion';
import America_Chicago from '@/tz/America/Chicago';
import America_Denver from '@/tz/America/Denver';
import America_La_Paz from '@/tz/America/La_Paz';
import America_Lima from '@/tz/America/Lima';
import America_Los_Angeles from '@/tz/America/Los_Angeles';
import America_New_York from '@/tz/America/New_York';
import America_Santiago from '@/tz/America/Santiago';
import America_Sao_Paulo from '@/tz/America/Sao_Paulo';
import Antarctica_Palmer from '@/tz/Antarctica/Palmer';
import Antarctica_Vostok from '@/tz/Antarctica/Vostok';
import Asia_Almaty from '@/tz/Asia/Almaty';
import Asia_Anadyr from '@/tz/Asia/Anadyr';
import Asia_Bangkok from '@/tz/Asia/Bangkok';
import Asia_Dhaka from '@/tz/Asia/Dhaka';
import Asia_Dubai from '@/tz/Asia/Dubai';
import Asia_Jerusalem from '@/tz/Asia/Jerusalem';
import Asia_Kabul from '@/tz/Asia/Kabul';
import Asia_Karachi from '@/tz/Asia/Karachi';
import Asia_Kathmandu from '@/tz/Asia/Kathmandu';
import Asia_Kolkata from '@/tz/Asia/Kolkata';
import Asia_Riyadh from '@/tz/Asia/Riyadh';
import Asia_Shanghai from '@/tz/Asia/Shanghai';
import Asia_Srednekolymsk from '@/tz/Asia/Srednekolymsk';
import Asia_Tehran from '@/tz/Asia/Tehran';
import Asia_Tokyo from '@/tz/Asia/Tokyo';
import Asia_Vladivostok from '@/tz/Asia/Vladivostok';
import Asia_Yangon from '@/tz/Asia/Yangon';
import Atlantic_Reykjavik from '@/tz/Atlantic/Reykjavik';
import Australia_Sydney from '@/tz/Australia/Sydney';
import Europe_Belgrade from '@/tz/Europe/Belgrade';
import Europe_Berlin from '@/tz/Europe/Berlin';
import Europe_Helsinki from '@/tz/Europe/Helsinki';
import Europe_Kaliningrad from '@/tz/Europe/Kaliningrad';
import Europe_London from '@/tz/Europe/London';
import Europe_Moscow from '@/tz/Europe/Moscow';
import Europe_Paris from '@/tz/Europe/Paris';
import Indian_Mahe from '@/tz/Indian/Mahe';
import Pacific_Auckland from '@/tz/Pacific/Auckland';
import Pacific_Honolulu from '@/tz/Pacific/Honolulu';

describe('All timezone modules', () => {
  it('America/New_York returns valid offset', () => {
    const offset = America_New_York(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/Chicago returns valid offset', () => {
    const offset = America_Chicago(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/Denver returns valid offset', () => {
    const offset = America_Denver(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/Los_Angeles returns valid offset', () => {
    const offset = America_Los_Angeles(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/Lima returns valid offset', () => {
    const offset = America_Lima(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/La_Paz returns valid offset', () => {
    const offset = America_La_Paz(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/Asuncion returns valid offset', () => {
    const offset = America_Asuncion(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/Santiago returns valid offset', () => {
    const offset = America_Santiago(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/Sao_Paulo returns valid offset', () => {
    const offset = America_Sao_Paulo(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('America/Argentina/Buenos_Aires returns valid offset', () => {
    const offset = America_Argentina_Buenos_Aires(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Atlantic/Reykjavik returns valid offset', () => {
    const offset = Atlantic_Reykjavik(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Europe/London returns valid offset', () => {
    const offset = Europe_London(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Europe/Berlin returns valid offset', () => {
    const offset = Europe_Berlin(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Europe/Belgrade returns valid offset', () => {
    const offset = Europe_Belgrade(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Europe/Paris returns valid offset', () => {
    const offset = Europe_Paris(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Europe/Kaliningrad returns valid offset', () => {
    const offset = Europe_Kaliningrad(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Europe/Helsinki returns valid offset', () => {
    const offset = Europe_Helsinki(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Europe/Moscow returns valid offset', () => {
    const offset = Europe_Moscow(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Jerusalem returns valid offset', () => {
    const offset = Asia_Jerusalem(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Riyadh returns valid offset', () => {
    const offset = Asia_Riyadh(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Tehran returns valid offset', () => {
    const offset = Asia_Tehran(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Dubai returns valid offset', () => {
    const offset = Asia_Dubai(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Kabul returns valid offset', () => {
    const offset = Asia_Kabul(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Karachi returns valid offset', () => {
    const offset = Asia_Karachi(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Kolkata returns valid offset', () => {
    const offset = Asia_Kolkata(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Kathmandu returns valid offset', () => {
    const offset = Asia_Kathmandu(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Dhaka returns valid offset', () => {
    const offset = Asia_Dhaka(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Yangon returns valid offset', () => {
    const offset = Asia_Yangon(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Bangkok returns valid offset', () => {
    const offset = Asia_Bangkok(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Shanghai returns valid offset', () => {
    const offset = Asia_Shanghai(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Tokyo returns valid offset', () => {
    const offset = Asia_Tokyo(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Vladivostok returns valid offset', () => {
    const offset = Asia_Vladivostok(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Srednekolymsk returns valid offset', () => {
    const offset = Asia_Srednekolymsk(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Anadyr returns valid offset', () => {
    const offset = Asia_Anadyr(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Asia/Almaty returns valid offset', () => {
    const offset = Asia_Almaty(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Africa/Abidjan returns valid offset', () => {
    const offset = Africa_Abidjan(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Africa/Tunis returns valid offset', () => {
    const offset = Africa_Tunis(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Africa/Ceuta returns valid offset', () => {
    const offset = Africa_Ceuta(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Africa/Johannesburg returns valid offset', () => {
    const offset = Africa_Johannesburg(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Africa/Cairo returns valid offset', () => {
    const offset = Africa_Cairo(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Africa/Nairobi returns valid offset', () => {
    const offset = Africa_Nairobi(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Indian/Mahe returns valid offset', () => {
    const offset = Indian_Mahe(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Australia/Sydney returns valid offset', () => {
    const offset = Australia_Sydney(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Pacific/Auckland returns valid offset', () => {
    const offset = Pacific_Auckland(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Pacific/Honolulu returns valid offset', () => {
    const offset = Pacific_Honolulu(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Antarctica/Vostok returns valid offset', () => {
    const offset = Antarctica_Vostok(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  it('Antarctica/Palmer returns valid offset', () => {
    const offset = Antarctica_Palmer(new Date());
    expect(typeof offset).toBe('number');
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });
});
