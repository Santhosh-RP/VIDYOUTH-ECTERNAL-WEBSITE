import Link from "next/link";

const CARDS = [
  { href: "/docs/getting-started/", title: "Getting Started", desc: "Create your account, sign in securely, and find your way around your dashboard.", icon: "M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7z", accent: "#38bdf8" },
  { href: "/docs/learners/", title: "Learner Guide", desc: "Enrol in courses, watch lessons, submit assignments, join live classes and earn certificates.", icon: "M22 10 12 5 2 10l10 5 10-5ZM6 12v5c0 1 3 3 6 3s6-2 6-3v-5", accent: "#34d399" },
  { href: "/docs/vendors/", title: "Vendor Guide", desc: "Onboard as a vendor, manage your dashboard, and keep your documents compliant.", icon: "M3 7h18v13H3zM3 7l2-4h14l2 4M9 12h6", accent: "#a78bfa" },
  { href: "/docs/mentors/", title: "Mentor Guide", desc: "Become a mentor, set your availability, run 1:1 sessions and track your payouts.", icon: "M16 11a4 4 0 1 0-8 0M4 21v-1a6 6 0 0 1 12 0v1M18 8l2 2 3-3", accent: "#fb7185" },
];

export default function DocsHome() {
  return (
    <div>
      <header className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">Documentation</p>
        <h1 className="mt-2 font-heading text-[clamp(2.1rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.03em] text-white">
          Vidyouth, explained step by step
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-7 text-slate-300">
          Everything you need to use the Vidyouth platform — whether you&apos;re a learner starting your
          journey, a vendor partnering with us, or a mentor guiding the next generation. Pick a guide
          below, or use the menu on the left.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20"
          >
            <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-60" style={{ background: `radial-gradient(circle, ${c.accent}, transparent 70%)` }} />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border" style={{ borderColor: `${c.accent}55`, background: `${c.accent}14`, color: c.accent }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon} /></svg>
            </span>
            <h2 className="relative mt-3.5 font-heading text-[17px] font-bold tracking-tight text-white">{c.title}</h2>
            <p className="relative mt-1.5 text-[13.5px] leading-6 text-slate-400">{c.desc}</p>
            <span className="relative mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: c.accent }}>
              Read guide <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-5">
        <p className="text-[14px] font-semibold text-white">Can&apos;t find what you need?</p>
        <p className="mt-1.5 text-[13.5px] leading-6 text-slate-300">
          Use the <strong className="text-cyan-200">Vidyouth Assistant</strong> chat on the main site for instant answers,
          or reach us any time via the <Link href="/#contact" className="text-cyan-300 underline-offset-2 hover:underline">Contact</Link> page.
        </p>
      </div>
    </div>
  );
}
