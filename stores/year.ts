import { create } from "zustand";
import { store } from "@/components/StoresProvider/store";

interface Values {
  year: number;
}

interface Actions {}

export const yearStore = store<number, Values & Actions>("year", ({ data }) =>
  create(() => ({
    year: data || 0,
  }))
);
