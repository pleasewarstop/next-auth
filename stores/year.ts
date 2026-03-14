import { ssrStore } from "@/components/StoresProvider/ssrStore";

interface Values {
  year: number;
}

const initValues: Values = {
  year: 0,
};

type State = Values & {};

export const yearStore = ssrStore<number, State>()(
  "year",

  ({ data, error }) => ({
    year: data || 0,
    error,
  }),

  (ssrDiff) => () => ({
    ...initValues,
    ...ssrDiff,
  })
);
