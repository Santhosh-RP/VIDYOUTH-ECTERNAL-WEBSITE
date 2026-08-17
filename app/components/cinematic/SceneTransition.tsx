"use client";

import { motion, useTransform, type MotionStyle } from "framer-motion";
import type { ReactNode } from "react";
import { useSceneProgress } from "./ScrollScene";

type Range = readonly [number, number, number];

export type SceneTransitionProps = {
  /** Progress points where opacity hits its 3 sample values. */
  opacityRange?: Range;
  opacityValues?: Range;
  /** Progress points + values for scale (e.g. shrink as we leave). */
  scaleRange?: Range;
  scaleValues?: Range;
  /** Progress points + values for translateY in viewport units. */
  yRange?: Range;
  yValues?: Range;
  /** Blur (px) across the scene. Pass [0, 0, n] for a leaving blur. */
  blurRange?: Range;
  blurValues?: Range;
  className?: string;
  style?: MotionStyle;
  children: ReactNode;
};

const DEFAULTS = {
  opacityRange: [0, 0.45, 0.85] as const,
  opacityValues: [1, 0.85, 0] as const,
  scaleRange: [0, 0.6, 1] as const,
  scaleValues: [1, 0.97, 0.92] as const,
  yRange: [0, 0.6, 1] as const,
  yValues: [0, -20, -60] as const,
  blurRange: [0, 0.55, 1] as const,
  blurValues: [0, 0, 8] as const,
};

/**
 * Drop-in cinematic exit transition for a scene's content block.
 * As the parent scene scrolls past, the wrapped content scales down,
 * lifts, blurs, and fades out — the next stacked scene takes over.
 */
export function SceneTransition({
  opacityRange = DEFAULTS.opacityRange,
  opacityValues = DEFAULTS.opacityValues,
  scaleRange = DEFAULTS.scaleRange,
  scaleValues = DEFAULTS.scaleValues,
  yRange = DEFAULTS.yRange,
  yValues = DEFAULTS.yValues,
  blurRange = DEFAULTS.blurRange,
  blurValues = DEFAULTS.blurValues,
  className = "",
  style,
  children,
}: SceneTransitionProps) {
  const { progress } = useSceneProgress();

  const opacity = useTransform(progress, [...opacityRange], [...opacityValues]);
  const scale = useTransform(progress, [...scaleRange], [...scaleValues]);
  const y = useTransform(
    progress,
    [...yRange],
    yValues.map((v) => `${v}vh`)
  );
  const filter = useTransform(
    progress,
    [...blurRange],
    blurValues.map((v) => `blur(${v}px)`)
  );

  return (
    <motion.div
      className={className}
      style={{
        opacity,
        scale,
        y,
        filter,
        willChange: "transform, opacity, filter",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
