import { defaultErrorMsg, errorMsg } from "@/api/errorMsg";
import { create } from "zustand";

const GUARANTEED_WIDTH = 5;
const DELAY_MS = 500;
const GUARANTEED_MS = 770;
const RISING_MS = 3200;

let currentId = 0;

interface Values {
  id: number;
  width: number;
  flickering: boolean;
  error: string | null;
}

const initValues: Values = {
  id: currentId,
  width: 0,
  flickering: false,
  error: null,
};

interface Actions {
  start: (promise: Promise<unknown>, pathname: string) => void;
}

export const useProgress = create<Values & Actions>((set, get) => ({
  ...initValues,

  start(promise) {
    const startTime = Date.now();
    const id = ++currentId;

    let stopped = false;

    set({ id, width: 0, flickering: false });

    setTimeout(() => {
      if (!stopped) handleProgress();
    }, DELAY_MS);

    function handleProgress() {
      if (get().id !== id) return;

      const duration = Date.now() - startTime;

      if (duration < GUARANTEED_MS) {
        set({
          width:
            GUARANTEED_WIDTH *
            ((duration - DELAY_MS) / (GUARANTEED_MS - DELAY_MS)),
        });
        requestAnimationFrame(handleProgress);
      } else if (duration < RISING_MS) {
        set({
          width:
            GUARANTEED_WIDTH +
            ((duration - GUARANTEED_MS) / (RISING_MS - GUARANTEED_MS)) * 100,
        });
        if (!stopped) requestAnimationFrame(handleProgress);
      } else {
        set({ width: 100, flickering: true });
      }
    }

    promise
      .catch((e) => {
        if (get().id === id) {
          set({ error: errorMsg(e) || defaultErrorMsg });
        }
      })
      .finally(() => {
        stopped = true;
        if (get().id === id) set(initValues);
      });
  },
}));

if (typeof window !== "undefined") {
  const prev = window.fetch;

  window.fetch = (...args) => {
    if (typeof args[0] === "string" || !("search" in args[0])) {
      return prev(...args);
    }
    const { search, pathname } = args[0];

    const promise = prev(...args);

    if (search.startsWith("?_rsc=")) {
      useProgress.getState().start(promise, pathname);
    }

    return promise;
  };
}
