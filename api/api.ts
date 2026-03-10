import { FetchApiExports } from "@/util/fetchApi/types";
import { TProductsResponse, TLoginData, TUser, TProductsParams } from "./types";

export const createApi = ({ get, fetchApi }: FetchApiExports) => ({
  login: (data: TLoginData) =>
    fetchApi("/auth/login", {
      method: "POST",
      data,
    }),

  me: () => get<TUser>("/auth/me?select=firstName,lastName,email"),

  products: (
    { limit, skip, signal }: TProductsParams = { limit: 12, skip: 0 }
  ) =>
    get<TProductsResponse>(
      `/products?limit=${limit}&skip=${skip}&select=title,category,price,thumbnail`,
      { signal }
    ),
});
