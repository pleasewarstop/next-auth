import {
  RestorableStore,
  InferFirstArg,
  Store,
} from "@/components/StoresProvider/types";

export function sessionStore<
  D,
  V,
  A,
  S extends RestorableStore<D, V, A> = RestorableStore<D, V, A>,
>(store: S) {
  const ref = {
    [store.name]: (arg: InferFirstArg<S>) => {
      if (typeof sessionStorage === "undefined") return store(arg);

      const key = cacheKey(store);
      const storeInstance = store(arg);

      storeInstance.subscribe((val) => {
        sessionStorage.setItem(key, JSON.stringify(val));
      });

      return storeInstance;
    },
  } as Record<string, Store>;

  const wrappedStore = ref[store.name];

  return wrappedStore as RestorableStore<V, A>;
}

export const getStoreSession = <S extends Store>(store: S) => {
  if (typeof window === "undefined") return null;
  const data = JSON.parse(sessionStorage.getItem(cacheKey(store)) || "null");
  return data;
};

export const cacheKey = <S extends Store>(store: S) => store.name;
