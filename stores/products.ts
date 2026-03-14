import { CanceledError } from "axios";
import { api } from "@/api/client";
import { productsErrorMsg } from "@/api/errorMsg";
import { TProductsResponse } from "@/api/types";
import { ssrStore } from "@/components/StoresProvider/ssrStore";

const PER_PAGE = 12;

type ProductsData = Pick<TProductsResponse, "products" | "total">;

interface Values extends ProductsData {
  loading: boolean;
  retrying: boolean;
  error: string | null;
}
const initValues: Values = {
  products: [],
  total: 0,
  loading: false,
  retrying: false,
  error: null,
};

interface Actions {
  fetchNextIfNeeded: () => Promise<void>;
}

export const productsStore = ssrStore<ProductsData, Values & Actions>(
  "products"
)(
  ({ state, data, error }) => {
    if (!state || error) {
      return {
        ...data,
        error,
      };
    } else if (data) {
      const { products, total } = state;

      const isProductsChanged = data.products.some(
        ({ id }, i) => products[i]?.id !== id
      );
      if (isProductsChanged) {
        return {
          ...data,
          error,
        };
      } else if (data.total > total) {
        return {
          products:
            products.length > total ? products.slice(0, total) : products,
          total: total,
        };
      }
    }
  },

  (ssrDiff) => (set, get) => ({
    ...initValues,
    ...ssrDiff,

    fetchNextIfNeeded: async () => {
      const { products, loading, total } = get();

      const skip = products.length;
      if (loading || (skip !== 0 && skip >= total)) return;

      set({ loading: true, error: null, retrying: Boolean(get().error) });

      try {
        const { products: resProducts, total } = await api.products({
          skip,
          limit: PER_PAGE,
        });

        set({
          products: [...products, ...resProducts],
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
  })
);
