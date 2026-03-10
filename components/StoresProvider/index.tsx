"use client";

import {
  InferFirstArg,
  InitDataItem,
  Store,
  StoreInstance,
} from "@/components/StoresProvider/types";
import { createContext, ReactNode, useCallback, useMemo, useRef } from "react";
import { refreshableSymbol } from "@/components/StoresProvider/refreshableStore";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initCtx = (store: Store) => ({}) as StoreInstance;
export const storesContext = createContext(initCtx);

const registeredStores: Record<string, Store> = {};
const storesInstances: Record<string, StoreInstance> = {};

interface Props {
  initData?: InitDataItem[];
  children: ReactNode;
}
export function StoresProvider({ initData, children }: Props) {
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
      const existedInstance = storesInstances[name];

      if (!name) {
        throw new Error(
          `Anonymous function can not be used as store. Error in function ${store.toString()}.`
        );
      }

      if (registeredStores[name] && registeredStores[name] !== store) {
        throw new Error(
          `Founded different stores with same name "${name}". It's not supported.`
        );
      }
      registeredStores[name] = store;

      if (!storeInitData) {
        throw new Error(`StoreProvider have not initData for store "${name}"`);
      }

      if (existedInstance) {
        if (usedInitDataByStoreRef.current[name] === storeInitData) {
          return existedInstance;
        } else {
          if (typeof document !== "undefined" && store[refreshableSymbol]) {
            const { onRefresh } = existedInstance.getState();

            onRefresh(storeInitData);
            usedInitDataByStoreRef.current[name] = storeInitData;
            return existedInstance;
          }
        }
      }

      const storeInstance = store(storeInitData as InferFirstArg<T>);

      usedInitDataByStoreRef.current[name] = storeInitData;
      storesInstances[name] = storeInstance;

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
