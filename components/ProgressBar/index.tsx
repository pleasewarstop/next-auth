"use client";

import { useProgress } from "@/components/ProgressBar/useProgress";
import s from "./styles.module.scss";

export interface Props {}
export function ProgressBar({}: Props) {
  const { width, ending } = useProgress();

  return (
    <div
      className={s.container}
      style={{
        width: `${width}%`,
        animation: ending ? `${s.ending} 2.5s infinite linear` : undefined,
      }}
    />
  );
}
