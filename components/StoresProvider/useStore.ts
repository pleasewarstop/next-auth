import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import { Store, InferStoreInstance } from "@/components/StoresProvider/types";

export function useStore<S extends Store>(store: S) {
  const resolveStore = useContext(storesContext);

  return resolveStore(store) as InferStoreInstance<S>;
}
