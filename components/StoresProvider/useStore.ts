import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import {
  Stores,
  StoreName,
  InferUseStore,
} from "@/components/StoresProvider/types";
import { nameByStoreMap } from "@/components/StoresProvider/consts";

export function useStore<
  Store extends Stores[StoreName],
  Name extends StoreName,
>(store: Store) {
  const ctx = useContext(storesContext);
  const name = nameByStoreMap.get(store) as Name;

  if (!ctx[name])
    throw new Error(
      `Store with name "${name}" is not initialized. Please add it in StoresProvider initData.`
    );

  return ctx[name] as InferUseStore<Store>;
}
