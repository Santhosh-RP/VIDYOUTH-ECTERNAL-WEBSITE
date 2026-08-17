"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { ScrollTrigger } from "@/app/lib/gsap";

type SceneProgressContextValue = {
  /** 0 → 1 across the scene's pin range. Driven by ScrollTrigger + Lenis. */
  progress: MotionValue<number>;
  index: number;
};

const SceneProgressContext = createContext<SceneProgressContextValue | null>(
  null
);

export function useSceneProgress(): SceneProgressContextValue {
  const ctx = useContext(SceneProgressContext);
  if (!ctx) {
    throw new Error(
      "useSceneProgress must be used inside a <ScrollScene> subtree."
    );
  }
  return ctx;
}

export type ScrollSceneProps = {
  id?: string;
  index?: number;
  /**
   * Outer section height. The inner stage is pinned for the duration
   * (height - 100vh) of scroll progress. Larger ⇒ slower, more cinematic.
   */
  height?: string;
  className?: string;
  /** Class names applied to the inner sticky 100vh stage. */
  stageClassName?: string;
  /** Z-index for the section. Later scenes naturally cover earlier ones. */
  zIndex?: number;
  children: ReactNode;
};

/**
 * Reusable pinned scroll scene. The inner stage stays locked to the viewport
 * while the outer section scrolls past it, producing a "new scene unfolds"
 * effect when several scenes are stacked. Scene progress is shared with
 * descendants through context.
 */
export function ScrollScene({
  id,
  index = 0,
  height = "200vh",
  className = "",
  stageClassName = "",
  zIndex,
  children,
}: ScrollSceneProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress.set(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [progress]);

  const style: CSSProperties = { height, zIndex };

  return (
    <SceneProgressContext.Provider value={{ progress, index }}>
      <section
        ref={sectionRef}
        id={id}
        data-scene-index={index}
        className={`relative w-full ${className}`}
        style={style}
      >
        <div
          className={`sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden ${stageClassName}`}
        >
          {children}
        </div>
      </section>
    </SceneProgressContext.Provider>
  );
}
