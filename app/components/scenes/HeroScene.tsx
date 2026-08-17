"use client";

import { motion, useTransform, type Variants } from "framer-motion";
import { ScrollScene, useSceneProgress } from "../cinematic/ScrollScene";
import { SceneTransition } from "../cinematic/SceneTransition";
import { ParallaxLayer } from "../cinematic/ParallaxLayer";
import SplineScene from "../SplineScene";
import { EASE_OUT_QUART } from "@/app/lib/easing";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.25 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE_OUT_QUART },
  },
};

export function HeroScene() {
  return (
    <ScrollScene id="hero" index={0} height="240vh" zIndex={1}>
      <HeroStage />
    </ScrollScene>
  );
}

function HeroStage() {
  const { progress } = useSceneProgress();
  const splineOpacity = useTransform(progress, [0, 0.45, 0.85], [1, 0.55, 0]);
  const scrollIndicator = useTransform(progress, [0, 0.06], [1, 0]);

  return (
    <>
      <ParallaxLayer
        depth={0.3}
        travel={80}
        className="pointer-events-none absolute inset-0 z-[1]"
      >
        <SplineScene
          progress={progress}
          motionEnabled
          contentOpacity={splineOpacity}
        />
      </ParallaxLayer>

      <SceneTransition
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start px-6 md:px-12 lg:px-16"
        scaleValues={[1, 0.96, 0.9]}
        yValues={[0, -8, -32]}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex w-full flex-col items-start"
        >
          <motion.div
            variants={fadeUp}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.4em] text-cyan-200/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
          >
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            Introducing Vidyouth · 2026
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-tighter text-white md:text-6xl lg:text-7xl"
          >
            Intelligence,
            <br />
            <span className="text-white/55">rendered cinematically.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
          >
            A new class of generative systems built at the intersection of
            space, circuitry, and human craft. Quiet, immersive, and tuned for
            the work that matters.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#access"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-cyan-300 px-7 py-3 text-sm font-medium text-[#04061a] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_24px_-12px_rgba(8,18,46,0.9)] transition-transform duration-500 active:scale-[0.98]"
            >
              <span className="relative z-10">Enter the Platform</span>
              <span className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
            </a>
            <a
              href="#intelligence"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 py-3 text-sm font-medium text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
            >
              Watch the film
            </a>
          </motion.div>
        </motion.div>
      </SceneTransition>

      <motion.div
        style={{ opacity: scrollIndicator }}
        className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/40">
          <span>Scroll</span>
          <motion.span
            className="h-8 w-px bg-gradient-to-b from-white/60 to-transparent"
            animate={{ scaleY: [0.4, 1, 0.4] }}
            style={{ transformOrigin: "top" }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </>
  );
}
