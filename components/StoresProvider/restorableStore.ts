import { RestorableStore } from "@/components/StoresProvider/types";
import { store as storeBase } from "./store";

const cacheGetters: Record<string, any> = {};

export const getStoreCache = (name: string) =>
  typeof window === "undefined" || !cacheGetters[name]
    ? null
    : cacheGetters[name]();

export function restorableStore<
  D,
  V,
  A,
  S extends RestorableStore<D, V, A> = RestorableStore<D, V, A>,
>(
  name: string,
  store: S,
  getCache: () => V,
  subscribe: (value: V & A) => void
) {
  const wrappedStore: RestorableStore<D, V, A> = (arg) => {
    const storeInstance = store(arg);
    if (typeof window === "undefined") return storeInstance;

    cacheGetters[name] = getCache;
    storeInstance.subscribe(subscribe);

    return storeInstance;
  };

  return storeBase<D, V & A>(name, wrappedStore);
}
