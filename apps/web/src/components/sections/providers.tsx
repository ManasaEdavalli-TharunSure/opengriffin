"use client";

import * as React from "react";
import { providers } from "@/lib/data";
import { Reveal, RevealItem } from "@/components/motion/scroll-reveal";
import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";

/**
 * A single provider chip with a magnetic hover — the chip eases toward the
 * cursor (capped to a few pixels) while the mouse is inside it. Returns to
 * rest on mouseleave. Springs are stiff so it feels responsive, not bouncy.
 */
function ProviderChip({
  name,
  index,
  disabled,
}: {
  name: string;
  index: number;
  disabled: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 22, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    // Clamp pull to ±6px so the chip stays inside its grid cell.
    x.set(Math.max(-6, Math.min(6, dx * 0.25)));
    y.set(Math.max(-6, Math.min(6, dy * 0.25)));
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="og-card rounded-lg px-4 py-3 text-center text-sm text-[var(--color-text)] hover:text-white transition-colors cursor-default"
      style={{ x: sx, y: sy }}
      variants={{
        hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.4,
            delay: disabled ? 0 : (index % 12) * 0.02,
          },
        },
      }}
    >
      {name}
    </motion.div>
  );
}

export function Providers() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 py-24 sm:py-32">
      <Reveal className="max-w-6xl mx-auto">
        <RevealItem as="h2" className="text-3xl sm:text-5xl font-bold tracking-tight">
          Bring any AI key.{" "}
          <span
            style={{
              background:
                "linear-gradient(120deg, var(--color-brand-soft), var(--color-alive-soft))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            21 providers supported.
          </span>
        </RevealItem>
        <RevealItem as="p" className="mt-4 text-[var(--color-text-dim)] max-w-2xl">
          No central account, no shared pool. Your keys, your bills, your data.
        </RevealItem>

        <motion.div
          className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
        >
          {providers.map((p, i) => (
            <ProviderChip key={p} name={p} index={i} disabled={!!reduce} />
          ))}
        </motion.div>
      </Reveal>
    </section>
  );
}
