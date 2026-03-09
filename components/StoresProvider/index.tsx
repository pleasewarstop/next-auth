/* eslint-disable react-hooks/refs */
"use client";

import {
  StoresContext,
  StoreName,
  InitDataByName,
} from "@/components/StoresProvider/types";
import stores from "@/stores";
import { createContext, ReactNode, useRef } from "react";

export const storesContext = createContext<StoresContext>({});

type InitData = {
  [K in StoreName]?: InitDataByName<K>;
};

interface Props {
  initData?: InitData;
  children: ReactNode;
}
export function StoresProvider({ initData, children }: Props) {
  const ctxRef = useRef<StoresContext>({});
  const usedInitDataRef = useRef<InitData>({});

  if (initData) {
    if (usedInitDataRef.current !== initData) {
      usedInitDataRef.current = initData;

      for (const key in initData) {
        const name = key as StoreName;
        ctxRef.current[name] = createStore(name, initData);
      }
    }
  }

  return (
    <storesContext.Provider value={ctxRef.current}>
      {children}
    </storesContext.Provider>
  );
}

function createStore<N extends StoreName>(name: N, initData: InitData) {
  const creator = stores[name] as (arg: StoresContext[N]) => any;
  return creator(initData[name] as StoresContext[N]);
}
