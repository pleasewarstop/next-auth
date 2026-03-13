import { restorableSsrStore } from "@/components/StoresProvider/restorableSsrStore";
import { RestorableSSRStore } from "@/components/StoresProvider/types";

export function sessionSsrStore<
  D,
  V,
  A,
  S extends RestorableSSRStore<D, V, A> = RestorableSSRStore<D, V, A>,
>(name: string, store: S) {
  const cacheKey = `store-${name}`;

  return restorableSsrStore<D, V, A>(
    name,
    store,
    () => JSON.parse(sessionStorage.getItem(cacheKey) || "null"),
    (val) => {
      sessionStorage.setItem(cacheKey, JSON.stringify(val));
    }
  );
}
