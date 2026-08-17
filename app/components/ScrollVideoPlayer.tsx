"use client";

import { useRef, type ReactNode } from "react";
import { useScrollVideo } from "../hooks/useScrollVideo";

export type ScrollVideoPlayerProps = {
  /** Path to the MP4 (or any seekable video format the browser supports). */
  src: string;
  /**
   * Total scroll-length of the section in any CSS length. Larger ⇒ slower
   * scrub. The inner video stage is pinned (`sticky top-0`) for this entire
   * range, so the rest of the page is unaffected.
   */
  height?: string;
  className?: string;
  /** Optional content rendered above the video inside the sticky stage. */
  children?: ReactNode;
};

/**
 * Drop-in scroll-scrubbed video. Renders a tall section whose inner
 * 100vh stage stays sticky while the user scrolls; the video's
 * `currentTime` tracks the section's scroll progress 1:1.
 */
export function ScrollVideoPlayer({
  src,
  height = "200vh",
  className = "",
  children,
}: ScrollVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useScrollVideo(containerRef, videoRef);

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {children}
      </div>
    </section>
  );
}
