"use client";

import { getStoreName } from "@/components/StoresProvider/ssrStore";
import {
  ServerDataItem,
  SSRStore,
  StoreInstance,
} from "@/components/StoresProvider/types";
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
    function <T extends SSRStore>(store: T) {
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
      const serverDiff =
        store.getServerDiff({
          state,
          ...storeServerData,
        }) || null;

      const filterFunctions = (obj: Record<string, any>) => {
        const result: Record<string, any> = {};
        for (const key in obj) {
          if (typeof obj[key] === "function") continue;
          result[key] = obj[key];
        }
        return result;
      };

      storesInstances[name] = create(
        store.creator(serverDiff || filterFunctions(state))
      );

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
