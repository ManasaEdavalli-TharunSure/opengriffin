"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { gateways, type Gateway } from "@/lib/data";
import { Reveal, RevealItem } from "@/components/motion/scroll-reveal";

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span
      aria-label={`Difficulty: ${level} of 3`}
      className="inline-flex gap-0.5"
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor:
              i <= level
                ? "var(--color-brand-soft)"
                : "var(--color-border-soft)",
          }}
        />
      ))}
    </span>
  );
}

function GatewayCard({ g, index }: { g: Gateway; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={g.docHref}
      target="_blank"
      rel="noreferrer"
      className="og-card rounded-xl p-5 group relative overflow-hidden flex flex-col"
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: reduce ? 0 : (index % 4) * 0.04,
          },
        },
      }}
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{
          background:
            "linear-gradient(90deg, var(--color-brand) 0%, transparent 100%)",
        }}
      />

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--color-text)] group-hover:text-white transition-colors">
          {g.name}
        </h3>
        <DifficultyDots level={g.difficulty} />
      </div>

      <p className="text-sm text-[var(--color-text-dim)] mt-2 leading-relaxed">
        {g.blurb}
      </p>

      <ol className="mt-4 space-y-1.5 text-xs text-[var(--color-text-dim)] list-decimal list-inside">
        {g.steps.map((s) => (
          <li key={s} className="leading-snug">
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-4 pt-3 border-t border-[var(--color-border-soft)]">
        <div className="mono text-[10px] text-[var(--color-brand-soft)] truncate">
          {g.envHint}
        </div>
      </div>

      <span className="absolute top-4 right-4 text-[var(--color-text-dim)] group-hover:text-[var(--color-brand-soft)] transition-colors opacity-0 group-hover:opacity-100">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </motion.a>
  );
}

export function Gateways() {
  return (
    <section id="gateways" className="px-6 py-24 sm:py-32">
      <Reveal className="max-w-6xl mx-auto">
        <RevealItem
          as="p"
          className="text-[var(--color-brand-soft)] text-sm tracking-wide uppercase font-semibold"
        >
          One brain · seven messengers
        </RevealItem>
        <RevealItem
          as="h2"
          className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight"
        >
          Pick your messenger.
        </RevealItem>
        <RevealItem
          as="p"
          className="mt-4 text-[var(--color-text-dim)] max-w-2xl"
        >
          Run on Telegram, Discord, Slack, Email, iMessage, Matrix, or Signal —
          or all of them at once. Shared memory, kanban, skills. Detailed
          per-gateway setup lives in the docs.
        </RevealItem>

        <motion.div
          className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {gateways.map((g, i) => (
            <GatewayCard key={g.name} g={g} index={i} />
          ))}
        </motion.div>

        <RevealItem className="mt-8">
          <p className="text-xs text-[var(--color-text-dim)]">
            ⚠️ Leaving any{" "}
            <span className="mono text-[var(--color-brand-soft)]">
              *_ALLOWED_USERS
            </span>{" "}
            env var empty opens the bot to anyone. Set it to your own id while
            testing.
          </p>
        </RevealItem>
      </Reveal>
    </section>
  );
}
