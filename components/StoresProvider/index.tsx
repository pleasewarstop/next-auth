"use client";

import { getStoreSession } from "@/components/StoresProvider/sessionStore";
import {
  InitDataItem,
  Store,
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

const unloadedKey = "unloaded";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initCtx = (store: Store) => ({}) as StoreInstance;
export const storesContext = createContext(initCtx);

const registeredStores: Record<string, Store> = {};

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
    function resolveStore<T extends Store>(store: T) {
      const { name } = store;
      const storeInitData = initDataByStore?.[name];

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

      if (usedInitDataByStoreRef.current[name] === storeInitData) {
        return storesInstancesRef.current[name];
      }

      usedInitDataByStoreRef.current[name] = storeInitData;

      storesInstancesRef.current[name] = store(storeInitData);
      const cache = getStoreSession(store);
      if (cache && !(unloadedKey in sessionStorage)) {
        storesInstancesRef.current[name].getState().restore(cache);
      }

      return storesInstancesRef.current[name];
    },
    [initDataByStore]
  );

  useEffect(() => {
    if (unloadedKey in sessionStorage) {
      sessionStorage.removeItem(unloadedKey);
      window.history.scrollRestoration = "auto";

      for (const name in storesInstancesRef.current) {
        const store = registeredStores[name];
        const cache = getStoreSession(store);
        if (cache) storesInstancesRef.current[name].getState().restore(cache);
      }
    }

    function onBeforeUnload() {
      window.sessionStorage.setItem(unloadedKey, "");
      window.history.scrollRestoration = "manual";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return (
    <storesContext.Provider value={resolveStore}>
      {children}
    </storesContext.Provider>
  );
}
