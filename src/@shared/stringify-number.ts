export const stringifyInteger = (value: number): [string, string, string] => [
  String(value),
  String(value).padStart(2, '0'),
  String(value).padStart(3, '0'),
];
