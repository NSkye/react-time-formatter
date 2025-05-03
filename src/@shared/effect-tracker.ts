type OnDispatch<T> = (payload: T) => void;
type RunInScope = <R>(fn: () => R) => R;

interface ScopedEffectTracker<T> {
  createScope(onDispatch: OnDispatch<T>): RunInScope;
  dispatch(payload: T): void;
}

export const createSyncEffectTracker = <T>(): ScopedEffectTracker<T> => {
  const scopes: Array<OnDispatch<T>> = [];
  const pushScope = (onDispatch: OnDispatch<T>) => scopes.push(onDispatch);
  const popScope = () => scopes.pop();

  const dispatch: ScopedEffectTracker<T>["dispatch"] = (payload) => {
    if (!scopes.length) return;
    scopes.at(-1)?.(payload);
  };

  const createScope: ScopedEffectTracker<T>["createScope"] =
    (onDispatch) => (fn) => {
      pushScope(onDispatch);
      const result = fn();
      popScope();
      return result;
    };

  return {
    createScope,
    dispatch,
  };
};
