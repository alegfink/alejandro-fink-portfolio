"use client";

import { useEffect, useState } from "react";

const LOADER_EXIT_EVENT = "portfolio-loader:exiting";

export function usePageEntrance() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;

    const reveal = () => {
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setIsReady(true));
      });
    };

    const loader = document.querySelector<HTMLElement>("[data-portfolio-loader]");
    const sessionLoaderSkipped = document.documentElement.dataset.portfolioLoaderSeen === "true";
    if (sessionLoaderSkipped || !loader || loader.dataset.phase === "exiting") {
      reveal();
    } else {
      window.addEventListener(LOADER_EXIT_EVENT, reveal, { once: true });
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener(LOADER_EXIT_EVENT, reveal);
    };
  }, []);

  return isReady;
}

export const pageEntranceEvent = LOADER_EXIT_EVENT;
