export const stringifyNumber = (value: number, pad: number[] = [1, 2]) =>
  pad.map(padSize => String(value).padStart(padSize, '0'));
