"use client";

import { motion, useTransform, type Variants } from "framer-motion";
import { ScrollScene, useSceneProgress } from "../cinematic/ScrollScene";
import { ParallaxLayer } from "../cinematic/ParallaxLayer";
import { EASE_OUT_QUART } from "@/app/lib/easing";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE_OUT_QUART },
  },
};

export function AccessScene() {
  return (
    <ScrollScene
      id="access"
      index={5}
      height="180vh"
      zIndex={6}
      stageClassName="bg-[#02041a]"
    >
      <AccessStage />
    </ScrollScene>
  );
}

function AccessStage() {
  const { progress } = useSceneProgress();

  const gateScale = useTransform(progress, [0, 0.6], [0.4, 1]);
  const gateOpacity = useTransform(progress, [0, 0.4], [0, 1]);
  const gateRotate = useTransform(progress, [0, 1], [-20, 30]);

  const headlineY = useTransform(progress, [0, 0.5], [80, 0]);
  const headlineOpacity = useTransform(progress, [0.1, 0.55], [0, 1]);
  const bodyOpacity = useTransform(progress, [0.3, 0.65], [0, 1]);
  const ctaOpacity = useTransform(progress, [0.45, 0.75], [0, 1]);

  return (
    <>
      <ParallaxLayer
        depth={0.2}
        travel={60}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,_rgba(34,211,238,0.22),transparent_55%),radial-gradient(ellipse_at_20%_90%,_rgba(34,211,238,0.10),transparent_55%)]" />
      </ParallaxLayer>

      <motion.div
        aria-hidden
        style={{
          scale: gateScale,
          opacity: gateOpacity,
          rotate: gateRotate,
        }}
        className="pointer-events-none absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-[72vmin] w-[72vmin] max-w-[760px] max-h-[760px]">
          {[100, 82, 64, 48].map((s, i) => (
            <motion.div
              key={s}
              className="absolute inset-0 rounded-full border"
              style={{
                width: `${s}%`,
                height: `${s}%`,
                left: `${(100 - s) / 2}%`,
                top: `${(100 - s) / 2}%`,
                borderColor: "rgba(125,211,252,0.18)",
                boxShadow:
                  i === 0
                    ? "inset 0 0 90px rgba(56,189,248,0.06)"
                    : undefined,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 60 + i * 30,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          <div className="absolute left-1/2 top-1/2 h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(186,230,253,0.7),_rgba(56,189,248,0.35)_40%,_transparent_75%)] blur-[8px]" />
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-x-6 px-6 md:px-12">
        <div className="col-span-12 md:col-span-7">
          <motion.p
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="mb-4 text-[11px] uppercase tracking-[0.5em] text-cyan-300/80"
          >
            Chapter 04 — Access
          </motion.p>

          <motion.h2
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="mb-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tighter text-white md:text-7xl"
          >
            Step through the <span className="text-white/55">aperture.</span>
          </motion.h2>

          <motion.p
            style={{ opacity: bodyOpacity }}
            className="mb-12 max-w-md text-base leading-relaxed text-white/55 md:text-lg"
          >
            Vidyouth is rolling out to studios, labs, and creative teams in a
            private cinematic preview. Request access to receive your
            invitation.
          </motion.p>

          <motion.div
            style={{ opacity: ctaOpacity }}
            variants={fadeUp}
            className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="mailto:access@vidyouth.systems"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-cyan-300 px-8 py-3.5 text-sm font-medium text-[#04061a] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_10px_28px_-14px_rgba(8,18,46,0.9)] transition-transform duration-500 active:scale-[0.98]"
            >
              <span className="relative z-10">Request invitation</span>
              <span className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
            </a>
            <a
              href="#hero"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
            >
              Return to top
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
