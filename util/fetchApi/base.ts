import axios, { AxiosResponse } from "axios";
import { FetchApiOptions } from "./types";

export async function fetchApiBase<T>(
  url: string,
  options?: FetchApiOptions
): Promise<AxiosResponse<T>> {
  const { headers, ...rest } = options || {};

  return axios.request({
    url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });
}
