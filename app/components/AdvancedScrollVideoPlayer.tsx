"use client";

import { useRef, type ReactNode } from "react";
import {
  useScrollVideo,
  type ScrollVideoOptions,
} from "../hooks/useScrollVideo";

export { easeOutCubic, easeInOutCubic, easeOutQuart } from "../hooks/useScrollVideo";

export type AdvancedScrollVideoPlayerProps = {
  /** Path to the video. */
  src: string;
  /** Optional poster image painted before the first frame is ready. */
  poster?: string;
  /** Total scroll-length of the section. Default `300vh`. */
  height?: string;
  /** Easing function applied to raw scroll progress. */
  easing?: ScrollVideoOptions["easing"];
  /** Map raw progress 0→1 onto a sub-range of the video time. */
  videoRange?: ScrollVideoOptions["videoRange"];
  /** Fires every animation frame with the eased progress. */
  onProgress?: ScrollVideoOptions["onProgress"];
  /** Extra CSS classes for the outer section. */
  className?: string;
  /** Extra CSS classes for the inner sticky stage. */
  stageClassName?: string;
  /**
   * Either a node, or a render-prop receiving the current scrub progress
   * (0→1) so overlays can react to scroll directly.
   */
  children?: ReactNode | ((progress: number) => ReactNode);
};

/**
 * Configurable scroll-scrubbed video. Adds easing, a video sub-range, and
 * a progress callback / render-prop on top of `ScrollVideoPlayer`.
 */
export function AdvancedScrollVideoPlayer({
  src,
  poster,
  height = "300vh",
  easing,
  videoRange,
  onProgress,
  className = "",
  stageClassName = "",
  children,
}: AdvancedScrollVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { progress } = useScrollVideo(containerRef, videoRef, {
    easing,
    videoRange,
    onProgress,
  });

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      <div
        className={`sticky top-0 h-screen w-full overflow-hidden bg-black ${stageClassName}`}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {typeof children === "function" ? children(progress) : children}
      </div>
    </section>
  );
}
