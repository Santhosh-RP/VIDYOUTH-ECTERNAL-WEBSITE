"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/app/lib/gsap";
import { SCENES } from "@/app/lib/scenes";

/**
 * Floating dot rail showing which scene the viewer is currently in.
 * Wires into ScrollTrigger directly so its highlight tracks the same
 * progress the scenes are reading.
 */
export function SceneIndicator() {
  const [active, setActive] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const compute = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const triggers = ScrollTrigger.getAll().filter((t) =>
        (t.trigger as HTMLElement | undefined)?.dataset?.sceneIndex !== undefined
      );

      let current = 0;
      for (const t of triggers) {
        const el = t.trigger as HTMLElement;
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        if (scrollY + vh * 0.55 >= top) {
          current = Number(el.dataset.sceneIndex);
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <nav
      aria-label="Scene navigation"
      className="pointer-events-auto fixed right-6 top-1/2 z-[50] hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
    >
      {SCENES.map((scene) => {
        const isActive = scene.index === active;
        return (
          <a
            key={scene.id}
            href={`#${scene.id}`}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.34em] text-white/40 transition-colors hover:text-white"
          >
            <span
              className={`whitespace-nowrap transition-all duration-500 ${
                isActive ? "text-white opacity-100" : "opacity-0 group-hover:opacity-80"
              }`}
            >
              {scene.label}
            </span>
            <span
              className={`relative h-[6px] w-[6px] rounded-full transition-all duration-500 ${
                isActive ? "scale-[1.6] bg-cyan-300" : "bg-white/30"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
