import { create } from "zustand";
import { CanceledError } from "axios";
import { api } from "@/api/client";
import { productsErrorMsg } from "@/api/errorMsg";
import { TProductsResponse } from "@/api/types";

const PER_PAGE = 12;

export type InitData = Pick<TProductsResponse, "products" | "total"> | null;

interface Values extends Exclude<InitData, null> {
  inited: boolean;
  loading: boolean;
  error: string | null;
  refetching: boolean;
}
const initValues: Values = {
  products: [],
  total: 0,
  inited: false,
  loading: false,
  error: null,
  refetching: false,
};

interface Actions {
  init: (data: InitData | null, error: string | null) => void;
  fetchNextIfNeeded: () => Promise<void>;
  abortIfNeeded: () => void;
}

let abortController: AbortController | null = null;

export const useProducts = create<Values & Actions>((set, get) => ({
  ...initValues,

  init(data, error) {
    set({
      ...initValues,
      inited: true,
      error,
      ...data,
    });
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
