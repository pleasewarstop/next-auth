import { create } from "zustand";
import { StoreArg } from "@/components/StoresProvider/types";
import { TUser } from "@/api/types";
import { getMe } from "@/features/auth/actions";
import { meErrorMsg } from "@/api/errorMsg";

interface Values {
  me: TUser | null;
  loading: boolean;
  error?: string | null;
}

const initValues = {
  me: null,
  loading: false,
  error: null,
};

interface Actions {
  refetch: () => void;
}

export const meStore = ({ data, error }: StoreArg<TUser>) =>
  create<Values & Actions>((set) => ({
    ...initValues,
    me: data,
    error,

    refetch: async () => {
      set({ loading: true, error: null });
      try {
        const me = await getMe();
        set({ me, loading: false });
      } catch (e) {
        set({ loading: false, error: meErrorMsg(e) });
      }
    },
  }));
