"use client";

import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";

const Spline = lazy(() => import("@splinetool/react-spline"));
const SCENE_URL = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;

export type CinematicSceneProps = {
  progress?: MotionValue<number>;
  tiltX?: MotionValue<number>;
  tiltY?: MotionValue<number>;
  motionEnabled?: boolean;
  contentOpacity?: MotionValue<number>;
};

export default function SplineScene(props: CinematicSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Respect the OS "reduce motion" setting — kills the whole animation load.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Pause the reactor's dozens of infinite animations once it's scrolled well
  // off-screen (huge sustained-CPU/GPU win on long scroll pages).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const motionEnabled = Boolean(props.motionEnabled && mounted && inView && !reduced);
  const useSpline = Boolean(SCENE_URL && mounted && !reduced);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full"
    >
      {useSpline ? (
        <Suspense fallback={<CinematicReactor {...props} motionEnabled={motionEnabled} />}>
          <Spline scene={SCENE_URL as string} />
        </Suspense>
      ) : (
        <CinematicReactor {...props} motionEnabled={motionEnabled} />
      )}
    </div>
  );
}

function asStyle(s: Record<string, unknown>): CSSProperties {
  return s as unknown as CSSProperties;
}

function CinematicReactor({
  progress,
  tiltX,
  tiltY,
  motionEnabled = false,
  contentOpacity,
}: CinematicSceneProps) {
  const fallback = useMotionValue(0);
  const p = progress ?? fallback;

  const camRotateY = useTransform(p, [0, 1], [-6, 26]);
  const camRotateX = useTransform(p, [0, 1], [3, -8]);
  const camZ = useTransform(p, [0, 1], [0, 360]);
  const camX = useTransform(p, [0, 1], [0, 140]);
  const camY = useTransform(p, [0, 1], [0, -30]);

  const coreRotateY = useTransform(p, [0, 1], [-12, 72]);
  const coreRotateX = useTransform(p, [0, 1], [-4, 16]);
  const coreScale = useTransform(p, [0, 0.5, 1], [1, 1.08, 1.2]);

  const ringOuterRotate = useTransform(p, [0, 1], [0, 70]);
  const ringMidRotate = useTransform(p, [0, 1], [0, -135]);
  const ringInnerRotate = useTransform(p, [0, 1], [0, 230]);

  const panelsRotateY = useTransform(p, [0, 1], [0, -42]);
  const panelsY = useTransform(p, [0, 1], [0, -60]);
  const panelsOpacityScroll = useTransform(p, [0, 0.45, 0.85], [1, 0.7, 0]);

  const fgY = useTransform(p, [0, 1], [0, -240]);
  const fgRotate = useTransform(p, [0, 1], [0, -10]);
  const fgOpacity = useTransform(p, [0, 0.6, 1], [0.95, 0.6, 0.28]);

  const bgY = useTransform(p, [0, 1], [0, -60]);
  const bgOpacity = useTransform(p, [0, 1], [1, 0.55]);

  const cameraStyle: CSSProperties = motionEnabled
    ? asStyle({
        rotateY: camRotateY,
        rotateX: camRotateX,
        z: camZ,
        x: camX,
        y: camY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      })
    : { transformStyle: "preserve-3d" };

  const tiltStyle: CSSProperties =
    motionEnabled && tiltX && tiltY
      ? asStyle({
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
        })
      : { transformStyle: "preserve-3d" };

  const reactorStyle: CSSProperties = motionEnabled
    ? asStyle({
        rotateY: coreRotateY,
        rotateX: coreRotateX,
        scale: coreScale,
        transformStyle: "preserve-3d",
        willChange: "transform",
      })
    : { transformStyle: "preserve-3d" };

  const panelsStyle: CSSProperties = motionEnabled
    ? asStyle({
        rotateY: panelsRotateY,
        y: panelsY,
        opacity: panelsOpacityScroll,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      })
    : { transformStyle: "preserve-3d" };

  const fgStyle: CSSProperties = motionEnabled
    ? asStyle({
        y: fgY,
        rotate: fgRotate,
        opacity: fgOpacity,
        willChange: "transform, opacity",
      })
    : {};

  const bgStyle: CSSProperties = motionEnabled
    ? asStyle({ y: bgY, opacity: bgOpacity, willChange: "transform, opacity" })
    : {};

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: "2000px", perspectiveOrigin: "48% 50%" }}
    >
      <motion.div className="absolute inset-0" style={cameraStyle}>
        <motion.div className="absolute inset-0" style={tiltStyle}>
          <motion.div className="absolute inset-0" style={bgStyle}>
            <BackgroundAtmosphere motionEnabled={motionEnabled} />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <ReactorCluster
              reactorStyle={reactorStyle}
              ringOuterRotate={motionEnabled ? ringOuterRotate : undefined}
              ringMidRotate={motionEnabled ? ringMidRotate : undefined}
              ringInnerRotate={motionEnabled ? ringInnerRotate : undefined}
              motionEnabled={motionEnabled}
            />
          </motion.div>

          <motion.div className="absolute inset-0" style={panelsStyle}>
            <MidPanels
              contentOpacity={contentOpacity}
              motionEnabled={motionEnabled}
            />
          </motion.div>

          <motion.div className="absolute inset-0" style={fgStyle}>
            <Foreground motionEnabled={motionEnabled} />
          </motion.div>

          {motionEnabled && <ScanSweep />}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,_transparent_36%,_rgba(5,7,26,0.55)_74%,_rgba(5,7,26,0.96)_100%)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function BackgroundAtmosphere({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute -left-[18%] -top-[12%] h-[60vh] w-[60vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.12), transparent 65%)",
          filter: "blur(90px)",
          transform: "translate3d(0,0,-400px)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-[14%] top-[2%] h-[95vh] w-[60vw]"
        style={{
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(56,189,248,0.24), rgba(56,189,248,0.12) 45%, transparent 75%)",
          filter: "blur(110px)",
          transform: "translate3d(0,0,-360px)",
        }}
        animate={motionEnabled ? { opacity: [0.65, 1, 0.65] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          aria-hidden
          className="absolute h-[160vmin] w-[160vmin] rounded-full border border-cyan-300/[0.05]"
          style={{ transform: "rotateX(74deg) translateZ(-520px)" }}
          animate={motionEnabled ? { rotate: 360 } : undefined}
          transition={{ duration: 320, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          aria-hidden
          className="absolute h-[120vmin] w-[120vmin] rounded-full border border-cyan-300/[0.07]"
          style={{
            transform:
              "rotateX(66deg) rotateY(-8deg) translateZ(-340px)",
          }}
          animate={motionEnabled ? { rotate: -360 } : undefined}
          transition={{ duration: 260, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,160,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,160,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_60%_55%,transparent_25%,black_70%)]"
        style={{ transform: "translate3d(0,0,-600px) scale(1.3)" }}
      />
    </>
  );
}

function ReactorCluster({
  reactorStyle,
  ringOuterRotate,
  ringMidRotate,
  ringInnerRotate,
  motionEnabled,
}: {
  reactorStyle: CSSProperties;
  ringOuterRotate?: MotionValue<number>;
  ringMidRotate?: MotionValue<number>;
  ringInnerRotate?: MotionValue<number>;
  motionEnabled: boolean;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        right: "-14%",
        top: "50%",
        width: "118vmin",
        height: "118vmin",
        maxWidth: "1280px",
        maxHeight: "1280px",
        transform: "translate3d(0,-50%,0)",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={reactorStyle}
      >
        <ClusterHalo motionEnabled={motionEnabled} />
        <OrbitalRing
          size={108}
          tiltX={70}
          tiltY={-8}
          tz={-90}
          gradient="conic-gradient(from 0deg, rgba(125,211,252,0) 0deg, rgba(125,211,252,0.42) 30deg, transparent 90deg, rgba(56,189,248,0.42) 180deg, transparent 240deg, rgba(125,211,252,0.32) 320deg, transparent 360deg)"
          maskRadii={[48.5, 49.2, 50, 50.8]}
          rotate={ringOuterRotate}
          motionEnabled={motionEnabled}
          continuousDuration={240}
          continuousDirection={1}
          ticks={36}
          tickAccent="rgba(125,211,252,0.55)"
        />
        <OrbitalRing
          size={86}
          tiltX={64}
          tiltY={10}
          tz={-30}
          gradient="conic-gradient(from 90deg, rgba(186,230,253,0) 0deg, rgba(186,230,253,0.55) 40deg, transparent 95deg, rgba(125,211,252,0.5) 200deg, transparent 280deg)"
          maskRadii={[48.7, 49.3, 49.9, 50.5]}
          rotate={ringMidRotate}
          motionEnabled={motionEnabled}
          continuousDuration={180}
          continuousDirection={-1}
          ticks={48}
          tickAccent="rgba(186,230,253,0.55)"
        />
        <CoreOrb motionEnabled={motionEnabled} />
        <OrbitalRing
          size={66}
          tiltX={58}
          tiltY={-4}
          tz={40}
          gradient="conic-gradient(from 180deg, rgba(125,211,252,0) 0deg, rgba(186,230,253,0.85) 18deg, transparent 55deg, rgba(125,211,252,0.45) 160deg, transparent 220deg)"
          maskRadii={[48.9, 49.4, 49.9, 50.4]}
          rotate={ringInnerRotate}
          motionEnabled={motionEnabled}
          continuousDuration={120}
          continuousDirection={1}
          ticks={24}
          tickAccent="rgba(186,230,253,0.7)"
        />
        <EnergyBeams motionEnabled={motionEnabled} />
      </motion.div>
    </motion.div>
  );
}

function ClusterHalo({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute -inset-[20%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.22), rgba(56,189,248,0.14) 30%, transparent 65%)",
          filter: "blur(90px)",
          transform: "translateZ(-180px)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -inset-[6%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(186,230,253,0.18), transparent 55%)",
          filter: "blur(40px)",
          transform: "translateZ(-30px)",
        }}
        animate={motionEnabled ? { opacity: [0.55, 0.9, 0.55] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function OrbitalRing({
  size,
  tiltX,
  tiltY,
  tz,
  gradient,
  maskRadii,
  rotate,
  motionEnabled,
  continuousDuration,
  continuousDirection,
  ticks,
  tickAccent,
}: {
  size: number;
  tiltX: number;
  tiltY: number;
  tz: number;
  gradient: string;
  maskRadii: [number, number, number, number];
  rotate?: MotionValue<number>;
  motionEnabled: boolean;
  continuousDuration: number;
  continuousDirection: 1 | -1;
  ticks: number;
  tickAccent: string;
}) {
  const [r1, r2, r3, r4] = maskRadii;
  const mask = `radial-gradient(circle, transparent ${r1}%, black ${r2}%, black ${r3}%, transparent ${r4}%)`;

  const innerStyle: CSSProperties = rotate
    ? asStyle({
        rotate,
        transformOrigin: "50% 50%",
        willChange: "transform",
      })
    : {};

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute"
        style={{
          width: `${size}%`,
          height: `${size}%`,
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${tz}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: gradient,
            mask,
            WebkitMask: mask,
            ...innerStyle,
          }}
          animate={
            rotate || !motionEnabled
              ? undefined
              : { rotate: 360 * continuousDirection }
          }
          transition={{
            duration: continuousDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(186,230,253,0.08)",
            ...innerStyle,
          }}
          animate={
            rotate || !motionEnabled
              ? undefined
              : { rotate: 360 * continuousDirection }
          }
          transition={{
            duration: continuousDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <RingTicks count={ticks} accent={tickAccent} rotate={rotate} motionEnabled={motionEnabled} continuousDuration={continuousDuration} continuousDirection={continuousDirection} />
      </div>
    </div>
  );
}

function RingTicks({
  count,
  accent,
  rotate,
  motionEnabled,
  continuousDuration,
  continuousDirection,
}: {
  count: number;
  accent: string;
  rotate?: MotionValue<number>;
  motionEnabled: boolean;
  continuousDuration: number;
  continuousDirection: 1 | -1;
}) {
  const innerStyle: CSSProperties = rotate
    ? asStyle({ rotate, willChange: "transform" })
    : {};
  return (
    <motion.div
      className="absolute inset-0"
      style={innerStyle}
      animate={
        rotate || !motionEnabled
          ? undefined
          : { rotate: 360 * continuousDirection }
      }
      transition={{
        duration: continuousDuration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        const rad = ((angle - 90) * Math.PI) / 180;
        const radius = 49;
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        const major = i % 4 === 0;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: major ? "2px" : "1px",
              height: major ? "10px" : "5px",
              background: accent,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              transformOrigin: "50% 50%",
              boxShadow: major ? `0 0 6px ${accent}` : "none",
              opacity: major ? 0.85 : 0.45,
            }}
          />
        );
      })}
    </motion.div>
  );
}

function CoreOrb({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="relative"
        style={{
          width: "54%",
          height: "54%",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          aria-hidden
          className="absolute -inset-[30%]"
          style={{
            background:
              "radial-gradient(circle at 45% 50%, rgba(56,189,248,0.32), rgba(56,189,248,0.18) 30%, transparent 65%)",
            filter: "blur(70px)",
            transform: "translateZ(-160px)",
          }}
        />

        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "0 0 80px 18px rgba(125,211,252,0.32), inset 0 0 110px 30px rgba(56,189,248,0.18)",
          }}
          animate={motionEnabled ? { opacity: [0.7, 1, 0.7] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, rgba(56,189,248,0.22), rgba(15,23,42,0.95) 48%, rgba(2,6,23,1) 95%)",
            boxShadow:
              "inset 30px 60px 140px rgba(0,0,0,0.85), inset -80px -120px 200px rgba(56,189,248,0.18)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(186,230,253,0.07) 24deg, transparent 30deg, rgba(56,189,248,0.07) 60deg, transparent 66deg, rgba(125,211,252,0.06) 96deg, transparent 102deg, rgba(186,230,253,0.07) 144deg, transparent 150deg, rgba(125,211,252,0.06) 192deg, transparent 200deg, rgba(56,189,248,0.07) 240deg, transparent 246deg, rgba(125,211,252,0.06) 288deg, transparent 294deg, rgba(186,230,253,0.06) 336deg, transparent 342deg)",
              mixBlendMode: "screen",
            }}
          />

          <SphereLatitudeGrid />
          <CircuitTraces motionEnabled={motionEnabled} />

          <div
            aria-hidden
            className="absolute inset-x-[4%] top-1/2 h-px -translate-y-1/2"
            style={{
              background:
                "linear-gradient(to right, transparent 4%, rgba(125,211,252,0.65) 28%, rgba(186,230,253,0.78) 50%, rgba(125,211,252,0.55) 72%, transparent 96%)",
              boxShadow: "0 0 14px rgba(125,211,252,0.7)",
            }}
          />

          <div
            aria-hidden
            className="absolute"
            style={{
              left: "8%",
              top: "10%",
              width: "58%",
              height: "58%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 28%, rgba(186,230,253,0.48), transparent 55%)",
              filter: "blur(22px)",
              mixBlendMode: "screen",
            }}
          />

          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 75% 78%, rgba(0,0,0,0.6), transparent 50%)",
            }}
          />

          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-[14%]"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(186,230,253,0.20) 50%, transparent)",
              mixBlendMode: "screen",
              filter: "blur(1px)",
            }}
            initial={{ top: "-15%" }}
            animate={motionEnabled ? { top: ["-15%", "110%"] } : undefined}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div
          aria-hidden
          className="absolute inset-[26%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(186,230,253,0.95) 0%, rgba(56,189,248,0.55) 22%, rgba(56,189,248,0.25) 50%, transparent 75%)",
            filter: "blur(10px)",
            transform: "translateZ(20px)",
          }}
          animate={
            motionEnabled
              ? { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }
              : undefined
          }
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          aria-hidden
          className="absolute inset-[14%] rounded-full"
          style={{
            border: "1px dashed rgba(186,230,253,0.20)",
            boxShadow: "inset 0 0 30px rgba(56,189,248,0.18)",
            transform: "translateZ(28px)",
          }}
          animate={motionEnabled ? { rotate: -360 } : undefined}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          aria-hidden
          className="absolute inset-[8%] rounded-full"
          style={{
            border: "1px solid rgba(56,189,248,0.18)",
            transform: "translateZ(34px) rotateX(20deg)",
          }}
          animate={motionEnabled ? { rotate: 360 } : undefined}
          transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function SphereLatitudeGrid() {
  const lines = [16, 28, 40, 50, 60, 72, 84];
  return (
    <>
      {lines.map((top) => {
        const offset = Math.abs(top - 50) / 50;
        const stretch = Math.sqrt(Math.max(0, 1 - offset * offset * 0.96));
        return (
          <div
            key={top}
            aria-hidden
            className="absolute left-1/2"
            style={{
              top: `${top}%`,
              width: `${stretch * 94}%`,
              height: "1px",
              transform: "translate(-50%, -50%)",
              background:
                "linear-gradient(to right, transparent, rgba(125,211,252,0.18) 28%, rgba(186,230,253,0.16) 72%, transparent)",
            }}
          />
        );
      })}
      {[18, 36, 54, 72, 84].map((leftPct) => {
        const offset = Math.abs(leftPct - 50) / 50;
        const stretch = Math.sqrt(Math.max(0, 1 - offset * offset * 0.96));
        return (
          <div
            key={`m-${leftPct}`}
            aria-hidden
            className="absolute top-1/2"
            style={{
              left: `${leftPct}%`,
              height: `${stretch * 92}%`,
              width: "1px",
              transform: "translate(-50%, -50%)",
              background:
                "linear-gradient(to bottom, transparent, rgba(125,211,252,0.10) 30%, rgba(186,230,253,0.10) 70%, transparent)",
            }}
          />
        );
      })}
    </>
  );
}

function CircuitTraces({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="trace-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(125,211,252,0)" />
          <stop offset="50%" stopColor="rgba(125,211,252,0.85)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0)" />
        </linearGradient>
        <linearGradient id="trace-violet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(186,230,253,0)" />
          <stop offset="50%" stopColor="rgba(186,230,253,0.75)" />
          <stop offset="100%" stopColor="rgba(186,230,253,0)" />
        </linearGradient>
      </defs>
      <g opacity="0.85">
        <path
          d="M 18 90 Q 60 60 100 95 T 178 105"
          stroke="url(#trace-cyan)"
          strokeWidth="0.6"
        />
        <path
          d="M 24 145 Q 70 130 115 138 T 180 152"
          stroke="url(#trace-violet)"
          strokeWidth="0.5"
        />
        <path
          d="M 30 55 Q 80 30 130 50 T 170 45"
          stroke="url(#trace-cyan)"
          strokeWidth="0.5"
          opacity="0.7"
        />
        <path
          d="M 100 18 Q 110 60 95 100 T 105 178"
          stroke="url(#trace-violet)"
          strokeWidth="0.4"
          opacity="0.55"
        />
      </g>
      {[
        { cx: 60, cy: 78, fill: "#7dd3fc", dur: 3, delay: 0 },
        { cx: 135, cy: 100, fill: "#c4b5fd", dur: 4, delay: 1 },
        { cx: 100, cy: 140, fill: "#7dd3fc", dur: 3.5, delay: 2 },
        { cx: 160, cy: 60, fill: "#c4b5fd", dur: 4.5, delay: 0.5 },
        { cx: 50, cy: 130, fill: "#7dd3fc", dur: 3.2, delay: 1.6 },
      ].map((n, i) => (
        <motion.circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={1.4}
          fill={n.fill}
          initial={{ opacity: 0.4 }}
          animate={motionEnabled ? { opacity: [0.4, 1, 0.4] } : undefined}
          transition={{
            duration: n.dur,
            delay: n.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

const ENERGY_BEAMS: Array<{ angle: number; length: number; delay: number; accent: "cyan" | "violet" }> = [
  { angle: 22, length: 64, delay: 0, accent: "cyan" },
  { angle: 88, length: 56, delay: 1.5, accent: "violet" },
  { angle: 158, length: 70, delay: 2.8, accent: "cyan" },
  { angle: 232, length: 52, delay: 0.8, accent: "violet" },
  { angle: 308, length: 60, delay: 2.1, accent: "cyan" },
];

function EnergyBeams({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="relative"
        style={{ width: "1px", height: "1px", transformStyle: "preserve-3d" }}
      >
        {ENERGY_BEAMS.map((b, i) => {
          const color =
            b.accent === "cyan"
              ? "rgba(125,211,252,0.75)"
              : "rgba(186,230,253,0.7)";
          const shadow =
            b.accent === "cyan"
              ? "0 0 16px rgba(125,211,252,0.55)"
              : "0 0 16px rgba(186,230,253,0.5)";
          return (
            <motion.div
              key={i}
              aria-hidden
              className="absolute left-0 top-0"
              style={{
                width: "1.5px",
                height: `${b.length}vmin`,
                transformOrigin: "50% 0%",
                transform: `translate(-50%, 0) rotate(${b.angle}deg)`,
                background: `linear-gradient(to bottom, ${color} 0%, rgba(56,189,248,0.25) 50%, transparent 100%)`,
                boxShadow: shadow,
              }}
              animate={
                motionEnabled
                  ? { opacity: [0.15, 0.7, 0.15], scaleY: [0.85, 1.08, 0.85] }
                  : undefined
              }
              transition={{
                duration: 5,
                delay: b.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

type PanelDef = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  z: number;
  tiltY: number;
  tiltX: number;
  title: string;
  value: string;
  accent: "cyan" | "violet";
  driftDelay: number;
  driftDuration: number;
  driftAmplitude: number;
  hideOnMobile?: boolean;
};

const PANEL_DEFS: PanelDef[] = [
  {
    left: "4%",
    top: "14%",
    z: 180,
    tiltY: -22,
    tiltX: 4,
    title: "CORE.SYS",
    value: "ACTIVE",
    accent: "cyan",
    driftDelay: 0.4,
    driftDuration: 7.4,
    driftAmplitude: 12,
  },
  {
    left: "6%",
    bottom: "22%",
    z: 120,
    tiltY: -16,
    tiltX: -3,
    title: "MESH.LATENCY",
    value: "2.4 ms",
    accent: "violet",
    driftDelay: 1.8,
    driftDuration: 8.6,
    driftAmplitude: 10,
  },
  {
    right: "32%",
    top: "10%",
    z: 90,
    tiltY: -8,
    tiltX: 6,
    title: "COHERENCE",
    value: "0.987",
    accent: "cyan",
    driftDelay: 3.0,
    driftDuration: 9.2,
    driftAmplitude: 14,
    hideOnMobile: true,
  },
  {
    right: "10%",
    bottom: "16%",
    z: 140,
    tiltY: 14,
    tiltX: -4,
    title: "FLUX.WAVE",
    value: "Φ 0.42",
    accent: "violet",
    driftDelay: 2.2,
    driftDuration: 8.0,
    driftAmplitude: 11,
    hideOnMobile: true,
  },
];

function MidPanels({
  contentOpacity,
  motionEnabled,
}: {
  contentOpacity?: MotionValue<number>;
  motionEnabled: boolean;
}) {
  const wrapperStyle: CSSProperties =
    motionEnabled && contentOpacity
      ? asStyle({ opacity: contentOpacity })
      : {};

  return (
    <motion.div className="absolute inset-0" style={wrapperStyle}>
      {PANEL_DEFS.map((p, i) => (
        <FloatingPanel key={i} {...p} motionEnabled={motionEnabled} />
      ))}
    </motion.div>
  );
}

function FloatingPanel(
  props: PanelDef & { motionEnabled: boolean }
) {
  const {
    top,
    left,
    right,
    bottom,
    z,
    tiltY,
    tiltX,
    title,
    value,
    accent,
    driftDelay,
    driftDuration,
    driftAmplitude,
    hideOnMobile,
    motionEnabled,
  } = props;

  const accentLine =
    accent === "cyan"
      ? "rgba(125,211,252,0.55)"
      : "rgba(186,230,253,0.55)";
  const dotColor = accent === "cyan" ? "bg-cyan-300" : "bg-cyan-200";
  const visibility = hideOnMobile ? "hidden md:block" : "";

  return (
    <motion.div
      className={`absolute w-44 rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.25)] backdrop-blur-md ${visibility}`}
      style={{
        top,
        left,
        right,
        bottom,
        transform: `rotateY(${tiltY}deg) rotateX(${tiltX}deg) translateZ(${z}px)`,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={
        motionEnabled
          ? {
              opacity: [0, 0.92, 0.92],
              y: [12, 0, -driftAmplitude, 0],
            }
          : { opacity: 0.92 }
      }
      transition={{
        opacity: { duration: 1.8, delay: driftDelay, ease: "easeOut" },
        y: {
          duration: driftDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: driftDelay,
        },
      }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`}
        />
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/45">
          {title}
        </p>
      </div>
      <p className="text-base font-light tabular-nums text-white/85">{value}</p>
      <div
        className="mt-2 h-px w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${accentLine}, transparent)`,
        }}
      />
    </motion.div>
  );
}

function Foreground({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute -left-[16%] top-[58%] h-[60vh] w-[80vw] md:-left-[12%]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(34,211,238,0.18), rgba(56,189,248,0.08) 45%, transparent 75%)",
          filter: "blur(50px)",
          transform: "rotate(-14deg) translate3d(0,0,200px)",
          willChange: "transform",
        }}
        animate={motionEnabled ? { opacity: [0.6, 0.95, 0.6] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute -right-[12%] -top-[14%] h-[55vh] w-[60vw]"
        style={{
          background:
            "radial-gradient(ellipse at 65% 40%, rgba(56,189,248,0.20), rgba(56,189,248,0.06) 40%, transparent 72%)",
          filter: "blur(60px)",
          transform: "rotate(12deg) translate3d(0,0,140px)",
          willChange: "transform",
        }}
        animate={motionEnabled ? { opacity: [0.55, 0.85, 0.55] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div
        aria-hidden
        className="absolute left-[-2%] bottom-[4%] hidden h-[34vh] w-[36vw] md:block"
        style={{
          background:
            "linear-gradient(115deg, rgba(8,12,30,0.0), rgba(15,23,42,0.55) 55%, rgba(8,12,30,0.0))",
          borderTop: "1px solid rgba(186,230,253,0.10)",
          borderRadius: "12px",
          filter: "blur(18px)",
          transform: "rotateX(58deg) rotateZ(-10deg) translate3d(0,0,260px)",
        }}
      />

      <div
        aria-hidden
        className="absolute right-[6%] top-[14%] hidden h-[18vh] w-[14vw] md:block"
        style={{
          background:
            "linear-gradient(135deg, rgba(125,211,252,0.10), rgba(56,189,248,0.04) 60%, transparent)",
          border: "1px solid rgba(186,230,253,0.14)",
          borderRadius: "10px",
          filter: "blur(2px)",
          transform: "rotateY(-26deg) rotateX(8deg) translate3d(0,0,300px)",
          boxShadow: "0 30px 80px -30px rgba(56,189,248,0.35)",
        }}
      />

      <motion.div
        aria-hidden
        className="absolute left-[12%] top-[30%] h-[1.5px] w-[42vw]"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(186,230,253,0.4) 35%, rgba(186,230,253,0.5) 65%, transparent)",
          filter: "blur(0.4px)",
          transform: "rotate(-6deg) translate3d(0,0,240px)",
          boxShadow: "0 0 18px rgba(125,211,252,0.4)",
        }}
        animate={motionEnabled ? { opacity: [0.3, 0.9, 0.3], x: [0, 30, 0] } : undefined}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function ScanSweep() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 w-[2px]"
      style={{
        background:
          "linear-gradient(to bottom, transparent, rgba(125,211,252,0.45) 25%, rgba(56,189,248,0.35) 70%, transparent)",
        boxShadow:
          "0 0 36px 4px rgba(125,211,252,0.25), 0 0 90px 12px rgba(125,211,252,0.10)",
        willChange: "transform",
      }}
      initial={{ left: "-8%" }}
      animate={{ left: ["-8%", "108%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
  );
}
