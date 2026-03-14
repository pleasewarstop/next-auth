import { StoreApi, UseBoundStore } from "zustand";

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type StoreCreator<T = any, SD = Partial<T> | null> = (
  ssrDiff: SD
) => (set: (state: Partial<T>) => void, get: () => T) => T;

export type SsrStore<
  D = any,
  T = any,
  GSD extends GetSsrDiff<D, T> = GetSsrDiff<D, T>,
> = {
  name: string;
  getSsrDiff: GSD;
  creator: InferStoreCreatorFromGetter<T, GSD>;
};

export type SsrDataItem = SsrData & {
  storeName: any;
};

export type SsrData<D = any> = {
  data: D | null;
  error: string | null;
};

export type GetSsrDiff<D = any, T = any> = (
  arg: SsrData<D> & {
    state: T | null;
  }
) => Partial<T> | null | void;

export type PrefetchArg<T extends SsrStore> = {
  store: T;
  data: ValueOrPromise<InferDataType<T>>;
  error?: (e: any) => any;
};

export type InferDataType<T> = T extends SsrStore<infer D> ? D : never;

type ValueOrPromise<T> = T | Promise<T>;

export type InferStoreCreatorFromGetter<
  T,
  GSD extends GetSsrDiff,
> = StoreCreator<T, InferSsrDiffFromGetter<GSD>>;

export type InferSsrDiffFromGetter<GSD extends GetSsrDiff> = ReturnType<GSD>;
