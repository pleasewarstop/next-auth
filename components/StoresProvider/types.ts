import { StoreApi, UseBoundStore } from "zustand";

export type ServerData<D = any> = {
  data: D | null;
  error: string | null;
};

export type GetServerDiffArg<D = any, T = any> = ServerData<D> & {
  state: T | null;
};

export type GetServerDiff<D = any, T = any> = (
  arg: GetServerDiffArg<D, T>
) => Partial<T> | void;

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type StoreCreator<T = any, SD = Partial<T> | null> = (
  serverDiff: SD
) => (set: (state: Partial<T>) => void, get: () => T) => T;

export type SSRStore<
  D = any,
  T = any,
  GSD extends GetServerDiff<D, T> = GetServerDiff<D, T>,
> = {
  name: string;
  getServerDiff: GSD;
  creator: StoreCreator<T, ServerDiffFromGetter<GSD>>;
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

export type ServerDiffFromGetter<GSD extends GetServerDiff> = ExcludeVoid<
  ReturnType<GSD>
>;

type ExcludeVoid<T> = T extends any ? (T extends void ? never : T) : never;
