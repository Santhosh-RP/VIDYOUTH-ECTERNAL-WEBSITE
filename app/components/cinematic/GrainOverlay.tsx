"use client";

/**
 * Fixed, ultra-subtle film-grain overlay. Pure CSS — no canvas, no perf hit.
 * The noise comes from a tiny inline SVG turbulence pattern, repeated.
 */
export function GrainOverlay({ opacity = 0.06 }: { opacity?: number }) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix values='0 0 0 0 0.85  0 0 0 0 0.92  0 0 0 0 1  0 0 0 0.7 0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}")`;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
      style={{
        backgroundImage: url,
        backgroundSize: "160px 160px",
        opacity,
      }}
    />
  );
}
