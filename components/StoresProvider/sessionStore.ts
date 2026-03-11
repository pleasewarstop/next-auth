import { InferFirstArg, Store } from "@/components/StoresProvider/types";

export function sessionStore<T, A, S extends Store<T & A> = Store<T & A>>(
  store: S
) {
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

  return wrappedStore as Store<T & A>;
}

export const getStoreSession = <S extends Store>(store: S) => {
  const data = JSON.parse(sessionStorage.getItem(cacheKey(store)) || "null");
  return data;
};

export const cacheKey = <S extends Store>(store: S) => store.name;
