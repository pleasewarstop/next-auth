import { SSRStore } from "@/components/StoresProvider/types";

const storesNames: Map<SSRStore, string> = new Map();

export const getStoreName = (store: SSRStore) => {
  const name = storesNames.get(store);
  if (!name) {
    throw new Error(
      `Trying to get the name of a non-existent store: ${store?.toString?.()}`
    );
  }
  return name;
};

export function ssrStore<D, T, S extends SSRStore<D, T> = SSRStore<D, T>>(
  name: string,
  store: S
) {
  for (const [, storeName] of storesNames) {
    if (storeName === name)
      throw new Error(`Cannot create a store with an existing name: "${name}"`);
  }

  storesNames.set(store, name);

  return store;
}
