import { useEffect, RefObject } from "react";

type ResizeCallback = (entry: ResizeObserverEntry) => void;

export function useResizeObserver<T extends Element>(
  ref: RefObject<T | null>,
  cb: ResizeCallback,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        cb(entries[0]);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, cb]);
}
