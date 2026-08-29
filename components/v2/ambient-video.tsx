"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/components/v2/ambient-video.module.css";

type AmbientVideoProps = {
  src: string;
  poster: string;
  className?: string;
  ariaLabel?: string;
  playLabel: string;
  decorative?: boolean;
  eager?: boolean;
};

export function AmbientVideo({
  src,
  poster,
  className,
  ariaLabel,
  playLabel,
  decorative = false,
  eager = false,
}: Readonly<AmbientVideoProps>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(eager);
  const blockedTimerRef = useRef<number | null>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [failed, setFailed] = useState(false);

  const prepareVideo = useCallback((video: HTMLVideoElement) => {
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }, []);

  const attemptPlayback = useCallback(async (fromUser = false) => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !visibleRef.current) return;

    prepareVideo(video);
    if (!fromUser && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setNeedsPlay(true);
      return;
    }

    try {
      await video.play();
      setNeedsPlay(false);
      setFailed(false);
    } catch {
      setNeedsPlay(true);
    }
  }, [prepareVideo, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldLoad) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      visibleRef.current = true;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: "700px 0px", threshold: 0.01 });

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    prepareVideo(video);
    video.load();

    const clearBlockedTimer = () => {
      if (blockedTimerRef.current === null) return;
      window.clearTimeout(blockedTimerRef.current);
      blockedTimerRef.current = null;
    };

    const queueBlockedFallback = () => {
      clearBlockedTimer();
      blockedTimerRef.current = window.setTimeout(() => {
        if (visibleRef.current && video.paused) setNeedsPlay(true);
      }, 1400);
    };

    const onReady = () => {
      void attemptPlayback();
      queueBlockedFallback();
    };
    const onPlaying = () => {
      clearBlockedTimer();
      setNeedsPlay(false);
      setFailed(false);
    };
    const onError = () => {
      clearBlockedTimer();
      setFailed(true);
      setNeedsPlay(true);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && visibleRef.current) void attemptPlayback();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = Boolean(entry?.isIntersecting);
      if (entry?.isIntersecting) {
        void attemptPlayback();
        queueBlockedFallback();
      } else {
        clearBlockedTimer();
        video.pause();
      }
    }, { threshold: 0.08 });

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibilityChange);
    observer.observe(video);
    void attemptPlayback();
    queueBlockedFallback();

    return () => {
      clearBlockedTimer();
      observer.disconnect();
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.pause();
    };
  }, [attemptPlayback, prepareVideo, shouldLoad, src]);

  const playFromControl = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!shouldLoad) setShouldLoad(true);
    visibleRef.current = true;
    prepareVideo(video);
    if (failed || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.load();
    await attemptPlayback(true);
  };

  return (
    <span className={styles.shell} data-video-state={failed ? "error" : needsPlay ? "paused" : "ready"}>
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload={shouldLoad ? "auto" : "none"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : ariaLabel}
      >
        {shouldLoad ? <source src={src} type="video/mp4" /> : null}
      </video>
      {(needsPlay || failed) ? (
        <button className={styles.playButton} type="button" onClick={playFromControl} aria-label={playLabel} />
      ) : null}
    </span>
  );
}
