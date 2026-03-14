import { TUser } from "@/api/types";
import { getMe } from "@/features/auth/actions";
import { meErrorMsg } from "@/api/errorMsg";
import { ssrStore } from "@/components/StoresProvider/ssrStore";

interface Values {
  me: TUser | null;
  loading: boolean;
  error: string | null;
}

const initValues: Values = {
  me: null,
  loading: false,
  error: null,
};

interface Actions {
  refetch: () => void;
}

type Store = Values & Actions;

export const meStore = ssrStore<TUser, Store>("me")(
  ({ data, error }) => ({
    me: data,
    error,
  }),

  (ssrDiff) => (set) => ({
    ...initValues,
    ...ssrDiff,

    refetch: async () => {
      set({ loading: true, error: null });
      try {
        const me = await getMe();
        set({ me, loading: false });
      } catch (e) {
        set({ loading: false, error: meErrorMsg(e) });
      }
    },
  })
);
