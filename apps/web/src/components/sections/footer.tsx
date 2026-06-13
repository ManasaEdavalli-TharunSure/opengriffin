"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal, RevealItem } from "@/components/motion/scroll-reveal";

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ManasaEdavalli-TharunSure/opengriffin",
    external: true,
  },
  { label: "Features", href: "#features" },
  { label: "Install", href: "#install" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  const reduce = useReducedMotion();
  return (
    <footer className="px-6 py-12 border-t border-[var(--color-border-soft)] text-[var(--color-text-faint)] text-sm">
      <Reveal
        as="div"
        className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4"
      >
        <RevealItem>© 2026 OpenGriffin contributors · Apache 2.0</RevealItem>
        <RevealItem as="div" className="flex gap-6">
          {LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              whileHover={reduce ? undefined : { y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="hover:text-[var(--color-brand-soft)] transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </RevealItem>
        <RevealItem as="div" className="text-xs">
          Not affiliated with Anthropic, OpenAI, Google, Meta, or any AI model vendor.
        </RevealItem>
      </Reveal>
    </footer>
  );
}
