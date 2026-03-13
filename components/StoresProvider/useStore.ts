import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import { SSRStore } from "@/components/StoresProvider/types";

export function useStore<S extends SSRStore>(store: S) {
  const resolveStore = useContext(storesContext);

  return resolveStore(store) as ReturnType<S>;
}
