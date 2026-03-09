import { create } from "zustand";
import { CanceledError } from "axios";
import { api } from "@/api/client";
import { productsErrorMsg } from "@/api/errorMsg";
import { TProductsResponse } from "@/api/types";
import { StoreArg } from "@/components/StoresProvider/types";

const PER_PAGE = 12;

type InitProducts = Pick<TProductsResponse, "products" | "total">;

interface Values extends InitProducts {
  loading: boolean;
  error: string | null;
  refetching: boolean;
}
const initValues: Values = {
  products: [],
  total: 0,
  loading: false,
  error: null,
  refetching: false,
};

interface Actions {
  fetchNextIfNeeded: () => Promise<void>;
}

export const productsStore = ({ data, error }: StoreArg<InitProducts>) =>
  create<Values & Actions>((set, get) => ({
    ...initValues,
    ...data,
    error,

    fetchNextIfNeeded: async () => {
      const skip = get().products.length;
      if (get().loading || (skip !== 0 && skip >= get().total)) return;

      set({ loading: true, error: null, refetching: Boolean(get().error) });

      try {
        const { products, total } = await api.products({
          skip,
          limit: PER_PAGE,
        });

        set({
          products: [...get().products, ...products],
          total,
          loading: false,
          refetching: false,
        });
      } catch (e: any) {
        set({
          loading: false,
          refetching: false,
          error: e instanceof CanceledError ? null : productsErrorMsg(e),
        });
      }
    },
  }));
