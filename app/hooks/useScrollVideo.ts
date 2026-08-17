"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type ScrollVideoOptions = {
  /**
   * Easing applied to the raw scroll progress (0→1) before mapping to video
   * time. Use to bias when frames concentrate (e.g. ease-in-out for slow
   * opens/closes and fast middle).
   */
  easing?: (t: number) => number;
  /**
   * Map raw progress 0→1 onto a sub-range of the video — e.g. `[0.1, 0.9]`
   * trims the first and last 10% of the clip. Defaults to `[0, 1]`.
   */
  videoRange?: [number, number];
  /** Fires every animation frame with the eased progress (0→1). */
  onProgress?: (progress: number) => void;
  /** Disable the rAF scrubber for reduced-motion or offscreen use cases. */
  enabled?: boolean;
  /** Emit progress through React state. Disable when caller only needs video scrubbing. */
  emitProgress?: boolean;
};

export type ScrollVideoState = {
  /** Eased scroll progress, 0→1. */
  progress: number;
  /** True once the video has duration + a current frame ready to display. */
  ready: boolean;
};

/**
 * Drives a `<video>` element's `currentTime` from the scroll position of a
 * container element. The video is scrubbed frame-by-frame inside a rAF loop
 * so it stays responsive both as the user scrolls and as new bytes stream in.
 *
 * The container is expected to be taller than the viewport. Progress is 0
 * when the container's top reaches the viewport top, and 1 when its bottom
 * reaches the viewport top.
 */
export function useScrollVideo(
  containerRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  options: ScrollVideoOptions = {}
): ScrollVideoState {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const seekingRef = useRef(false);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    if (optionsRef.current.enabled === false) {
      const readyId = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(readyId);
    }

    let rafId = 0;
    let cancelled = false;
    let lastEmitted = -1;

    const tick = () => {
      if (cancelled) return;

      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      const raw = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      const easeFn = optionsRef.current.easing;
      const eased = easeFn ? easeFn(raw) : raw;

      if (Math.abs(eased - lastEmitted) > 1 / 1000) {
        lastEmitted = eased;
        if (optionsRef.current.emitProgress !== false) {
          setProgress(eased);
        }
        optionsRef.current.onProgress?.(eased);
      }

      const dur = video.duration;
      if (dur && isFinite(dur) && video.readyState >= 1) {
        const [vs, ve] = optionsRef.current.videoRange ?? [0, 1];
        const target = (vs + (ve - vs) * eased) * dur;
        const clamped = Math.min(Math.max(target, 0), dur - 0.05);

        if (
          Math.abs(video.currentTime - clamped) > 1 / 60 &&
          !seekingRef.current
        ) {
          seekingRef.current = true;
          try {
            video.currentTime = clamped;
          } catch {
            /* seek raced metadata — try again next frame */
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const onSeeked = () => {
      seekingRef.current = false;
    };

    const onReady = () => {
      if (!isFinite(video.duration)) return;
      setReady((current) => (current ? current : true));
      // Warm the decoder so the first scroll paints a non-keyframe.
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => video.pause())
          .catch(() => {
            /* autoplay rejected — scrub still works */
          });
      }
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);

    try {
      video.load();
    } catch {
      /* ignore */
    }

    if (video.readyState >= 1) onReady();

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, [containerRef, videoRef]);

  return { progress, ready };
}

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
