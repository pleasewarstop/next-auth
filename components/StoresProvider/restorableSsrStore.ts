import { RestorableSSRStore } from "@/components/StoresProvider/types";
import { ssrStore } from "./ssrStore";

const cacheGetters: Record<string, any> = {};

export const getStoreCache = (name: string) =>
  typeof window === "undefined" || !cacheGetters[name]
    ? null
    : cacheGetters[name]();

export function restorableSsrStore<
  D,
  V,
  A,
  S extends RestorableSSRStore<D, V, A> = RestorableSSRStore<D, V, A>,
>(
  name: string,
  store: S,
  getCache: () => V,
  subscribe: (value: V & A) => void
) {
  const wrappedStore: RestorableSSRStore<D, V, A> = (arg) => {
    const storeInstance = store(arg);
    if (typeof window === "undefined") return storeInstance;

    cacheGetters[name] = getCache;
    storeInstance.subscribe(subscribe);

    return storeInstance;
  };

  return ssrStore<D, V & A>(name, wrappedStore);
}
