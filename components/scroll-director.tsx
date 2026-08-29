"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  clampProgress,
  getHorizontalStoryScrollProgress,
  getProjectStoryIndex,
  getReadableHorizontalProgress,
} from "@/lib/scroll-motion";

type HorizontalStoryState = {
  element: HTMLElement;
  rail: HTMLElement;
  cards: HTMLElement[];
  progress: number;
  pointerId: number | null;
  pointerStartX: number;
  pointerStartY: number;
  startProgress: number;
  dragging: boolean;
  scrollSync: {
    progress: number;
    targetY: number;
    deadline: number;
  } | null;
};

export function ScrollDirector() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const story = document.querySelector<HTMLElement>("[data-project-story]");
    const storySlides = story ? Array.from(story.querySelectorAll<HTMLElement>("[data-story-slide]")) : [];
    const storyMarkers = story ? Array.from(story.querySelectorAll<HTMLButtonElement>("[data-story-marker]")) : [];
    const viewedProjects = new Set<string>();

    const selectStorySlide = (activeIndex: number) => {
      storySlides.forEach((slide, index) => {
        const state = index < activeIndex ? "before" : index === activeIndex ? "active" : "after";
        slide.dataset.state = state;
        slide.setAttribute("aria-hidden", state === "active" ? "false" : "true");
        slide.querySelectorAll<HTMLElement>("a, button").forEach((control) => {
          control.tabIndex = state === "active" ? 0 : -1;
        });
      });
      storyMarkers.forEach((marker, index) => {
        const isActive = index === activeIndex;
        marker.dataset.state = isActive ? "active" : "idle";
        if (isActive) marker.setAttribute("aria-current", "step");
        else marker.removeAttribute("aria-current");
      });
      story?.style.setProperty("--active-project", String(activeIndex));
      const projectId = storySlides[activeIndex]?.dataset.projectId;
      const locale = document.documentElement.lang === "en" ? "en" : "es";
      if (projectId && !viewedProjects.has(projectId) && trackEvent("project_story_view", { projectId, locale, position: activeIndex + 1 })) {
        viewedProjects.add(projectId);
      }
    };

    if (reducedMotion) {
      root.dataset.motion = "reduced";
      storySlides.forEach((slide) => {
        slide.dataset.state = "active";
        slide.setAttribute("aria-hidden", "false");
        slide.querySelectorAll<HTMLElement>("a, button").forEach((control) => {
          control.tabIndex = 0;
        });
      });
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        element.dataset.reveal = "visible";
      });
      return () => {
        delete root.dataset.motion;
        root.style.removeProperty("--page-progress");
      };
    }

    root.dataset.motion = "ready";
    selectStorySlide(0);

    const horizontalStories: HorizontalStoryState[] = Array.from(
      document.querySelectorAll<HTMLElement>("[data-horizontal-story]"),
    ).flatMap((element) => {
      const rail = element.querySelector<HTMLElement>("[data-capability-rail]");
      if (!rail) return [];
      return [{
        element,
        rail,
        cards: Array.from(rail.children) as HTMLElement[],
        progress: 0,
        pointerId: null,
        pointerStartX: 0,
        pointerStartY: 0,
        startProgress: 0,
        dragging: false,
        scrollSync: null,
      }];
    });

    const getRailTravel = ({ cards }: HorizontalStoryState) => (
      cards.length > 1 ? cards[cards.length - 1].offsetLeft - cards[0].offsetLeft : 0
    );

    const renderHorizontalProgress = (state: HorizontalStoryState, progress: number) => {
      const safeProgress = clampProgress(progress);
      state.progress = safeProgress;
      state.element.style.setProperty("--horizontal-progress", String(safeProgress));
      state.element.style.setProperty("--horizontal-shift", `${getRailTravel(state) * safeProgress * -1}px`);
    };

    const scrollToHorizontalStop = (state: HorizontalStoryState, requestedIndex: number) => {
      if (!state.cards.length) return;
      const targetIndex = Math.min(state.cards.length - 1, Math.max(0, requestedIndex));
      const storyTop = window.scrollY + state.element.getBoundingClientRect().top;
      const travel = Math.max(1, state.element.offsetHeight - window.innerHeight);
      const targetProgress = targetIndex / Math.max(1, state.cards.length - 1);
      const targetY = storyTop + travel * getHorizontalStoryScrollProgress(targetIndex, state.cards.length);
      state.scrollSync = { progress: targetProgress, targetY, deadline: performance.now() + 1200 };
      renderHorizontalProgress(state, targetProgress);
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    };

    const scrollToStorySlide = (requestedIndex: number) => {
      if (!story || !storySlides.length) return;
      const activeIndex = Math.min(storySlides.length - 1, Math.max(0, requestedIndex));
      const storyTop = window.scrollY + story.getBoundingClientRect().top;
      const travel = Math.max(1, story.offsetHeight - window.innerHeight);
      const targetProgress = (activeIndex + 0.5) / storySlides.length;
      selectStorySlide(activeIndex);
      window.scrollTo({
        top: storyTop + travel * targetProgress,
        behavior: "smooth",
      });
    };

    const markerListeners = storyMarkers.map((marker, index) => {
      const handleClick = () => scrollToStorySlide(index);
      const handleKeyDown = (event: KeyboardEvent) => {
        let targetIndex: number | null = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % storyMarkers.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + storyMarkers.length) % storyMarkers.length;
        if (event.key === "Home") targetIndex = 0;
        if (event.key === "End") targetIndex = storyMarkers.length - 1;
        if (targetIndex === null) return;
        event.preventDefault();
        storyMarkers[targetIndex]?.focus();
        scrollToStorySlide(targetIndex);
      };
      marker.addEventListener("click", handleClick);
      marker.addEventListener("keydown", handleKeyDown);
      return { marker, handleClick, handleKeyDown };
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) (entry.target as HTMLElement).dataset.reveal = "visible";
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.12 },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => revealObserver.observe(element));

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const documentTravel = document.documentElement.scrollHeight - viewport;
      root.style.setProperty("--page-progress", String(documentTravel > 0 ? clampProgress(window.scrollY / documentTravel) : 0));

      document.querySelectorAll<HTMLElement>("[data-scroll-hero]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const travel = Math.max(1, element.offsetHeight - viewport);
        element.style.setProperty("--hero-progress", String(clampProgress(-rect.top / travel)));
      });

      if (story && storySlides.length) {
        const rect = story.getBoundingClientRect();
        const travel = Math.max(1, story.offsetHeight - viewport);
        const progress = clampProgress(-rect.top / travel);
        const storyPosition = progress * storySlides.length;
        const active = getProjectStoryIndex(progress, storySlides.length);
        const localProgress = active === storySlides.length - 1 && progress === 1 ? 1 : storyPosition - active;
        story.style.setProperty("--story-progress", String(progress));
        story.style.setProperty("--story-drift", `${(0.5 - localProgress) * 22}px`);
        story.style.setProperty("--story-copy-drift", `${(0.5 - localProgress) * 14}px`);
        story.style.setProperty("--story-scale", String(0.985 + localProgress * 0.015));
        story.style.setProperty("--story-image-shift", `${localProgress * -2.4}%`);
        selectStorySlide(active);
      }

      horizontalStories.forEach((state) => {
        if (state.dragging) return;
        if (state.scrollSync) {
          const reachedTarget = Math.abs(window.scrollY - state.scrollSync.targetY) < 2;
          const expired = performance.now() >= state.scrollSync.deadline;
          if (!reachedTarget && !expired) {
            renderHorizontalProgress(state, state.scrollSync.progress);
            return;
          }
          state.scrollSync = null;
        }
        const rect = state.element.getBoundingClientRect();
        const travel = Math.max(1, state.element.offsetHeight - viewport);
        renderHorizontalProgress(
          state,
          getReadableHorizontalProgress(clampProgress(-rect.top / travel), state.cards.length),
        );
      });

      document.querySelectorAll<HTMLElement>("[data-scroll-manifesto]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const travel = Math.max(1, element.offsetHeight - viewport);
        element.style.setProperty("--manifesto-progress", String(clampProgress(-rect.top / travel)));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const horizontalListeners = horizontalStories.map((state) => {
      const resetPointer = () => {
        if (state.pointerId !== null && state.rail.hasPointerCapture(state.pointerId)) {
          state.rail.releasePointerCapture(state.pointerId);
        }
        state.pointerId = null;
        state.dragging = false;
        delete state.rail.dataset.dragging;
      };

      const handlePointerDown = (event: PointerEvent) => {
        if ((event.pointerType === "mouse" && event.button !== 0) || (event.target as Element).closest("a, button")) return;
        state.scrollSync = null;
        state.pointerId = event.pointerId;
        state.pointerStartX = event.clientX;
        state.pointerStartY = event.clientY;
        state.startProgress = state.progress;
        state.dragging = false;
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerId !== state.pointerId) return;
        const deltaX = event.clientX - state.pointerStartX;
        const deltaY = event.clientY - state.pointerStartY;

        if (!state.dragging) {
          if (Math.hypot(deltaX, deltaY) < 8) return;
          if (Math.abs(deltaY) >= Math.abs(deltaX)) {
            resetPointer();
            return;
          }
          state.dragging = true;
          state.rail.dataset.dragging = "true";
          state.rail.setPointerCapture(event.pointerId);
        }

        event.preventDefault();
        renderHorizontalProgress(state, state.startProgress - deltaX / Math.max(1, getRailTravel(state)));
      };

      const handlePointerEnd = (event: PointerEvent) => {
        if (event.pointerId !== state.pointerId) return;
        const shouldSnap = state.dragging;
        const targetIndex = Math.round(state.progress * Math.max(0, state.cards.length - 1));
        resetPointer();
        if (shouldSnap) scrollToHorizontalStop(state, targetIndex);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        const currentIndex = Math.round(state.progress * Math.max(0, state.cards.length - 1));
        let targetIndex: number | null = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = currentIndex + 1;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = currentIndex - 1;
        if (event.key === "Home") targetIndex = 0;
        if (event.key === "End") targetIndex = state.cards.length - 1;
        if (targetIndex === null) return;
        event.preventDefault();
        scrollToHorizontalStop(state, targetIndex);
      };

      state.rail.addEventListener("pointerdown", handlePointerDown);
      state.rail.addEventListener("pointermove", handlePointerMove);
      state.rail.addEventListener("pointerup", handlePointerEnd);
      state.rail.addEventListener("pointercancel", handlePointerEnd);
      state.rail.addEventListener("keydown", handleKeyDown);
      return { state, handlePointerDown, handlePointerMove, handlePointerEnd, handleKeyDown };
    });

    const cancelHorizontalSync = () => {
      horizontalStories.forEach((state) => {
        state.scrollSync = null;
      });
      requestUpdate();
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("wheel", cancelHorizontalSync, { passive: true });
    window.addEventListener("touchstart", cancelHorizontalSync, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      revealObserver.disconnect();
      markerListeners.forEach(({ marker, handleClick, handleKeyDown }) => {
        marker.removeEventListener("click", handleClick);
        marker.removeEventListener("keydown", handleKeyDown);
      });
      horizontalListeners.forEach(({ state, handlePointerDown, handlePointerMove, handlePointerEnd, handleKeyDown }) => {
        state.rail.removeEventListener("pointerdown", handlePointerDown);
        state.rail.removeEventListener("pointermove", handlePointerMove);
        state.rail.removeEventListener("pointerup", handlePointerEnd);
        state.rail.removeEventListener("pointercancel", handlePointerEnd);
        state.rail.removeEventListener("keydown", handleKeyDown);
      });
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("wheel", cancelHorizontalSync);
      window.removeEventListener("touchstart", cancelHorizontalSync);
      delete root.dataset.motion;
      root.style.removeProperty("--page-progress");
    };
  }, []);

  return null;
}
