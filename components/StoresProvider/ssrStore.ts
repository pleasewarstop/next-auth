import {
  GetSsrDiff,
  SsrStore,
  StoreCreator,
} from "@/components/StoresProvider/types";

const storesNames: Map<SsrStore, string> = new Map();

export function ssrStore<D, T>(
  name: string,
  getSsrDiff: GetSsrDiff<D, T>,
  creator: StoreCreator<T>
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

export const getStoreName = (store: SsrStore) => {
  const name = storesNames.get(store);
  if (!name) {
    throw new Error(
      `Trying to get the name of a non-existent store: ${store?.toString?.()}`
    );
  }
  return name;
};
