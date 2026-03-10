"use client";

import {
  InferFirstArg,
  InitDataItem,
  Store,
  StoreInstance,
} from "@/components/StoresProvider/types";
import { createContext, ReactNode, useCallback, useMemo, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initCtx = (store: Store) => ({}) as StoreInstance;
export const storesContext = createContext(initCtx);

const registeredStores: Record<string, Store> = {};

interface Props {
  initData?: InitDataItem[];
  children: ReactNode;
}
export function StoresProvider({ initData, children }: Props) {
  const storesInstancesRef = useRef<Record<string, StoreInstance>>({});
  const initDataByStore = useMemo(
    () =>
      initData?.reduce(
        (acc, { storeName, data, error }) => {
          acc[storeName] = { data, error };
          return acc;
        },
        {} as Record<string, Pick<InitDataItem, "data" | "error">>
      ),
    [initData]
  );
  const usedInitDataByStoreRef = useRef<
    Record<string, Pick<InitDataItem, "data" | "error">>
  >({});

  const resolveStore = useCallback(
    function resolveStore<T extends Store>(store: T) {
      const { name } = store;
      const storeInitData = initDataByStore?.[name];
      const existedInstance = storesInstancesRef.current[name];

      if (registeredStores[name] && registeredStores[name] !== store) {
        throw new Error(
          `Founded different stores with same name "${name}". It's not supported.`
        );
      }
      registeredStores[name] = store;

      if (
        existedInstance &&
        usedInitDataByStoreRef.current[name] === storeInitData
      ) {
        return existedInstance;
      }

      if (!storeInitData) {
        throw new Error(`StoreProvider have not initData for store "${name}"`);
      }

      const storeInstance = store(storeInitData as InferFirstArg<T>);

      usedInitDataByStoreRef.current[name] = storeInitData;
      storesInstancesRef.current[name] = storeInstance;

      return storeInstance;
    },
    [initDataByStore]
  );

  return (
    <storesContext.Provider value={resolveStore}>
      {children}
    </storesContext.Provider>
  );
}
