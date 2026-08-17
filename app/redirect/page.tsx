"use client";

/**
 * Loading buffer — sits between the landing's auth popup and the app's login /
 * signup screens. Reads ?to=<app url>, shows a centered cinematic loader, then
 * redirects. Only the app host is allowed (open-redirect guard).
 */
import Image from "next/image";
import { useEffect, useState } from "react";

const APP_HOST = "lms.vidyouthintelligence.com";
const FALLBACK = `https://${APP_HOST}/login`;

export default function RedirectBuffer() {
  const [target, setTarget] = useState<string>(FALLBACK);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("to") || "";
    let safe = FALLBACK;
    try {
      const u = new URL(raw);
      if (u.hostname === APP_HOST) safe = u.toString();
    } catch {
      /* keep fallback */
    }
    setTarget(safe);
    const t = setTimeout(() => {
      window.location.href = safe;
    }, 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at 50% 40%, #0a1330 0%, #02040d 70%)",
        color: "#e6f0ff",
      }}
    >
      <style>{`@keyframes vy-spin{to{transform:rotate(360deg)}}@keyframes vy-pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ position: "relative", width: 92, height: 92, margin: "0 auto" }}>
          {/* Spinning ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "3px solid rgba(56,189,248,0.15)",
              borderTopColor: "#38bdf8",
              boxShadow: "0 0 40px -6px rgba(56,189,248,0.6)",
              animation: "vy-spin 0.9s linear infinite",
            }}
          />
          {/* Vidyouth seal — centered, static, gentle pulse. `priority` because
              the page redirects after 1.3s; a lazy image may never paint. */}
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <Image
              src="/vidyouth-logo.png"
              alt="Vidyouth Intelligence Institute Pvt. Ltd."
              width={56}
              height={56}
              priority
              style={{
                width: 56,
                height: 56,
                animation: "vy-pulse 1.6s ease-in-out infinite",
              }}
            />
          </div>
        </div>
        <p
          style={{
            marginTop: 26,
            fontSize: 12,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#7dd3fc",
            animation: "vy-pulse 1.6s ease-in-out infinite",
          }}
        >
          Loading…
        </p>
        <p style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
          Taking you to Vidyouth — if it doesn’t,{" "}
          <a href={target} style={{ color: "#38bdf8", textDecoration: "underline" }}>
            continue
          </a>
          .
        </p>
      </div>
    </main>
  );
}
