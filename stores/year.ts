import { ssrStore } from "@/components/StoresProvider/ssrStore";

interface Values {
  year: number;
}

const initValues: Values = {
  year: 0,
};

interface Actions {}

export const yearStore = ssrStore<number, Values & Actions>(
  "year",

  ({ data, error }) => ({
    year: data || 0,
    error,
  }),

  (serverDiff) => () => ({
    ...initValues,
    ...serverDiff,
  })
);
