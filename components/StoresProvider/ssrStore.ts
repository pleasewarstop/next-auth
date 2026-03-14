import {
  GetSsrDiff,
  InferStoreCreatorFromGetSsrDiff,
  SsrStore,
} from "@/components/StoresProvider/types";

const storesNames: Map<SsrStore, string> = new Map();

export function ssrStore<D, T>() {
  return function <
    N extends string = string,
    GSD extends GetSsrDiff<D, T> = GetSsrDiff<D, T>,
    C extends InferStoreCreatorFromGetSsrDiff<T, GSD> =
      InferStoreCreatorFromGetSsrDiff<T, GSD>,
  >(name: N, getSsrDiff: GSD, creator: C) {
    for (const storeName of storesNames.values()) {
      if (name === storeName) {
        throw new Error(
          `Cannot create a store with an existing name: "${name}"`
        );
      }
    }

    const store = {
      name,
      getSsrDiff,
      creator,
    };

    storesNames.set(store, name);

    return store;
  };
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
