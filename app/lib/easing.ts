// Curated cinematic easings reused across all scenes.
// Numeric tuples are direct cubic-bezier inputs for framer-motion.
// String names map to gsap's built-in eases for ScrollTrigger timelines.

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT_QUART = [0.83, 0, 0.17, 1] as const;
export const EASE_FILM = [0.6, 0.05, 0.1, 0.95] as const;

export const GSAP_EASE_CINEMATIC = "power3.out";
export const GSAP_EASE_SCRUB = "none";
export const GSAP_EASE_DRIFT = "sine.inOut";
