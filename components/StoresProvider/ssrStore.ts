import {
  GetSSRDiff,
  SSRStore,
  StoreCreator,
} from "@/components/StoresProvider/types";

const storesNames: Map<SSRStore, string> = new Map();

export function ssrStore<D, V, A>(
  name: string,
  getSsrDiff: GetSSRDiff<D, V & A>,
  creator: StoreCreator<V, A>
) {
  for (const storeName of storesNames.values()) {
    if (name === storeName) {
      throw new Error(`Cannot create a store with an existing name: "${name}"`);
    }
  }

  const store = {
    name,
    getSsrDiff,
    creator,
  };

  storesNames.set(store, name);

  return store;
}

export const getStoreName = (store: SSRStore) => {
  const name = storesNames.get(store);
  if (!name) {
    throw new Error(
      `Trying to get the name of a non-existent store: ${store?.toString?.()}`
    );
  }
  return name;
};
