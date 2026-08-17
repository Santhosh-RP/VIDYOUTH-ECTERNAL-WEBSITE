"use client";

import { useRef, type ReactNode } from "react";
import { motion, type MotionValue } from "framer-motion";
import {
  useScrollFrames,
  type ScrollFramesOptions,
} from "../hooks/useScrollFrames";

// Re-exported so callers can `import { ScrollFrameSequence, easeInOutCubic }`
// from a single module — same ergonomics as AdvancedScrollVideoPlayer.
export {
  easeOutCubic,
  easeInOutCubic,
  easeOutQuart,
} from "../hooks/useScrollVideo";

export type ScrollFrameSequenceProps = {
  /** Directory the frames live in, e.g. `/frames`. */
  frameDir: string;
  /** Total number of frames in the on-disk sequence. */
  frameCount: number;
  /**
   * Inclusive sub-range of frame indices this instance scrubs.
   * Defaults to `[0, frameCount - 1]`. Use to split one sequence across
   * multiple sections so frame progression resumes seamlessly.
   */
  frameRange?: [number, number];
  /** Filename prefix. Default `frame_`. */
  framePrefix?: string;
  /** Zero-pad width of the frame number. Default `4` (→ `0001`). */
  framePad?: number;
  /** Frame file extension (no dot). Default `webp`. */
  frameExt?: string;
  /** 1-based index of the first frame file. Default `1`. */
  frameStart?: number;
  /** Total scroll-length of the section. Default `300vh`. */
  height?: string;
  /** Easing applied to raw scroll progress. */
  easing?: ScrollFramesOptions["easing"];
  /** Fires every animation frame with the eased progress. */
  onProgress?: ScrollFramesOptions["onProgress"];
  /** Extra CSS classes for the outer section. */
  className?: string;
  /** Extra CSS classes for the inner sticky stage. */
  stageClassName?: string;
  /**
   * Optional motion value bound to the sticky stage's opacity. Use to fade
   * the cinematic background in/out at section boundaries — e.g. to hide
   * the canvas while a non-cinematic interlude is on screen. When `0` the
   * canvas (and Vignette + overlay children) become fully invisible and
   * `pointer-events: none`, so the satellite cannot bleed through the
   * neighbouring section during sticky-release scroll overlap.
   */
  stageOpacity?: MotionValue<number>;
  /**
   * Either a node, or a render-prop receiving the current scrub progress
   * (0→1) so overlays can react to scroll directly.
   */
  children?: ReactNode | ((progress: number) => ReactNode);
};

/**
 * Scroll-scrubbed image sequence — a drop-in replacement for
 * `AdvancedScrollVideoPlayer` that paints a preloaded frame set onto a
 * `<canvas>` instead of seeking a `<video>`. Same outer/sticky-stage shell
 * and the same `height` / `easing` / `onProgress` / `children` contract, so
 * the overlay/scene layout stays untouched.
 */
export function ScrollFrameSequence({
  frameDir,
  frameCount,
  frameRange,
  framePrefix = "frame_",
  framePad = 4,
  frameExt = "webp",
  frameStart = 1,
  height = "300vh",
  easing,
  onProgress,
  className = "",
  stageClassName = "",
  stageOpacity,
  children,
}: ScrollFrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const base = frameDir.replace(/\/$/, "");
  const frameUrl = (i: number) =>
    `${base}/${framePrefix}${String(i + frameStart).padStart(framePad, "0")}.${frameExt}`;

  const { progress, ready } = useScrollFrames(containerRef, canvasRef, {
    frameCount,
    frameUrl,
    frameRange,
    easing,
    onProgress,
  });

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      <motion.div
        style={stageOpacity ? { opacity: stageOpacity } : undefined}
        className={`sticky top-0 h-screen w-full overflow-hidden bg-black ${stageClassName}`}
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />

        {/* Quiet loader — only visible until the first frame is painted. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-cyan-300/60">
            Loading
          </span>
        </div>

        {typeof children === "function" ? children(progress) : children}
      </motion.div>
    </section>
  );
}
