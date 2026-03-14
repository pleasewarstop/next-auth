import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import {
  OnData,
  InferStoreCreatorFromOnData,
  StoreInstance,
} from "@/components/StoresProvider/types";

export function useStore<T = any, OD extends OnData = OnData>(store: {
  name: string;
  onData: OD;
  creator: InferStoreCreatorFromOnData<T, OD>;
}) {
  const resolveStore = useContext(storesContext);

  return resolveStore(store) as StoreInstance<T>;
}
