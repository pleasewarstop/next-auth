"use client";

import { useProgress } from "@/components/ProgressBar/useProgress";
import s from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const clientRouter = {} as any;

export interface Props {}
export function ProgressBar({}: Props) {
  const { width, flickering, error } = useProgress();
  const router = useRouter();
  useEffect(() => {
    clientRouter.push = router.push;
  }, [router.push]);

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
