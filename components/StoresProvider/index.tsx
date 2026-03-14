"use client";

import { getStoreName } from "@/components/StoresProvider/ssrStore";
import {
  SsrData,
  SsrStore,
  StoreInstance,
} from "@/components/StoresProvider/types";
import { createContext, ReactNode, useCallback, useRef } from "react";
import { create } from "zustand";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initCtx = (store: SsrStore) => ({}) as StoreInstance;
export const storesContext = createContext(initCtx);
const storesInstances: Record<string, StoreInstance> = {};

interface Props {
  ssrData?: Record<string, SsrData>;
  children: ReactNode;
}
export function StoresProvider({ ssrData, children }: Props) {
  const usedSsrDataRef = useRef<Record<string, Omit<SsrData, "storeName">>>({});

  const resolveStore = useCallback(
    function <S extends SsrStore>(store: S) {
      const name = getStoreName(store);
      const storeSsrData = ssrData?.[name];

      if (!storeSsrData) {
        throw new Error(
          `StoreProvider have not ssrData for ssrStore "${name}"`
        );
      }

      const existedInstance = storesInstances[name];

      if (usedSsrDataRef.current[name] === storeSsrData) {
        return storesInstances[name];
      }
      usedSsrDataRef.current[name] = storeSsrData;

      const state = existedInstance?.getState() || null;
      const ssrDiff =
        store.getSsrDiff({
          state,
          ...storeSsrData,
        }) || null;

      if (!existedInstance || ssrDiff) {
        storesInstances[name] = create(store.creator(ssrDiff));
      }

      return storesInstances[name];
    },
    [ssrData]
  );

  return (
    <storesContext.Provider value={resolveStore}>
      {children}
    </storesContext.Provider>
  );
}
