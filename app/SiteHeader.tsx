import Link from "next/link";
import { GITHUB_REPOSITORY } from "./constants";

interface SiteHeaderProps {
  currentPage?: "home" | "docs";
}

export function SiteHeader({ currentPage = "home" }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/#top" aria-label="SlashToken home">
        <span className="brand-name">/SlashToken</span>
      </Link>

      <nav className="header-nav" aria-label="Site">
        <Link
          href="/docs"
          aria-current={currentPage === "docs" ? "page" : undefined}
        >
          Docs
        </Link>
        <a href={GITHUB_REPOSITORY} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/angad-srivastava-bba083388" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </nav>
    </header>
  );
}
