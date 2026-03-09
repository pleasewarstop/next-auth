import { create } from "zustand";
import { StoreArg } from "@/components/StoresProvider/types";

interface Values {
  year: number;
}
const initValues: Values = {
  year: 0,
};

interface Actions {}

export const yearStore = ({ data }: StoreArg<number>) =>
  create<Values & Actions>(() => ({
    ...initValues,
    year: data || 0,
  }));
