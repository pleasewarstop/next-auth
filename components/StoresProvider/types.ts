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
  creator: StoreCreator<T, SsrDiffFromGetter<GSD>>;
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

export type SsrDiffFromGetter<GSD extends GetSsrDiff> = ExcludeVoid<
  ReturnType<GSD>
>;

type ExcludeVoid<T> = T extends any ? (T extends void ? never : T) : never;
