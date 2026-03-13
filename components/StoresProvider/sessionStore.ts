import { restorableStore } from "@/components/StoresProvider/restorableStore";
import { RestorableStore } from "@/components/StoresProvider/types";

export function sessionStore<
  D,
  V,
  A,
  S extends RestorableStore<D, V, A> = RestorableStore<D, V, A>,
>(name: string, store: S) {
  const cacheKey = `store-${name}`;

  return restorableStore<D, V, A>(
    name,
    store,
    () => JSON.parse(sessionStorage.getItem(cacheKey) || "null"),
    (val) => {
      sessionStorage.setItem(cacheKey, JSON.stringify(val));
    }
  );
}
