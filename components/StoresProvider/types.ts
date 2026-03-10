import { refreshableSymbol } from "@/components/StoresProvider/refreshableStore";
import { StoreApi, UseBoundStore } from "zustand";

export type StoreArg<T> = { data: T | null; error: string | null };

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type Store<A = any, T = any> = ((
  arg: StoreArg<A>
) => StoreInstance<T>) & {
  [refreshableSymbol]?: true;
};

export type RefreshableStoreStateBase<A = any> = {
  onRefresh: (arg: StoreArg<A>) => void;
};

export type RefreshableStore<A, T extends RefreshableStoreStateBase<A>> = Store<
  A,
  T
>;

export type InitDataItem = {
  storeName: any;
  data: any;
  error?: any;
};

export type PrefetchArg<T extends Store> = {
  store: T;
  data: ValueOrPromise<InferFirstArg<T>["data"]>;
  error?: (e: any) => any;
};

export type InferStoreInstance<T> = T extends (...args: any[]) => infer Instance
  ? Instance
  : never;

export type InferFirstArg<T> = T extends (arg: infer Arg) => any ? Arg : never;

type ValueOrPromise<T> = T | Promise<T>;
