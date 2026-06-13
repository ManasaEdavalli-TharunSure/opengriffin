"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Glow } from "@/components/ui/glow";
import { Magnetic } from "@/components/motion/magnetic";
import { GitHubIcon } from "@/components/icons/github";

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/ManasaEdavalli-TharunSure/opengriffin/main/scripts/install.sh | bash";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Parallax: the hero glow drifts up at ~0.4x scroll speed so the section
  // feels alive without disorienting the reader. Tied to the hero section
  // viewport via useScroll(target).
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const glowYRaw = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const glowOpacityRaw = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  // Freeze parallax when prefers-reduced-motion is on.
  const glowY = shouldReduceMotion ? 0 : glowYRaw;
  const glowOpacity = shouldReduceMotion ? 1 : glowOpacityRaw;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const staggerDelay = shouldReduceMotion ? 0 : 0.08;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex items-center justify-center px-4 pt-20 pb-24 sm:pt-28 sm:pb-32"
    >
      {/* Dot grid background with radial mask — dev-tool texture. The mask
          tapers the dots toward the edges so they read as ambient depth
          rather than a "table". */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-dot) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, #000 50%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, #000 50%, transparent 100%)",
        }}
      />

      {/* Layer 1: large soft orange radial glow (parallax) */}
      <motion.div
        aria-hidden
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          y: glowY,
          opacity: glowOpacity,
          background:
            "radial-gradient(ellipse, var(--color-brand) 0%, transparent 60%)",
        }}
      />

      {/* Layer 2: slow-rotating conic gradient — agentic / energy. Disabled
          under prefers-reduced-motion. */}
      <motion.div
        aria-hidden
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full opacity-30 blur-2xl pointer-events-none mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 0deg, var(--color-brand) 0deg, var(--color-alive) 90deg, var(--color-brand-soft) 180deg, var(--color-alive-soft) 270deg, var(--color-brand) 360deg)",
        }}
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Layer 3: small amber accent glow bottom-right */}
      <motion.div
        aria-hidden
        className="absolute bottom-[10%] right-[12%] w-[360px] h-[360px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-alive) 0%, transparent 65%)",
        }}
        animate={
          shouldReduceMotion
            ? {}
            : { scale: [1, 1.15, 1], opacity: [0.2, 0.32, 0.2] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 21st.dev Glow — twin radial blooms themed to the OpenGriffin palette */}
      <Glow variant="top" className="opacity-70" />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Status pill — 21st.dev badge-with-action: pulsing amber dot +
            arrow that slides on hover, links through to the repo. */}
        <motion.div variants={item} className="flex justify-center mb-6">
          <Badge
            asChild
            variant="outline"
            className="group px-4 py-1.5 bg-[var(--color-bg-elev)]/70 backdrop-blur-md border-[var(--color-border-soft)] flex items-center gap-2 transition-colors hover:border-[var(--color-border-hover)]"
          >
            <a
              href="https://github.com/ManasaEdavalli-TharunSure/opengriffin"
              target="_blank"
              rel="noreferrer"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: "var(--color-alive)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: "var(--color-alive)" }}
                />
              </span>
              <Sparkles className="w-3 h-3" style={{ color: "var(--color-alive-soft)" }} />
              <span className="text-xs font-medium tracking-wide text-[var(--color-text)]">
                OSS · Apache 2.0 · self-evolving
              </span>
              <ArrowRight className="w-3 h-3 text-[var(--color-text-dim)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-soft)]" />
            </a>
          </Badge>
        </motion.div>

        {/* Headline — fluid clamp() type scales continuously across viewports */}
        <motion.h1
          variants={item}
          className="text-[clamp(2.75rem,7vw,5rem)] font-bold tracking-tight leading-[1.05] mb-6 text-balance"
        >
          <span className="block text-[var(--color-text)]">
            The personal AI agent
          </span>
          <span className="block mt-2 text-gradient-flow">
            that compounds while you sleep.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          variants={item}
          className="text-[clamp(1rem,1.4vw+0.6rem,1.2rem)] max-w-2xl mx-auto mb-10 leading-relaxed text-pretty"
          style={{ color: "var(--color-text-dim)" }}
        >
          Persistent memory across sessions. A daily journal at 4:30am. 21 AI
          providers, BYO key. Runs on your machine — no backend, no telemetry.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
        >
          <Magnetic>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Button
              size="lg"
              className="relative overflow-hidden text-base px-7 h-12 font-semibold shadow-[0_0_40px_-10px_var(--color-brand-glow)] hover:shadow-[0_0_60px_-8px_var(--color-brand-glow)] transition-shadow"
              style={{
                backgroundColor: "var(--color-brand)",
                color: "#0a0a0a",
              }}
              asChild
            >
              <a href="#install">
                {/* Background sheen sweeps across on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
                    transform: "translateX(-100%)",
                    animation: "og-sheen 1.6s ease-out infinite",
                  }}
                />
                <span className="relative">Install in one line</span>
              </a>
            </Button>
          </motion.div>
          </Magnetic>
          <Magnetic>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="text-base px-7 h-12 font-semibold bg-[var(--color-bg-elev)]/40 backdrop-blur-sm border-[var(--color-border-soft)] hover:border-[var(--color-border-hover)] text-[var(--color-text)]"
              asChild
            >
              <a
                href="https://github.com/ManasaEdavalli-TharunSure/opengriffin"
                target="_blank"
                rel="noreferrer"
              >
                <GitHubIcon className="w-5 h-5 mr-1" />
                View on GitHub
              </a>
            </Button>
          </motion.div>
          </Magnetic>
        </motion.div>

        {/* Install command card */}
        <motion.div variants={item} className="flex justify-center">
          <Card className="inline-flex items-center gap-3 px-4 sm:px-5 py-3 bg-[var(--color-bg-elev)]/85 backdrop-blur-md border-[var(--color-border-soft)] shadow-2xl max-w-full">
            <code
              className="mono text-xs sm:text-sm truncate"
              style={{ color: "var(--color-text)" }}
            >
              {INSTALL_CMD}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy install command"}
              className="h-7 w-7 p-0 shrink-0"
            >
              {copied ? (
                <Check
                  className="w-4 h-4"
                  style={{ color: "var(--color-alive)" }}
                />
              ) : (
                <Copy
                  className="w-4 h-4"
                  style={{ color: "var(--color-text-dim)" }}
                />
              )}
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
