import { PrefetchArg, Store } from "@/components/StoresProvider/types";
import { isPromise } from "@/util/isPromise";

export async function prefetchStores<St extends Store[]>(
  ...args: [...{ [K in keyof St]: PrefetchArg<St[K]> }]
) {
  const promises = args.map((arg) => {
    const { store, data, error } = arg;
    return isPromise(data)
      ? data
          .then((data) => ({ store, data }))
          .catch((e) => {
            throw {
              store,
              error: error ? error(e) : e,
            };
          })
      : { store, data };
  });

  const results = await Promise.allSettled(promises);

  return results.map((result) => {
    return result.status === "fulfilled"
      ? {
          storeName: result.value.store.name,
          data: result.value.data,
          error: null,
        }
      : {
          storeName: result.reason.store.name as string,
          data: null,
          error: result.reason.error,
        };
  });
}
