import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import { SsrStore, StoreInstance } from "@/components/StoresProvider/types";

export function useStore<
  D = any,
  T = any,
  S extends SsrStore<D, T> = SsrStore<D, T>,
>(store: S) {
  const resolveStore = useContext(storesContext);

  return resolveStore(store) as StoreInstance<T>;
}
