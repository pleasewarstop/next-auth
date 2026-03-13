"use client";

import { useProgress } from "@/components/ProgressBar/useProgress";
import s from "./styles.module.scss";

export interface Props {}
export function ProgressBar({}: Props) {
  const { width, flickering, error } = useProgress();

  return (
    <>
      <div
        className={s.container}
        style={{
          width: `${width}%`,
          animation: flickering
            ? `${s.flickering} 2.5s infinite linear`
            : undefined,
        }}
      />
      <span className={s.error}>{error}</span>
    </>
  );
}
