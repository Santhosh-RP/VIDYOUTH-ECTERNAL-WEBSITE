"use client";

// ──────────────────────────────────────────────────────────────────────────
// VIDYOUTH — HOMEPAGE
//
// Content + layout recreated from the approved reference blueprint, rendered
// in the EXISTING dark cinematic system (PCB/India video backdrop, cyan-glass
// cards, Space Grotesk type, subtle Framer reveals). Section order:
//
//   01  Hero                     headline + chip art + 4 feature cards
//   02  Mission · Vision · Founders
//   03  Programs                 3 tracks + hiring-partner strip
//   04  India Semiconductor Mission (ISM) + infinity-loop + ISM 2.0
//   05  Trust & Credibility      Vidyouth × KTSemicon + stats + testimonial
//   06  Contact                  info + enquiry form
//   07  FAQ                      accordion
//   Footer                       socials + government recognition
//
// Images the reference used (founders photo, 3D chip, ecosystem diagram,
// partner + government logos, mascot) are rendered as ON-BRAND SVG/CSS
// placeholders and marked with `SWAP:` comments for real assets later.
// ──────────────────────────────────────────────────────────────────────────

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import AuthPortal from "./components/AuthPortal";
import { useScrollVideo } from "./hooks/useScrollVideo";
import { EASE_OUT_QUART } from "./lib/easing";

// ──────────────────────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "ISM", href: "#ism" },
  { label: "Partners", href: "#trust" },
  { label: "Docs", href: "/docs/" },
  { label: "Contact", href: "#contact" },
] as const;

const HERO_FEATURES = [
  { icon: "mentorship", title: "Industry Mentors" },
  { icon: "labs", title: "Hands-on Projects" },
  { icon: "placement", title: "Career-Focused Learning" },
] as const;

const MVF = [
  {
    icon: "mission",
    label: "Our Mission",
    body: "Our mission is not only to educate talent, but to cultivate the workforce that will power India’s semiconductor future.",
  },
  {
    icon: "vision",
    label: "Our Vision",
    body: "Vidyouth Intelligence was founded with the vision of contributing to the India Semiconductor Mission (ISM) by developing a highly skilled, industry-ready workforce for India’s semiconductor and electronics ecosystem. Through practical, industry-driven education, expert mentorship, strategic partnerships, and continuous innovation, we aim to bridge the gap between academia and industry while supporting the national objectives of Viksit Bharat, Atmanirbhar Bharat, Make in India, Made in India, Digital India, Skill India, and the vision of transforming India into a global technology and semiconductor leader.",
  },
  {
    icon: "founder",
    label: "A Note from the Founders",
    body: "We believe that every great technological nation is built by its people. While infrastructure, research, and innovation shape industries, it is skilled professionals who transform vision into reality. India is entering a defining era in its semiconductor journey. This is an opportunity not only to manufacture technology, but to cultivate knowledge, innovation, and leadership that can inspire the world. We believe India’s greatest contribution to the global semiconductor industry will be its talent. That belief inspired the creation of Vidyouth Intelligence. Our aspiration extends beyond education. We are committed to building a collaborative ecosystem where students, academia, industry, researchers, innovators, and policymakers work together to strengthen India’s semiconductor capabilities. By nurturing globally competitive professionals and encouraging continuous learning, we aim to contribute meaningfully to the objectives of the India Semiconductor Mission (ISM) and the vision of Viksit Bharat 2047. “The future of India’s semiconductor industry will be shaped by the talent we empower today. That is the legacy we aspire to build.”",
  },
] as const;

const EMPOWERMENT_WORDS = [
  { label: "Empower", color: "#38bdf8", href: "#about" },
  { label: "Educate", color: "#34d399", href: "#programs" },
  { label: "Employ", color: "#a78bfa", href: "#contact" },
] as const;

// Dynamic hero line — the second line of the headline rotates through Vidyouth's
// focus areas in a fixed, single-line area (no layout jump) with a typing caret.
const HERO_PHRASES = [
  "Semiconductor Talent",
  "Aerospace & Defence",
  "VLSI & Chip Design",
  "AI & Deep-Tech Talent",
] as const;

function RotatingHeadline() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % HERO_PHRASES.length), 1900);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative mt-1 block h-[1.15em] w-full overflow-hidden text-[clamp(2.1rem,4.6vw,5rem)]">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "0.55em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.55em", filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center whitespace-nowrap"
        >
          <span className="bg-gradient-to-r from-[#8fb9c5] via-[#67e8f9] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(103,232,249,0.22)]">
            {HERO_PHRASES[i]}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const PROGRAMS = [
  {
    icon: "vlsi",
    title: "VLSI Design Program",
    accent: "#38bdf8",
    items: [
      "Digital Design (Verilog, SystemVerilog)",
      "FPGA Design & Verification",
      "ASIC Flow & Methodologies",
      "Industry-standard EDA Tools",
      "Capstone Projects",
    ],
  },
  {
    icon: "embedded",
    title: "Embedded Systems Program",
    accent: "#34d399",
    items: [
      "C Programming & Data Structures",
      "Microcontrollers & SoC",
      "RTOS & Device Drivers",
      "IoT & Communication Protocols",
      "Hands-on Hardware Labs",
    ],
  },
  {
    icon: "physical",
    title: "Physical Design Program",
    accent: "#a78bfa",
    items: [
      "RTL to GDSII Flow",
      "Floorplanning & Placement",
      "Clock Tree & Routing",
      "Timing & Signoff",
      "Industry Tools: ICC2, PrimeTime",
    ],
  },
] as const;

// SWAP: replace text wordmarks with licensed partner logos when available.
const HIRING_PARTNERS = [
  "Intel",
  "Qualcomm",
  "NVIDIA",
  "AMD",
  "Texas Instruments",
  "Synopsys",
  "Cadence",
  "Micron",
  "Bosch",
  "NXP",
  "Samsung",
] as const;

const ISM_OBJECTIVES = [
  "Establish Semiconductor & Display Manufacturing Ecosystem",
  "Promote Design, Innovation & IP Development",
  "Build Skilled Workforce",
  "Strengthen Supply Chain & Global Partnerships",
  "Attract Investments & Drive Industry Growth",
] as const;

const COLLABORATION = [
  "Industry-relevant curriculum designed with KTSemicon experts",
  "Live projects & real-time design challenges",
  "Mentorship by working professionals",
  "Direct placement opportunities for trained students",
] as const;

// Client-supplied credibility figures (from the reference brief).
const TRUST_STATS = [
  { icon: "users", value: "100+", label: "Students Trained" },
  { icon: "handshake", value: "25+", label: "Placement Partners" },
  { icon: "chart", value: "75%", label: "Placement Success" },
  { icon: "mentor", value: "10+", label: "Industry Experience Mentors" },
] as const;

const CONTACT_INFO = [
  { icon: "mail", label: "Email", value: "info@vidyouthintelligence.com", href: "mailto:info@vidyouthintelligence.com" },
  { icon: "pin", label: "Location", value: "Hyderabad, India", href: "" },
] as const;

const PROGRAM_OPTIONS = [
  "VLSI Design Program",
  "Embedded Systems Program",
  "Physical Design Program",
] as const;

const FAQS = [
  {
    q: "What makes Vidyouth different from other learning platforms?",
    a: "Vidyouth delivers hands-on, industry-led learning designed for careers in Defence, Aerospace, Semiconductors, and emerging technologies. We focus on practical skills, real-world projects, and career readiness.",
  },
  {
    q: "Who can enroll in Vidyouth programs?",
    a: "Our programs welcome students and graduates from STEM backgrounds. Eligibility varies by course.",
  },
  {
    q: "Do I need any prior experience or coding knowledge?",
    a: "No prior experience or coding knowledge is required. We start from the basics and guide you step by step to advanced concepts and real-world applications.",
  },
  {
    q: "How do I know which course is right for me?",
    a: "Our counselors will assess your academic background, interests, and career goals to help you choose the course that's right for you.",
  },
  {
    q: "Will I work on real-world projects?",
    a: "Yes. Project-based learning is at the core of our training. You'll work on practical, industry-relevant projects that help you build a strong portfolio and showcase your skills.",
  },
  {
    q: "Will I receive a certificate after completing the course?",
    a: "Yes! Once you successfully complete the course and meet the completion requirements, you'll receive a Vidyouth Certificate of Completion.",
  },
  {
    q: "Do you offer placement assistance?",
    a: "We provide career support through resume building, interview preparation, and career guidance to help you become job-ready. However, we do not guarantee placements.",
  },
  {
    q: "Does Vidyouth offer Defence-related training?",
    a: "Yes. We offer industry-focused training for Defence, Aerospace, and Strategic Technology careers. Vidyouth is an independent edtech platform with no official government or military affiliation unless explicitly stated.",
  },
  {
    q: "Why should I choose a career in semiconductors?",
    a: "The semiconductor industry is one of the fastest-growing technology sectors, creating high-demand career opportunities in chip design, manufacturing, testing, and electronics. With significant investments in India's semiconductor ecosystem, now is an ideal time for STEM students to build future-ready skills.",
  },
  {
    q: "Is Vidyouth part of KT Semicon?",
    a: "No. Vidyouth is an independent edtech organization. We collaborate with KT Semicon on selected academic initiatives to enhance learning opportunities for our learners.",
  },
] as const;

const ISM_MILESTONES = [
  { year: "2021", text: "India Semiconductor Mission (ISM) launched under the ₹76,000 crore Semicon India Programme." },
  { year: "2022", text: "50% fiscal support introduced for semiconductor and display manufacturing projects." },
  { year: "2023", text: "Global partnerships expanded through Semicon India 2023." },
  { year: "2024", text: "International collaborations strengthened to enhance India's semiconductor ecosystem." },
  { year: "2025", text: "First Made-in-India semiconductor chips showcased; key manufacturing agreements signed." },
  { year: "2026", text: "Semicon 2.0 launched with ₹1.275 lakh crore to accelerate ecosystem growth." },
] as const;

const ISM_PILLARS = [
  { icon: "vlsi", title: "Design of Chips" },
  { icon: "equipment", title: "Machines & Materials" },
  { icon: "ecosystem", title: "Setting up more Fabs" },
  { icon: "embedded", title: "Strengthening ATMP/OSAT Industry" },
  { icon: "rnd", title: "Research & Development" },
  { icon: "mentor", title: "Talent Development" },
] as const;

const SOCIALS = [
  { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/vidyouth-intelligence-institute-pvt-ltd/" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/vidyouthintelligence?igsh=MWpscGVqOWEyODRxNQ==" },
  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@vidyouthintelligence" },
  { name: "Twitter", icon: "twitter", href: "https://x.com/VidyouthEdu" },
  { name: "Facebook", icon: "facebook", href: "#" },
] as const;

// SWAP: government recognition marks — replace label badges with official logos.
const RECOGNITION: {
  label: string;
  sub: string;
  tag: string;
  flag?: boolean;
  image?: string;
}[] = [
  { label: "Make in India, Made in India", sub: "", tag: "", image: "/make-in-india-logo-transparent.png" },
  { label: "NSDC", sub: "National Skill Development Corporation", tag: "", image: "/nsdc-transparent.png" },
];

// ──────────────────────────────────────────────────────────────────────────
// MOTION
// ──────────────────────────────────────────────────────────────────────────
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_QUART } },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: EASE_OUT_QUART, delay }}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// HOOKS
// ──────────────────────────────────────────────────────────────────────────
function usePageScrollProgress(): MotionValue<number> {
  const mv = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const total =
        (document.documentElement.scrollHeight || 0) - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
      mv.set(p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [mv]);
  return mv;
}

function useActiveSection(): number {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const compute = () => {
      const trigger = window.scrollY + window.innerHeight * 0.4;
      let idx = 0;
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= trigger) idx = i;
      }
      setActive((curr) => (curr === idx ? curr : idx));
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);
  return active;
}

// ──────────────────────────────────────────────────────────────────────────
// PAGE
// ──────────────────────────────────────────────────────────────────────────
export default function Home() {
  const pageProgress = usePageScrollProgress();
  return (
    <main className="relative isolate w-full bg-[#02030a] font-sans text-white">
      <PageBackdrop />
      <ProgressBar progress={pageProgress} />
      <TopNav />

      <HeroSection />
      <MissionVisionFounders />
      <ProgramsSection />
      <IsmSection />
      <TrustSection />
      <ContactSection />
      <FaqSection />
      <SiteFooter />
      <ChatbotLauncher />

      {/* Sign-in modal. Listens for the `vy:open-auth` event dispatched by the
          nav; routes through /redirect to the LMS auth screen. */}
      <AuthPortal showTrigger={false} />
    </main>
  );
}

// ──────────────────────────────────────────────────────────────────────────
const CHAT_FAQS = [
  {
    q: "What makes Vidyouth different from other learning platforms?",
    a: "Vidyouth delivers hands-on, industry-led learning designed for careers in Defence, Aerospace, Semiconductors, and emerging technologies. We focus on practical skills, real-world projects, and career readiness.",
  },
  {
    q: "Who can enroll in Vidyouth programs?",
    a: "Our programs welcome students and graduates from STEM backgrounds. Eligibility varies by course.",
  },
  {
    q: "Do I need any prior experience or coding knowledge?",
    a: "No prior experience or coding knowledge is required. We start from the basics and guide you step by step to advanced concepts and real-world applications.",
  },
  {
    q: "How do I know which course is right for me?",
    a: "Our counselors will assess your academic background, interests, and career goals to help you choose the course that's right for you.",
  },
  {
    q: "Will I work on real-world projects?",
    a: "Yes. Project-based learning is at the core of our training. You'll work on practical, industry-relevant projects that help you build a strong portfolio and showcase your skills.",
  },
  {
    q: "Will I receive a certificate after completing the course?",
    a: "Yes! Once you successfully complete the course and meet the completion requirements, you'll receive a Vidyouth Certificate of Completion.",
  },
  {
    q: "Do you offer placement assistance?",
    a: "Yes. While we don't guarantee placements, we provide career support through resume building, mock interviews, interview preparation, and career guidance to help you become job-ready.",
  },
  {
    q: "Does Vidyouth offer Defence-related training?",
    a: "Yes. We offer industry-focused training for Defence, Aerospace, and Strategic Technology careers. Vidyouth is an independent edtech platform with no official government or military affiliation unless explicitly stated.",
  },
  {
    q: "Why should I choose a career in semiconductors?",
    a: "The semiconductor industry is one of the fastest-growing technology sectors, creating high-demand career opportunities in chip design, manufacturing, testing, and electronics. With significant investments in India's semiconductor ecosystem, now is an ideal time for STEM students to build future-ready skills.",
  },
  {
    q: "Is Vidyouth part of KT Semicon?",
    a: "No. Vidyouth is an independent edtech organization. We collaborate with KT Semicon on selected academic initiatives to enhance learning opportunities for our learners.",
  },
] as const;

// Backend base for the public FAQ chatbot (same LLM stack the LMS uses).
const CHAT_API = "https://lms.vidyouthintelligence.com";

type ChatMsg = { role: "user" | "assistant"; text: string };

function ChatbotLauncher() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      text: "Hi! I'm the Vidyouth Assistant. Ask me anything about our programs, eligibility, projects, placements or certificates.",
    },
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesized chat sounds (no audio files needed — works on the static site).
  const playTone = (freqs: number[], step = 0.12, peak = 0.07) => {
    if (muted || typeof window === "undefined") return;
    try {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ctx = audioCtxRef.current ?? (audioCtxRef.current = new AC());
      if (ctx.state === "suspended") void ctx.resume();
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        const start = ctx.currentTime + i * step;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(peak, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + step);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + step);
      });
    } catch {
      /* audio unavailable — ignore */
    }
  };
  const playSend = () => playTone([680], 0.1, 0.05);
  const playReceive = () => playTone([880, 1240], 0.12, 0.07);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, open, busy]);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    const history = messages.slice(-6);
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    playSend();
    setBusy(true);
    try {
      const res = await fetch(`${CHAT_API}/api/v1/public/faq-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = (await res.json().catch(() => null)) as { answer?: string } | null;
      const answer =
        data?.answer ||
        "Sorry, I couldn't reach the assistant just now. Please try again in a moment, or use the Contact section below.";
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
      playReceive();
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry, I couldn't reach the assistant just now. Please try again in a moment, or use the Contact section below.",
        },
      ]);
      playReceive();
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    void send(input);
  };

  const showStarters = messages.length <= 1 && !busy;

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            className="flex h-[min(520px,calc(100vh-6rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-cyan-300/25 bg-[#071525]/97 text-left shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Vidyouth Assistant</p>
                <p className="text-[11px] leading-4 text-emerald-300/90">Online · usually replies instantly</p>
              </div>
              <button
                type="button"
                aria-label={muted ? "Unmute sounds" : "Mute sounds"}
                onClick={() => setMuted((v) => !v)}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                {muted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4.7 6.3 9H3v6h3.3L11 19.3z" /><path d="m16 9 5 5" /><path d="m21 9-5 5" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4.7 6.3 9H3v6h3.3L11 19.3z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>
                )}
              </button>
              <button
                type="button"
                aria-label="Close Vidyouth Assistant"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <p
                    className={
                      m.role === "user"
                        ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-cyan-500/90 px-3 py-2 text-xs leading-5 text-[#04121f]"
                        : "max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-white/8 px-3 py-2 text-xs leading-5 text-slate-200"
                    }
                  >
                    {m.text}
                  </p>
                </div>
              ))}

              {busy && (
                <div className="flex justify-start">
                  <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/8 px-3 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300" />
                  </span>
                </div>
              )}

              {showStarters && (
                <div className="pt-1">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Try asking</p>
                  <div className="flex flex-col gap-1.5">
                    {CHAT_FAQS.slice(0, 4).map((f) => (
                      <button
                        key={f.q}
                        type="button"
                        onClick={() => void send(f.q)}
                        className="rounded-lg border border-cyan-300/15 bg-white/[0.03] px-3 py-2 text-left text-[11.5px] leading-4 text-slate-300 transition-colors hover:border-cyan-300/45 hover:bg-cyan-300/5 hover:text-white"
                      >
                        {f.q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                aria-label="Ask a question"
                disabled={busy}
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={busy || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-[#04121f] transition-colors hover:bg-cyan-400 disabled:opacity-50"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Close Vidyouth Assistant" : "Open Vidyouth Assistant"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        animate={{ y: [0, -7, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-[74px] w-[74px] items-center justify-center bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <Image
          src="/chatbot-rocket-cutout.png"
          alt=""
          width={150}
          height={150}
          className="pointer-events-none absolute -bottom-4 -right-5 h-[112px] w-[112px] max-w-none object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.4)]"
        />
      </motion.button>
    </div>
  );
}

// CHROME — background video, progress bar, top navigation
// ──────────────────────────────────────────────────────────────────────────
function PageBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ready } = useScrollVideo(containerRef, videoRef);
  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <video
        ref={videoRef}
        src="/ind-final-v6-brighter-pins.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 h-screen w-full object-cover"
      />
      {/* Global readability wash so glass cards + text hold over any frame. */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_40%,rgba(2,4,12,0.35)_0%,rgba(2,4,12,0.6)_60%,rgba(2,4,12,0.78)_100%)]" />
      <div
        className={`fixed inset-0 flex items-center justify-center transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-300/60">
          Loading
        </span>
      </div>
    </div>
  );
}

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-white/[0.04]"
    >
      <motion.div
        style={{ scaleX: progress, transformOrigin: "left" }}
        className="h-full bg-gradient-to-r from-cyan-300/40 via-cyan-300/80 to-cyan-200 shadow-[0_0_12px_0_rgba(56,189,248,0.135)]"
      />
    </div>
  );
}

function TopNav() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  return (
    <header
      aria-label="Primary navigation"
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
      <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-5 md:px-10 md:pt-6">
        {/* Brand */}
        <a
          href="#home"
          onClick={() => setOpen(false)}
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
          className="pointer-events-auto group flex items-center gap-3 text-[18px] font-semibold uppercase tracking-[0.14em] text-white"
        >
          <BrandBadge />
          <span className="hidden sm:flex flex-col leading-none">
            <span>Vidyouth</span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-cyan-300/80">
              INTELLIGENCE
            </span>
          </span>
        </a>

        {/* Center links */}
        <nav
          aria-label="Sections"
          className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 whitespace-nowrap text-[13px] font-medium lg:flex xl:gap-6 xl:text-[14px]"
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
              className={`relative inline-flex items-center whitespace-nowrap transition-colors duration-300 ${
                active === i ? "text-cyan-100" : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
              <span
                aria-hidden
                className={`absolute -bottom-2 left-0 h-px bg-cyan-300 shadow-[0_0_8px_1px_rgba(56,189,248,0.3)] transition-[width,opacity] duration-500 ${
                  active === i ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="pointer-events-auto flex items-center gap-3">
          <label className="hidden h-8 items-center gap-2 rounded-full border border-white/20 bg-[rgba(15,23,42,0.55)] px-3 text-white/70 transition-colors focus-within:border-cyan-300/70 lg:flex">
            <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              aria-label="Search"
              className="w-24 bg-transparent text-[11px] text-white outline-none placeholder:text-white/45"
            />
          </label>
          {/* Sign In temporarily disabled per request — restore this button to re-enable. */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-white/25 bg-white/[0.05] backdrop-blur-md transition-colors duration-300 hover:border-cyan-300/60 lg:hidden"
          >
            <span
              className={`block h-px w-4 bg-white transition-transform duration-300 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-4 bg-white transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-4 bg-white transition-transform duration-300 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
            className="pointer-events-auto mx-6 mt-3 overflow-hidden rounded-2xl border border-cyan-400/15 bg-[rgba(6,10,20,0.92)] backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col p-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/85 transition-colors duration-200 hover:bg-cyan-400/[0.08] hover:text-cyan-100"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function BrandBadge({ size = 48 }: { size?: number }) {
  return (
    <Image
      src="/vidyouth-seal.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      priority
      className="shrink-0 drop-shadow-[0_0_10px_rgba(56,189,248,0.25)]"
      style={{ width: size, height: size }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SHARED — section header + scrim
// ──────────────────────────────────────────────────────────────────────────
function SectionScrim() {
  return null;
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center,
  containerClassName,
  titleClassName,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  // Replaces the default width cap; `titleClassName` is appended to the <h2>.
  // Both exist so a section can widen its header without changing the others.
  containerClassName?: string;
  titleClassName?: string;
}) {
  return (
    <Reveal
      className={
        containerClassName ??
        (center ? "mx-auto max-w-[720px] text-center" : "max-w-[760px]")
      }
    >
      {eyebrow && (
        <span
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-300"
        >
          {eyebrow}
        </span>
      )}
      <h2
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55), 0 8px 28px rgba(0,0,0,0.55)" }}
        className={`mt-3 text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-white md:text-[2.75rem] ${titleClassName ?? ""}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
          className={`mt-4 text-[15px] font-normal leading-[1.7] text-[#cbd5e1] md:text-base ${
            center ? "mx-auto max-w-[60ch]" : "max-w-[62ch]"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 01 · HERO
// ──────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="home"
      aria-label="Vidyouth — home"
      className="relative flex min-h-screen w-full items-start pt-24 pb-14"
    >
      <div className="relative mx-auto w-full max-w-none px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.6fr_0.4fr] lg:gap-4">
          {/* Left — copy */}
          <Reveal>
            <h1
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55), 0 12px 36px rgba(0,0,0,0.5)" }}
              className="mt-0 max-w-[1250px] text-balance text-[clamp(3rem,4.2vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white"
            >
              Empowering the Future of
              <RotatingHeadline />
            </h1>
            <p
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}
              className="mt-7 max-w-[850px] text-[18px] leading-[1.7] text-[#cbd5e1] md:text-[24px]"
            >
              Lightning the path to electrical intelligence
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 sm:gap-x-10">
              {EMPOWERMENT_WORDS.map((word) => (
                <a
                  key={word.label}
                  href={word.href}
                  className="empowerment-word text-2xl font-bold tracking-[-0.03em] transition-transform duration-300 hover:-translate-y-1 sm:text-3xl"
                  style={{
                    color: word.color,
                    textShadow: `0 0 8px ${word.color}88, 0 0 22px ${word.color}55, 0 0 42px ${word.color}33`,
                  }}
                >
                  {word.label}
                </a>
              ))}
            </div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              className="mt-7 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {HERO_FEATURES.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="flex items-center gap-2 rounded-2xl border border-cyan-400/12 bg-[rgba(10,15,25,0.6)] px-3 py-2.5 transition-colors duration-300 hover:border-cyan-400/30"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300">
                    <Icon name={f.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-heading text-xs font-semibold leading-snug text-white">
                    {f.title}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            <p className="mt-5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-300/70">
              Scroll to Explore
            </p>
          </Reveal>

          {/* Right — chip art (SWAP: 3D chip render) */}
          <Reveal delay={0.1} className="relative flex justify-center">
            <ChipArt />
          </Reveal>
        </div>

      </div>
    </section>
  );
}

function ChipArt() {
  return (
    <div className="relative aspect-square w-full max-w-[336px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.28)_0%,transparent_68%)] blur-xl"
      />
      <svg viewBox="0 0 200 200" className="relative h-full w-full" fill="none">
        {/* radiating traces */}
        {Array.from({ length: 4 }).map((_, i) => {
          const rot = i * 90;
          return (
            <g key={i} transform={`rotate(${rot} 100 100)`} stroke="rgba(56,189,248,0.35)" strokeWidth="1">
              <path d="M100 62 V22 M84 62 V34 M116 62 V34" />
              <circle cx="100" cy="20" r="2.5" fill="#7dd3fc" stroke="none" />
              <circle cx="84" cy="32" r="2" fill="#38bdf8" stroke="none" />
              <circle cx="116" cy="32" r="2" fill="#38bdf8" stroke="none" />
            </g>
          );
        })}
        {/* pin rows */}
        {Array.from({ length: 7 }).map((_, i) => {
          const p = 74 + i * 8.7;
          return (
            <g key={`pins-${i}`} stroke="rgba(125,211,252,0.7)" strokeWidth="2" strokeLinecap="round">
              <path d={`M${p} 62 V70`} />
              <path d={`M${p} 130 V138`} />
              <path d={`M62 ${p} H70`} />
              <path d={`M130 ${p} H138`} />
            </g>
          );
        })}
        {/* body */}
        <rect x="66" y="66" width="68" height="68" rx="8" fill="rgba(8,14,26,0.9)" stroke="rgba(125,211,252,0.6)" strokeWidth="2" />
        <rect x="82" y="82" width="36" height="36" rx="5" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.7)" strokeWidth="1.5" />
        <path d="M100 82 V118 M82 100 H118" stroke="rgba(56,189,248,0.5)" strokeWidth="1" />
        <circle cx="100" cy="100" r="6" fill="#38bdf8" />
        <circle cx="100" cy="100" r="11" fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 02 · MISSION · VISION · FOUNDERS
// ──────────────────────────────────────────────────────────────────────────
function MissionVisionFounders() {
  const founder = MVF[2];

  return (
    <section
      id="about"
      aria-label="Mission, vision and a note from the founders"
      className="section-y relative w-full"
    >
      <SectionScrim />
      <div className="relative mx-auto w-full max-w-[1200px] px-6">
        {/* The title needs ~818px to sit on one line, so this header opts out of
            the default 760px cap. `lg:whitespace-nowrap` guarantees the single
            line on desktop even if font metrics differ; it still wraps below lg. */}
        <SectionHeader
          eyebrow="About"
          title="About Vidyouth"
          subtitle="The belief and purpose behind Vidyouth Intelligence."
          containerClassName="max-w-[920px]"
          titleClassName="lg:whitespace-nowrap"
        />

        {/* Single column — the three blocks span the full width, which lets the
            copy sit on fewer lines and keeps the section inside one viewport. */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          className="mt-4 flex flex-col gap-2"
        >
          {MVF.map((b) => (
            <motion.div
              key={b.label}
              variants={fadeUp}
              className="flex gap-4 rounded-2xl border border-cyan-400/12 bg-[rgba(10,15,25,0.55)] p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">{b.label}</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#cbd5e1]">{b.body}</p>
              </div>
            </motion.div>
          ))}

          <Reveal delay={0.3} className="hidden">
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
              className="group relative overflow-hidden rounded-[20px] border border-[rgba(59,130,246,0.15)] bg-[rgba(10,20,35,0.45)] p-8 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-cyan-400/30 hover:shadow-[0_16px_45px_-30px_rgba(56,189,248,0.55)] md:p-12"
            >
              <span className="pointer-events-none absolute bottom-[-0.2em] left-5 select-none font-serif text-[11rem] leading-none text-cyan-300/[0.06]">“</span>
              <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-start">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300">
                  <Icon name={founder.icon} className="h-5 w-5" />
                </span>
                <div className="max-w-[75ch]">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{founder.label}</h3>
                  <p className="mt-5 text-[15px] leading-[1.8] text-[#cbd5e1]">{founder.body}</p>
                </div>
              </div>
              <span aria-hidden className="absolute bottom-7 right-10 flex items-center gap-3 opacity-50">
                <span className="h-px w-20 bg-cyan-300/45" />
                <span className="h-2 w-2 rounded-full border border-cyan-300/55" />
              </span>
            </motion.article>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 03 · PROGRAMS
// ──────────────────────────────────────────────────────────────────────────
function ProgramsSection() {
  return (
    <section
      id="programs"
      aria-label="Our programs"
      className="section-y relative w-full"
    >
      <SectionScrim />
      <div className="relative mx-auto w-full max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Programs"
          title="Our Industry-Aligned Programs"
          subtitle="Learn. Build. Innovate. Get Hired."
          center
          containerClassName="mx-auto max-w-[1000px] text-center"
          titleClassName="lg:whitespace-nowrap"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          className="mt-10 grid grid-cols-1 gap-5 md:mt-12 lg:grid-cols-3"
        >
          {PROGRAMS.map((p) => (
            <motion.article
              key={p.title}
              variants={fadeUp}
              className="group flex h-full flex-col rounded-3xl border border-cyan-400/12 bg-[rgba(10,15,25,0.6)] p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_22px_55px_-26px_rgba(56,189,248,0.45)]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-[rgba(8,14,26,0.7)]"
                  style={{ borderColor: `${p.accent}44`, color: p.accent }}
                >
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-white">
                  {p.title}
                </h3>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {p.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: p.accent }}
                    />
                    <span className="text-[13.5px] leading-[1.55] text-[#cbd5e1]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#02041a] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: p.accent }}
              >
                Enroll Now
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </a>
            </motion.article>
          ))}
        </motion.div>

        {/* Hiring partners */}
        <Reveal className="mt-6 md:mt-8">
          <div className="rounded-3xl border border-cyan-400/12 bg-[rgba(10,15,25,0.5)] px-6 py-6">
            <p className="text-center text-lg font-bold leading-tight tracking-[-0.01em] text-cyan-100 md:text-xl">
              Companies hiring for VLSI and Embedded systems
            </p>
            <div className="partner-marquee mt-5 overflow-hidden">
              <div className="partner-marquee-track flex w-max items-center">
                {[0, 1].map((group) => (
                  <div
                    key={group}
                    aria-hidden={group === 1}
                    className="flex shrink-0 items-center gap-x-8 pr-8"
                  >
                    {HIRING_PARTNERS.map((name) => (
                      <span
                        key={`${group}-${name}`}
                        className="whitespace-nowrap text-sm font-semibold tracking-tight text-white/55 transition-colors duration-300 hover:text-cyan-100"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-[920px] text-center text-[11px] leading-5 text-red-400">
              Note: The companies listed are provided for reference only and represent organizations that hire VLSI and Embedded Systems professionals. Their inclusion does not imply any partnership, affiliation, or placement agreement with us.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 04 · INDIA SEMICONDUCTOR MISSION
// ──────────────────────────────────────────────────────────────────────────
function IsmSection() {
  return (
    <section
      id="ism"
      aria-label="India Semiconductor Mission"
      className="section-y relative w-full"
    >
      <SectionScrim />
      <div className="relative mx-auto w-full max-w-[1250px] px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left — overview + objectives */}
          <Reveal>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-300">
              India Semiconductor Mission
            </span>
            <h2
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
              className="mt-3 text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-white md:text-[2.5rem]"
            >
              Powering India&apos;s Chip Future
            </h2>

            <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.12em] text-cyan-300">
              Key Objectives
            </p>
            <ul className="mt-3 space-y-3">
              {ISM_OBJECTIVES.map((o) => (
                <li key={o} className="flex items-start gap-3">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <span className="text-[14px] leading-[1.6] text-[#cbd5e1]">{o}</span>
                </li>
              ))}
            </ul>

          </Reveal>

          {/* Right — ecosystem diagram */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-cyan-400/12 bg-[rgba(8,12,22,0.6)] p-6">
              <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-300">
                The Infinity Loop — Connecting Talent &amp; Ecosystem
              </p>
              <InfinityLoopArt />
              <div className="mt-4 flex items-center justify-center gap-6 text-[11px] font-medium">
                <span className="flex items-center gap-2 text-cyan-200">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" /> Vidyouth
                  Training &amp; Placement
                </span>
                <span className="flex items-center gap-2 text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> National
                  Ecosystem Flow
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Core Pillars of ISM */}
        <Reveal className="mt-6 md:mt-8">
          <h3
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
            className="text-center text-2xl font-semibold tracking-[-0.02em] text-white"
          >
            Core Pillars of ISM
          </h3>
        </Reveal>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ISM_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-3xl border border-cyan-400/15 bg-[rgba(7,13,24,0.62)] px-3 py-5 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.06] text-cyan-300">
                <Icon name={pillar.icon} className="h-6 w-6" />
              </span>
              <span className="text-[11px] font-semibold leading-snug text-white">
                {pillar.title}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-cyan-400/12 bg-[rgba(8,12,22,0.5)] px-5 py-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-cyan-300">
            ISM Milestones
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3">
            {ISM_MILESTONES.map((milestone, index) => (
              <div key={milestone.year} className="relative min-w-0">
                {index < ISM_MILESTONES.length - 1 && (
                  <span className="absolute left-8 right-[-12px] top-4 hidden h-px bg-cyan-400/25 lg:block" />
                )}
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/60 bg-[#071525] text-[10px] font-bold text-cyan-100">
                  {milestone.year.slice(2)}
                </div>
                <p className="mt-3 text-xs font-extrabold tracking-wide text-cyan-100">{milestone.year}</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-300">{milestone.text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-[1000px] text-center text-[11px] leading-5 text-red-300/90">
          NOTE: Vidyouth Intelligence is a private initiative that supports the vision of the India Semiconductor Mission (ISM). It is not affiliated with, endorsed by, or sponsored by the Government of India.
        </p>
      </div>
    </section>
  );
}

type LoopNode = { n: number; a: number; t: string };

const LOOP_LEFT: LoopNode[] = [
  { n: 1, a: 180, t: "Student/User" },
  { n: 2, a: 135, t: "Explore Programs" },
  { n: 3, a: 90, t: "Select Program" },
  { n: 4, a: 45, t: "Training" },
  { n: 5, a: 0, t: "Projects & Labs" },
  { n: 6, a: -45, t: "Mentorship" },
  { n: 7, a: -90, t: "Placement" },
  { n: 8, a: -135, t: "Career Support" },
];
const LOOP_RIGHT: LoopNode[] = [
  { n: 1, a: 0, t: "ISM Leadership" },
  { n: 2, a: 52, t: "Government Mission" },
  { n: 3, a: 103, t: "Investment" },
  { n: 4, a: 155, t: "New Jobs" },
  { n: 5, a: -155, t: "Talent Demand" },
  { n: 6, a: -103, t: "Skilled Engineers" },
  { n: 7, a: -52, t: "Industry Growth" },
];

function InfinityLoopArt() {
  const R = 145;
  const NR = 17;
  const CL = { x: 178, y: 275 };
  const CR = { x: 462, y: 275 };
  const HUB = { x: 320, y: 275 };
  const toRad = (d: number) => (d * Math.PI) / 180;
  const pos = (c: { x: number; y: number }, r: number, a: number) => ({
    x: c.x + r * Math.cos(toRad(a)),
    y: c.y - r * Math.sin(toRad(a)),
  });
  const splitLabel = (s: string) => {
    const t = s.split(" ");
    if (t.length <= 2) return t;
    return [t.slice(0, -1).join(" "), t[t.length - 1]];
  };

  // A numbered stage node with its label pushed clear of the hub / loop line.
  const StageNode = ({
    c,
    d,
    ring,
    num,
    label,
    side,
  }: {
    c: { x: number; y: number };
    d: LoopNode;
    ring: string;
    num: string;
    label: string;
    side: "L" | "R";
  }) => {
    const { x, y } = pos(c, R, d.a);
    const cos = Math.cos(toRad(d.a));
    const sin = Math.sin(toRad(d.a));
    const inner = side === "L" ? cos > 0.5 : cos < -0.5;
    let anchor: "start" | "middle" | "end";
    let bx: number;
    let by: number;
    if (inner) {
      // inner nodes face the hub — stack their labels vertically clear of it
      anchor = "middle";
      bx = x;
      by = sin > 0 ? y - 24 : y + 26;
    } else {
      anchor = cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";
      bx = x + (cos > 0.25 ? 20 : cos < -0.25 ? -20 : 0);
      by = y + (sin > 0.4 ? -24 : sin < -0.4 ? 26 : 4);
    }
    const lines = splitLabel(d.t);
    const y0 = lines.length === 2 ? by - 4 : by;
    return (
      <g>
        <circle cx={x} cy={y} r={NR} fill="rgba(8,14,26,0.98)" stroke={ring} strokeWidth={1.4} />
        <text x={x} y={y + 3.4} textAnchor="middle" fill={num} fontSize={9.5} fontWeight={700}>
          {d.n}
        </text>
        <text textAnchor={anchor} fill={label} fontSize={8.4} fontWeight={600}>
          {lines.map((ln, i) => (
            <tspan key={i} x={bx} y={y0 + i * 9}>
              {ln}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  // Small directional chevron sitting on the loop line to show flow.
  const chevron = (
    c: { x: number; y: number },
    a: number,
    color: string,
    cw: boolean,
    key: string
  ) => {
    const { x, y } = pos(c, R, a);
    let fx = Math.sin(toRad(a));
    let fy = Math.cos(toRad(a));
    if (!cw) {
      fx = -fx;
      fy = -fy;
    }
    const sx = -fy;
    const sy = fx;
    const tx = x + fx * 4;
    const ty = y + fy * 4;
    return (
      <path
        key={key}
        d={`M${tx - fx * 6 + sx * 4.5} ${ty - fy * 6 + sy * 4.5} L${tx} ${ty} L${
          tx - fx * 6 - sx * 4.5
        } ${ty - fy * 6 - sy * 4.5}`}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    );
  };

  return (
    <div className="relative mx-auto mt-5 w-[92%] overflow-hidden">
      <svg
        viewBox="-30 0 700 500"
        className="h-auto w-full"
        fill="none"
        role="img"
        aria-label="Infinity loop connecting Vidyouth talent training and the national semiconductor ecosystem through the alumni network"
      >
        <defs>
          <radialGradient id="loop-glow-l" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(56,189,248,0.10)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0)" />
          </radialGradient>
          <radialGradient id="loop-glow-r" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(52,211,153,0.10)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0)" />
          </radialGradient>
          <radialGradient id="loop-hub" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#0b2436" />
            <stop offset="100%" stopColor="#06101d" />
          </radialGradient>
        </defs>

        <text x={320} y={18} textAnchor="middle" fill="#dbeafe" fontSize={20} fontWeight={800} letterSpacing={1.8}>
          THE INFINITY FLYWHEEL
        </text>
        <text x={320} y={34} textAnchor="middle" fill="#94a3b8" fontSize={7.5} fontWeight={600}>
          Empowering Talent. Strengthening Industry. Building Bharat&apos;s Semiconductor Future.
        </text>
        <rect x={4} y={48} width={310} height={24} rx={12} fill="#124b9b" />
        <rect x={346} y={48} width={316} height={24} rx={12} fill="#147a48" />
        <text x={159} y={64} textAnchor="middle" fill="white" fontSize={8.4} fontWeight={800} letterSpacing={0.18}>
          VIDYOUTH TRAINING &amp; PLACEMENT MODEL FLYWHEEL
        </text>
        <text x={504} y={64} textAnchor="middle" fill="white" fontSize={8.1} fontWeight={800} letterSpacing={0.12}>
          NATIONAL SEMICONDUCTOR ECOSYSTEM FLOW FLYWHEEL
        </text>
        <text x={178} y={87} textAnchor="middle" fill="#93c5fd" fontSize={8} fontWeight={600}>
          From Learning to Earning — Building Industry-Ready Engineers
        </text>
        <text x={462} y={87} textAnchor="middle" fill="#86efac" fontSize={8} fontWeight={600}>
          From Leadership to Growth — Powering India&apos;s Semiconductor Future
        </text>

        <circle cx={CL.x} cy={CL.y} r={R + 14} fill="url(#loop-glow-l)" />
        <circle cx={CR.x} cy={CR.y} r={R + 14} fill="url(#loop-glow-r)" />

        <circle cx={CL.x} cy={CL.y} r={R} fill="none" stroke="#2563eb" strokeOpacity={0.72} strokeWidth={3} />
        <circle cx={CR.x} cy={CR.y} r={R} fill="none" stroke="#16a34a" strokeOpacity={0.72} strokeWidth={3} />

        {[154, 51, -102].map((a) => chevron(CL, a, "#7dd3fc", true, `lc${a}`))}
        {[26, 129, -78].map((a) => chevron(CR, a, "#6ee7b7", false, `rc${a}`))}

        {LOOP_LEFT.map((d) => (
          <StageNode key={`l${d.n}`} c={CL} d={d} ring="#38bdf8" num="#bae6fd" label="#dbeafe" side="L" />
        ))}
        {LOOP_RIGHT.map((d) => (
          <StageNode key={`r${d.n}`} c={CR} d={d} ring="#34d399" num="#bbf7d0" label="#d1fae5" side="R" />
        ))}

        <text x={CL.x} y={CL.y - 8} textAnchor="middle" fill="#2563eb" fontSize={15} fontWeight={900}>
          ✓
        </text>
        <text x={CL.x} y={CL.y + 20} textAnchor="middle" fill="#dbeafe" fontSize={15} fontWeight={800} letterSpacing={1.2}>
          VIDYOUTH
        </text>
        <text x={CL.x} y={CL.y + 34} textAnchor="middle" fill="#bfdbfe" fontSize={7} fontWeight={700} letterSpacing={1.5}>
          INTELLIGENCE
        </text>
        <text x={CR.x} y={CR.y - 6} textAnchor="middle" fill="#86efac" fontSize={22} fontWeight={900}>
          ▦
        </text>
        <text x={CR.x} y={CR.y + 20} textAnchor="middle" fill="#dcfce7" fontSize={8} fontWeight={800}>
          POWERING BHARAT&apos;S
        </text>
        <text x={CR.x} y={CR.y + 32} textAnchor="middle" fill="#bbf7d0" fontSize={8} fontWeight={800}>
          SEMICONDUCTOR FUTURE
        </text>

        <circle cx={HUB.x} cy={HUB.y} r={30} fill="url(#loop-hub)" stroke="#a5f3fc" strokeWidth={1.6} />
        <circle cx={HUB.x} cy={HUB.y} r={34} fill="none" stroke="#a5f3fc" strokeOpacity={0.25} strokeWidth={1} />
        <text x={HUB.x} y={HUB.y - 2} textAnchor="middle" fill="#e0f2fe" fontSize={9} fontWeight={700}>
          ALUMNI
        </text>
        <text x={HUB.x} y={HUB.y + 9} textAnchor="middle" fill="#e0f2fe" fontSize={9} fontWeight={700}>
          NETWORK
        </text>
        <rect x={235} y={452} width={170} height={28} rx={7} fill="rgba(8,14,26,0.9)" stroke="#64748b" strokeOpacity={0.55} />
        <text x={320} y={464} textAnchor="middle" fill="#93c5fd" fontSize={8.5} fontWeight={800}>
          Stronger Alumni Network
        </text>
        <text x={320} y={475} textAnchor="middle" fill="#86efac" fontSize={8.5} fontWeight={800}>
          Stronger Ecosystem
        </text>
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 05 · TRUST & CREDIBILITY — VIDYOUTH × KTSemicon
// ──────────────────────────────────────────────────────────────────────────
function TrustSection() {
  return (
    <section
      id="trust"
      aria-label="Trust and credibility"
      className="section-y relative w-full"
    >
      <SectionScrim />
      <div className="relative mx-auto w-full max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Trust & Credibility"
          title="Vidyouth × KTSemicon"
          subtitle="Empowering Semiconductor Careers Together"
          center
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* About KTSemicon */}
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-cyan-400/12 bg-[rgba(10,15,25,0.6)] p-6">
              <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">
                About KTSemicon
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[#cbd5e1]">
                KTSemicon is a leading semiconductor design services company
                delivering world-class solutions in VLSI, Physical Design,
                Verification, and ASIC flows for global clients.
              </p>
              <div className="mt-5 inline-flex w-fit flex-col rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-3">
                <span className="text-base font-bold tracking-tight text-cyan-200">
                  KTSemicon
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-300/80">
                  Design · Develop · Deliver
                </span>
              </div>
            </div>
          </Reveal>

          {/* Our Collaboration */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-3xl border border-cyan-400/12 bg-[rgba(10,15,25,0.6)] p-6">
              <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">
                Our Collaboration
              </h3>
              <ul className="mt-4 space-y-3">
                {COLLABORATION.map((c) => (
                  <li key={c} className="flex items-start gap-2.5">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <span className="text-[14px] leading-[1.6] text-[#cbd5e1]">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-6">
          <p className="mx-auto max-w-[980px] text-center text-[14px] leading-[1.7] text-[#cbd5e1]">
            Our training programs are delivered in collaboration with our partners,
            leveraging industry-standard infrastructure, expert trainers, and advanced
            technology platforms to provide a high-quality learning experience.
          </p>
        </Reveal>

        {/* Stats */}
        <Reveal className="mt-6">
          <p className="font-heading text-center text-lg font-semibold tracking-[-0.01em] text-white">
            Why Students Trust Us
          </p>
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {TRUST_STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="flex flex-col items-center rounded-2xl border border-cyan-400/12 bg-[rgba(10,15,25,0.55)] p-5 text-center"
            >
              <Icon name={s.icon} className="h-6 w-6 text-cyan-300" />
              <span className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white">
                {s.value}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[#94a3b8]">
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 06 · CONTACT
// ──────────────────────────────────────────────────────────────────────────
// Public serverless endpoint (API Gateway → Lambda → Resend) that emails the
// enquiry to info@vidyouthintelligence.com. Independent of the app servers.
const CONTACT_ENDPOINT = "https://bz8j5drco0.execute-api.ap-south-1.amazonaws.com";

function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      program: String(fd.get("program") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setNote("Please fill in your name, email and message.");
      return;
    }
    setStatus("sending");
    setNote("");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setNote("Thanks! Your message has reached us — we'll get back to you shortly.");
      form.reset();
    } catch {
      setStatus("error");
      setNote("Something went wrong. Please email info@vidyouthintelligence.com directly.");
    }
  };

  return (
    <section
      id="contact"
      aria-label="Contact us"
      className="section-y relative w-full"
    >
      <SectionScrim />
      <div className="relative mx-auto w-full max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
          {/* Left — info */}
          <Reveal className="lg:col-span-5">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-300">
              Contact Us
            </span>
            <h2
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
              className="mt-3 text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-white md:text-[2.5rem]"
            >
              Get In Touch
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[#cbd5e1]">
              We&apos;re here to help you start your journey in the semiconductor
              industry.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {CONTACT_INFO.map((c) => {
                const inner = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300">
                      <Icon name={c.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-[#94a3b8]">
                        {c.label}
                      </span>
                      <span className="block truncate text-sm text-white">
                        {c.value}
                      </span>
                    </span>
                  </>
                );
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors duration-300 hover:border-cyan-400/15 hover:bg-cyan-400/[0.04]"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={c.label} className="flex items-center gap-3 p-2">
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-[rgba(56,189,248,0.05)] p-5">
              <p className="text-sm font-semibold text-white">
                We&apos;d Love to Hear From You!
              </p>
              <p className="mt-2 text-[13px] leading-[1.65] text-[#cbd5e1]">
                Have questions about our programs, admissions, or partnerships?
                Drop us a message and our team will get back to you.
              </p>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-cyan-400/12 bg-[rgba(10,15,25,0.6)] p-6 md:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id="name" label="Full Name" type="text" placeholder="Enter your name" required />
                <Field id="email" label="Email Address" type="email" placeholder="Enter your email" required />
                <Field id="phone" label="Phone Number" type="tel" placeholder="Enter your phone number" />
                <SelectField id="program" label="Interested Program" options={PROGRAM_OPTIONS} />
              </div>
              <div className="mt-4">
                <Field id="message" label="Your Message" textarea placeholder="Type your message..." required />
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#02041a] shadow-[0_10px_30px_-12px_rgba(56,189,248,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {status === "sending" ? "Sending…" : "Enquire Now"}
                  {status !== "sending" && <Icon name="arrow" className="h-3.5 w-3.5" />}
                </button>
                {note && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`text-[13px] leading-snug ${status === "sent" ? "text-emerald-300" : status === "error" ? "text-rose-300" : "text-[#94a3b8]"}`}
                  >
                    {note}
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  textarea = false,
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  required?: boolean;
}) {
  const base =
    "w-full rounded-xl border border-cyan-400/15 bg-[rgba(6,10,20,0.6)] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-[border-color,box-shadow] duration-300 focus:border-cyan-400/60 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)]";
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#94a3b8]">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={id} required={required} rows={4} placeholder={placeholder} className={`${base} resize-none`} />
      ) : (
        <input id={id} name={id} required={required} type={type} placeholder={placeholder} className={base} />
      )}
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
}: {
  id: string;
  label: string;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#94a3b8]">
        {label}
      </label>
      <select
        id={id}
        name={id}
        defaultValue=""
        className="w-full appearance-none rounded-xl border border-cyan-400/15 bg-[rgba(6,10,20,0.6)] px-4 py-3 text-sm text-white outline-none transition-[border-color,box-shadow] duration-300 focus:border-cyan-400/60 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)]"
      >
        <option value="" disabled className="bg-[#06111e]">
          Select a program
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#06111e]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 07 · FAQ
// ──────────────────────────────────────────────────────────────────────────
function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="section-y relative w-full"
    >
      <SectionScrim />
      <div className="relative mx-auto w-full max-w-[820px] px-6">
        <SectionHeader
          eyebrow="FAQ"
          title="FAQs"
          subtitle="Find quick answers to the most common queries."
          center
        />

        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-2xl border border-cyan-400/12 bg-[rgba(10,15,25,0.6)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[15px] font-medium text-white">{f.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-400/25 text-cyan-300 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Icon name="plus" className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
                    >
                      <p className="px-5 pb-5 text-[14px] leading-[1.7] text-[#cbd5e1]">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Reveal className="mt-8 flex justify-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/[0.06] px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-cyan-100 transition-colors duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/[0.12]"
          >
            View All FAQs
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// FOOTER
// ──────────────────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="relative w-full border-t border-cyan-400/12 bg-[rgba(3,6,14,0.85)]">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-6">
        <div className="flex flex-col items-center gap-4">
          {/* Brand + social */}
          <div className="flex flex-col items-center gap-3">
            <a href="#home" className="flex w-full justify-center">
              <Image
                src="/vidyouth-wordmark.png"
                alt="Vidyouth Intelligence Institute Pvt. Ltd."
                width={1000}
                height={330}
                priority
                className="h-auto w-[min(100%,400px)] rounded-lg bg-white"
              />
            </a>
            <div className="flex items-center gap-3">
              <div className="flex gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/15 bg-[rgba(10,15,25,0.6)] text-cyan-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:text-white"
                  >
                    <Icon name={s.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Government recognition */}
          <div className="flex w-full flex-wrap items-center justify-center gap-3 border-t border-white/5 pt-4 pb-0">
            {RECOGNITION.map((r) => (
              <div
                key={r.label}
                className="flex min-h-[96px] w-[230px] shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(10,15,25,0.5)] px-3 py-3"
              >
                {r.image ? (
                  <Image
                    src={r.image}
                    alt={`${r.label} logo`}
                    width={220}
                    height={90}
                    className="h-12 w-24 shrink-0 rounded-md bg-white object-contain p-2"
                  />
                ) : r.flag ? (
                  <span className="flex h-7 w-10 flex-col overflow-hidden rounded-sm border border-white/15">
                    <span className="flex-1 bg-[#ff9933]" />
                    <span className="flex-1 bg-white" />
                    <span className="flex-1 bg-[#138808]" />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-400/20 bg-cyan-400/[0.06] text-[10px] font-bold text-cyan-200">
                    {r.label.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="flex flex-col leading-tight">
                  {r.tag && (
                    <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#94a3b8]">
                      {r.tag}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-white">{r.label}</span>
                  {r.sub && (
                    <span className="text-[9px] text-[#94a3b8]">{r.sub}</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Legal */}
          <div className="flex w-full flex-col items-center gap-2 border-t border-white/5 pt-4 text-center sm:flex-row sm:justify-between">
            <p className="text-[11px] text-[#94a3b8]">
              © 2026 Vidyouth Intelligence. All rights reserved.
            </p>
            <div className="flex gap-5 text-[11px] text-[#94a3b8]">
              <a href="#" className="transition-colors duration-300 hover:text-cyan-200">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors duration-300 hover:text-cyan-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ICONS — single source, keyed by name (stroke SVGs unless noted)
// ──────────────────────────────────────────────────────────────────────────
function Icon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const p = {
    className,
    style,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const fillP = {
    className,
    style,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  };
  switch (name) {
    // hero features
    case "curriculum":
      return (
        <svg {...p}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z" /><path d="M8 7h7M8 11h7" /></svg>
      );
    case "labs":
      return (
        <svg {...p}><path d="M9 3v6l-5 8a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-8V3" /><path d="M8 3h8M8 13h8" /></svg>
      );
    case "mentorship":
      return (
        <svg {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 5.5a3 3 0 0 1 0 5.5M21 20c0-2.5-1.4-4.2-3.5-4.8" /></svg>
      );
    case "placement":
      return (
        <svg {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M9 13l2 2 4-4" /></svg>
      );
    // mission/vision/founder
    case "mission":
      return (
        <svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /></svg>
      );
    case "vision":
      return (
        <svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
      );
    case "founder":
      return (
        <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></svg>
      );
    case "quote":
      return (
        <svg {...fillP}><path d="M7 7H4.5A1.5 1.5 0 0 0 3 8.5V13a2 2 0 0 0 2 2h1.5A1.5 1.5 0 0 0 8 13.5V8a1 1 0 0 0-1-1zm11 0h-2.5A1.5 1.5 0 0 0 14 8.5V13a2 2 0 0 0 2 2h1.5a1.5 1.5 0 0 0 1.5-1.5V8a1 1 0 0 0-1-1z" /></svg>
      );
    // programs
    case "vlsi":
      return (
        <svg {...p}><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" /></svg>
      );
    case "embedded":
      return (
        <svg {...p}><rect x="5" y="6" width="14" height="12" rx="1.5" /><rect x="9" y="10" width="6" height="4" rx="0.5" /><path d="M8 6V3M12 6V3M16 6V3M8 18v3M12 18v3M16 18v3" /></svg>
      );
    case "physical":
      return (
        <svg {...p}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>
      );
    // ism 2.0
    case "ecosystem":
      return (
        <svg {...p}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="4" r="1.6" /><circle cx="5" cy="18" r="1.6" /><circle cx="19" cy="18" r="1.6" /><path d="M12 9V6M10 14l-3.5 2.5M14 14l3.5 2.5" /></svg>
      );
    case "equipment":
      return (
        <svg {...p}><path d="M14 6l4 4-8 8-4 1 1-4 8-8z" /><path d="M4 20h6" /></svg>
      );
    case "rnd":
      return (
        <svg {...p}><path d="M9 3v6l-4 7a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-4-7V3" /><path d="M9 3h6" /><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" /></svg>
      );
    case "pipeline":
      return (
        <svg {...p}><path d="M12 3 2 8l10 5 10-5-10-5z" /><path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" /></svg>
      );
    case "exports":
      return (
        <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z" /></svg>
      );
    // trust stats
    case "users":
      return (
        <svg {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 5.5a3 3 0 0 1 0 5.5M21 20c0-2.5-1.4-4.2-3.5-4.8" /></svg>
      );
    case "handshake":
      return (
        <svg {...p}><path d="M8 12l3 3 3-3" /><path d="M3 8l5-3 4 3 4-3 5 3-5 8-4-3-4 3-5-8z" /></svg>
      );
    case "chart":
      return (
        <svg {...p}><path d="M3 20h18" /><path d="M6 20V10M11 20V5M16 20v-8M21 20v-4" /></svg>
      );
    case "mentor":
      return (
        <svg {...p}><circle cx="12" cy="7" r="3.5" /><path d="M5 21c0-4 3-6 7-6s7 2 7 6" /><path d="M12 2.5l1 1.6 1.8.3-1.3 1.3.3 1.8-1.8-.9-1.8.9.3-1.8L8.2 4.4l1.8-.3 1-1.6z" /></svg>
      );
    // contact
    case "phone":
      return (
        <svg {...p}><path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L18 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 0-2z" /></svg>
      );
    case "mail":
      return (
        <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></svg>
      );
    case "globe":
      return (
        <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z" /></svg>
      );
    case "pin":
      return (
        <svg {...p}><path d="M12 21s-7-5.7-7-11a7 7 0 0 1 14 0c0 5.3-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
      );
    // ui
    case "arrow":
      return (
        <svg {...p}><path d="M4 12h15" /><path d="M13 6l6 6-6 6" /></svg>
      );
    case "check":
      return (
        <svg {...p}><path d="M4 12l5 5L20 6" /></svg>
      );
    case "plus":
      return (
        <svg {...p}><path d="M12 5v14M5 12h14" /></svg>
      );
    // socials (filled)
    case "linkedin":
      return (
        <svg {...fillP}><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
      );
    case "instagram":
      return (
        <svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
      );
    case "youtube":
      return (
        <svg {...fillP}><path d="M23 12s0-3.6-.46-5.3a2.6 2.6 0 0 0-1.83-1.85C18.9 4.4 12 4.4 12 4.4s-6.9 0-8.71.45A2.6 2.6 0 0 0 1.46 6.7C1 8.4 1 12 1 12s0 3.6.46 5.3a2.6 2.6 0 0 0 1.83 1.85C5.1 19.6 12 19.6 12 19.6s6.9 0 8.71-.45a2.6 2.6 0 0 0 1.83-1.85C23 15.6 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z" /></svg>
      );
    case "twitter":
      return (
        <svg {...fillP}><path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.5 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20z" /></svg>
      );
    case "facebook":
      return (
        <svg {...fillP}><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" /></svg>
      );
    default:
      return null;
  }
}
