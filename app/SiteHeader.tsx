/* eslint-disable @next/next/no-img-element -- vinext local image optimization has no ASSETS binding */

import Link from "next/link";

interface SiteHeaderProps {
  currentPage?: "home" | "docs";
}

export function SiteHeader({ currentPage = "home" }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/#top" aria-label="SlashToken home">
        <span className="brand-image-wrap">
          <img src="/slashtoken-mark.png" alt="" className="brand-image" width="96" height="96" />
        </span>
        <span className="brand-name">SlashToken</span>
        <span className="brand-status" aria-hidden="true" />
      </Link>

      <Link
        className="header-docs-link"
        href="/docs"
        aria-current={currentPage === "docs" ? "page" : undefined}
      >
        Docs
      </Link>
    </header>
  );
}
