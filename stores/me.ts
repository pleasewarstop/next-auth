import { create } from "zustand";
import { StoreArg } from "@/components/StoresProvider/types";
import { TUser } from "@/api/types";

interface Values {
  me: TUser | null;
  error: string | null;
}

interface Actions {}

export const meStore = ({ data, error }: StoreArg<TUser>) =>
  create<Values & Actions>(() => ({
    me: data,
    error,
  }));
