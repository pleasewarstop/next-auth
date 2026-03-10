import { create } from "zustand";
import { StoreArg } from "@/components/StoresProvider/types";

interface Values {
  year: number;
}

interface Actions {}

export const yearStore = ({ data }: StoreArg<number>) =>
  create<Values & Actions>(() => ({
    year: data || 0,
  }));
