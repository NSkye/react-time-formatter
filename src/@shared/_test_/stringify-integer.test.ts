import { describe } from 'vitest';

import { stringifyInteger } from '@shared/stringify-integer';

describe('stringifyInteger', () => {
  test.each([
    [0, ['0', '00', '000', '0000']],
    [-0, ['0', '00', '000', '0000']],
    [5, ['5', '05', '005', '0005']],
    [-5, ['-5', '-05', '-005', '-0005']],
    [25, ['25', '25', '025', '0025']],
    [-25, ['-25', '-25', '-025', '-0025']],
    [100, ['100', '100', '100', '0100']],
    [-125, ['-125', '-125', '-125', '-0125']],
  ])('stringifies integers %s correctly', (value, expected) => {
    expect([...stringifyInteger(value as unknown as number)]).toEqual(expected);
  });

  test.each([
    [0.25, ['0', '00', '000', '0000']],
    [-0.25, ['0', '00', '000', '0000']],
    [5.25, ['5', '05', '005', '0005']],
    [-5.25, ['-5', '-05', '-005', '-0005']],
    [25.25, ['25', '25', '025', '0025']],
    [-25.1, ['-25', '-25', '-025', '-0025']],
    [100.99, ['100', '100', '100', '0100']],
    [-125.123, ['-125', '-125', '-125', '-0125']],
  ])('trucates fractional part: %s', (value, expected) => {
    expect([...stringifyInteger(value as unknown as number)]).toEqual(expected);
  });

  test.each([
    [{}, ['#', '##', '###', '####']],
    [() => {}, ['#', '##', '###', '####']],
    [null, ['#', '##', '###', '####']],
    [undefined, ['#', '##', '###', '####']],
    ['ABC', ['#', '##', '###', '####']],
    [Symbol(), ['#', '##', '###', '####']],
    [NaN, ['#', '##', '###', '####']],
    [Infinity, ['#', '##', '###', '####']],
    [-Infinity, ['#', '##', '###', '####']],
  ])('falls back to # on junk inputs: %s', (value, expected) => {
    expect([...stringifyInteger(value as unknown as number)]).toEqual(expected);
  });
});
