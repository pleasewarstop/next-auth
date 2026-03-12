import {
  RestorableStore,
  InferFirstArg,
  Store,
} from "@/components/StoresProvider/types";

const cacheGetters: Record<string, any> = {};

export const getStoreCache = <S extends Store>(store: S) =>
  typeof window === "undefined" || !cacheGetters[store.name]
    ? null
    : cacheGetters[store.name]();

export function restorableStore<
  D,
  V,
  A,
  S extends RestorableStore<D, V, A> = RestorableStore<D, V, A>,
>(store: S, getCache: () => V, subscribe: (value: V & A) => void) {
  const ref = {
    [store.name]: (arg: InferFirstArg<S>) => {
      const storeInstance = store(arg);
      if (typeof window === "undefined") return storeInstance;

      cacheGetters[store.name] = getCache;
      storeInstance.subscribe(subscribe);

      return storeInstance;
    },
  } as Record<string, Store>;

  const wrappedStore = ref[store.name];

  return wrappedStore as RestorableStore<D, V, A>;
}
