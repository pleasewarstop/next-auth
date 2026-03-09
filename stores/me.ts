import { create } from "zustand";
import { StoreArg } from "@/components/StoresProvider/types";
import { TUser } from "@/api/types";

interface Values {
  me: TUser | null;
  error: string | null;
}
const initValues: Values = {
  me: null,
  error: null,
};

interface Actions {}

export const meStore = ({ data, error }: StoreArg<TUser>) =>
  create<Values & Actions>(() => ({
    ...initValues,
    me: data,
    error,
  }));
