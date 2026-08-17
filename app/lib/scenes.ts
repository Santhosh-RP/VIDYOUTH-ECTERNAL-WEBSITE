// Single source of truth for scene metadata used by the indicator,
// the page composition, and any internal navigation.

export type SceneMeta = {
  id: string;
  index: number;
  label: string;
  caption: string;
  /** Outer container height — drives the "pin duration" of the sticky scene. */
  height: string;
};

export const SCENES: SceneMeta[] = [
  {
    id: "hero",
    index: 0,
    label: "Arrival",
    caption: "Introducing Vidyouth",
    height: "240vh",
  },
  {
    id: "circuit",
    index: 1,
    label: "Circuit",
    caption: "Designed frame by frame",
    height: "360vh",
  },
  {
    id: "intelligence",
    index: 2,
    label: "Intelligence",
    caption: "A continuous neural fabric",
    height: "260vh",
  },
  {
    id: "platform",
    index: 3,
    label: "Platform",
    caption: "Quietly engineered",
    height: "240vh",
  },
  {
    id: "research",
    index: 4,
    label: "Research",
    caption: "Light, motion, structure",
    height: "240vh",
  },
  {
    id: "access",
    index: 5,
    label: "Access",
    caption: "Enter the platform",
    height: "180vh",
  },
];
