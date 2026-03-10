import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import { Store, InferStoreInstance } from "@/components/StoresProvider/types";

export function useStore<T extends Store>(store: T) {
  const resolveStore = useContext(storesContext);

  return resolveStore(store) as InferStoreInstance<T>;
}
