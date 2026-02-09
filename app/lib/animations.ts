import { type Variants, type Transition } from "framer-motion";

// ---------------------------------------------------------------------------
// Duration constants (seconds)
// ---------------------------------------------------------------------------
export const DURATION = {
  fast: 0.2, // 200ms - switches, quick state changes
  normal: 0.3, // 300ms - general animations
  slow: 0.5, // 500ms - complex transitions
} as const;

// ---------------------------------------------------------------------------
// Easing presets
// ---------------------------------------------------------------------------
export const EASING = {
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  snappy: [0.2, 0, 0, 1] as [number, number, number, number],
  decelerate: [0, 0, 0.2, 1] as [number, number, number, number],
} as const;

// ---------------------------------------------------------------------------
// Spring configurations (reused from Bottom Sheet)
// ---------------------------------------------------------------------------
export const SPRING = {
  default: {
    type: "spring" as const,
    damping: 30,
    stiffness: 300,
    mass: 0.8,
  },
  snappy: {
    type: "spring" as const,
    damping: 40,
    stiffness: 400,
    mass: 0.5,
  },
} as const;

// ---------------------------------------------------------------------------
// Transition presets
// ---------------------------------------------------------------------------
export const TRANSITION: Record<string, Transition> = {
  fast: { duration: DURATION.fast, ease: EASING.smooth },
  normal: { duration: DURATION.normal, ease: EASING.smooth },
  slow: { duration: DURATION.slow, ease: EASING.smooth },
  snappy: { duration: DURATION.fast, ease: EASING.snappy },
} as const;

// ---------------------------------------------------------------------------
// GPU-accelerated style (apply to animated elements for performance)
// ---------------------------------------------------------------------------
export const GPU_ACCELERATED_STYLE: React.CSSProperties = {
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

// ---------------------------------------------------------------------------
// Popup variants (fade + scale)
// ---------------------------------------------------------------------------
export const POPUP_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: DURATION.fast,
      ease: EASING.smooth,
    },
  },
};

// ---------------------------------------------------------------------------
// Backdrop variants (fade only)
// ---------------------------------------------------------------------------
export const BACKDROP_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASING.smooth },
  },
};

// ---------------------------------------------------------------------------
// Fade variants (opacity only)
// ---------------------------------------------------------------------------
export const FADE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASING.smooth },
  },
};

// ---------------------------------------------------------------------------
// Slide variants
// ---------------------------------------------------------------------------
export const SLIDE_VARIANTS = {
  fromBottom: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.normal, ease: EASING.smooth },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: DURATION.fast, ease: EASING.smooth },
    },
  },
  fromTop: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.normal, ease: EASING.smooth },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: DURATION.fast, ease: EASING.smooth },
    },
  },
  fromRight: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: DURATION.normal, ease: EASING.smooth },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: DURATION.fast, ease: EASING.smooth },
    },
  },
} as const satisfies Record<string, Variants>;

// ---------------------------------------------------------------------------
// Button interaction constants
// ---------------------------------------------------------------------------
export const BUTTON_INTERACTION = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
  },
} as const;

// ---------------------------------------------------------------------------
// Stagger animation (for lists)
// ---------------------------------------------------------------------------
export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.smooth,
    },
  },
};

// ---------------------------------------------------------------------------
// Tab indicator (navigation)
// ---------------------------------------------------------------------------
export const TAB_COLORS = {
  active: "#A3FF0C",
  inactive: "#9F9FA2",
  activeBorder: "#A3FF0C",
  inactiveBorder: "#323234",
} as const;

// ---------------------------------------------------------------------------
// Accessibility: reduced motion
// ---------------------------------------------------------------------------
export const REDUCED_MOTION_TRANSITION: Transition = {
  duration: 0,
};

/**
 * Returns an instant transition when the user prefers reduced motion,
 * otherwise returns the provided transition.
 */
export function getReducedMotionTransition(
  fallback: Transition = TRANSITION.normal
): Transition {
  if (typeof window === "undefined") return fallback;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  return prefersReduced ? REDUCED_MOTION_TRANSITION : fallback;
}
