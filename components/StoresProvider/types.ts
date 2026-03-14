import { StoreApi, UseBoundStore } from "zustand";

export type StoreInstance<T = any> = UseBoundStore<StoreApi<T>>;

export type StoreCreator<T = any, SD = Partial<T>> = (
  ssrDiff: SD | null
) => (set: (state: Partial<T>) => void, get: () => T) => T;

export type SsrStore<
  D = any,
  T = any,
  OD extends OnData<D, T> = OnData<D, T>,
> = {
  name: string;
  onData: OD;
  creator: InferStoreCreatorFromOnData<T, OD>;
};

export type SsrData<D = any> = {
  data: D | null;
  error: string | null;
};

export type OnData<D = any, T = any> = (
  arg: OnDataArg<D, T>
) => Partial<T> | void;

type OnDataArg<D, T> = SsrData<D> & {
  state: T | null;
};

export type PrefetchArg<T extends SsrStore> = {
  store: T;
  data: ValueOrPromise<InferDataType<T>>;
  error?: (e: any) => any;
};

export type InferDataType<T> = T extends SsrStore<infer D> ? D : never;

export type ValueOrPromise<T> = T | Promise<T>;

export type InferStoreCreatorFromOnData<T, OD extends OnData> = StoreCreator<
  T,
  InferSsrDiffFromGetter<OD>
>;

type InferSsrDiffFromGetter<OD extends OnData> = Exclude<ReturnType<OD>, void>;

export type PrefetchResult<P extends PrefetchArg<any>[]> = {
  [K in P[number] as K["store"]["name"]]: {
    data: Awaited<K["data"]> | null;
    error: any;
  };
};
