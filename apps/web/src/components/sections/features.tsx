"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { features } from "@/lib/data";
import { Reveal, RevealItem } from "@/components/motion/scroll-reveal";

const CATEGORY_COLORS: Record<string, string> = {
  Memory: "var(--color-brand-soft)",
  Compounding: "var(--color-brand-soft)",
  Skills: "var(--color-brand-soft)",
  Autonomous: "var(--color-alive-soft)",
  Triggers: "var(--color-alive-soft)",
  Security: "#f59e0b",
  "Multi-platform": "var(--color-brand-soft)",
  "Voice + Vision": "var(--color-alive-soft)",
  Ops: "var(--color-text-dim)",
};

function FeatureCard({
  category,
  title,
  body,
  index,
}: {
  category: string;
  title: string;
  body: React.ReactNode;
  index: number;
}) {
  const reduce = useReducedMotion();
  const accentColor = CATEGORY_COLORS[category] ?? "var(--color-brand-soft)";
  return (
    <motion.div
      className="og-card rounded-xl p-5 relative overflow-hidden group cursor-default"
      whileHover={reduce ? undefined : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: reduce ? 0 : (index % 6) * 0.035,
          },
        },
      }}
    >
      {/* Gradient sweep — radial glow that appears in the top-left on hover */}
      <span
        aria-hidden
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${accentColor}22 0%, transparent 60%)`,
        }}
      />
      {/* Top accent bar — subtle stripe in the category color */}
      <span
        aria-hidden
        className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{
          background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
        }}
      />
      <div
        className="relative text-xs uppercase tracking-wider font-semibold"
        style={{ color: accentColor }}
      >
        {category}
      </div>
      <h3 className="relative mt-1 font-semibold text-[var(--color-text)] group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="relative text-sm text-[var(--color-text-dim)] mt-2 leading-relaxed group-hover:text-[var(--color-text)] transition-colors">
        {body}
      </p>
    </motion.div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="px-6 py-24 sm:py-32"
    >
      <Reveal className="max-w-6xl mx-auto">
        <RevealItem as="p" className="text-[var(--color-brand-soft)] text-sm tracking-wide uppercase font-semibold">
          30 features · 33 MCP servers · 11 nightly auto-jobs
        </RevealItem>
        <RevealItem as="h2" className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
          A complete personal-agent runtime.
        </RevealItem>
        <RevealItem as="p" className="mt-4 text-[var(--color-text-dim)] max-w-2xl">
          Every feature is local-first. None require an account or a subscription.
          Bring your own AI provider key for any of 21 supported backends.
        </RevealItem>

        <motion.div
          className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={{ visible: { transition: { staggerChildren: 0.025 } } }}
        >
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              category={f.category}
              title={f.title}
              body={f.body}
              index={i}
            />
          ))}
        </motion.div>
      </Reveal>
    </section>
  );
}
