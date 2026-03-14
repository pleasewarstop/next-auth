"use client";

import { getStoreName } from "@/components/StoresProvider/ssrStore";
import {
  ServerDataItem,
  SSRStore,
  StoreInstance,
} from "@/components/StoresProvider/types";
import { filterFunctions } from "@/util/filterFunctions";
import { createContext, ReactNode, useCallback, useMemo, useRef } from "react";
import { create } from "zustand";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initCtx = (store: SSRStore) => ({}) as StoreInstance;
export const storesContext = createContext(initCtx);
const storesInstances: Record<string, StoreInstance> = {};

interface Props {
  serverData?: ServerDataItem[];
  children: ReactNode;
}
export function StoresProvider({ serverData, children }: Props) {
  const serverDataByStore = useMemo(
    () =>
      serverData?.reduce(
        (acc, { storeName, ...rest }) => {
          acc[storeName] = rest;
          return acc;
        },
        {} as Record<string, Omit<ServerDataItem, "storeName">>
      ),
    [serverData]
  );
  const usedServerDataByStoreRef = useRef<
    Record<string, Omit<ServerDataItem, "storeName">>
  >({});

  const resolveStore = useCallback(
    function <S extends SSRStore>(store: S) {
      const name = getStoreName(store);
      const storeServerData = serverDataByStore?.[name];

      if (!storeServerData) {
        throw new Error(
          `StoreProvider have not serverData for ssrStore "${name}"`
        );
      }

      if (usedServerDataByStoreRef.current[name] === storeServerData) {
        return storesInstances[name];
      }

      const state = storesInstances[name]?.getState() || null;
      const ssrDiff =
        store.getSsrDiff({
          state,
          ...storeServerData,
        }) || filterFunctions(state || {});

      storesInstances[name] = create(store.creator(ssrDiff));

      usedServerDataByStoreRef.current[name] = storeServerData;

      return storesInstances[name];
    },
    [serverDataByStore]
  );

  return (
    <storesContext.Provider value={resolveStore}>
      {children}
    </storesContext.Provider>
  );
}
