"use client";

import { motion, useTransform, type MotionStyle } from "framer-motion";
import type { ReactNode } from "react";
import { useSceneProgress } from "./ScrollScene";

export type ParallaxLayerProps = {
  /**
   * Depth multiplier. 0 = locked to viewport, 1 = scrolls at scene speed.
   * Values > 1 over-scroll for foreground depth. Negative values invert.
   */
  depth?: number;
  /** Distance, in vh, that the layer travels across the scene at depth=1. */
  travel?: number;
  /** Scale change across the scene. Useful for slow "push in" backgrounds. */
  scaleFrom?: number;
  scaleTo?: number;
  /** Optional blur range, in pixels, across the scene. */
  blurFrom?: number;
  blurTo?: number;
  /** Optional opacity range across the scene. */
  opacityFrom?: number;
  opacityTo?: number;
  className?: string;
  style?: MotionStyle;
  children: ReactNode;
};

/**
 * Layer that translates / scales / fades in response to the parent scene's
 * scroll progress. Stack multiple ParallaxLayers with different `depth`
 * values to build a sense of depth between background, midground, foreground.
 */
export function ParallaxLayer({
  depth = 0.5,
  travel = 100,
  scaleFrom,
  scaleTo,
  blurFrom,
  blurTo,
  opacityFrom,
  opacityTo,
  className = "",
  style,
  children,
}: ParallaxLayerProps) {
  const { progress } = useSceneProgress();

  const y = useTransform(progress, [0, 1], [0, -travel * depth]);

  const scale = useTransform(
    progress,
    [0, 1],
    [scaleFrom ?? 1, scaleTo ?? scaleFrom ?? 1]
  );
  const filter = useTransform(
    progress,
    [0, 1],
    [`blur(${blurFrom ?? 0}px)`, `blur(${blurTo ?? blurFrom ?? 0}px)`]
  );
  const opacity = useTransform(
    progress,
    [0, 1],
    [opacityFrom ?? 1, opacityTo ?? opacityFrom ?? 1]
  );

  const motionStyle: MotionStyle = {
    y,
    willChange: "transform, opacity, filter",
    ...style,
  };

  if (scaleFrom !== undefined || scaleTo !== undefined) {
    motionStyle.scale = scale;
  }
  if (blurFrom !== undefined || blurTo !== undefined) {
    motionStyle.filter = filter;
  }
  if (opacityFrom !== undefined || opacityTo !== undefined) {
    motionStyle.opacity = opacity;
  }

  return (
    <motion.div className={className} style={motionStyle}>
      {children}
    </motion.div>
  );
}
