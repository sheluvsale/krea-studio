"use client";

import { useEffect } from "react";

export function NoCursorScript() {
  useEffect(() => {
    document.documentElement.classList.add("no-custom-cursor");
    return () => {
      document.documentElement.classList.remove("no-custom-cursor");
    };
  }, []);
  return null;
}
