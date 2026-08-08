"use client";
/* eslint-disable @next/next/no-img-element -- vinext local image optimization has no ASSETS binding */

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GITHUB_REPOSITORY } from "./constants";

const navigation = [
  { href: "/#how-it-works", label: "Demo", page: "home" },
  { href: "/#optimization-flow", label: "How it works", page: "home" },
  { href: "/#safeguards", label: "Safeguards", page: "home" },
  { href: "/#open-source", label: "Open source", page: "home" },
  { href: "/docs", label: "Docs", page: "docs" },
] as const;

interface SiteHeaderProps {
  currentPage?: "home" | "docs";
}

function ExternalArrow() {
  return <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />;
}

export function SiteHeader({ currentPage = "home" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <Link className="brand" href="/#top" aria-label="SlashToken home" onClick={closeMenu}>
        <span className="brand-image-wrap">
          <img src="/slashtoken-mark.png" alt="" className="brand-image" width="96" height="96" />
        </span>
        <span className="brand-name">SlashToken</span>
        <span className="brand-status" aria-hidden="true" />
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            aria-current={item.page === "docs" && currentPage === "docs" ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <a
        className="header-cta animated-fill"
        href={GITHUB_REPOSITORY}
        target="_blank"
        rel="noreferrer"
      >
        <span>View GitHub</span>
        <ExternalArrow />
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            onClick={closeMenu}
            aria-current={item.page === "docs" && currentPage === "docs" ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <a href={GITHUB_REPOSITORY} target="_blank" rel="noreferrer" onClick={closeMenu}>
          View GitHub <ExternalArrow />
        </a>
      </nav>
    </header>
  );
}
