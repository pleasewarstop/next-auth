import { getStoreName } from "@/components/StoresProvider/ssrStore";
import { PrefetchArg } from "@/components/StoresProvider/types";
import { isPromise } from "@/util/isPromise";

export async function prefetchStores<P extends PrefetchArg<any>[]>(...args: P) {
  const usedNames: Record<string, true> = {};

  const promises = args.map((arg) => {
    const { store, data, error } = arg;
    const name = getStoreName(store);

    if (usedNames[name]) {
      throw new Error(`Duplicate preloading for store "${name}"`);
    }
    usedNames[name] = true;

    return isPromise(data)
      ? data
          .then((data) => ({ name, data }))
          .catch((e) => {
            throw {
              name,
              error: error ? error(e) : e,
            };
          })
      : { name, data };
  });

  const results = await Promise.allSettled(promises);

  return Object.fromEntries(
    results.map((result) =>
      result.status === "fulfilled"
        ? [
            result.value.name,
            {
              data: result.value.data,
              error: null,
            },
          ]
        : [
            result.reason.name as string,
            {
              data: null,
              error: result.reason.error,
            },
          ]
    )
  ) as Record<
    string,
    {
      data: DataUnion<P> | null;
      error: any;
    }
  >;
}

type DataUnion<P extends PrefetchArg<any>[]> = Awaited<P[number]["data"]>;
