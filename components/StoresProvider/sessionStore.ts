import { restorableSsrStore } from "@/components/StoresProvider/restorableSsrStore";
import { RestorableSSRStore } from "@/components/StoresProvider/types";

export function sessionStore<
  D,
  V,
  A,
  S extends RestorableSSRStore<D, V, A, V> = RestorableSSRStore<D, V, A, V>,
>(name: string, store: S) {
  const cacheKey = `store-${name}`;

  return restorableSsrStore<D, V, A, V>(
    name,
    store,
    () => JSON.parse(sessionStorage.getItem(cacheKey) || "null"),
    (val) => {
      sessionStorage.setItem(cacheKey, JSON.stringify(val));
    }
  );
}
