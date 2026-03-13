"use client";

import { getStoreCache } from "@/components/StoresProvider/restorableSsrStore";
import { getStoreName } from "@/components/StoresProvider/ssrStore";
import {
  InitDataItem,
  SSRStore,
  StoreInstance,
} from "@/components/StoresProvider/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

let hydrated = false;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initCtx = (store: SSRStore) => ({}) as StoreInstance;
export const storesContext = createContext(initCtx);

interface Props {
  initData?: InitDataItem[];
  children: ReactNode;
}
export function StoresProvider({ initData, children }: Props) {
  const initDataByStore = useMemo(
    () =>
      initData?.reduce(
        (acc, { storeName, ...rest }) => {
          acc[storeName] = rest;
          return acc;
        },
        {} as Record<string, Omit<InitDataItem, "storeName">>
      ),
    [initData]
  );
  const storesInstancesRef = useRef<Record<string, StoreInstance>>({});
  const usedInitDataByStoreRef = useRef<
    Record<string, Omit<InitDataItem, "storeName">>
  >({});

  const resolveStore = useCallback(
    function resolveStore<T extends SSRStore>(store: T) {
      const name = getStoreName(store);
      const storeInitData = initDataByStore?.[name];

      if (!storeInitData) {
        throw new Error(`StoreProvider have not initData for store "${name}"`);
      }

      if (usedInitDataByStoreRef.current[name] === storeInitData) {
        return storesInstancesRef.current[name];
      }

      usedInitDataByStoreRef.current[name] = storeInitData;
      storesInstancesRef.current[name] = store(storeInitData);

      if (hydrated) {
        const cache = getStoreCache(name);
        if (cache) storesInstancesRef.current[name].getState().restore(cache);
      }

      return storesInstancesRef.current[name];
    },
    [initDataByStore]
  );

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;

      for (const name in storesInstancesRef.current) {
        const cache = getStoreCache(name);
        if (cache) storesInstancesRef.current[name].getState().restore(cache);
      }
    }
  }, []);

  return (
    <storesContext.Provider value={resolveStore}>
      {children}
    </storesContext.Provider>
  );
}
