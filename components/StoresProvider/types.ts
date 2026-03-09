import stores from "@/stores";
import { StoreApi, UseBoundStore } from "zustand";

export type Stores = typeof stores;

export type StoreName = keyof Stores;

export type StoreArg<T> = { data: T | null; error: string | null };

export type InitDataByName<K extends StoreName> = InferFirstArg<Stores[K]>;

export type StoreCreator = (arg: StoreArg<any>) => UseBoundStore<StoreApi<any>>;

export type StoresContext = {
  [K in StoreName]?: InferUseStore<Stores[K]>;
};

export type Prefetcher<T> = {
  data: T | Promise<T>;
  error?: (e: any) => any;
};

export type PrefetchersObject = {
  [K in StoreName]?: Prefetcher<InitDataByName<K>["data"]>;
};

export type PrefetchArg<T extends Stores[StoreName]> = {
  store: T;
} & Prefetcher<InferFirstArg<T>["data"]>;

export type InferUseStore<T> = T extends (...args: any[]) => infer UseStore
  ? UseStore
  : never;

type InferFirstArg<T> = T extends (initData: infer I) => any ? I : never;
