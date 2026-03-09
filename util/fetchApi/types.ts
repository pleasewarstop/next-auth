import { AxiosRequestConfig, AxiosResponse } from "axios";

type MethodOptions = Omit<AxiosRequestConfig, "url" | "method">;

export type FetchApiOptions = MethodOptions & { method?: "GET" | "POST" };

export type TargetFetchApi<T = any> = (
  url: string,
  options?: FetchApiOptions
) => Promise<AxiosResponse<T>>;

export type Methods = {
  get: <T>(url: string, options?: MethodOptions) => Promise<T>;
  post: <T>(
    url: string,
    body?: AxiosRequestConfig["data"],
    options?: MethodOptions
  ) => Promise<T>;
};

export type FetchApiExports<T = any> = {
  get: Methods["get"];
  post: Methods["post"];
  fetchApi: TargetFetchApi<T>;
};
