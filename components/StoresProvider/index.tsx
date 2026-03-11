"use client";

import {
  cacheKey,
  getStoreSession,
} from "@/components/StoresProvider/sessionStore";
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
      storesInstancesRef.current[name] = store(
        typeof window === "undefined"
          ? storeInitData
          : {
              ...storeInitData,
              cache: getStoreSession(store),
            }
      );

      return storesInstancesRef.current[name];
    },
    [initDataByStore]
  );

  useEffect(() => {
    for (const name in storesInstancesRef.current) {
      const store = registeredStores[name];
      const sessionCache = getStoreSession(store);
      if (!sessionCache) continue;

      function filterFunctions(obj: any) {
        const filtered: any = {};
        for (const key in obj) {
          if (typeof obj[key] === "function") continue;
          filtered[key] = obj[key];
        }
        return filtered;
      }

      storesInstancesRef.current[name].setState(
        filterFunctions(
          store({
            data: filterFunctions(storesInstancesRef.current[name].getState()),
            cache: sessionCache,
          }).getState()
        )
      );
    }

    function onBeforeUnload() {
      for (const name in registeredStores) {
        sessionStorage.removeItem(cacheKey(registeredStores[name]));
      }
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
