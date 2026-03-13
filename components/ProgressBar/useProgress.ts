import { create } from "zustand";

const DELAY_TIME = 500;
const GUARANTEED_WIDTH = 5;
const GUARANTEED_TIME = 770;
const RISING_TIME = 3200;

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

    handleProgress();

    setTimeout(() => {
      if (!stopped) handleProgress();
    }, DELAY_TIME);

    function handleProgress() {
      if (get().id !== id) return;

      const duration = Date.now() - startTime;

      if (duration < GUARANTEED_TIME) {
        set({
          width:
            GUARANTEED_WIDTH *
            ((duration - DELAY_TIME) / (GUARANTEED_TIME - DELAY_TIME)),
        });
        requestAnimationFrame(handleProgress);
      } else if (duration < RISING_TIME) {
        set({
          width:
            GUARANTEED_WIDTH +
            ((duration - GUARANTEED_TIME) / (RISING_TIME - GUARANTEED_TIME)) *
              100,
        });
        if (!stopped) requestAnimationFrame(handleProgress);
      } else if (!get().flickering) {
        set({ width: 100, flickering: true });
      }
    }

    promise.finally(() => {
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
