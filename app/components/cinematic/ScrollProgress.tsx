"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-cyan-300"
      style={{ scaleX }}
    />
  );
}
