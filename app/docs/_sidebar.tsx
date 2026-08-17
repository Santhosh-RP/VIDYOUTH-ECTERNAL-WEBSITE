"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Docs navigation tree. `href` uses trailing slashes to match the static export
// (trailingSlash: true). Sub-items are in-page anchors on that section page.
export const DOCS_NAV = [
  {
    title: "Getting Started",
    href: "/docs/getting-started/",
    items: [
      { label: "Overview", hash: "overview" },
      { label: "Create your account", hash: "create-account" },
      { label: "Sign in & 2FA", hash: "sign-in" },
      { label: "Your dashboard", hash: "dashboard" },
    ],
  },
  {
    title: "Learner Guide",
    href: "/docs/learners/",
    items: [
      { label: "Enroll in a course", hash: "enroll" },
      { label: "Watch lessons & videos", hash: "lessons" },
      { label: "Assignments", hash: "assignments" },
      { label: "Live classes", hash: "live" },
      { label: "Book a mentor", hash: "mentors" },
      { label: "Certificates", hash: "certificates" },
    ],
  },
  {
    title: "Vendor Guide",
    href: "/docs/vendors/",
    items: [
      { label: "Become a vendor", hash: "start" },
      { label: "Your vendor dashboard", hash: "dashboard" },
      { label: "Documents & compliance", hash: "documents" },
    ],
  },
  {
    title: "Mentor Guide",
    href: "/docs/mentors/",
    items: [
      { label: "Become a mentor", hash: "start" },
      { label: "Set your availability", hash: "availability" },
      { label: "Run sessions", hash: "sessions" },
      { label: "Payouts", hash: "payouts" },
    ],
  },
] as const;

export default function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const norm = (p: string) => (p.endsWith("/") ? p : p + "/");
  const here = norm(pathname || "/docs/");

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="sticky top-0 z-30 flex w-full items-center gap-2 border-b border-white/10 bg-[#070d18]/95 px-5 py-3 text-sm font-semibold text-white backdrop-blur lg:hidden"
        aria-expanded={open}
      >
        <span className="text-cyan-300">{open ? "✕" : "☰"}</span> Documentation menu
      </button>

      <aside
        className={`${open ? "block" : "hidden"} border-b border-white/10 bg-[#070d18] lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r`}
      >
        <div className="px-5 py-6 lg:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-300 text-[15px] font-extrabold text-[#04121f]">V</span>
            <span className="text-[15px] font-bold tracking-tight text-white">Vidyouth <span className="font-normal text-cyan-300/80">Docs</span></span>
          </Link>

          <nav className="mt-7 flex flex-col gap-6">
            {DOCS_NAV.map((sec) => {
              const active = here === sec.href;
              return (
                <div key={sec.href}>
                  <Link
                    href={sec.href}
                    onClick={() => setOpen(false)}
                    className={`block text-[13px] font-semibold tracking-tight transition-colors ${active ? "text-cyan-300" : "text-white hover:text-cyan-200"}`}
                  >
                    {sec.title}
                  </Link>
                  <ul className={`mt-2 flex flex-col gap-1.5 border-l ${active ? "border-cyan-400/40" : "border-white/10"} pl-3`}>
                    {sec.items.map((it) => (
                      <li key={it.hash}>
                        <Link
                          href={`${sec.href}#${it.hash}`}
                          onClick={() => setOpen(false)}
                          className="block text-[12.5px] leading-5 text-slate-400 transition-colors hover:text-white"
                        >
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>

          <Link href="/" className="mt-8 inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:text-cyan-300">
            ← Back to vidyouthintelligence.com
          </Link>
        </div>
      </aside>
    </>
  );
}
