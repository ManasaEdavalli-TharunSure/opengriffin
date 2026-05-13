"use client";

import * as React from "react";
import { useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { GitHubIcon } from "@/components/icons/github";

function GriffinMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4zm0 7l3 2v3l-3 2-3-2v-3l3-2z" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#install", label: "Install" },
  { href: "#why", label: "Why" },
  { href: "#faq", label: "FAQ" },
  {
    href: "https://github.com/greentarallc/opengriffin/blob/main/docs/index.md",
    label: "Docs",
    external: true,
  },
];

export function Nav() {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();

  // Backdrop opacity ramps as the user starts scrolling. Before that, the nav
  // is nearly transparent so the hero glow shows through.
  const bgOpacity = useTransform(scrollY, [0, 120], [0.1, 0.75]);
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile sheet is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50">
        {/* Backdrop layer — fades in on scroll */}
        <motion.div
          aria-hidden
          className="absolute inset-0 backdrop-blur-md"
          style={{
            backgroundColor: "rgba(10, 10, 10, 1)",
            opacity: bgOpacity,
          }}
        />
        {/* Bottom border — fades in on scroll */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            backgroundColor: "var(--color-border-soft)",
            opacity: borderOpacity,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Left: brand */}
          <a
            href="/"
            className="flex items-center gap-2 font-semibold text-[var(--color-text)] group"
          >
            <motion.span
              whileHover={reduce ? undefined : { rotate: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="inline-flex"
            >
              <GriffinMark className="w-6 h-6 text-[var(--color-brand)] drop-shadow-[0_0_8px_var(--color-brand-glow)]" />
            </motion.span>
            <span>OpenGriffin</span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-brand-soft)] border border-[var(--color-brand)]/40 rounded px-1.5 py-0.5 ml-1 mono">
              v0.1
            </span>
          </a>

          {/* Center/right: nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <a
              href="https://github.com/greentarallc/opengriffin"
              target="_blank"
              rel="noreferrer"
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <GitHubIcon size={14} />
              GitHub
            </a>
          </nav>

          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-[var(--color-border-soft)] text-[var(--color-text)] hover:border-[var(--color-border-hover)] transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Scroll progress bar — pinned to bottom edge of the nav. width
            tracks scrollYProgress so it sweeps left→right as the page scrolls. */}
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] origin-left"
          style={{
            scaleX: scrollYProgress,
            width: "100%",
            backgroundImage:
              "linear-gradient(90deg, var(--color-brand) 0%, var(--color-alive) 50%, var(--color-brand-soft) 100%)",
            boxShadow: "0 0 8px var(--color-brand-glow)",
          }}
        />
      </header>

      {/* Spacer so page content doesn't slide under the fixed header */}
      <div aria-hidden className="h-14" />

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden fixed inset-0 top-14 z-40 bg-[rgba(10,10,10,0.95)] backdrop-blur-md"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-1 p-6"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                  className="px-3 py-3 rounded-md text-[var(--color-text)] hover:bg-white/5 hover:text-[var(--color-brand-soft)] transition-colors text-lg"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="https://github.com/greentarallc/opengriffin"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + NAV_LINKS.length * 0.04, duration: 0.25 }}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-white text-black font-medium"
              >
                <GitHubIcon size={16} />
                Star on GitHub
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="relative px-3 py-1.5 text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors group"
    >
      <span>{label}</span>
      {/* Underline draw-in on hover */}
      <span
        aria-hidden
        className="absolute left-3 right-3 -bottom-0.5 h-[1.5px] bg-[var(--color-brand)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
        style={{ boxShadow: "0 0 6px var(--color-brand-glow)" }}
      />
    </a>
  );
}
