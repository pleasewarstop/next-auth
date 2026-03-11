import { create } from "zustand";
import { CanceledError } from "axios";
import { api } from "@/api/client";
import { productsErrorMsg } from "@/api/errorMsg";
import { TProductsResponse } from "@/api/types";
import { sessionStore } from "@/components/StoresProvider/sessionStore";

const PER_PAGE = 12;

type InitProducts = Pick<TProductsResponse, "products" | "total">;

interface Values extends InitProducts {
  loading: boolean;
  error: string | null | undefined;
  retrying: boolean;
}
const initValues: Values = {
  products: [],
  total: 0,
  loading: false,
  error: null,
  retrying: false,
};

interface Actions {
  fetchNextIfNeeded: () => Promise<void>;
  abortIfNeeded: () => void;
}

let abortController: AbortController | null = null;

export const productsStore = sessionStore<Values, Actions>(
  function productsStore({ data, error, cache }) {
    const isProductsChanged = data?.products?.some(
      ({ id }, i) => cache?.products[i]?.id !== id
    );
    const products =
      (isProductsChanged ? data?.products : cache?.products) || [];

    return create((set, get) => ({
      ...initValues,
      ...data,
      products,
      error,

      fetchNextIfNeeded: async () => {
        const skip = get().products.length;
        if (get().loading || (skip !== 0 && skip >= get().total)) return;

        set({ loading: true, error: null, retrying: Boolean(get().error) });

        try {
          abortController = new AbortController();

          const { products, total } = await api.products({
            skip,
            limit: PER_PAGE,
            signal: abortController.signal,
          });

          set({
            products: [...get().products, ...products],
            total,
            loading: false,
            retrying: false,
          });
        } catch (e: any) {
          set({
            loading: false,
            retrying: false,
            error: e instanceof CanceledError ? null : productsErrorMsg(e),
          });
        }
      },

      abortIfNeeded: () => {
        if (get().loading) abortController?.abort();
      },
    }));
  }
);
