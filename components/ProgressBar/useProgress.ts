import { create } from "zustand";

interface Values {
  id: number;
  width: number;
  ending: boolean;
}

let currentId = 0;

const initValues: Values = {
  id: currentId,
  width: 0,
  ending: false,
};

interface Actions {
  start: (promise: Promise<unknown>, pathname: string) => void;
}

export const useProgress = create<Values & Actions>((set, get) => ({
  ...initValues,

  start(promise, pathname) {
    const time = Date.now();
    const id = ++currentId;

    const SLOW_WIDTH = 5;
    const SLOW_TIME = 270;
    const RISING_TIME = 2700;

    let stopped = false;

    set({ id, width: 0 });
    applyProgress();

    function applyProgress() {
      if (get().id !== id) return;

      const diff = Date.now() - time;
      if (diff < SLOW_TIME) {
        set({ width: (SLOW_WIDTH * diff) / SLOW_TIME });
        requestAnimationFrame(applyProgress);
        return;
      }

      if (stopped && window.location.pathname === pathname) {
        set(initValues);
        return;
      }

      if (diff < RISING_TIME) {
        set({
          width:
            SLOW_WIDTH + ((diff - SLOW_TIME) / (RISING_TIME - SLOW_TIME)) * 100,
        });
      } else if (!get().ending) set({ width: 100, ending: true });

      requestAnimationFrame(applyProgress);
    }

    promise.finally(() => {
      stopped = true;
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
