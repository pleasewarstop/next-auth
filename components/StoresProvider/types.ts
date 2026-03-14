import { StoreApi, UseBoundStore } from "zustand";

export type ServerData<D = any> = {
  data: D | null;
  error: string | null;
};

type GetSSRDiffArg<D = any, T = any> = ServerData<D> & {
  state: T | null;
};

export type GetSSRDiff<D = any, T = any> = (
  arg: GetSSRDiffArg<D, T>
) => Partial<T> | void;

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type StoreCreator<V = any, A = any, SD = Partial<V> | null> = (
  ssrDiff: SD
) => (set: (state: Partial<V & A>) => void, get: () => V & A) => V & A;

export type SSRStore<
  D = any,
  T = any,
  GSD extends GetSSRDiff<D, T> = GetSSRDiff<D, T>,
> = {
  name: string;
  getSsrDiff: GSD;
  creator: StoreCreator<T, SSRDiffFromGetter<GSD>>;
};

export type ServerDataItem = ServerData & {
  storeName: any;
};

export type PrefetchArg<T extends SSRStore> = {
  store: T;
  data: ValueOrPromise<InferDataType<T>>;
  error?: (e: any) => any;
};

export type InferDataType<T> = T extends SSRStore<infer D> ? D : never;

export type InferStoreInstance<S extends SSRStore> =
  S extends SSRStore<any, infer T> ? StoreInstance<T> : never;

type ValueOrPromise<T> = T | Promise<T>;

export type SSRDiffFromGetter<GSD extends GetSSRDiff> = ExcludeVoid<
  ReturnType<GSD>
>;

type ExcludeVoid<T> = T extends any ? (T extends void ? never : T) : never;
