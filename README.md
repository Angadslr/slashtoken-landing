# SlashToken Landing Page

Product landing page for [SlashToken](https://github.com/Angadslr/Token-Optimizer),
an evidence-driven multilingual prompt gateway for Codex and LLM APIs.

The page explains how SlashToken protects exact prompt content, measures the
complete request path, verifies optimized candidates, and keeps the original
prompt whenever the transformed route is unsafe, unsupported, unverifiable, or
uneconomical.

## Local development

Requirements:

- Node.js `>=22.13.0`

Install dependencies and start the local site:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm test
```

The test command creates the production build and verifies the rendered landing
page, product claims, repository links, and removal of starter content.

## Project structure

- `app/page.tsx` contains the landing-page content and interactions.
- `app/globals.css` contains the responsive visual system.
- `app/layout.tsx` provides typography, metadata, favicon, and social-preview metadata.
- `public/` contains the supplied SlashToken logo derivatives and social card.

The site intentionally has no form backend, analytics, cookies, accounts, or
persistent user data.
