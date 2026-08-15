import type { Metadata } from "next";
import { SiteHeader } from "../SiteHeader";
import { DocsContent } from "./DocsContent";

export const metadata: Metadata = {
  title: "SlashToken Docs — Install locally",
  description:
    "Install SlashToken on macOS or Windows and try verified multilingual routing through its approval UI or Codex MCP tools.",
};

export default function DocsPage() {
  return (
    <main className="docs-page">
      <SiteHeader currentPage="docs" />
      <DocsContent />
    </main>
  );
}
