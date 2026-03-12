import { StoreApi, UseBoundStore } from "zustand";

export type StoreArg<D = undefined> = {
  data: D | null;
  error?: string | null;
};

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type Store<D = any, T = any> = (arg: StoreArg<D>) => StoreInstance<T>;

export type RestorableStore<D = any, V = any, A = any> = Store<
  D,
  V & A & { restore: (cache: V) => void }
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
