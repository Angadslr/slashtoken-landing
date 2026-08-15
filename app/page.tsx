import { GITHUB_REPOSITORY } from "./constants";
import { SiteHeader } from "./SiteHeader";

const methodSteps = [
  "Protect names, numbers, URLs, code, quotes, IDs",
  "Compile a compact-English candidate",
  "Verify language, constraints, and net cost",
  "Send the winner, or the original",
];

const boundaries = [
  "High-stakes prompts are not transformed in v1. These include requests for legal, medical, tax, or financial advice; safety- or security-critical work; and prompts where a wording change could alter compliance, liability, or real-world outcomes.",
  "Optimization is optional routing, never an unconditional translation step.",
  "SlashToken does not claim lossless translation. It reports measured, bounded preservation and falls back when checks fail.",
  "Raw original and transformed prompts are not persisted by the production app.",
  "Optional response controls can reduce output restatement and boilerplate without changing requested functionality.",
];

const outputProfiles = [
  {
    mode: "chatbot",
    trim: [
      "repeated points and restated questions",
      "filler and throat-clearing",
      "extra framing you did not ask for",
    ],
    keep: [
      "qualifications, caveats, and examples that matter",
      "the detail level, format, and language you requested",
    ],
  },
  {
    mode: "agentic_coding",
    trim: ["long progress updates and wrap-up narration"],
    keep: [
      "the smallest change that actually solves the problem",
      "tests, validation, security, accessibility, and architecture",
      "enough explanation that someone can use the result",
    ],
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader currentPage="home" />

      <section id="top" className="hero">
        <div className="page-shell hero-inner">
          <h1>A local gateway that sends a cheaper prompt only after it proves equivalent.</h1>
          <p className="hero-author">Angad Srivastava @ Oregon State University</p>
          <p className="hero-lead">
            SlashToken optimizes Chinese, Arabic, Turkish, and Japanese prompts for Codex.
            A compact-English route is a candidate, not a default. The original always
            remains the fallback. Nothing is sent to Codex until you approve a route.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="/docs#quickstart">
              Install locally
            </a>
            <a className="text-link" href="#receipt">
              Read the method
            </a>
          </div>
        </div>
      </section>

      <section id="receipt" className="section anchor-section">
        <div className="page-shell">
          <p className="section-label mono">decision.receipt</p>
          <h2>Example transformation from a benchmark fixture</h2>
          <p className="section-intro">
            Tokenizers treat non-English letter sequences as unusual patterns and split
            them into more billable tokens. SlashToken protects exact values, produces a
            compact-English candidate, and compares it with the original. If the candidate
            is not equivalent and cheaper, the original prompt continues unchanged.
          </p>

          <div className="receipt-frame" aria-label="Routing receipt for zh-code-001">
            <div className="receipt-grid">
              <article className="receipt-pane">
                <header className="receipt-pane-header">
                  <strong>original.route</strong>
                  <span>zh-code-001</span>
                </header>
                <div className="receipt-pane-body" lang="zh-Hans">
                  请分析这个 Python 服务的并发错误，保留函数名{" "}
                  <span className="protected">`process_batch`</span>、错误代码{" "}
                  <span className="protected">ERR-2048</span> 和超时值{" "}
                  <span className="protected">30 秒</span>
                  。请用中文给出完整修复方案、测试和风险说明，不要省略任何约束。
                </div>
              </article>

              <article className="receipt-pane">
                <header className="receipt-pane-header">
                  <strong>verified.candidate</strong>
                  <span>en_candidate</span>
                </header>
                <div className="receipt-pane-body">
                  Analyze the Python service concurrency error. Keep{" "}
                  <span className="protected">`process_batch`</span>,{" "}
                  <span className="protected">ERR-2048</span>, and the{" "}
                  <span className="protected">30-second timeout</span> exactly. Reply in
                  Chinese with a complete fix, tests, risk notes, and every constraint intact.
                </div>
              </article>

              <aside className="receipt-pane receipt-inspector">
                <header className="receipt-pane-header">
                  <strong>decision.receipt</strong>
                  <span>inspector</span>
                </header>
                <dl className="receipt-metrics">
                  <div>
                    <dt>fixture.id</dt>
                    <dd>zh-code-001</dd>
                  </div>
                  <div>
                    <dt>route.lang</dt>
                    <dd>zh → en_candidate</dd>
                  </div>
                  <div>
                    <dt>protected.spans</dt>
                    <dd>3</dd>
                  </div>
                  <div>
                    <dt>route.decision</dt>
                    <dd>approve(candidate)</dd>
                  </div>
                </dl>
              </aside>
            </div>

            <div className="restore-strip" aria-label="Protected value restore path">
              <span className="restore-label">restore:</span>
              <div className="restore-paths">
                <div className="restore-path">
                  <code>process_batch</code>
                  <span className="restore-arrow">→</span>
                  <code>⟦P_1⟧</code>
                  <span className="restore-arrow">→</span>
                  <code>process_batch</code>
                </div>
                <div className="restore-path">
                  <code>ERR-2048</code>
                  <span className="restore-arrow">→</span>
                  <code>⟦P_2⟧</code>
                  <span className="restore-arrow">→</span>
                  <code>ERR-2048</code>
                </div>
                <div className="restore-path">
                  <code>30</code>
                  <span className="restore-arrow">→</span>
                  <code>⟦P_3⟧</code>
                  <span className="restore-arrow">→</span>
                  <code>30</code>
                </div>
              </div>
            </div>
          </div>

          <p className="receipt-caption">
            Not a live run or measured savings claim. For demonstration and understanding purposes
            only.
          </p>
        </div>
      </section>

      <section id="method" className="section anchor-section">
        <div className="page-shell">
          <p className="section-label mono">route.method</p>
          <h2>How it decides</h2>
          <ol className="method-list">
            {methodSteps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="instrument" className="section anchor-section">
        <div className="page-shell">
          <p className="section-label mono">local.approval.client</p>
          <h2>The operator console</h2>
          <div className="operator-console" aria-label="SlashToken local approval client">
            <header className="oc-topbar">
              <div className="oc-mark">
                <span className="oc-prompt" aria-hidden="true">~/</span>
                <span>SlashToken</span>
              </div>
              <nav className="oc-tabs" aria-label="Workspace sections">
                <span className="oc-tab">Router</span>
                <span className="oc-tab is-active">Decision</span>
                <span className="oc-tab">Console</span>
              </nav>
              <div className="oc-connection">
                <span className="oc-status">codex.connected</span>
                <span className="oc-endpoint">local://gateway</span>
              </div>
            </header>

            <div className="oc-controls" aria-label="Routing configuration">
              <div className="oc-field">
                <span>project.path</span>
                <code>/Users/angad/projects/shexianggou</code>
              </div>
              <div className="oc-field">
                <span>codex.model</span>
                <code>gpt-5.6</code>
              </div>
              <div className="oc-field">
                <span>workload.mode</span>
                <code>agentic_coding</code>
              </div>
              <label className="oc-toggle">
                <input type="checkbox" defaultChecked tabIndex={-1} />
                <span>optimize.language</span>
              </label>
              <label className="oc-toggle">
                <input type="checkbox" tabIndex={-1} />
                <span>optimize.output</span>
              </label>
            </div>

            <div className="oc-decision" aria-label="Route comparison">
              <article className="oc-pane">
                <header className="oc-pane-bar">
                  <h3>original.route</h3>
                  <span className="oc-tokens">4271 exact tokens</span>
                </header>
                <div className="oc-prompt-clip">
                <pre className="oc-prompt-body" lang="ja">非常に経験豊富で、責任感が強く、プロフェッショナルなフロントエンド・プロダクトエンジニア兼UI実装コンサルタントとして対応してください。対象は完全に空のコードベースです。ゼロから「社享购」という名称のソーシャルコマースアプリの、完成度の高いフロントエンドデモを計画し、実装してください。

全体的な体験は、Facebookのようなソーシャル性の高いプロダクトにできる限り近づけてください。ユーザーが単に無機質な商品一覧を見るのではなく、慣れ親しんだソーシャルフィードの中で商品を発見し、投稿に反応し、コメントや共有を行い、販売者やクリエイターをフォローし、商品詳細を確認し、カートに追加し、デモ用の購入フローを最後まで完了できるようにしてください。

未完成のプロトタイプ、静的デザイン、ワイヤーフレーム、ランディングページ、概念説明だけの成果物は受け入れられません。直接起動でき、クリック可能な、プレゼンテーション品質のフロントエンドアプリケーションを納品してください。実装範囲にはフィード、プロフィール、出品者ページ、商品詳細、カート、決済デモ、通知、検索、および管理用の最低限のシードデータが含まれます。各画面は実際の状態遷移を持ち、ダミーの静止画で終わらせないでください。

技術要件は次のとおりです。フロントエンドは本番相当のコンポーネント分割、ルーティング、状態管理、アクセシビリティ、レスポンシブレイアウト、空状態とエラー状態を含むこと。データはローカルのモックで十分ですが、スキーマは一貫させ、ID、価格、在庫、投稿本文、コメントスレッドを途中で欠落させないこと。ブランド名「社享购」と既存の固有名詞は一字も変更しないこと。</pre>
                <div className="oc-prompt-fade" aria-hidden="true" />
                </div>
                <footer className="oc-pane-actions">
                  <span className="oc-btn">submit(original)</span>
                </footer>
              </article>
              <article className="oc-pane">
                <header className="oc-pane-bar">
                  <h3 className="oc-verified">verified.candidate</h3>
                  <span className="oc-tokens">2440 exact tokens</span>
                </header>
                <div className="oc-prompt-clip">
                <pre className="oc-prompt-body oc-candidate">Act as a highly experienced, responsible, professional front-end product engineer and UI implementation consultant. The target is a completely empty codebase. From scratch, plan and implement a polished front-end demo of a social commerce app named &quot;社享购&quot;.

Make the overall experience as close as possible to a highly social product like Facebook: users should discover products in a familiar social feed, react to posts, comment and share, follow sellers and creators, view product details, add to cart, and complete a demo purchase flow, rather than just viewing a sterile product list.

Deliverables that are unfinished prototypes, static designs, wireframes, landing pages, or conceptual explanations are not acceptable. Deliver a directly launchable, clickable, presentation-quality front-end application. Scope includes feed, profiles, seller pages, product detail, cart, checkout demo, notifications, search, and enough seeded data to walk the whole path. Every screen needs real state changes; do not stop at static mockups.

Technical requirements: production-like component split, routing, state, accessibility, responsive layout, empty and error states. Local mocks are fine if the schema stays consistent and IDs, prices, inventory, post bodies, and comment threads are never dropped mid-flow. Do not change the brand name &quot;社享购&quot; or any existing proper nouns.</pre>
                <div className="oc-prompt-fade" aria-hidden="true" />
                </div>
                <footer className="oc-pane-actions">
                  <span className="oc-btn oc-btn-primary">approve(candidate)</span>
                </footer>
              </article>
            </div>

            <footer className="oc-statusbar">
              <span>VERIFIED_ROUTING</span>
              <span>raw prompts: not persisted</span>
              <span>route: explicit approval</span>
            </footer>
          </div>
          <p className="console-caption">
            Cropped view of a longer prompt in the local approval client at{" "}
            <code className="mono">127.0.0.1:8765</code>. Tokenizer counts for this run:
            4271 original tokens, 2440 verified tokens. The visible text is the start of
            each route, not the full prompt.
          </p>
        </div>
        <div className="flowchart-stage">
          <div className="flowchart-pair" aria-label="SlashToken routing flow">
            <figure className="flowchart-card">
              <img
                src="/part-1-analyze-and-compress.svg"
                alt="Part 1: Analyze and create a safe compact English candidate"
                width={1920}
                height={1080}
              />
            </figure>
            <figure className="flowchart-card">
              <img
                src="/part-2-verify-and-execute.svg"
                alt="Part 2: Verify net cost, meaning, user approval, and execute the best route"
                width={1920}
                height={1080}
              />
            </figure>
          </div>
        </div>
      </section>

      <section id="boundaries" className="section anchor-section">
        <div className="page-shell">
          <p className="section-label mono">product.boundaries</p>
          <h2>What SlashToken does and does not claim</h2>
          <ul className="boundary-list">
            {boundaries.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="output-policy" className="section anchor-section">
        <div className="page-shell">
          <p className="section-label mono">optimize.output</p>
          <h2>Less narration. Same requirements.</h2>
          <p className="section-intro">
            On long agent runs, output tokens often cost more than the prompt. Models tend to
            pad replies with progress updates, repeated summaries, and polite framing. Turn on{" "}
            <code className="mono">optimize.output</code> (off by default) and SlashToken adds a
            short developer policy before the model starts writing, not after it finishes. In
            Codex that applies to the thread through developer instructions and{" "}
            <code className="mono">model_verbosity: low</code> where the model supports it. On
            the API path the same policies ride along as system content. SlashToken never
            rewrites a completed answer, and there is no hard cap on output length. What you
            asked for stays protected by explicit preserve rules and your approval step.
          </p>

          <div className="output-compare" aria-label="Illustrative narration contrast (fictional)">
            <article className="output-compare-pane">
              <header className="output-compare-header">
                <strong>default.behavior</strong>
                <span>fictional</span>
              </header>
              <p>
                I&apos;d be happy to help with that. To summarize what you asked: analyze the
                concurrency error, keep the function names, and reply in Chinese with tests and
                risks. First, let me restate the constraints…
              </p>
            </article>
            <article className="output-compare-pane output-compare-pane-policy">
              <header className="output-compare-header">
                <strong>output.policy</strong>
                <span>fictional</span>
              </header>
              <p>
                Concurrency bug is in the lock around batch flush. Keep{" "}
                <code className="mono">process_batch</code> and <code className="mono">ERR-2048</code>
                . Fix, tests, and risk notes in Chinese below. Every constraint stays the same.
              </p>
            </article>
          </div>
          <p className="output-compare-caption">
            Made-up example for illustration. Not benchmark data or a measured savings claim.
          </p>

          <div className="output-profiles">
            {outputProfiles.map((profile) => (
              <article key={profile.mode} className="output-profile">
                <header className="output-profile-header">
                  <strong>workload.mode</strong>
                  <code className="mono">{profile.mode}</code>
                </header>
                <div className="output-profile-grid">
                  <div>
                    <h3>What gets shorter</h3>
                    <ul>
                      {profile.trim.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>What stays intact</h3>
                    <ul>
                      {profile.keep.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="output-policy-note">
            Compact verified English prompts can shrink what goes in. Output policy can shrink
            what comes out. You can turn either one on from the operator console, and each is
            measured on its own against your quality thresholds. If optimization is off or a
            check fails, SlashToken falls back to the unchanged route, the same way it does
            for input routing.
          </p>
        </div>
      </section>

      <section id="install" className="install-band anchor-section">
        <div className="page-shell">
          <h2>Install from source</h2>
          <p>
            Clone the repository, install into a virtual environment, and start the local
            approval client. Review the README and privacy notes before connecting Codex.
          </p>
          <pre className="install-command">{`git clone ${GITHUB_REPOSITORY}.git
cd Token-Optimizer
python3 -m venv .venv
.venv/bin/python -m pip install -e '.[tokenizers]'
.venv/bin/slashtoken ui`}</pre>
          <div className="install-links">
            <a href={`${GITHUB_REPOSITORY}/blob/main/README.md`} target="_blank" rel="noreferrer">
              Read the README
            </a>
            <a href={`${GITHUB_REPOSITORY}/blob/main/docs/privacy.md`} target="_blank" rel="noreferrer">
              Review privacy
            </a>
            <a href={GITHUB_REPOSITORY} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell footer-meta">
          <span>0.1.0</span>
          <span>zh · ar · tr · ja</span>
          <span>local-only · prompts not persisted</span>
        </div>
      </footer>
    </main>
  );
}
