"use client";

import { motion, useTransform } from "framer-motion";
import { ScrollScene, useSceneProgress } from "../cinematic/ScrollScene";
import { SceneTransition } from "../cinematic/SceneTransition";
import { ParallaxLayer } from "../cinematic/ParallaxLayer";

export function IntelligenceScene() {
  return (
    <ScrollScene
      id="intelligence"
      index={2}
      height="260vh"
      zIndex={3}
      stageClassName="bg-[#04061a]"
    >
      <IntelligenceStage />
    </ScrollScene>
  );
}

function IntelligenceStage() {
  const { progress } = useSceneProgress();

  // Words assemble as we enter, dissolve as we leave.
  const wordOpacity = useTransform(progress, [0, 0.15, 0.7, 1], [0, 1, 1, 0]);
  const wordY = useTransform(progress, [0, 0.2, 0.7, 1], [60, 0, 0, -40]);
  const wordBlur = useTransform(
    progress,
    [0, 0.18, 0.7, 1],
    ["blur(14px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  const beamWidth = useTransform(progress, [0.1, 0.55], ["0%", "100%"]);
  const subOpacity = useTransform(progress, [0.25, 0.4, 0.75, 0.95], [0, 1, 1, 0]);

  return (
    <>
      <ParallaxLayer
        depth={0.2}
        travel={60}
        scaleFrom={1.05}
        scaleTo={1.15}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,_rgba(34,211,238,0.16),transparent_60%),radial-gradient(ellipse_at_15%_85%,_rgba(34,211,238,0.10),transparent_55%)]" />
      </ParallaxLayer>

      <ParallaxLayer
        depth={0.6}
        travel={140}
        className="pointer-events-none absolute inset-0 [transform:translateX(18%)]"
      >
        <NeuralWeb />
      </ParallaxLayer>

      <SceneTransition
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 items-end gap-y-12 px-6 md:px-12"
        opacityValues={[1, 1, 1]}
        scaleValues={[0.96, 1, 0.94]}
        scaleRange={[0, 0.4, 1]}
        yValues={[20, 0, -30]}
        yRange={[0, 0.4, 1]}
        blurValues={[6, 0, 6]}
        blurRange={[0, 0.4, 1]}
      >
        <div className="col-span-12 md:col-span-8 md:col-start-1">
          <p className="mb-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.5em] text-cyan-300/80">
            <span className="h-px w-10 bg-cyan-300/50" />
            Chapter 01 — Intelligence
          </p>

          <motion.h2
            style={{
              opacity: wordOpacity,
              y: wordY,
              filter: wordBlur,
            }}
            className="max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-tighter text-white md:text-7xl lg:text-[5.25rem]"
          >
            A continuous fabric of{" "}
            <span className="text-white/55">light, motion &amp; thought</span>.
          </motion.h2>

          <motion.div
            style={{ width: beamWidth }}
            className="mt-12 h-px max-w-md bg-gradient-to-r from-cyan-300/60 to-transparent"
          />
        </div>

        <motion.p
          style={{ opacity: subOpacity }}
          className="col-span-12 max-w-md text-base leading-relaxed text-white/55 md:col-span-4 md:col-start-9 md:text-[15px]"
        >
          Vidyouth perceives the world as a single field — every frame, every
          gesture, every pixel woven into the same generative tissue. The
          system does not assemble responses. It composes them.
        </motion.p>
      </SceneTransition>
    </>
  );
}

function NeuralWeb() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-50"
    >
      <defs>
        <linearGradient id="line-c" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(125,211,252,0)" />
          <stop offset="50%" stopColor="rgba(125,211,252,0.55)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0)" />
        </linearGradient>
        <radialGradient id="node-g">
          <stop offset="0%" stopColor="rgba(186,230,253,1)" />
          <stop offset="60%" stopColor="rgba(125,211,252,0.4)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0)" />
        </radialGradient>
      </defs>

      {WEB_LINES.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="url(#line-c)"
          strokeWidth={0.7}
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.15, 0.6, 0.15] }}
          transition={{
            duration: 6 + (i % 5),
            delay: i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {WEB_NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={n.r}
          fill="url(#node-g)"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{
            duration: 4 + (i % 4),
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
        />
      ))}
    </svg>
  );
}

const WEB_NODES = [
  { cx: 120, cy: 180, r: 3 },
  { cx: 300, cy: 110, r: 2.5 },
  { cx: 500, cy: 220, r: 3.5 },
  { cx: 720, cy: 140, r: 2.8 },
  { cx: 920, cy: 250, r: 3 },
  { cx: 1080, cy: 160, r: 2.6 },
  { cx: 200, cy: 460, r: 3 },
  { cx: 420, cy: 540, r: 2.8 },
  { cx: 640, cy: 470, r: 3.4 },
  { cx: 860, cy: 560, r: 2.7 },
  { cx: 1040, cy: 480, r: 3 },
];

const WEB_LINES = [
  { x1: 120, y1: 180, x2: 300, y2: 110 },
  { x1: 300, y1: 110, x2: 500, y2: 220 },
  { x1: 500, y1: 220, x2: 720, y2: 140 },
  { x1: 720, y1: 140, x2: 920, y2: 250 },
  { x1: 920, y1: 250, x2: 1080, y2: 160 },
  { x1: 200, y1: 460, x2: 420, y2: 540 },
  { x1: 420, y1: 540, x2: 640, y2: 470 },
  { x1: 640, y1: 470, x2: 860, y2: 560 },
  { x1: 860, y1: 560, x2: 1040, y2: 480 },
  { x1: 300, y1: 110, x2: 420, y2: 540 },
  { x1: 500, y1: 220, x2: 640, y2: 470 },
  { x1: 720, y1: 140, x2: 860, y2: 560 },
  { x1: 120, y1: 180, x2: 200, y2: 460 },
  { x1: 920, y1: 250, x2: 1040, y2: 480 },
];
