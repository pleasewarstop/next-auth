import { nameByStoreMap } from "@/components/StoresProvider/consts";
import {
  StoreName,
  InitDataByName,
  PrefetchersObject,
  Stores,
  PrefetchArg,
  Prefetcher,
} from "@/components/StoresProvider/types";
import { isPromise } from "util/types";

export async function prefetchStores<T extends Stores[StoreName][]>(
  ...args: [...{ [K in keyof T]: PrefetchArg<T[K]> }]
) {
  const prefetchers: PrefetchersObject = {};
  args.forEach((arg) => {
    const { store, ...prefetcher } = arg;
    const storeName = nameByStoreMap.get(store) as StoreName;
    prefetchers[storeName] = prefetcher as Prefetcher<any>;
  });

  const wrappedPromises = Object.entries(prefetchers).map(
    ([name, prefetcher]) => {
      if (isPromise(prefetcher.data)) {
        return prefetcher.data
          .then((data) => ({ name, data }))
          .catch((e) => {
            throw {
              name: name,
              error: prefetcher.error ? prefetcher.error(e) : e,
            };
          });
      }
      return { name, data: prefetcher.data };
    }
  );

  const results = (await Promise.allSettled(wrappedPromises)) as unknown as {
    [K in StoreName]: PromiseSettledResult<{
      name: K;
      data: InitDataByName<K>["data"];
    }>;
  }[StoreName][];

  return results.reduce((acc, result) => {
    const name =
      result.status === "fulfilled" ? result.value.name : result.reason.name;

    acc[name] =
      result.status === "fulfilled"
        ? {
            data: result.value.data,
            error: null,
          }
        : { data: null, error: result.reason.error };

    return acc;
  }, {} as any) as {
    [K in StoreName]?: InitDataByName<K>;
  };
}
