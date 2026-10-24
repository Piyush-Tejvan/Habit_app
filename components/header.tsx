"use client";
import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { PilotCTA } from "./cta";
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="site-header container">
      <Link
        href="/"
        className="wordmark"
        aria-label="Do.Theory home"
        onClick={() => setOpen(false)}
      >
        do<span className="wordmark-dot">.</span>theory
        <span className="wordmark-star" aria-hidden="true">
          ✳
        </span>
      </Link>
      <button
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="main-nav"
        className={open ? "main-nav is-open" : "main-nav"}
        aria-label="Main navigation"
        onClick={() => setOpen(false)}
      >
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#your-week">Your seven days</Link>
        <Link
          href="/sample"
          aria-current={path === "/sample" ? "page" : undefined}
        >
          Try a sample <ArrowIcon />
        </Link>
        <PilotCTA className="button button-small button-outline" />
      </nav>
    </header>
  );
}
