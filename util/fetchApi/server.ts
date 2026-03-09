import { cookies } from "next/headers";
import { fetchApiBase } from "./base";
import { createMethods } from "./methods";
import { FetchApiExports, FetchApiOptions } from "./types";

async function fetchApiOnServer<T>(url: string, options?: FetchApiOptions) {
  const cookieStore = await cookies();

  return fetchApiBase<T>(url, {
    ...options,
    withCredentials: true,
    headers: {
      cookie: cookieStore.toString(),
      ...options?.headers,
    },
  });
}

export default {
  ...createMethods(fetchApiOnServer),
  fetchApi: fetchApiOnServer,
} satisfies FetchApiExports;
