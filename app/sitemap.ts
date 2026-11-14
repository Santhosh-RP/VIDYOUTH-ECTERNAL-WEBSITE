import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

// Static export: generate sitemap.xml at build time.
export const dynamic = "force-static";

const PAGES = [
  { path: "/", priority: 1 },
  { path: "/docs/", priority: 0.7 },
  { path: "/docs/getting-started/", priority: 0.6 },
  { path: "/docs/learners/", priority: 0.6 },
  { path: "/docs/vendors/", priority: 0.5 },
  { path: "/docs/mentors/", priority: 0.5 },
  { path: "/privacy/", priority: 0.2 },
  { path: "/terms/", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority }) => ({ url: `${SITE_URL}${path}`, priority }));
}
