import { StoreApi, UseBoundStore } from "zustand";

export type SSRStoreArg<D = undefined> = {
  data: D | null;
  error: string | null;
};

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type SSRStore<D = any, T = any> = (
  arg: SSRStoreArg<D>
) => StoreInstance<T>;

export type RestorableSSRStore<D = any, V = any, A = any, C = V> = SSRStore<
  D,
  V & A & { restore: (cache: C) => void }
>;

export type InitDataItem = {
  storeName: any;
  data: any;
  error: any;
};

export type PrefetchArg<T extends SSRStore> = {
  store: T;
  data: ValueOrPromise<InferFirstArg<T>["data"]>;
  error?: (e: any) => any;
};

export type InferFirstArg<T> = T extends (arg: infer Arg) => any ? Arg : never;

type ValueOrPromise<T> = T | Promise<T>;
