/**
 * Motion Tokens for Framer Motion
 * 
 * Karakter animasi yang konsisten untuk memperkuat branding 'Premium & Airy'.
 */

import { Transition, Variants } from "framer-motion";

/**
 * 1. springSnappy
 * Karakter: Cepat, presisi, minim getaran (over-damped).
 * Penggunaan: Hover effects, micro-interactions, kursor.
 */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  restDelta: 0.001
};

/**
 * 2. springBouncy
 * Karakter: Playful, elastis, berenergi (under-damped).
 * Penggunaan: Modal, Popups, Bento card entry, Notification.
 */
export const springBouncy: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 12,
  mass: 1,
  restDelta: 0.001
};

/**
 * 3. fadeReveal
 * Karakter: Elegan, sinematik, halus.
 * Penggunaan: Scroll-triggered content, Section entrance.
 */
export const fadeReveal: Variants = {
  hidden: { opacity: 0, y: 20, willChange: "transform, opacity" },
  visible: (custom: { i?: number; isLow?: boolean } = {}) => {
    const { i = 0, isLow = false } = custom;
    return {
      opacity: 1, 
      y: 0,
      transition: {
        delay: isLow ? i * 0.05 : i * 0.1,
        duration: isLow ? 0.4 : 0.8,
        ease: [0.16, 1, 0.3, 1] // Quart-out
      },
      transitionEnd: {
        willChange: "auto"
      }
    };
  }
};

/**
 * 4. pageTransition
 * Karakter: Stabil, meluas secara perlahan.
 * Penggunaan: Route changes, Page transitions.
 */
export const pageTransition: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] // Quint-out
};

/**
 * 5. getAnimationVariants
 * Helper to get reduced motion variants based on performance tier.
 */
export const getAnimationVariants = (isLow: boolean) => ({
  hidden: { opacity: 0, y: isLow ? 0 : 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: isLow ? 0.2 : 0.8, 
      ease: isLow ? "linear" : [0.16, 1, 0.3, 1] 
    }
  }
});
