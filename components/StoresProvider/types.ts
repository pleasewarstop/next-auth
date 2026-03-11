import { StoreApi, UseBoundStore } from "zustand";

export type StoreArg<T = undefined> = {
  data: (T extends object ? Partial<T> : T) | null;
  error?: string | null;
  cache?: T;
};

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type Store<T = any> = (arg: StoreArg<T>) => StoreInstance<T>;

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
