import { clientRouter } from "@/components/ProgressBar";
import { create } from "zustand";

const DELAY_TIME = 500;
const GUARANTEED_WIDTH = 5;
const GUARANTEED_TIME = 770;
const RISING_TIME = 3200;
const RETRY_DELAY = 3000;
const MAX_RETRIES = 7;

let currentId = 0;
let retriesCount = 0;
let retrying = false;

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

  start(promise, pathname) {
    const startTime = Date.now();
    const id = ++currentId;

    let stoppedTime = 0;

    set({ id, width: retrying ? 100 : 0, flickering: false });
    if (retrying) {
      retriesCount += 1;
      retrying = false;
    } else retriesCount = 0;

    handleProgress();

    function handleProgress() {
      if (get().id !== id) return;

      const duration = Date.now() - startTime;

      if (duration < DELAY_TIME) {
        if (!stoppedTime) requestAnimationFrame(handleProgress);
        return;
      }

      if (duration < GUARANTEED_TIME) {
        set({
          width:
            GUARANTEED_WIDTH *
            ((duration - DELAY_TIME) / (GUARANTEED_TIME - DELAY_TIME)),
        });
        requestAnimationFrame(handleProgress);
        return;
      }

      if (stoppedTime) {
        if (
          process.env.NODE_ENV !== "development" ||
          window.location.pathname === pathname
        ) {
          set(initValues);
          return;
        } else if (Date.now() - stoppedTime > RETRY_DELAY) {
          if (retriesCount <= MAX_RETRIES) {
            retrying = true;
            clientRouter.push(pathname);
            return;
          } else {
            const error = `Failed to change route from ${window.location.pathname} to ${pathname}. Please try again.`;
            set({ ...initValues, error });
            throw new Error(error);
          }
        }
      }

      if (duration < RISING_TIME) {
        set({
          width:
            GUARANTEED_WIDTH +
            ((duration - GUARANTEED_TIME) / (RISING_TIME - GUARANTEED_TIME)) *
              100,
        });
      } else if (!get().flickering) set({ width: 100, flickering: true });

      requestAnimationFrame(handleProgress);
    }

    promise.finally(() => {
      stoppedTime = Date.now();
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
