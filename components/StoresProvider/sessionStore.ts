import { restorableSsrStore } from "@/components/StoresProvider/restorableSsrStore";
import { RestorableSSRStore } from "@/components/StoresProvider/types";

export function sessionStore<
  D,
  V,
  A,
  C = V,
  S extends RestorableSSRStore<D, V, A, C> = RestorableSSRStore<D, V, A, C>,
>(name: string, store: S) {
  const cacheKey = `store-${name}`;

  return restorableSsrStore<D, V, A, C>(
    name,
    store,
    () => JSON.parse(sessionStorage.getItem(cacheKey) || "null"),
    (val) => {
      sessionStorage.setItem(cacheKey, JSON.stringify(val));
    }
  );
}
