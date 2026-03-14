import { StoreApi, UseBoundStore } from "zustand";

export type SsrData<D = any> = {
  data: D | null;
  error: string | null;
};

type GetSsrDiffArg<D = any, T = any> = SsrData<D> & {
  state: T | null;
};

export type GetSsrDiff<D = any, T = any> = (
  arg: GetSsrDiffArg<D, T>
) => Partial<T> | void;

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type StoreCreator<V = any, A = any, SD = Partial<V> | null> = (
  ssrDiff: SD
) => (set: (state: Partial<V & A>) => void, get: () => V & A) => V & A;

export type SsrStore<
  D = any,
  T = any,
  GSD extends GetSsrDiff<D, T> = GetSsrDiff<D, T>,
> = {
  name: string;
  getSsrDiff: GSD;
  creator: StoreCreator<T, SsrDiffFromGetter<GSD>>;
};

export type SsrDataItem = SsrData & {
  storeName: any;
};

export type PrefetchArg<T extends SsrStore> = {
  store: T;
  data: ValueOrPromise<InferDataType<T>>;
  error?: (e: any) => any;
};

export type InferDataType<T> = T extends SsrStore<infer D> ? D : never;

type ValueOrPromise<T> = T | Promise<T>;

export type SsrDiffFromGetter<GSD extends GetSsrDiff> = ExcludeVoid<
  ReturnType<GSD>
>;

type ExcludeVoid<T> = T extends any ? (T extends void ? never : T) : never;
