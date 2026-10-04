"use client";

import { useEffect } from "react";

// A cross-page fragment can be restored before hydration, fonts or the loader
// have settled. Complete that navigation once the destination is ready.
export function useProjectAnchor(pageReady: boolean) {
  useEffect(() => {
    if (!pageReady) return;
    let stopFollowing = () => {};

    const followHash = () => {
      stopFollowing();
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      const target = document.getElementById(id);
      if (!target?.matches("[data-project-case]")) return;

      let stopped = false;
      let frame = 0;
      const align = () => {
        if (!stopped) target.scrollIntoView({ behavior: "instant", block: "start" });
      };
      const scheduleAlign = () => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(align);
      };
      const stop = () => {
        stopped = true;
        window.cancelAnimationFrame(frame);
        window.clearTimeout(deadline);
        observer.disconnect();
        window.removeEventListener("load", scheduleAlign);
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchstart", stop);
        window.removeEventListener("pointerdown", stop);
        window.removeEventListener("keydown", onKeyDown);
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Tab"].includes(event.key)) stop();
      };
      const observer = new ResizeObserver(scheduleAlign);
      const archive = target.closest("[data-analytics-section='projects_archive']");
      if (archive) observer.observe(archive);
      // Only stabilize the arrival. Never keep dragging a reader back to the hash.
      const deadline = window.setTimeout(stop, 2000);
      stopFollowing = stop;
      window.addEventListener("load", scheduleAlign);
      window.addEventListener("wheel", stop, { passive: true });
      window.addEventListener("touchstart", stop, { passive: true });
      window.addEventListener("pointerdown", stop, { passive: true });
      window.addEventListener("keydown", onKeyDown);
      void document.fonts.ready.then(scheduleAlign);
      scheduleAlign();
    };

    followHash();
    window.addEventListener("hashchange", followHash);
    window.addEventListener("pageshow", followHash);
    return () => {
      stopFollowing();
      window.removeEventListener("hashchange", followHash);
      window.removeEventListener("pageshow", followHash);
    };
  }, [pageReady]);
}
