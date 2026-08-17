"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type ScrollFramesOptions = {
  /** Total number of frames in the on-disk sequence. */
  frameCount: number;
  /** Builds the URL for absolute frame index `i` (0-based). */
  frameUrl: (i: number) => string;
  /**
   * Inclusive sub-range of absolute frame indices this instance scrubs.
   * Defaults to `[0, frameCount - 1]`. Only frames in this range are
   * preloaded.
   */
  frameRange?: [number, number];
  /**
   * Easing applied to raw scroll progress (0→1) before mapping to a frame
   * index. Mirrors `useScrollVideo` so easings are interchangeable.
   */
  easing?: (t: number) => number;
  /** Fires every animation frame with the eased progress (0→1). */
  onProgress?: (progress: number) => void;
  /**
   * When false, the hook does not store eased progress in React state, so the
   * host component never re-renders on scroll. Use this when the consumer only
   * needs `ready`/`loaded` (e.g. a pure background canvas) — `onProgress` still
   * fires for imperative consumers. Defaults to true.
   */
  trackProgress?: boolean;
};

export type ScrollFramesState = {
  /** Eased scroll progress, 0→1 within the container. */
  progress: number;
  /** True once the first frame in the range has decoded and been painted. */
  ready: boolean;
  /** Fraction of in-range frames preloaded so far, 0→1. */
  loaded: number;
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

// How far outside the viewport each zone reaches:
//   LOAD   — preload frames this far ahead, unload once this far past.
//   RENDER — only run the rAF paint loop within this margin.
const LOAD_MARGIN = "1400px 0px";
const RENDER_MARGIN = "120px 0px";

/**
 * Scroll-scrubbed image sequence. Paints the frame matching the container's
 * scroll position onto a `<canvas>` with object-cover sizing — deterministic
 * and frame-accurate, no `<video>` seek latency.
 *
 * Lifecycle is fully self-contained so multiple instances can coexist
 * without a global canvas:
 *   - Frames preload only when the section nears the viewport (LOAD zone)
 *     and are released — `img.src` cleared, references dropped — once it is
 *     well past, so an inactive sequence holds no memory.
 *   - The rAF paint loop runs only while the section is on/near screen
 *     (RENDER zone); a hidden canvas is never painted.
 */
export function useScrollFrames(
  containerRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: ScrollFramesOptions,
): ScrollFramesState {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const { frameCount, frameUrl } = optionsRef.current;
    const [rStart, rEnd] = optionsRef.current.frameRange ?? [
      0,
      frameCount - 1,
    ];
    const rLen = rEnd - rStart + 1;
    if (rLen <= 0) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let cancelled = false;
    let rafId = 0;
    let renderActive = false;

    // ── Frame store (lazily populated / released) ─────────────────────────
    // images[relIdx] ↔ absolute frame (rStart + relIdx)
    let images: HTMLImageElement[] = [];
    let loadedFlags: boolean[] = [];
    let loadedCount = 0;
    let isLoaded = false;
    let lastDrawn: HTMLImageElement | null = null;
    let lastRelIndex = -1;

    const ensureLoaded = () => {
      if (isLoaded || cancelled) return;
      isLoaded = true;
      images = new Array(rLen);
      loadedFlags = new Array<boolean>(rLen).fill(false);
      loadedCount = 0;
      for (let i = 0; i < rLen; i++) {
        const img = new Image();
        img.decoding = "async";
        const done = () => {
          if (cancelled || !isLoaded || loadedFlags[i]) return;
          loadedFlags[i] = true;
          loadedCount++;
          setLoaded(loadedCount / rLen);
          if (i === 0) {
            setReady(true);
            paintFromScroll(); // show the first frame as soon as it's ready
          }
        };
        img.onload = done;
        img.onerror = done; // don't stall the loader on a single bad frame
        img.src = frameUrl(rStart + i);
        images[i] = img;
      }
    };

    // Release every frame so an offscreen sequence holds no memory.
    const unload = () => {
      if (!isLoaded) return;
      isLoaded = false;
      for (const img of images) {
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.src = "";
        }
      }
      images = [];
      loadedFlags = [];
      loadedCount = 0;
      lastDrawn = null;
      lastRelIndex = -1;
      setReady(false);
      setLoaded(0);
    };

    // Requested frame if decoded, else the closest decoded neighbour so
    // scrubbing stays filled while preloading.
    const pickImage = (relIdx: number): HTMLImageElement | null => {
      if (!isLoaded) return null;
      if (loadedFlags[relIdx]) return images[relIdx];
      for (let d = 1; d < rLen; d++) {
        if (relIdx - d >= 0 && loadedFlags[relIdx - d])
          return images[relIdx - d];
        if (relIdx + d < rLen && loadedFlags[relIdx + d])
          return images[relIdx + d];
      }
      return null;
    };

    // ── Canvas paint (object-cover, DPR-aware) ───────────────────────────
    const drawImageCover = (img: HTMLImageElement) => {
      const dpr = window.devicePixelRatio || 1;
      const cw = Math.round(canvas.clientWidth * dpr);
      const ch = Math.round(canvas.clientHeight * dpr);
      if (cw === 0 || ch === 0) return;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawn = img;
    };

    // ── Scroll → frame index ─────────────────────────────────────────────
    let lastEmitted = -1;

    const computeEased = () => {
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      const raw = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      const easeFn = optionsRef.current.easing;
      return easeFn ? easeFn(raw) : raw;
    };

    const paintFromScroll = () => {
      const eased = computeEased();
      const relIdx = clamp(Math.round(eased * (rLen - 1)), 0, rLen - 1);
      const img = pickImage(relIdx);
      if (img && img !== lastDrawn) drawImageCover(img);
    };

    const tick = () => {
      if (cancelled || !renderActive) {
        rafId = 0;
        return;
      }

      const eased = computeEased();
      if (Math.abs(eased - lastEmitted) > 1 / 1000) {
        lastEmitted = eased;
        if (optionsRef.current.trackProgress !== false) setProgress(eased);
        optionsRef.current.onProgress?.(eased);
      }

      const relIdx = clamp(Math.round(eased * (rLen - 1)), 0, rLen - 1);
      const img = pickImage(relIdx);
      if (img && (relIdx !== lastRelIndex || img !== lastDrawn)) {
        drawImageCover(img);
        lastRelIndex = relIdx;
      }

      rafId = requestAnimationFrame(tick);
    };

    const startTick = () => {
      if (!rafId && renderActive && !cancelled) {
        rafId = requestAnimationFrame(tick);
      }
    };

    // ── Visibility zones ─────────────────────────────────────────────────
    // LOAD zone (wide): preload ahead, unload once well past.
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) ensureLoaded();
        else unload();
      },
      { rootMargin: LOAD_MARGIN },
    );
    loadObserver.observe(container);

    // RENDER zone (narrow): only paint while on/near screen.
    const renderObserver = new IntersectionObserver(
      ([entry]) => {
        renderActive = entry.isIntersecting;
        if (renderActive) {
          paintFromScroll();
          startTick();
        }
      },
      { rootMargin: RENDER_MARGIN },
    );
    renderObserver.observe(container);

    // Synchronous fallback for the section already in view at mount.
    const initRect = container.getBoundingClientRect();
    const initVh = window.innerHeight;
    if (initRect.bottom > -1400 && initRect.top < initVh + 1400) {
      ensureLoaded();
    }
    if (initRect.bottom > 0 && initRect.top < initVh) {
      renderActive = true;
      startTick();
    }

    const onResize = () => {
      lastDrawn = null; // force a repaint at the new size
      paintFromScroll();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      loadObserver.disconnect();
      renderObserver.disconnect();
      window.removeEventListener("resize", onResize);
      unload();
    };
  }, [containerRef, canvasRef]);

  return { progress, ready, loaded };
}
