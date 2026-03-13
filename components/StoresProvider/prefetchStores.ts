import { getStoreName } from "@/components/StoresProvider/ssrStore";
import { PrefetchArg, SSRStore } from "@/components/StoresProvider/types";
import { isPromise } from "@/util/isPromise";

export async function prefetchStores<S extends SSRStore[]>(
  ...args: [...{ [K in keyof S]: PrefetchArg<S[K]> }]
) {
  const promises = args.map((arg) => {
    const { store, data, error } = arg;
    const storeName = getStoreName(store);

    return isPromise(data)
      ? data
          .then((data) => ({ storeName, data }))
          .catch((e) => {
            throw {
              storeName,
              error: error ? error(e) : e,
            };
          })
      : { storeName, data };
  });

  const results = await Promise.allSettled(promises);

  return results.map((result) => {
    return result.status === "fulfilled"
      ? {
          storeName: result.value.storeName,
          data: result.value.data,
          error: null,
        }
      : {
          storeName: result.reason.storeName as string,
          data: null,
          error: result.reason.error,
        };
  });
}
