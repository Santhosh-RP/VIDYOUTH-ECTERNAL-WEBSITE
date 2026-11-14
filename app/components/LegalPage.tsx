import Link from "next/link";
import type { ReactNode } from "react";

// Shared shell for the Privacy Policy and Terms of Service pages: same dark
// palette and type as the docs, with a way back to the landing page.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <main className="mx-auto w-full max-w-3xl px-5 py-12 lg:py-16">
        <Link href="/" className="text-[13px] font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
          ← Back to Vidyouth
        </Link>
        <header className="mt-6 mb-8 border-b border-white/10 pb-6">
          <h1 className="font-heading text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-tight tracking-[-0.03em]">{title}</h1>
          <p className="mt-2 text-[13px] text-slate-400">Last updated: {updated}</p>
        </header>
        <div className="flex flex-col gap-7 text-[15px] leading-7 text-slate-300">{children}</div>
      </main>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-white">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
