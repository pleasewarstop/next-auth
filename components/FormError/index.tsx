import { useEffect, useEffectEvent, useRef, useState } from "react";
import cn from "classnames";
import { useResizeObserver } from "@/util/useResizeObserver";
import s from "./styles.module.scss";

const TRANSITION_DURATION = 200;
type Timer = ReturnType<typeof setTimeout>;

interface Props {
  error?: null | boolean | string;
  className?: string;
}
export function FormError({ error, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<Timer>(null);
  const [{ height, visible }, setState] = useState({
    height: 0,
    visible: false,
  });
  const set = useEffectEvent((diff: { height?: number; visible?: boolean }) => {
    setState((state) => ({ ...state, ...diff }));
  });

  useEffect(() => {
    if (error) {
      if (!visible) {
        set({ visible: true });
      } else if (!height && ref.current) {
        set({ height: ref.current.scrollHeight });
      }
    } else if (height) {
      set({ height: 0 });

      timerRef.current = setTimeout(() => {
        set({ visible: false });
      }, TRANSITION_DURATION);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [error, height, visible]);

  const onResize = useEffectEvent(() => {
    if (!ref.current) return;
    const { scrollHeight } = ref.current;
    if (visible && height !== scrollHeight) {
      set({ height: scrollHeight });
    }
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useResizeObserver(ref, onResize);

  return visible ? (
    <div
      className={cn(s.container, className)}
      style={{ height, minHeight: height, opacity: height ? 1 : 0 }}
    >
      <span ref={ref}>{error}</span>
    </div>
  ) : null;
}
