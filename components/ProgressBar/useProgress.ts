import { clientRouter } from "@/components/ProgressBar";
import { create } from "zustand";

const START_WIDTH = 5;
const START_TIME = 270;
const RISING_TIME = 2700;
const RETRY_TIME = 8000;
const MAX_RETRIES = 7;

let currentId = 0;
let retriesCount = 0;
let retrying = false;

interface Values {
  id: number;
  width: number;
  ending: boolean;
  error: string | null;
}

const initValues: Values = {
  id: currentId,
  width: 0,
  ending: false,
  error: null,
};

interface Actions {
  start: (promise: Promise<unknown>, pathname: string) => void;
}

export const useProgress = create<Values & Actions>((set, get) => ({
  ...initValues,

  start(promise, pathname) {
    const time = Date.now();
    const id = ++currentId;

    let stopped = retrying ? true : false;

    set({ id, width: retrying ? 100 : 0, ending: false });
    if (retrying) {
      retriesCount += 1;
      retrying = false;
    } else retriesCount = 0;

    applyProgress();

    function applyProgress() {
      if (get().id !== id) return;

      const diff = Date.now() - time;
      if (diff < START_TIME) {
        set({ width: (START_WIDTH * diff) / START_TIME });
        requestAnimationFrame(applyProgress);
        return;
      }

      if (stopped) {
        if (diff > RETRY_TIME) {
          if (retriesCount <= MAX_RETRIES) {
            retrying = true;
            clientRouter.push(pathname);
            return;
          } else {
            const error = `Failed to change route from ${window.location.pathname} to ${pathname}. Please try again.`;
            set({ ...initValues, error });
            throw new Error(error);
          }
        } else if (window.location.pathname === pathname) {
          set(initValues);
          return;
        }
      }

      if (diff < RISING_TIME) {
        set({
          width:
            START_WIDTH +
            ((diff - START_TIME) / (RISING_TIME - START_TIME)) * 100,
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
