import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import { InferStoreInstance, Store } from "@/components/StoresProvider/types";

export function useStore<T extends Store>(store: T) {
  const resolveStore = useContext(storesContext);

  return resolveStore(store) as InferStoreInstance<T>;
}
