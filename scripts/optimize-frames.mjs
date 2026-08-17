// Re-encode the heavy scroll-frame sequences to a smaller resolution + tighter
// webp. They're full-bleed cover backgrounds painted onto a canvas, so a modest
// downscale is visually ~invisible but roughly halves the bytes the browser must
// download on the landing page. Filenames/count are unchanged, so no component
// edits are needed. Idempotent-ish (re-running just recompresses again).
import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join } from "path";

const JOBS = [
  { dir: "public/frames-earth", width: 1080, quality: 72 },
  { dir: "public/frames-satellite", width: 1200, quality: 72 },
];

for (const { dir, width, quality } of JOBS) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  let before = 0;
  let after = 0;
  for (const f of files) {
    const p = join(dir, f);
    before += statSync(p).size;
    // Read bytes ourselves so sharp never holds a handle on the file we're about
    // to overwrite (Windows locks it otherwise).
    const input = readFileSync(p);
    const buf = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toBuffer();
    writeFileSync(p, buf);
    after += buf.length;
  }
  console.log(
    `${dir}: ${files.length} frames  ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB`,
  );
}
