import { create } from "zustand";
import { ssrStore } from "@/components/StoresProvider/ssrStore";

interface Values {
  year: number;
}

interface Actions {}

export const yearStore = ssrStore<number, Values & Actions>(
  "year",

  ({ data }) =>
    create(() => ({
      year: data || 0,
    }))
);
