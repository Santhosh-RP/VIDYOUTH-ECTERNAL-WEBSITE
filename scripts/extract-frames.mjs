// One-off frame extractor: turns a source video into an evenly-spaced WebP
// image sequence under public/<outDir>/ for a scroll-scrubbed canvas.
//
//   node scripts/extract-frames.mjs <inputPath> [outDirName] [frameCount]
//   npm run frames:earth         # VideoA → public/frames-earth
//   npm run frames:satellite     # VideoB → public/frames-satellite
//
// No system ffmpeg needed — binaries come from the ffmpeg-static /
// ffprobe-static dev deps.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// ── Defaults ──────────────────────────────────────────────────────────────
const DEFAULT_FRAME_COUNT = 150;
const DEFAULT_MAX_WIDTH = 1600; // cap — only downscales, never upscales
const DEFAULT_QUALITY = 78; // 0–100, higher = bigger/sharper

// ── Args ──────────────────────────────────────────────────────────────────
//   node extract-frames.mjs <input> [outDir] [count] [quality] [maxWidth]
const inputArg = process.argv[2];
const outName = process.argv[3] ?? "frames";
const FRAME_COUNT = Number(process.argv[4]) || DEFAULT_FRAME_COUNT;
const WEBP_QUALITY = Number(process.argv[5]) || DEFAULT_QUALITY;
const MAX_WIDTH = Number(process.argv[6]) || DEFAULT_MAX_WIDTH;

if (!inputArg) {
  console.error(
    "Usage: node scripts/extract-frames.mjs <inputPath> [outDirName] [frameCount]",
  );
  process.exit(1);
}

const ffprobePath = ffprobeStatic.path;
const inputPath = resolve(inputArg);
const outDir = join(projectRoot, "public", outName);

if (!ffmpegPath || !existsSync(ffmpegPath)) {
  console.error("ffmpeg-static binary not found. Run `npm install` first.");
  process.exit(1);
}
if (!existsSync(inputPath)) {
  console.error(`Source video not found:\n  ${inputPath}`);
  process.exit(1);
}

// ── Probe duration + dimensions ───────────────────────────────────────────
const probeRaw = execFileSync(
  ffprobePath,
  [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "json",
    inputPath,
  ],
  { encoding: "utf8" },
);
const probe = JSON.parse(probeRaw);
const srcW = Number(probe.streams?.[0]?.width);
const srcH = Number(probe.streams?.[0]?.height);
const duration = Number(probe.format?.duration);

if (!duration || !isFinite(duration) || !srcW || !srcH) {
  console.error("Could not read duration/dimensions from the source video.");
  console.error(probeRaw);
  process.exit(1);
}

const outW = Math.min(MAX_WIDTH, srcW);
const outH = Math.round((srcH * (outW / srcW)) / 2) * 2; // keep aspect, even

console.log(`Source : ${inputPath}`);
console.log(`        ${srcW}x${srcH}, ${duration.toFixed(2)}s`);
console.log(
  `Output : ${FRAME_COUNT} frames @ ${outW}x${outH} WebP q${WEBP_QUALITY} → public/${outName}/`,
);

// ── Clean output dir ──────────────────────────────────────────────────────
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// ── Extract ───────────────────────────────────────────────────────────────
// fps=N/duration samples evenly; -frames:v caps it to exactly FRAME_COUNT
// (the filter can round to ±1).
execFileSync(
  ffmpegPath,
  [
    "-hide_banner",
    "-loglevel", "error",
    "-stats",
    "-i", inputPath,
    "-vf", `fps=${FRAME_COUNT}/${duration},scale=${outW}:${outH}:flags=lanczos`,
    "-frames:v", String(FRAME_COUNT),
    "-c:v", "libwebp",
    "-quality", String(WEBP_QUALITY),
    "-compression_level", "6",
    join(outDir, "frame_%04d.webp"),
  ],
  { stdio: "inherit" },
);

// ── Manifest + summary ────────────────────────────────────────────────────
const frames = readdirSync(outDir).filter((f) => f.endsWith(".webp")).sort();
const totalBytes = frames.reduce(
  (sum, f) => sum + statSync(join(outDir, f)).size,
  0,
);

writeFileSync(
  join(outDir, "manifest.json"),
  JSON.stringify({ count: frames.length, width: outW, height: outH }, null, 2),
);

console.log(
  `\nDone: ${frames.length} frames, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total → public/${outName}/`,
);
if (frames.length !== FRAME_COUNT) {
  console.warn(
    `Note: produced ${frames.length} frames (expected ${FRAME_COUNT}). ` +
      `Update the matching frameCount in app/page.tsx to ${frames.length}.`,
  );
}
