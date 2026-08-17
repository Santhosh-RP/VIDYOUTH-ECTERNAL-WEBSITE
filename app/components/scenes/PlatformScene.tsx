"use client";

import { motion, useTransform } from "framer-motion";
import { ScrollScene, useSceneProgress } from "../cinematic/ScrollScene";
import { SceneTransition } from "../cinematic/SceneTransition";
import { ParallaxLayer } from "../cinematic/ParallaxLayer";

const FEATURES = [
  {
    label: "01",
    title: "Generative Intelligence",
    body: "Adaptive models that learn the cadence of your craft and respond with cinematic precision.",
  },
  {
    label: "02",
    title: "Spatial Reasoning",
    body: "A multimodal core that perceives light, motion, and structure as a single continuous field.",
  },
  {
    label: "03",
    title: "Quiet Performance",
    body: "Sub-second inference, zero clutter. Engineered to disappear into the work itself.",
  },
];

export function PlatformScene() {
  return (
    <ScrollScene
      id="platform"
      index={3}
      height="240vh"
      zIndex={4}
      stageClassName="bg-[#040619]"
    >
      <PlatformStage />
    </ScrollScene>
  );
}

function PlatformStage() {
  const { progress } = useSceneProgress();

  return (
    <>
      <ParallaxLayer
        depth={0.25}
        travel={60}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(34,211,238,0.16),transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(34,211,238,0.10),transparent_55%)]" />
      </ParallaxLayer>

      <ParallaxLayer
        depth={0.4}
        travel={80}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(125,211,252,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" />
      </ParallaxLayer>

      <SceneTransition
        className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12"
        scaleValues={[0.96, 1, 0.94]}
        scaleRange={[0, 0.35, 1]}
        yValues={[20, 0, -30]}
        yRange={[0, 0.35, 1]}
        opacityValues={[0.3, 1, 0]}
      >
        <header className="mb-14 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.5em] text-cyan-300/80">
              Chapter 02 — Platform
            </p>
            <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-tighter text-white md:text-5xl lg:text-6xl">
              A continuous fabric of intelligence,{" "}
              <span className="text-white/55">designed to feel inevitable.</span>
            </h2>
          </div>
          <p className="col-span-12 max-w-sm text-sm leading-relaxed text-white/45 md:col-span-4 md:col-start-9">
            Three primitives compose the system. They are not features; they
            are the surface of a single instrument.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-5 md:grid-rows-2 md:gap-6 [grid-auto-flow:dense]">
          <PlatformCard feature={FEATURES[0]} index={0} className="md:col-span-3 md:row-span-2 min-h-[360px]" emphasis />
          <PlatformCard feature={FEATURES[1]} index={1} className="md:col-span-2 md:row-span-1 min-h-[180px]" />
          <PlatformCard feature={FEATURES[2]} index={2} className="md:col-span-2 md:row-span-1 min-h-[180px]" />
        </div>
      </SceneTransition>

      <motion.div
        aria-hidden
        style={{
          x: useTransform(progress, [0, 1], ["-20%", "120%"]),
        }}
        className="pointer-events-none absolute top-1/2 z-[5] h-px w-[120%] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent"
      />
    </>
  );
}

function PlatformCard({
  feature,
  index,
  className = "",
  emphasis = false,
}: {
  feature: { label: string; title: string; body: string };
  index: number;
  className?: string;
  emphasis?: boolean;
}) {
  const { progress } = useSceneProgress();

  const enterStart = 0.15 + index * 0.08;
  const enterEnd = enterStart + 0.22;
  const opacity = useTransform(progress, [enterStart, enterEnd], [0, 1]);
  const y = useTransform(progress, [enterStart, enterEnd], [60, 0]);
  const blur = useTransform(
    progress,
    [enterStart, enterEnd],
    ["blur(12px)", "blur(0px)"]
  );

  return (
    <motion.div
      style={{ opacity, y, filter: blur }}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-colors duration-500 hover:border-cyan-300/25 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-60" />
      <div className="relative flex h-full flex-col">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-300/70">
          {feature.label}
        </p>
        <h3 className={`mb-3 font-medium text-white ${emphasis ? "text-2xl md:text-3xl tracking-tight" : "text-xl"}`}>
          {feature.title}
        </h3>
        <p className={`leading-relaxed text-white/55 ${emphasis ? "max-w-md text-base" : "text-sm"}`}>
          {feature.body}
        </p>
      </div>
    </motion.div>
  );
}
