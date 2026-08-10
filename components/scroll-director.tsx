"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ScrollDirector() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const story = document.querySelector<HTMLElement>("[data-project-story]");
    const storySlides = story ? Array.from(story.querySelectorAll<HTMLElement>("[data-story-slide]")) : [];
    const storyMarkers = story ? Array.from(story.querySelectorAll<HTMLElement>("[data-story-marker]")) : [];
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
        marker.dataset.state = index === activeIndex ? "active" : "idle";
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
      root.style.setProperty("--page-progress", String(documentTravel > 0 ? clamp(window.scrollY / documentTravel) : 0));

      document.querySelectorAll<HTMLElement>("[data-scroll-hero]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const travel = Math.max(1, element.offsetHeight - viewport);
        element.style.setProperty("--hero-progress", String(clamp(-rect.top / travel)));
      });

      if (story && storySlides.length) {
        const rect = story.getBoundingClientRect();
        const travel = Math.max(1, story.offsetHeight - viewport);
        const progress = clamp(-rect.top / travel);
        const storyPosition = progress * storySlides.length;
        const active = Math.min(storySlides.length - 1, Math.floor(storyPosition));
        const localProgress = active === storySlides.length - 1 && progress === 1 ? 1 : storyPosition - active;
        story.style.setProperty("--story-progress", String(progress));
        story.style.setProperty("--story-drift", `${(0.5 - localProgress) * 22}px`);
        story.style.setProperty("--story-copy-drift", `${(0.5 - localProgress) * 14}px`);
        story.style.setProperty("--story-scale", String(0.985 + localProgress * 0.015));
        story.style.setProperty("--story-image-shift", `${localProgress * -2.4}%`);
        selectStorySlide(active);
      }

      document.querySelectorAll<HTMLElement>("[data-horizontal-story]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const travel = Math.max(1, element.offsetHeight - viewport);
        const rawProgress = clamp(-rect.top / travel);
        const rail = element.querySelector<HTMLElement>("[data-capability-rail]");
        const cards = rail ? Array.from(rail.children) as HTMLElement[] : [];
        const railTravel = cards.length > 1 ? cards[cards.length - 1].offsetLeft - cards[0].offsetLeft : 0;
        const edgeProgress = clamp((rawProgress - 0.06) / 0.82);
        const stopCount = Math.max(1, cards.length - 1);
        const position = edgeProgress * stopCount;
        const stopIndex = Math.min(stopCount - 1, Math.floor(position));
        const localProgress = edgeProgress === 1 ? 1 : position - stopIndex;
        const transitionProgress = clamp((localProgress - 0.22) / 0.56);
        const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
        const readableProgress = edgeProgress === 1 ? 1 : (stopIndex + easedProgress) / stopCount;
        element.style.setProperty("--horizontal-progress", String(readableProgress));
        element.style.setProperty("--horizontal-shift", `${railTravel * readableProgress * -1}px`);
      });

      document.querySelectorAll<HTMLElement>("[data-scroll-manifesto]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const travel = Math.max(1, element.offsetHeight - viewport);
        element.style.setProperty("--manifesto-progress", String(clamp(-rect.top / travel)));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      revealObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      delete root.dataset.motion;
      root.style.removeProperty("--page-progress");
    };
  }, []);

  return null;
}
