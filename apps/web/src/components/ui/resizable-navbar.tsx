"use client";

/**
 * Resizable Navbar — adapted from the 21st.dev / Aceternity "Resizable Navbar"
 * component. Ported to this repo's stack: framer-motion (not motion/react),
 * lucide-react icons (not @tabler), and the OpenGriffin dark/orange tokens.
 *
 * Signature behaviors kept from the source:
 *   - the nav body shrinks to a narrower, blurred "pill" once the user scrolls
 *   - nav items share a single sliding highlight via layoutId on hover
 * Both are disabled under prefers-reduced-motion.
 */

import * as React from "react";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_TRIGGER = 80;

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Navbar({ children, className }: NavbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > SCROLL_TRIGGER);
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        // Only inject `visible` into the layout children that consume it
        // (NavBody / MobileNav) — other children (e.g. the scroll-progress
        // bar) are DOM elements and would reject an unknown `visible` attr.
        React.isValidElement(child) &&
        (child.type === NavBody || child.type === MobileNav)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export function NavBody({ children, className, visible }: NavBodyProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={
        reduce
          ? undefined
          : {
              backdropFilter: visible ? "blur(12px)" : "blur(0px)",
              boxShadow: visible
                ? "0 8px 32px -12px rgba(0,0,0,0.6), 0 0 0 1px var(--color-border-soft), 0 0 24px -8px var(--color-brand-glow)"
                : "0 0 0 0 rgba(0,0,0,0)",
              width: visible ? "62%" : "100%",
              y: visible ? 12 : 0,
            }
      }
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      style={{ minWidth: visible ? "720px" : undefined }}
      className={cn(
        "relative z-[60] mx-auto hidden max-w-6xl flex-row items-center justify-between self-start rounded-2xl px-4 py-2 md:flex",
        visible
          ? "bg-[var(--color-bg-elev)]/80 border border-[var(--color-border-soft)]"
          : "bg-transparent",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

interface NavItem {
  name: string;
  link: string;
  external?: boolean;
}

interface NavItemsProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export function NavItems({ items, className, onItemClick }: NavItemsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center gap-1 text-sm font-medium md:flex",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          key={`nav-link-${idx}`}
          href={item.link}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noreferrer" : undefined}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-text)]"
        >
          {hovered === idx && (
            <motion.span
              layoutId="nav-hover-pill"
              aria-hidden
              className="absolute inset-0 rounded-full bg-[var(--color-surface-hover)] ring-1 ring-[var(--color-brand)]/25"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export function MobileNav({ children, className, visible }: MobileNavProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={
        reduce
          ? undefined
          : {
              backdropFilter: visible ? "blur(12px)" : "blur(0px)",
              width: visible ? "92%" : "100%",
              y: visible ? 10 : 0,
              borderRadius: visible ? "1rem" : "0rem",
            }
      }
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-col items-center justify-between px-1 py-2 md:hidden",
        visible
          ? "bg-[var(--color-bg-elev)]/80 border border-[var(--color-border-soft)]"
          : "bg-transparent",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function MobileNavHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between px-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MobileNavToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-menu"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-border-soft)] text-[var(--color-text)] transition-colors hover:border-[var(--color-border-hover)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="x"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <X className="h-5 w-5" />
          </motion.span>
        ) : (
          <motion.span
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <Menu className="h-5 w-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function MobileNavMenu({
  children,
  className,
  isOpen,
}: {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-nav-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "absolute inset-x-2 top-16 z-50 flex w-[calc(100%-1rem)] flex-col items-start gap-1 rounded-xl border border-[var(--color-border-soft)] bg-[rgba(10,10,10,0.97)] p-4 shadow-2xl backdrop-blur-md",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
