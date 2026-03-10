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
  onRefresh: ({ data, error }: StoreArg<InitProducts>) => void;
  abortIfNeeded: () => void;
}

let abortController: AbortController | null = null;

export const productsStore = ({ data, error }: StoreArg<InitProducts>) =>
  create<Values & Actions>((set, get) => ({
    ...initValues,
    ...data,
    error,

    // Если у стора есть prop onRefresh,
    // То StoreProvider на клиенте не будет создавать новую сущность стора для каждой страницы
    // А использует эту функцию для переинициализации единого стора на сессию
    // Осталось нормально отразить это в типах
    onRefresh({ data, error }) {
      if (!data || error) {
        set({
          ...initValues,
          ...data,
          error,
        });
      } else {
        const { products, total } = data;
        const isProductsChanged = products.some(
          ({ id }, i) => get().products[i]?.id !== id
        );
        if (isProductsChanged) {
          set({
            ...data,
            error: null,
          });
        } else if (total !== get().total) {
          set({ total });
        }
      }
    },

    fetchNextIfNeeded: async () => {
      const skip = get().products.length;
      if (get().loading || (skip !== 0 && skip >= get().total)) return;

      set({ loading: true, error: null, refetching: Boolean(get().error) });

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

    abortIfNeeded: () => {
      if (get().loading) abortController?.abort();
    },
  }));
