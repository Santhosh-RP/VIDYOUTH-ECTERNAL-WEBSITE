"use client";

import {
  motion,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ScrollScene, useSceneProgress } from "../cinematic/ScrollScene";
import { ParallaxLayer } from "../cinematic/ParallaxLayer";

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
};

const PANELS = [
  {
    chapter: "01 — Motion",
    title: "Frame-perfect choreography.",
    body: "Every transition is hand-scored against scroll. Camera moves, light passes, and silicon ignition land on the exact pixel — never a frame early, never a frame late.",
  },
  {
    chapter: "02 — Systems",
    title: "Engineering rendered as design.",
    body: "Pinned scenes, GPU-friendly parallax, and a scrubbed media spine. The architecture is invisible by intent — what you feel is timing, weight, and breath.",
  },
  {
    chapter: "03 — Form",
    title: "From a single board, an entire world.",
    body: "Watch the circuit dismantle itself in your hands. We design the interior life of a product, then let it bloom outward — layer by layer, on demand.",
  },
] as const;

export function CircuitScene() {
  return (
    <ScrollScene
      id="circuit"
      index={1}
      height="360vh"
      zIndex={2}
      stageClassName="bg-[#02041a]"
    >
      <CircuitStage />
    </ScrollScene>
  );
}

function CircuitStage() {
  const { progress } = useSceneProgress();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef(0);
  const seekingRef = useRef(false);
  const [ready, setReady] = useState(false);

  // Drive video.currentTime from scroll progress using a rAF loop. We
  // subscribe to the MotionValue directly and clamp seeks to one per
  // animation frame so the browser's decoder isn't thrashed.
  useEffect(() => {
    const video = videoRef.current as VideoWithRVFC | null;
    if (!video) return;

    let cancelled = false;

    const applySeek = () => {
      if (cancelled) return;
      const dur = video.duration;
      if (!dur || !isFinite(dur) || video.readyState < 1) {
        rafRef.current = requestAnimationFrame(applySeek);
        return;
      }
      const next = Math.min(Math.max(targetTimeRef.current, 0), dur - 0.05);
      const delta = Math.abs(video.currentTime - next);
      if (delta > 1 / 60 && !seekingRef.current) {
        seekingRef.current = true;
        try {
          video.currentTime = next;
        } catch {
          /* ignore */
        }
      }
      rafRef.current = requestAnimationFrame(applySeek);
    };

    const onSeeked = () => {
      seekingRef.current = false;
    };

    const onReady = () => {
      if (!isFinite(video.duration)) return;
      setReady(true);
      targetTimeRef.current = progress.get() * video.duration;
      // Warm up the decoder so the first scrub paints a real frame.
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            video.pause();
            try {
              video.currentTime = targetTimeRef.current;
            } catch {
              /* ignore */
            }
          })
          .catch(() => {
            /* autoplay rejected — seek still works once metadata is loaded */
          });
      }
    };

    const onProgress = (latest: number) => {
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;
      targetTimeRef.current = Math.min(Math.max(latest, 0), 0.999) * dur;
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("seeked", onSeeked);

    // Some browsers require an explicit load() call to start fetching
    // even with preload="auto".
    try {
      video.load();
    } catch {
      /* ignore */
    }

    if (video.readyState >= 1) onReady();

    const unsub = progress.on("change", onProgress);
    onProgress(progress.get());
    rafRef.current = requestAnimationFrame(applySeek);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      unsub();
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [progress]);

  const videoScale = useTransform(progress, [0, 0.5, 1], [1.08, 1, 1.04]);
  const videoOpacity = useTransform(
    progress,
    [0, 0.02, 0.95, 1],
    [0.85, 1, 1, 0.5]
  );
  const vignetteOpacity = useTransform(
    progress,
    [0, 0.5, 1],
    [0.35, 0.55, 0.75]
  );
  const placeholderOpacity = useTransform(progress, [0, 0.05], [1, 0]);

  return (
    <>
      <ParallaxLayer
        depth={0.2}
        travel={50}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_rgba(34,211,238,0.18),transparent_60%),radial-gradient(ellipse_at_15%_85%,_rgba(56,189,248,0.08),transparent_55%)]" />
      </ParallaxLayer>

      <motion.div
        aria-hidden
        style={{ scale: videoScale, opacity: videoOpacity }}
        className="absolute inset-0 z-[2]"
      >
        <video
          ref={videoRef}
          src="/cir_board.mp4"
          muted
          playsInline
          preload="auto"
          // Pause autoplay — we drive currentTime from scroll.
          autoPlay={false}
          className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 object-cover"
          // poster intentionally omitted; first frame paints on metadata load
        />
        {!ready && (
          <motion.div
            style={{ opacity: placeholderOpacity }}
            className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.5em] text-white/30"
          >
            Loading circuit…
          </motion.div>
        )}
      </motion.div>

      <motion.div
        aria-hidden
        style={{ opacity: vignetteOpacity }}
        className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(2,4,26,0.85)_85%)]"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-40 bg-gradient-to-b from-[#02041a] via-[#02041a]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-[#02041a] via-[#02041a]/80 to-transparent" />

      <ChapterCounter />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-6 md:px-12 lg:px-16">
        <div className="relative w-full">
          {PANELS.map((panel, i) => (
            <CircuitPanel key={panel.chapter} panel={panel} index={i} />
          ))}
        </div>
      </div>

      <ScrollHint />
    </>
  );
}

function CircuitPanel({
  panel,
  index,
}: {
  panel: (typeof PANELS)[number];
  index: number;
}) {
  const { progress } = useSceneProgress();

  // Three panels span ~0.1 → ~0.95 of the scene. Each gets a tight window
  // so only one is readable at a time; they cross-fade through the video.
  const segment = 0.28;
  const gap = 0.04;
  const start = 0.08 + index * (segment + gap);
  const peakIn = start + 0.08;
  const peakOut = start + segment - 0.04;
  const end = start + segment + gap;

  const opacity = useTransform(
    progress,
    [start, peakIn, peakOut, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, peakIn, peakOut, end],
    [60, 0, 0, -50]
  );
  const blur = useTransform(
    progress,
    [start, peakIn, peakOut, end],
    ["blur(14px)", "blur(0px)", "blur(0px)", "blur(10px)"]
  );

  // Alternate horizontal anchoring to give the eye somewhere new to rest.
  const alignment =
    index % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0";

  return (
    <motion.div
      style={{ opacity, y, filter: blur }}
      className={`pointer-events-none absolute left-0 top-1/2 w-full max-w-2xl -translate-y-1/2 ${alignment}`}
    >
      <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-10">
        <p className="mb-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-300/80">
          <span className="h-px w-8 bg-cyan-300/50" />
          {panel.chapter}
        </p>
        <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tighter text-white md:text-5xl lg:text-[3.5rem]">
          {panel.title}
        </h2>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
          {panel.body}
        </p>
      </div>
    </motion.div>
  );
}

function ChapterCounter() {
  const { progress } = useSceneProgress();
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (latest) => {
    const idx =
      latest < 0.36 ? 0 : latest < 0.66 ? 1 : 2;
    setActive(idx);
  });

  return (
    <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {PANELS.map((p, i) => (
        <div key={p.chapter} className="flex items-center gap-3">
          <span
            className={`h-[2px] transition-all duration-500 ${
              i === active ? "w-12 bg-cyan-300" : "w-6 bg-white/20"
            }`}
          />
          <span
            className={`text-[10px] uppercase tracking-[0.4em] transition-colors duration-500 ${
              i === active ? "text-white/80" : "text-white/30"
            }`}
          >
            {p.chapter.split(" — ")[1]}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScrollHint() {
  const { progress } = useSceneProgress();
  const opacity = useTransform(progress, [0, 0.05, 0.95, 1], [1, 1, 0, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
    >
      <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/40">
        <span>Continue</span>
        <motion.span
          className="h-8 w-px bg-gradient-to-b from-white/60 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
