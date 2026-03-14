import { StoreApi, UseBoundStore } from "zustand";

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type StoreCreator<T = any, SD = Partial<T>> = (
  ssrDiff: SD | null
) => (set: (state: Partial<T>) => void, get: () => T) => T;

export type SsrStore<
  D = any,
  T = any,
  GSD extends GetSsrDiff<D, T> = GetSsrDiff<D, T>,
> = {
  name: string;
  getSsrDiff: GSD;
  creator: InferStoreCreatorFromGetSsrDiff<T, GSD>;
};

export type SsrData<D = any> = {
  data: D | null;
  error: string | null;
};

export type GetSsrDiff<D = any, T = any> = (
  arg: GetSsrDiffArg<D, T>
) => Partial<T> | void;

type GetSsrDiffArg<D, T> = SsrData<D> & {
  state: T | null;
};

export type PrefetchArg<T extends SsrStore> = {
  store: T;
  data: ValueOrPromise<InferDataType<T>>;
  error?: (e: any) => any;
};

export type InferDataType<T> = T extends SsrStore<infer D> ? D : never;

export type ValueOrPromise<T> = T | Promise<T>;

export type InferStoreCreatorFromGetSsrDiff<
  T,
  GSD extends GetSsrDiff,
> = StoreCreator<T, InferSsrDiffFromGetter<GSD>>;

type InferSsrDiffFromGetter<GSD extends GetSsrDiff> = Exclude<
  ReturnType<GSD>,
  void
>;
