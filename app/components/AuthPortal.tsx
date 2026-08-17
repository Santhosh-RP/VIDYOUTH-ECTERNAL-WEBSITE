"use client";

/**
 * AuthPortal — the "Login" CTA on the landing opens a popup offering Sign up /
 * Sign in per role (User / Vendor / Organisation / Mentor). Each choice routes
 * through the /redirect loading buffer, which then sends the user to the app's
 * auth screen.
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const APP = "https://lms.vidyouthintelligence.com";

const SIGNUP: [string, string][] = [
  ["User", `${APP}/signup`],
  ["Vendor", `${APP}/vendor/signup`],
  ["Organisation", `${APP}/org/signup`],
  ["Mentor", `${APP}/mentor/signup`],
];
const LOGIN: [string, string][] = [
  ["User", `${APP}/login`],
  ["Vendor", `${APP}/vendor/login`],
  ["Organisation", `${APP}/org/login`],
  ["Mentor", `${APP}/mentor/login`],
];

// Route through the /redirect loading buffer to the app's auth screen. No
// component state involved, so this lives at module scope.
function go(url: string) {
  window.location.assign(`/redirect/?to=${encodeURIComponent(url)}`);
}

// A single role column (Create account / Sign in). Declared at module scope so
// it isn't recreated on every AuthPortal render.
function Col({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">{title}</h3>
      <div className="flex flex-col gap-2.5">
        {items.map(([label, url]) => (
          <button
            key={label}
            onClick={() => go(url)}
            className="group flex items-center justify-between rounded-xl border border-cyan-400/15 bg-white/[0.04] px-4 py-3 text-left text-[14px] font-medium text-slate-100 transition-all duration-200 hover:border-cyan-400/45 hover:bg-cyan-400/[0.08]"
          >
            <span>{label}</span>
            <span className="text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AuthPortal({ showTrigger = true }: { showTrigger?: boolean }) {
  const [open, setOpen] = useState(false);
  // Let any other trigger (e.g. the nav "Sign In" button) open this popup.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("vy:open-auth", handler);
    return () => window.removeEventListener("vy:open-auth", handler);
  }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      {showTrigger && (
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-400/[0.10] px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#f8fafc] transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/[0.16]"
        >
          <span>Login</span>
        </button>
      )}

      {open && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 2147483647 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-cyan-400/20 bg-[#05070f]/95 p-7 shadow-[0_30px_80px_-20px_rgba(56,189,248,0.35)] sm:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-center text-2xl font-bold tracking-tight text-white">Welcome to Vidyouth</h2>
            <p className="mt-1.5 text-center text-sm text-slate-400">Choose how you’d like to continue.</p>
            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <Col title="Create account" items={SIGNUP} />
              <Col title="Sign in" items={LOGIN} />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
