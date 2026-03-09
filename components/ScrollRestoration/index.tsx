"use client";

import { useEffect } from "react";

interface Props {}
export function ScrollRestoration({}: Props) {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);
  return null;
}
