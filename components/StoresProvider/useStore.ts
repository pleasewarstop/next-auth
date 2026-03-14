import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import {
  InferStoreInstance,
  SSRStore,
} from "@/components/StoresProvider/types";

export function useStore<
  D = any,
  T = any,
  S extends SSRStore<D, T> = SSRStore<D, T>,
>(store: S) {
  const resolveStore = useContext(storesContext);

  return resolveStore(store) as InferStoreInstance<S>;
}
