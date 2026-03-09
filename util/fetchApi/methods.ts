import { FetchApiOptions, Methods, TargetFetchApi } from "./types";

export function createMethods(targetFetch: TargetFetchApi): Methods {
  return {
    get: async <T>(url: string, options?: FetchApiOptions) => {
      const res = await targetFetch(url, { ...options, method: "GET" });
      return res.data as T;
    },
    post: async <T>(
      url: string,
      data?: FetchApiOptions["data"],
      options?: Omit<FetchApiOptions, "data">
    ) => {
      const res = await targetFetch(url, { ...options, method: "POST", data });
      return res.data as T;
    },
  };
}
