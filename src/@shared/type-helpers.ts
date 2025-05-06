export type AtLeastOneKeyFrom<T> = {
  [K in keyof T]: Pick<T, K>;
}[keyof T] &
  Partial<T>;

export type ChildrenOrRender<PropType, ChildrenType> =
  | (PropType & { children: ChildrenType; render?: never })
  | (PropType & { render: ChildrenType; children?: never });
