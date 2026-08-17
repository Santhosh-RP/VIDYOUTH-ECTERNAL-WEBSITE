"use client";

import { motion, useTransform } from "framer-motion";
import { ScrollScene, useSceneProgress } from "../cinematic/ScrollScene";
import { SceneTransition } from "../cinematic/SceneTransition";
import { ParallaxLayer } from "../cinematic/ParallaxLayer";

const STATS = [
  { value: "147.3", unit: "PFLOPs", label: "Training compute" },
  { value: "0.41", unit: "ms", label: "Frame latency" },
  { value: "12.8B", unit: "tokens / day", label: "Generative throughput" },
  { value: "62", unit: "languages", label: "Spatial reasoning" },
];

export function ResearchScene() {
  return (
    <ScrollScene
      id="research"
      index={4}
      height="240vh"
      zIndex={5}
      stageClassName="bg-[#03051a]"
    >
      <ResearchStage />
    </ScrollScene>
  );
}

function ResearchStage() {
  const { progress } = useSceneProgress();

  // Clip-path reveal of the orbiting visualization.
  const clip = useTransform(
    progress,
    [0.1, 0.55],
    ["inset(0% 100% 0% 0% round 24px)", "inset(0% 0% 0% 0% round 24px)"]
  );

  return (
    <>
      <ParallaxLayer
        depth={0.2}
        travel={60}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,_rgba(34,211,238,0.16),transparent_60%),radial-gradient(ellipse_at_10%_80%,_rgba(34,211,238,0.10),transparent_55%)]" />
      </ParallaxLayer>

      <SceneTransition
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2"
        scaleValues={[0.96, 1, 0.94]}
        scaleRange={[0, 0.35, 1]}
        yValues={[20, 0, -28]}
        yRange={[0, 0.35, 1]}
        opacityValues={[0.4, 1, 0]}
      >
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.5em] text-cyan-300/80">
            Chapter 03 — Research
          </p>
          <h2 className="mb-8 text-balance text-4xl font-semibold leading-[1.02] tracking-tighter text-white md:text-5xl lg:text-6xl">
            Light, motion, and structure —{" "}
            <span className="text-white/55">measured continuously.</span>
          </h2>
          <p className="mb-12 max-w-md text-base leading-relaxed text-white/55 md:text-lg">
            Every signal feeds back into the same continuous field. The
            platform refines itself with every frame it perceives.
          </p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            {STATS.map((s, i) => (
              <StatBlock key={s.label} stat={s} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          style={{ clipPath: clip, WebkitClipPath: clip }}
          className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
        >
          <OrbitVisual />
        </motion.div>
      </SceneTransition>
    </>
  );
}

function StatBlock({
  stat,
  index,
}: {
  stat: { value: string; unit: string; label: string };
  index: number;
}) {
  const { progress } = useSceneProgress();
  const start = 0.18 + index * 0.06;
  const end = start + 0.18;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [24, 0]);

  return (
    <motion.div style={{ opacity, y }} className="border-l border-white/10 pl-4">
      <p className="font-mono text-3xl font-light tracking-tight text-white md:text-4xl">
        {stat.value}
        <span className="ml-1 text-sm text-cyan-300/70">{stat.unit}</span>
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.32em] text-white/40">
        {stat.label}
      </p>
    </motion.div>
  );
}

function OrbitVisual() {
  const { progress } = useSceneProgress();
  const rotate = useTransform(progress, [0, 1], [0, 60]);

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(56,189,248,0.22),transparent_55%)]" />

      <motion.div
        style={{ rotate }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {[78, 60, 42].map((s, i) => (
          <div
            key={s}
            className="absolute rounded-full border"
            style={{
              width: `${s}%`,
              height: `${s}%`,
              borderColor: "rgba(125,211,252,0.16)",
              boxShadow:
                i === 0
                  ? "inset 0 0 40px rgba(56,189,248,0.05)"
                  : undefined,
            }}
          />
        ))}

        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const r = 30;
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          return (
            <motion.span
              key={angle}
              className="absolute h-2 w-2 rounded-full bg-cyan-300"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{
                opacity: [0.35, 1, 0.35],
                scale: [0.85, 1.15, 0.85],
              }}
              transition={{
                duration: 4 + (i % 3),
                delay: i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>

      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </>
  );
}
