import { useContext } from "react";
import { storesContext } from "@/components/StoresProvider";
import {
  GetSsrDiff,
  InferStoreCreatorFromGetSsrDiff,
  StoreInstance,
} from "@/components/StoresProvider/types";

export function useStore<T = any, GSD extends GetSsrDiff = GetSsrDiff>(store: {
  name: string;
  getSsrDiff: GSD;
  creator: InferStoreCreatorFromGetSsrDiff<T, GSD>;
}) {
  const resolveStore = useContext(storesContext);

  return resolveStore(store) as StoreInstance<T>;
}
