export type AtLeastOneKeyFrom<T> = {
  [K in keyof T]: Pick<T, K>;
}[keyof T] &
  Partial<T>;
