"use client";

import { getStoreName } from "@/components/StoresProvider/ssrStore";
import {
  SsrDataItem,
  SsrStore,
  StoreInstance,
} from "@/components/StoresProvider/types";
import { createContext, ReactNode, useCallback, useMemo, useRef } from "react";
import { create } from "zustand";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initCtx = (store: SsrStore) => ({}) as StoreInstance;
export const storesContext = createContext(initCtx);
const storesInstances: Record<string, StoreInstance> = {};

interface Props {
  ssrData?: SsrDataItem[];
  children: ReactNode;
}
export function StoresProvider({ ssrData, children }: Props) {
  const ssrDataByStore = useMemo(() => {
    return ssrData?.reduce(
      (acc, { storeName, ...rest }) => {
        acc[storeName] = rest;
        return acc;
      },
      {} as Record<string, Omit<SsrDataItem, "storeName">>
    );
  }, [ssrData]);
  const usedSsrDataByStoreRef = useRef<
    Record<string, Omit<SsrDataItem, "storeName">>
  >({});

  const resolveStore = useCallback(
    function <S extends SsrStore>(store: S) {
      const name = getStoreName(store);
      const storeSsrData = ssrDataByStore?.[name];

      if (!storeSsrData) {
        throw new Error(
          `StoreProvider have not ssrData for ssrStore "${name}"`
        );
      }

      const existedInstance = storesInstances[name];

      if (usedSsrDataByStoreRef.current[name] === storeSsrData) {
        return storesInstances[name];
      }
      usedSsrDataByStoreRef.current[name] = storeSsrData;

      const state = existedInstance?.getState() || null;
      const ssrDiff =
        store.getSsrDiff({
          state,
          ...storeSsrData,
        }) || state;

      storesInstances[name] = create(store.creator(ssrDiff));

      return storesInstances[name];
    },
    [ssrDataByStore]
  );

  return (
    <storesContext.Provider value={resolveStore}>
      {children}
    </storesContext.Provider>
  );
}
