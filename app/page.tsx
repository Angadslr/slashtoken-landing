/* eslint-disable @next/next/no-img-element -- vinext local image optimization has no ASSETS binding */

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Github,
  Languages,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { GITHUB_REPOSITORY } from "./constants";
import { InteractiveWavesBackground } from "./InteractiveWavesBackground";
import { SiteHeader } from "./SiteHeader";

const productFacts = [
  {
    value: "03",
    label: "Initial source languages",
    detail: "MANDARIN / ARABIC / TURKISH",
  },
  {
    value: "05",
    label: "Validation gates",
    detail: "MEANING / CONSTRAINTS / LANGUAGE / VALUES / SAVINGS",
  },
  {
    value: "38%",
    label: "Average input-token savings",
    detail: "OBSERVED IN EARLY MVP TESTS*",
  },
];

function ExternalArrow() {
  return <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />;
}

export default function Home() {
  return (
    <main>
      <SiteHeader currentPage="home" />

      <section id="top" className="hero">
        <InteractiveWavesBackground
          className="hero-waves"
          lineColor="rgba(199, 255, 159, 0.62)"
          backgroundColor="transparent"
          waveSpeedX={0.01}
          waveSpeedY={0.004}
          waveAmpX={26}
          waveAmpY={13}
          friction={0.93}
          tension={0.006}
          maxCursorMove={58}
          xGap={15}
          yGap={40}
        />
        <div className="hero-fade" aria-hidden="true" />
        <div className="hero-content page-shell">
          <p className="eyebrow centered-eyebrow"><span /> Cross-lingual token optimization <span /></p>
          <h1>SlashToken <span>MVP</span></h1>
          <p className="hero-tagline">The shortest prompt may be in another language...</p>
          <p className="hero-description">Multilingual prompts, fewer tokens.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/docs#quickstart">
              Try it in Codex <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a className="button button-secondary" href="#how-it-works">
              See a real transformation <ArrowDownRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section cost-section anchor-section">
        <div className="page-shell cost-intro">
          <p className="eyebrow"><span /> Why SlashToken exists</p>
          <div className="section-heading-simple">
            <h2>Same request. <em>Different token bill.</em></h2>
          </div>
          <p className="tokenizer-thesis">
            LLMs do not read text one character or one word at a time. Their tokenizers
            split each language differently, and providers charge for those tokens.
          </p>
        </div>

        <div className="page-shell language-comparison" aria-label="Equivalent Mandarin and English request example">
          <div className="language-example language-example-source">
            <div className="example-label">
              <span>MANDARIN REQUEST</span>
              <Languages aria-hidden="true" />
            </div>
            <blockquote lang="zh-Hans">
              请分析这个软件服务中的并发错误，并用中文给出完整修复和测试步骤。
            </blockquote>
            <p>The selected tokenizer may split this request into more billable tokens.</p>
          </div>
          <div className="comparison-connector" aria-hidden="true">
            <span>Equivalent intent</span>
            <ArrowDownRight />
          </div>
          <div className="language-example language-example-target">
            <div className="example-label">
              <span>COMPACT ENGLISH ROUTE</span>
              <Check aria-hidden="true" />
            </div>
            <blockquote>
              Analyze the service&apos;s concurrency error. Reply in Mandarin with a complete fix and tests.
            </blockquote>
            <p>A verified compact route can use fewer target-model input tokens.</p>
          </div>
        </div>

        <p className="page-shell mandarin-why">
          The internal representation can change language without changing the user&apos;s
          language or requested outcome. The request stays equivalent; <em>the language
          changes the meter.</em>
        </p>
      </section>

      <section className="metric-band" aria-label="SlashToken product boundaries">
        <div className="page-shell metric-grid">
          {productFacts.map((fact) => (
            <article className="metric-card" key={fact.label}>
              <p className="metric-value">{fact.value}</p>
              <div>
                <h2>{fact.label}</h2>
                <p>{fact.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="metric-note page-shell">
          *Early MVP result. Savings vary by model, source language, tokenizer, and prompt type.
        </p>
      </section>

      <section id="optimization-flow" className="section optimizer-section anchor-section">
        <div className="page-shell optimizer-intro">
          <p className="eyebrow"><span /> How it works</p>
          <h2>Compile across languages. <em>Route only what passes.</em></h2>
          <p>
            SlashToken protects exact values, produces a compact cross-language candidate,
            and compares it with the original. If the candidate is not equivalent and
            cheaper, the original prompt continues unchanged.
          </p>
        </div>

        <div className="page-shell optimizer-diagram" aria-label="SlashToken optimization and verification flow">
          <div className="diagram-flow">
            <article className="diagram-node diagram-node-shield">
              <span className="node-number">01</span>
              <Languages aria-hidden="true" />
              <p className="node-kicker">UNDERSTAND + PROTECT</p>
              <h3>Read intent without risking exact values</h3>
              <p>Intent, constraints, response language, names, code, IDs, and formatting are separated safely.</p>
            </article>
            <ArrowRight className="flow-arrow" aria-hidden="true" />
            <article className="diagram-node diagram-node-transformer">
              <span className="node-number">02</span>
              <Bot aria-hidden="true" />
              <p className="node-kicker">CROSS-LANGUAGE COMPILER</p>
              <h3>Find a more token-efficient representation</h3>
              <p>Translate or compact only the transformable text while retaining the requested behavior.</p>
            </article>
            <ArrowRight className="flow-arrow" aria-hidden="true" />
            <article className="diagram-node">
              <span className="node-number">03</span>
              <ScanSearch aria-hidden="true" />
              <p className="node-kicker">VERIFICATION GATE</p>
              <h3>Compare candidate to original</h3>
              <p>Check meaning, constraints, language, placeholders, and net savings before routing.</p>
            </article>
            <ArrowRight className="flow-arrow" aria-hidden="true" />
            <article className="diagram-node diagram-node-approved">
              <span className="node-number">04</span>
              <Check aria-hidden="true" />
              <p className="node-kicker">APPROVED ROUTE</p>
              <h3>Send the winner—or the original</h3>
              <p>Restore protected values exactly and use the lower-cost route only when every gate passes.</p>
            </article>
          </div>

          <div id="safeguards" className="safeguards-block anchor-section">
            <div className="safeguards-intro">
              <p className="eyebrow"><span /> Safeguards</p>
              <h2>Equivalent is required. <em>Cheaper is not enough.</em></h2>
              <p>Every optimization must preserve the requested outcome and the content that cannot safely change.</p>
            </div>

            <div className="protected-lane">
              <div className="protected-copy">
                <p className="node-kicker">PROTECTED-VALUE BYPASS</p>
                <h3>The transformer never regenerates these values.</h3>
                <p>They travel around the transformer as local placeholders and return character-for-character.</p>
              </div>
              <div className="value-stage">
                <span>ORIGINAL</span>
                <code>Angad</code><code>v2.4.1</code><code>https://api.example.com</code><code>{`{"format":"json"}`}</code>
              </div>
              <ArrowRight className="protected-arrow" aria-hidden="true" />
              <div className="value-stage value-stage-placeholder">
                <span>SHIELDED</span>
                <code>⟦P_1⟧</code><code>⟦P_2⟧</code><code>⟦P_3⟧</code><code>⟦P_4⟧</code>
              </div>
              <ArrowRight className="protected-arrow" aria-hidden="true" />
              <div className="value-stage value-stage-restored">
                <span>RESTORED EXACTLY</span>
                <code>Angad</code><code>v2.4.1</code><code>https://api.example.com</code><code>{`{"format":"json"}`}</code>
              </div>
            </div>

            <div className="verification-rule">
              <ShieldCheck aria-hidden="true" />
              <div>
                <h3>Meaning is verified—not assumed.</h3>
                <p>If a candidate changes requirements, meaning, or protected content, SlashToken discards it and sends the original request unchanged.</p>
              </div>
            </div>
          </div>

          <div className="input-savings-callout">
            <span>PRIMARY CAPABILITY / INPUT SAVINGS</span>
            <h3>Compact the request before the expensive model reads it.</h3>
            <p>The current MVP evaluates Mandarin, Arabic, and Turkish while preserving the user&apos;s requested response language.</p>
          </div>
        </div>
      </section>

      <section id="output-efficiency" className="output-support-section anchor-section">
        <div className="page-shell output-support-grid">
          <div className="output-support-copy">
            <p className="eyebrow"><span /> Secondary capability</p>
            <h2>Also reduces output waste.</h2>
            <p>
              Response controls reduce repeated framing, duplicate explanations, and generic
              boilerplate while preserving requested functionality, constraints, tests, and language.
            </p>
          </div>
          <aside className="output-support-result" aria-label="Observed output-token savings">
            <span>OBSERVED IN EARLY MVP TESTS*</span>
            <strong>34%</strong>
            <p>average output-token savings on projects with more than 10 million output tokens</p>
          </aside>
        </div>
        <p className="page-shell output-support-note">*Results vary by model, language, prompt type, and workload.</p>
      </section>

      <section id="open-source" className="repository-section anchor-section">
        <div className="page-shell repository-grid">
          <div>
            <p className="dark-eyebrow">OPEN SOURCE / EARLY MVP</p>
            <h2>Inspect the source. <em>Verify the claims.</em></h2>
          </div>
          <div className="repository-actions">
            <p>
              Review the implementation, benchmark methodology, architecture, and privacy
              boundaries directly in the SlashToken repository.
            </p>
            <a className="repo-primary" href={GITHUB_REPOSITORY} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" />
              <span><small>GITHUB REPOSITORY</small>Angadslr / Token-Optimizer</span>
              <ExternalArrow />
            </a>
            <div className="repo-link-grid">
              <a href={`${GITHUB_REPOSITORY}/blob/main/README.md`} target="_blank" rel="noreferrer">
                Read the README <ExternalArrow />
              </a>
              <a href={`${GITHUB_REPOSITORY}/blob/main/docs/privacy.md`} target="_blank" rel="noreferrer">
                Review privacy <ExternalArrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="page-shell footer-grid">
          <div className="footer-brand">
            <img src="/slashtoken-mark.png" alt="" width="68" height="68" />
            <span>SlashToken</span>
          </div>
          <p>Verified multilingual prompt routing for Codex and LLM APIs.</p>
          <div className="footer-meta">
            <span>EARLY TECHNICAL MVP</span>
            <span>© 2026 ANGAD SRIVASTAVA</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
