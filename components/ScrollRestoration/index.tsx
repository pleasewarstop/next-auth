"use client";

import { useEffect } from "react";

export interface Props {}
export function ScrollRestoration({}: Props) {
  useEffect(() => {
    window.history.scrollRestoration = "auto";

    function onBeforeUnload() {
      window.history.scrollRestoration = "manual";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return null;
}
