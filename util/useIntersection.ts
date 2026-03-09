import { RefObject, useEffect, useEffectEvent } from "react";

export function useIntersection(
  ref: RefObject<HTMLDivElement | null>,
  onIntersect: () => void,
  willRendered = true,
  rootMargin = "0px 0px 200px 0px",
) {
  const handleIntersect = useEffectEvent(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    },
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, rootMargin, willRendered]);
}
