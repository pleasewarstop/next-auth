import {
  RefreshableStore,
  RefreshableStoreStateBase,
} from "@/components/StoresProvider/types";

export const refreshableSymbol: unique symbol = Symbol("refreshable");

export function refreshableStore<A, T extends RefreshableStoreStateBase<A>>(
  store: RefreshableStore<A, T>
) {
  store[refreshableSymbol] = true;
  return store;
}
