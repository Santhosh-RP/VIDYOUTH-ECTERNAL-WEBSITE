import Link from "next/link";
import type { ReactNode } from "react";

// Page title + lead paragraph
export function DocHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header className="mb-9 border-b border-white/10 pb-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">{eyebrow}</p>
      <h1 className="mt-2 font-heading text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-tight tracking-[-0.03em] text-white">{title}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300">{lead}</p>
    </header>
  );
}

// Section wrapper with an anchor id (matches the sidebar hashes)
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-b border-white/[0.07] py-8 first:pt-2">
      <h2 className="font-heading text-[20px] font-bold tracking-tight text-white">
        <a href={`#${id}`} className="group">
          {title}
          <span className="ml-2 text-cyan-400/0 transition-colors group-hover:text-cyan-400/70">#</span>
        </a>
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-[14.5px] leading-7 text-slate-300">{children}</div>
    </section>
  );
}

// Numbered step
export function Step({ n, title, children }: { n: number; title: string; children?: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400/15 text-[12px] font-bold text-cyan-300 ring-1 ring-cyan-400/30">{n}</span>
      <div>
        <p className="font-semibold text-white">{title}</p>
        {children && <div className="mt-1 text-slate-300">{children}</div>}
      </div>
    </div>
  );
}

// Callout / note box
export function Callout({ type = "tip", children }: { type?: "tip" | "note" | "warn"; children: ReactNode }) {
  const map = {
    tip: { c: "#34d399", bg: "rgba(52,211,153,0.07)", b: "rgba(52,211,153,0.28)", label: "Tip" },
    note: { c: "#38bdf8", bg: "rgba(56,189,248,0.07)", b: "rgba(56,189,248,0.28)", label: "Note" },
    warn: { c: "#fbbf24", bg: "rgba(251,191,36,0.07)", b: "rgba(251,191,36,0.30)", label: "Heads up" },
  }[type];
  return (
    <div className="rounded-xl border p-4" style={{ background: map.bg, borderColor: map.b }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: map.c }}>{map.label}</p>
      <div className="mt-1.5 text-[14px] leading-6 text-slate-200">{children}</div>
    </div>
  );
}

// Inline key / code
export function Kbd({ children }: { children: ReactNode }) {
  return <code className="rounded-md border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12.5px] text-cyan-100">{children}</code>;
}

// Link into the LMS app (same base URL the landing page's Login button uses).
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dy08yaj8o1qyw.cloudfront.net";

export function AppLink({ path, children }: { path: string; children: ReactNode }) {
  return (
    <a
      href={`${APP_URL}${path}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 transition-colors hover:text-cyan-200"
    >
      {children}
    </a>
  );
}

// Prev / next footer nav
export function PageNav({ prev, next }: { prev?: { href: string; label: string }; next?: { href: string; label: string } }) {
  return (
    <nav className="mt-10 flex items-stretch justify-between gap-4 border-t border-white/10 pt-6">
      {prev ? (
        <Link href={prev.href} className="group flex flex-1 flex-col rounded-xl border border-white/10 p-4 transition-colors hover:border-cyan-400/40">
          <span className="text-[11px] text-slate-500">← Previous</span>
          <span className="mt-0.5 text-[13.5px] font-semibold text-white group-hover:text-cyan-200">{prev.label}</span>
        </Link>
      ) : <span className="flex-1" />}
      {next ? (
        <Link href={next.href} className="group flex flex-1 flex-col items-end rounded-xl border border-white/10 p-4 text-right transition-colors hover:border-cyan-400/40">
          <span className="text-[11px] text-slate-500">Next →</span>
          <span className="mt-0.5 text-[13.5px] font-semibold text-white group-hover:text-cyan-200">{next.label}</span>
        </Link>
      ) : <span className="flex-1" />}
    </nav>
  );
}
