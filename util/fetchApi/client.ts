import { FetchApiExports, FetchApiOptions } from "./types";
import { fetchApiBase } from "./base";
import { createMethods } from "./methods";

async function fetchApiOnClient<T>(url: string, options?: FetchApiOptions) {
  return fetchApiBase<T>(url, {
    ...options,
    withCredentials: false,
  });
}

export default {
  ...createMethods(fetchApiOnClient),
  fetchApi: fetchApiOnClient,
} satisfies FetchApiExports;
