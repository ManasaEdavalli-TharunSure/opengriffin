"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated gradient line that draws in when scrolled into view. Used between
 * major page sections in place of a static `border-t`. The line scales from
 * the center outward via `originX: 0.5`, mimicking a horizon line appearing.
 *
 * No props on purpose — every divider on the page should feel the same.
 */
export function SectionDivider() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="relative mx-auto h-px max-w-6xl overflow-visible"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-border-soft) 20%, var(--color-brand)/40 50%, var(--color-border-soft) 80%, transparent 100%)",
          transformOrigin: "center",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: reduce ? 0.01 : 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      {/* Small brand spark at the centre */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{
          backgroundColor: "var(--color-brand)",
          boxShadow: "0 0 12px var(--color-brand-glow)",
        }}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: reduce ? 0.01 : 0.5,
          delay: reduce ? 0 : 0.4,
          ease: "easeOut",
        }}
      />
    </div>
  );
}
