"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Platform = "macos" | "windows";

const REPOSITORY = "https://github.com/Angadslr/Token-Optimizer";
const CODEX_CLI_DOCS = "https://learn.chatgpt.com/docs/codex/cli";
const CODEX_COMMANDS_DOCS = "https://learn.chatgpt.com/docs/developer-commands";
const CODEX_GLOSSARY_DOCS = "https://learn.chatgpt.com/docs/glossary";
const CODEX_MCP_DOCS = "https://learn.chatgpt.com/docs/extend/mcp";
const CODEX_CONFIG_DOCS = "https://learn.chatgpt.com/docs/config-file/config-basic";
const CODEX_CONFIG_REFERENCE_DOCS = "https://learn.chatgpt.com/docs/config-file/config-reference";
const NVIDIA_KEY_DOCS = "https://docs.api.nvidia.com/nim/re/docs/api-quickstart";

const docsNavigation = [
  ["quickstart", "Start here"],
  ["prerequisites", "Prerequisites"],
  ["install", "Install SlashToken"],
  ["api-key", "Configure the optimizer"],
  ["choose-path", "Choose a path"],
  ["approval-ui", "Approval UI"],
  ["mcp", "MCP diagnostics"],
  ["codex-config", "Configure Codex"],
  ["codex-setup-prompt", "Codex setup prompt"],
  ["verify", "Verify the result"],
  ["troubleshooting", "Troubleshooting"],
] as const;

const prerequisiteCommands = {
  macos: `python3 --version
git --version
codex --version
codex login status`,
  windows: `python --version
git --version
codex --version
codex login status`,
};

const codexInstallCommands = {
  macos: `curl -fsSL https://chatgpt.com/codex/install.sh | sh`,
  windows: `powershell -ExecutionPolicy Bypass -c "irm https://chatgpt.com/codex/install.ps1 | iex"`,
};

const installCommands = {
  macos: `git clone https://github.com/Angadslr/Token-Optimizer.git
cd Token-Optimizer
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -e '.[tokenizers]'
.venv/bin/slashtoken --help`,
  windows: `git clone https://github.com/Angadslr/Token-Optimizer.git
cd Token-Optimizer
python -m venv .venv
./.venv/Scripts/python.exe -m pip install --upgrade pip
./.venv/Scripts/python.exe -m pip install -e ".[tokenizers]"
./.venv/Scripts/slashtoken.exe --help`,
};

const apiKeyCommands = {
  macos: `printf "Paste your NVIDIA API key: "
read -s NVIDIA_API_KEY
export NVIDIA_API_KEY
printf "\\nNVIDIA_API_KEY is set for this terminal.\\n"`,
  windows: `$env:NVIDIA_API_KEY = "paste-your-key-here"`,
};

const apiKeyCommandsGitBash = `export NVIDIA_API_KEY="paste-your-key-here"`;
const apiKeyCommandsCmd = `set NVIDIA_API_KEY=paste-your-key-here`;

const uiCommands = {
  macos: `.venv/bin/slashtoken ui --host 127.0.0.1 --port 8765`,
  windows: `./.venv/Scripts/slashtoken.exe ui --host 127.0.0.1 --port 8765`,
};

const mcpCommands = {
  macos: `codex mcp add slashtoken -- "$PWD/.venv/bin/slashtoken" mcp
codex mcp list
codex`,
  windows: `$slashToken = (Resolve-Path ./.venv/Scripts/slashtoken.exe).Path
codex mcp add slashtoken -- "$slashToken" mcp
codex mcp list
codex`,
};

const mcpCommandsGitBash = `codex mcp add slashtoken -- "$(pwd -W)/.venv/Scripts/slashtoken.exe" mcp
codex mcp list
codex`;

const mcpCommandsCmd = `codex mcp add slashtoken -- "%CD%/.venv/Scripts/slashtoken.exe" mcp
codex mcp list
codex`;

const testPrompt = `Use SlashToken as an inspection and separate-provider workflow for this test. Call analyze_prompt and optimize_prompt for target model gpt-5.6-terra. Explain that Codex already received this message, so these tools cannot reduce the input tokens for the current Codex turn. Show the original route, verified candidate, token evidence, and fallback reason. Stop and wait for my route selection.

If I approve a route and ask you to continue, call run_chat. Clearly label its result as a separate request sent through SlashToken's configured NVIDIA/DeepSeek provider, not as a rewritten Codex turn.

请分析这个软件服务中的并发错误，并用中文给出完整修复和测试步骤。`;

const codexConfigExample = `# ~/.codex/config.toml
model = "gpt-5.6"
model_reasoning_effort = "high"
personality = "pragmatic"

# Keep command execution interactive and workspace-scoped.
approval_policy = "on-request"
sandbox_mode = "workspace-write"

# Use cached search by default; switch to "live" for current results.
web_search = "cached"

[features]
fast_mode = true`;

interface CodeBlockProps {
  code: string;
  id: string;
  label: string;
  hidden?: boolean;
}

function CodeBlock({ code, id, label, hidden = false }: CodeBlockProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <div className="docs-code" hidden={hidden} data-platform-code={id}>
      <div className="docs-code-header">
        <span>{label}</span>
        <button type="button" onClick={copy} aria-label={`Copy ${label} commands`}>
          <span aria-live="polite">
            {status === "copied" ? "Copied" : status === "error" ? "Select text" : "Copy"}
          </span>
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

interface PlatformCodeProps {
  commands: Record<Platform, string>;
  id: string;
  platform: Platform;
  windowsLabel?: string;
}

function PlatformCode({ commands, id, platform, windowsLabel = "Windows · Terminal" }: PlatformCodeProps) {
  return (
    <>
      <CodeBlock code={commands.macos} id={`${id}-macos`} label="macOS · Terminal" hidden={platform !== "macos"} />
      <CodeBlock code={commands.windows} id={`${id}-windows`} label={windowsLabel} hidden={platform !== "windows"} />
    </>
  );
}

function PlatformNote({ platform, when, children }: { platform: Platform; when: Platform; children: ReactNode }) {
  return (
    <div className="docs-platform-block" hidden={platform !== when}>
      {children}
    </div>
  );
}

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="docs-inline-link" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function DocumentationNavigation({ className = "" }: { className?: string }) {
  return (
    <nav className={className} aria-label="Documentation sections">
      {docsNavigation.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
    </nav>
  );
}

export function DocsContent() {
  const [platform, setPlatform] = useState<Platform>("macos");

  return (
    <>
      <div className="docs-mobile-index">
        <details>
          <summary>Documentation sections</summary>
          <DocumentationNavigation />
        </details>
      </div>

      <div className="docs-shell">
        <aside className="docs-sidebar">
          <p>Documentation</p>
          <DocumentationNavigation />
          <a className="docs-repo-link" href={REPOSITORY} target="_blank" rel="noreferrer">
            GitHub repository
          </a>
        </aside>

        <article className="docs-article">
          <header id="quickstart" className="docs-hero docs-anchor">
            <div className="docs-breadcrumb"><Link href="/">SlashToken</Link><span>/</span><span>Docs</span></div>
            <h1>Install SlashToken locally</h1>
            <p className="docs-lead">
              Start with Codex and VS Code, add the local toolchain SlashToken needs,
              then optimize before a Codex turn through the approval UI or inspect routing
              decisions from an active task through MCP.
            </p>
            <div className="docs-notice">
              <p><strong>Early technical release.</strong> Review every route before execution. Interfaces may change while the cost-and-quality hypothesis is validated.</p>
            </div>
          </header>

          <div className="platform-picker" role="tablist" aria-label="Installation platform">
            <span>Show commands for</span>
            <button
              type="button"
              role="tab"
              aria-selected={platform === "macos"}
              className={platform === "macos" ? "is-active" : ""}
              onClick={() => setPlatform("macos")}
            >
              macOS
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={platform === "windows"}
              className={platform === "windows" ? "is-active" : ""}
              onClick={() => setPlatform("windows")}
            >
              Windows
            </button>
          </div>

          <PlatformNote platform={platform} when="windows">
            <div className="docs-callout">
              <h3>You can stay in the terminal VS Code already opened</h3>
              <p>
                These Windows commands work in PowerShell, Command Prompt, and Git Bash.
                You do not need to switch shells, and you do not need PowerShell-only
                commands such as <code>Set-Location</code> or <code>py -3</code>.
              </p>
              <p>
                Check the dropdown on the right side of the VS Code terminal panel, next
                to the <strong>+</strong> button, if a later step asks for a shell-specific command:
              </p>
              <ul>
                <li><strong>PowerShell</strong> — the prompt starts with <code>PS</code></li>
                <li><strong>Command Prompt</strong> — the prompt looks like <code>C:\Users\YourName&gt;</code></li>
                <li><strong>Git Bash</strong> — the prompt includes <code>MINGW64</code> or ends with <code>$</code></li>
              </ul>
              <p>
                If you are inside Windows Subsystem for Linux (WSL), switch this page to
                macOS commands instead. WSL is a Linux environment.
              </p>
            </div>
          </PlatformNote>

          <section id="prerequisites" className="docs-section docs-anchor">
            <p className="docs-section-number">01 / Prerequisites</p>
            <h2>Check the local toolchain</h2>
            <p>
              Open the integrated terminal in VS Code with <strong>View → Terminal</strong>.
              SlashToken requires Python 3.11 or newer, Git, an authenticated Codex CLI,
              and an NVIDIA API key.
            </p>
            <PlatformCode commands={prerequisiteCommands} id="prerequisites" platform={platform} />
            <PlatformNote platform={platform} when="windows">
              <div className="docs-callout compact-callout">
                <h3>If <code>python</code> is not recognized, use <code>python3</code></h3>
                <p>
                  That is expected on many Windows laptops. Run <code>python3 --version</code>.
                  If it prints <code>Python 3.11</code> or newer, you are fine — use
                  <code>python3</code> later only on the <code>python -m venv .venv</code> line.
                  You can ignore <code>py -3</code> unless that command already works on your PC.
                </p>
                <p>
                  If <code>python</code> opens the Microsoft Store instead of printing a version,
                  close the Store and use <code>python3</code>, or install from python.org with
                  <strong>Add python.exe to PATH</strong> enabled, then fully quit and reopen VS Code.
                </p>
              </div>
            </PlatformNote>

            <div className="requirement-grid">
              <article>
                <h3>Python 3.11+</h3>
                <p>
                  Install from <DocLink href="https://www.python.org/downloads/">python.org</DocLink> if the version check fails.
                  {platform === "windows" ? " Enable Add python.exe to PATH, then fully quit and reopen VS Code." : ""}
                </p>
              </article>
              <article>
                <h3>Git</h3>
                {platform === "windows" ? (
                  <p>Install <DocLink href="https://git-scm.com/download/win">Git for Windows</DocLink>. The default setup options are fine. Fully quit and reopen VS Code afterward so <code>git</code> is available in the terminal.</p>
                ) : (
                  <p>On macOS, run <code>xcode-select --install</code> if <code>git --version</code> fails.</p>
                )}
              </article>
              <article><h3>Codex CLI</h3><p>The desktop app alone may not expose <code>codex</code> in your terminal. Verify the command before continuing.</p></article>
            </div>

            <div className="docs-callout">
              <h3>If the Codex command is missing</h3>
              <p>Use OpenAI&apos;s official installer, restart the VS Code terminal, then run <code>codex login</code>.</p>
              <PlatformNote platform={platform} when="windows">
                <p>
                  Paste this even if you are already in PowerShell, Command Prompt, or Git Bash.
                  It starts PowerShell for the installer. A second window may appear; that is normal.
                  When it finishes, close the VS Code terminal tab and open a new one, then run
                  <code>codex --version</code> again.
                </p>
              </PlatformNote>
              <PlatformCode commands={codexInstallCommands} id="codex-install" platform={platform} windowsLabel="Windows · any terminal" />
              <DocLink href={CODEX_CLI_DOCS}>Open the official Codex CLI guide</DocLink>
            </div>
          </section>

          <section id="install" className="docs-section docs-anchor">
            <p className="docs-section-number">02 / Install</p>
            <h2>Clone and install SlashToken</h2>
            <p>
              Run these commands from the folder where you keep projects. The package is
              installed into its own <code>.venv</code>; the guide calls that environment&apos;s
              executables directly so shell activation is not required.
            </p>
            <PlatformNote platform={platform} when="windows">
              <p>
                <code>cd Token-Optimizer</code> only means &quot;enter the folder you just cloned.&quot;
                It is the everyday change-directory command and works in PowerShell, Command
                Prompt, and Git Bash. You do not need <code>Set-Location</code>. Run the lines
                one at a time if you are still deciding between <code>python</code> and
                <code>python3</code>.
              </p>
            </PlatformNote>
            <PlatformCode commands={installCommands} id="install" platform={platform} />
            <ol className="docs-explain">
              <li>
                <strong>git clone</strong> downloads the source into a new folder named
                <code>Token-Optimizer</code>. If that folder already exists, skip this line
                and start at <code>cd</code>.
              </li>
              <li>
                <strong>cd Token-Optimizer</strong> moves you into that folder. Your prompt
                should then include <code>Token-Optimizer</code>. Later commands fail if you
                skip this.
              </li>
              <li>
                <strong>{platform === "windows" ? "python -m venv .venv" : "python3 -m venv .venv"}</strong> creates
                a private Python environment. A new <code>.venv</code> folder appears; leave it there.
                {platform === "windows" ? (
                  <>
                    {" "}If <code>python</code> was not recognized earlier, run{" "}
                    <code>python3 -m venv .venv</code> instead. The following{" "}
                    <code>.venv/Scripts</code> lines stay the same.
                  </>
                ) : null}
              </li>
              <li>
                <strong>pip install</strong> puts SlashToken into that environment. This can take a minute.
                {platform === "windows" ? (
                  <>
                    {" "}Keep the quotes around <code>&quot;.[tokenizers]&quot;</code> — Windows needs them.
                  </>
                ) : null}
              </li>
              <li>
                <strong>{platform === "windows" ? "slashtoken.exe --help" : "slashtoken --help"}</strong> confirms the install.
                You should see usage text, not &quot;not recognized.&quot;
              </li>
            </ol>
            <p className="docs-success-line">Success: the final command prints the SlashToken command help and its <code>ui</code>, <code>mcp</code>, and <code>benchmark</code> commands.</p>
            <PlatformNote platform={platform} when="windows">
              <div className="docs-callout compact-callout">
                <h3>You do not need to activate the virtual environment</h3>
                <p>
                  Commands such as <code>./.venv/Scripts/python.exe</code> call the copy of
                  Python inside the project folder. Forward slashes are intentional and work
                  in PowerShell, Command Prompt, and Git Bash. If a command says the path
                  does not exist, you are not inside <code>Token-Optimizer</code> yet — run
                  <code>cd Token-Optimizer</code> and try again.
                </p>
              </div>
            </PlatformNote>
          </section>

          <section id="api-key" className="docs-section docs-anchor">
            <p className="docs-section-number">03 / Configure</p>
            <h2>Connect the DeepSeek optimizer</h2>
            <p>
              Create a development key through NVIDIA&apos;s hosted API catalog, then load it
              only into the current terminal. SlashToken uses that key for prompt
              transformation and verification; Codex authentication remains separate.
            </p>
            <a className="docs-action-link" href={NVIDIA_KEY_DOCS} target="_blank" rel="noreferrer">
              Get an NVIDIA API key
            </a>
            <PlatformNote platform={platform} when="windows">
              <p>
                Copy only the block that matches your terminal. Replace
                <code>paste-your-key-here</code> with your real NVIDIA key, then press Enter.
                The terminal will not print the key back — that is success. This lasts only
                until you close this terminal tab; setting it again next time is expected.
              </p>
            </PlatformNote>
            <CodeBlock
              code={apiKeyCommands.macos}
              id="api-key-macos"
              label="macOS · Terminal"
              hidden={platform !== "macos"}
            />
            <CodeBlock
              code={apiKeyCommands.windows}
              id="api-key-windows"
              label="Windows · PowerShell"
              hidden={platform !== "windows"}
            />
            <CodeBlock
              code={apiKeyCommandsGitBash}
              id="api-key-git-bash"
              label="Windows · Git Bash"
              hidden={platform !== "windows"}
            />
            <CodeBlock
              code={apiKeyCommandsCmd}
              id="api-key-cmd"
              label="Windows · Command Prompt"
              hidden={platform !== "windows"}
            />
            <PlatformNote platform={platform} when="windows">
              <div className="docs-callout compact-callout">
                <h3>Command Prompt has no quotes</h3>
                <p>
                  PowerShell and Git Bash keep the quotation marks around the key.
                  Command Prompt uses <code>set NVIDIA_API_KEY=your-key</code> with no spaces
                  around the equals sign and no quotes unless the key itself contains
                  special characters.
                </p>
              </div>
            </PlatformNote>
            <div className="docs-warning">
              <div><h3>Keep the credential local</h3><p>Do not commit the key, add it to project files, include it in screenshots, or pass it through <code>codex mcp add --env</code>. Set it again whenever you open a new terminal.</p></div>
            </div>
          </section>

          <section id="choose-path" className="docs-section docs-anchor">
            <p className="docs-section-number">04 / First run</p>
            <h2>Choose how to try SlashToken</h2>
            <p>Choose whether you want the full multilingual experience before a task reaches Codex, or a simpler helper that works from inside an existing Codex task.</p>
            <div className="workflow-grid">
              <a href="#approval-ui">
                <span>Option A · Full experience</span>
                <h3>Local UI connected to Codex</h3>
                <p>See and approve a shorter multilingual prompt before Codex receives it, then send your chosen version with one click.</p>
                <strong>Open the local UI</strong>
              </a>
              <a href="#mcp">
                <span>Option B · Limited mode</span>
                <h3>Use SlashToken inside Codex</h3>
                <p>Let SlashToken clean up repetitive task wording and explain its suggestions without leaving your Codex session.</p>
                <div className="workflow-warning">
                  <p><strong>Multilingual transformation is unavailable here.</strong> Codex receives your prompt before it can call SlashToken through MCP, so this option can only reduce unnecessary redundancy in tasks.</p>
                </div>
                <strong>Set up in Codex</strong>
              </a>
            </div>
          </section>

          <section id="approval-ui" className="docs-section docs-anchor">
            <p className="docs-section-number">05A / Approval UI</p>
            <h2>Review each route visually</h2>
            <p>This is SlashToken&apos;s pre-send optimization path for Codex. The local UI transforms and verifies the prompt first, then creates a Codex App Server turn containing only the route you select. Run the client from the repository root and leave its terminal open for the session.</p>
            <PlatformNote platform={platform} when="windows">
              <p>
                Run this from inside <code>Token-Optimizer</code> — the same folder that
                contains <code>.venv</code>. Leave this terminal running; closing it stops
                the UI. Opening the browser is the next step, not a replacement for this command.
              </p>
            </PlatformNote>
            <PlatformCode commands={uiCommands} id="ui" platform={platform} />
            <ol className="docs-steps">
              <li><span>1</span><div><strong>Open the client</strong><p>Visit <a href="http://127.0.0.1:8765">http://127.0.0.1:8765</a> if it does not open automatically.</p></div></li>
              <li><span>2</span><div><strong>Confirm Codex</strong><p>Wait for the header to show <code>codex.connected</code>, then select a model.</p></div></li>
              <li><span>3</span><div><strong>Choose a project</strong><p>{platform === "windows" ? <>Enter the full folder path Codex should work in, for example <code>C:\Users\YourName\Documents\my-app</code>. You can copy it from File Explorer&apos;s address bar.</> : "Enter the absolute path of the coding project Codex should work in."}</p></div></li>
              <li><span>4</span><div><strong>Analyze a prompt</strong><p>Paste the Mandarin example below and select <code>analyze()</code>.</p></div></li>
              <li><span>5</span><div><strong>Submit one route</strong><p>Review the original, candidate, token evidence, and checks. Send only the route you approve.</p></div></li>
            </ol>
            <CodeBlock code="请分析这个软件服务中的并发错误，并用中文给出完整修复和测试步骤。" id="ui-example" label="Mandarin test prompt" />
          </section>

          <section id="mcp" className="docs-section docs-anchor">
            <p className="docs-section-number">05B / MCP</p>
            <h2>Use MCP for diagnostics</h2>
            <p>
              MCP exposes SlashToken&apos;s analysis, optimization, settings, and execution
              tools during a Codex task. Register the executable from the project&apos;s virtual
              environment, then run the final <code>codex</code> command from the same terminal
              where you set <code>NVIDIA_API_KEY</code> so the local MCP server inherits it.
            </p>
            <div className="docs-warning">
              <div>
                <h3>MCP does not intercept the current prompt</h3>
                <p>Codex receives your message before it can call an MCP tool. SlashToken can analyze that already-received prompt, but it cannot reduce the input tokens consumed by the current Codex turn. For actual pre-send optimization, use the Approval UI; it creates a Codex App Server turn containing only your selected route.</p>
                <p>OpenAI defines an MCP tool as an action Codex can call during a task. Review the <DocLink href={CODEX_GLOSSARY_DOCS}>Codex glossary</DocLink> and <DocLink href={CODEX_MCP_DOCS}>MCP documentation</DocLink> for the underlying lifecycle.</p>
              </div>
            </div>
            <PlatformNote platform={platform} when="windows">
              <p>
                Run this from inside <code>Token-Optimizer</code>. The first line finds the
                full Windows path to SlashToken so Codex can start it later, even if you
                change folders. Copy the block that matches your terminal.
              </p>
            </PlatformNote>
            <CodeBlock
              code={mcpCommands.macos}
              id="mcp-macos"
              label="macOS · Terminal"
              hidden={platform !== "macos"}
            />
            <CodeBlock
              code={mcpCommands.windows}
              id="mcp-windows"
              label="Windows · PowerShell"
              hidden={platform !== "windows"}
            />
            <CodeBlock
              code={mcpCommandsGitBash}
              id="mcp-git-bash"
              label="Windows · Git Bash"
              hidden={platform !== "windows"}
            />
            <CodeBlock
              code={mcpCommandsCmd}
              id="mcp-cmd"
              label="Windows · Command Prompt"
              hidden={platform !== "windows"}
            />
            <PlatformNote platform={platform} when="windows">
              <div className="docs-callout compact-callout">
                <h3>What success looks like here</h3>
                <p>
                  <code>codex mcp list</code> should include <code>slashtoken</code>. The
                  last command opens Codex. Start a new task after registration; existing
                  chats will not pick up the new MCP server.
                </p>
              </div>
            </PlatformNote>
            <div className="docs-callout compact-callout">
              <h3>Confirm the tools</h3>
              <p>Start a new Codex task after registration and enter <code>/mcp</code>. SlashToken should list <code>analyze_prompt</code>, <code>optimize_prompt</code>, <code>run_chat</code>, <code>settings_get</code>, <code>settings_update</code>, and <code>usage_summary</code>.</p>
            </div>
            <CodeBlock code={testPrompt} id="mcp-example" label="First Codex task" />
            <p className="docs-fine-print"><code>optimize_prompt</code> only prepares a candidate. After your approval, <code>run_chat</code> sends the selected route as a separate request to SlashToken&apos;s configured NVIDIA/DeepSeek provider. It does not replace or rewrite the prompt already submitted to Codex.</p>
          </section>

          <section id="codex-config" className="docs-section docs-anchor">
            <p className="docs-section-number">06 / Codex configuration</p>
            <h2>Adjust reasoning effort and Codex defaults</h2>
            <p>
              In the Codex desktop app, open <strong>Settings → Configuration → Open config.toml</strong>.
              {" "}Personal defaults live in{" "}
              <code hidden={platform !== "macos"}>~/.codex/config.toml</code>
              <code hidden={platform !== "windows"}>%USERPROFILE%\.codex\config.toml</code>
              <span hidden={platform !== "windows"}>
                , which is usually <code>C:\Users\YourName\.codex\config.toml</code>
              </span>
              . For settings that should apply only to a trusted repository, create{" "}
              <code>.codex/config.toml</code> inside that project.
            </p>
            <CodeBlock code={codexConfigExample} id="codex-config" label="Codex config.toml" />
            <div className="verification-list">
              <article>
                <div><h3>Choose the lowest useful reasoning effort</h3><p>Start with <code>medium</code>. Use <code>low</code> for narrow, fast tasks and <code>high</code> for work that needs more planning and checking. Supported effort levels depend on the selected model; higher effort generally takes longer and uses more tokens.</p></div>
              </article>
              <article>
                <div><h3>Keep safe execution defaults</h3><p><code>approval_policy = &quot;on-request&quot;</code> lets Codex request permission when necessary, while <code>sandbox_mode = &quot;workspace-write&quot;</code> keeps ordinary edits scoped to the active workspace.</p></div>
              </article>
              <article>
                <div><h3>Use the right configuration scope</h3><p>Command-line flags override project settings, project settings override profile and user defaults, and project configuration loads only after you trust the repository.</p></div>
              </article>
            </div>
            <div className="docs-callout compact-callout">
              <h3>Change the current chat without editing the file</h3>
              <p>Use the model and reasoning control beneath the composer, or run <code>/model</code> in an interactive Codex CLI session. File settings provide the durable default for future sessions.</p>
              <p>Review OpenAI&apos;s <DocLink href={CODEX_CONFIG_DOCS}>configuration guide</DocLink> and <DocLink href={CODEX_CONFIG_REFERENCE_DOCS}>complete setting reference</DocLink> before adding advanced options.</p>
            </div>
          </section>

          <section id="codex-setup-prompt" className="docs-section docs-anchor">
            <p className="docs-section-number">07 / Codex-assisted setup</p>
            <h2>Install with a Codex prompt</h2>
            <div className="prompt-coming-soon">
              <p>Codex setup prompt</p>
              <h3>Coming soon</h3>
              <span>The copyable setup prompt is being prepared. Use the manual installation above as the canonical setup path for now.</span>
            </div>
          </section>

          <section id="verify" className="docs-section docs-anchor">
            <p className="docs-section-number">08 / Verify</p>
            <h2>Know what success looks like</h2>
            <div className="verification-list">
              <article><div><h3>Qualified candidate</h3><p>A compact route appears only after language, protected-value, semantic, and savings checks pass.</p></div></article>
              <article><div><h3>Protected values survive exactly</h3><p>Names, numbers, URLs, code, IDs, quotations, and formatting requirements must match their original values.</p></div></article>
              <article><div><h3>Fallback is expected</h3><p>If the route is unsupported, risky, ambiguous, changed, or not cheaper enough, SlashToken presents the unchanged original request.</p></div></article>
            </div>
          </section>

          <section id="troubleshooting" className="docs-section docs-anchor">
            <p className="docs-section-number">09 / Troubleshooting</p>
            <h2>Resolve common setup problems</h2>
            <div className="troubleshooting-list">
              <details>
                <summary><span>Python or Git is not found</span><strong>+</strong></summary>
                <p>
                  Install the missing prerequisite, completely close the VS Code terminal,
                  open a new one, and rerun the checks under Prerequisites. On Windows, try
                  <code>python3 --version</code> if <code>python</code> fails. You do not need
                  <code>py -3</code> unless that command already works on your PC. After
                  installing Python or Git, fully quit VS Code and reopen it so PATH changes apply.
                </p>
              </details>
              <details>
                <summary><span><code>python</code> opens the Microsoft Store</span><strong>+</strong></summary>
                <p>
                  Windows app aliases can intercept <code>python</code>. Use <code>python3</code>
                  instead, or install from python.org with <strong>Add python.exe to PATH</strong>
                  enabled, then fully quit and reopen VS Code.
                </p>
              </details>
              <details>
                <summary><span><code>cd Token-Optimizer</code> cannot find the folder</span><strong>+</strong></summary>
                <p>
                  You are not in the folder that contains the clone. Run <code>dir</code> in
                  PowerShell or Command Prompt, or <code>ls</code> in Git Bash, and look for
                  <code>Token-Optimizer</code>. Then run <code>cd Token-Optimizer</code>. If
                  you never ran <code>git clone</code>, start with that command from your
                  projects folder.
                </p>
              </details>
              <details>
                <summary><span><code>codex</code> is missing or signed out</span><strong>+</strong></summary>
                <p>Use the official Codex installer above, then run <code>codex login</code> and confirm with <code>codex login status</code>. Run <code>codex doctor</code> for installation and authentication diagnostics.</p>
              </details>
              <details>
                <summary><span>The NVIDIA key command fails</span><strong>+</strong></summary>
                <p>
                  <code>$env:NVIDIA_API_KEY</code> is PowerShell-only. If that is not recognized,
                  you are in Git Bash or Command Prompt — use the matching block in Configure.
                  Set the key again in the same terminal that launches SlashToken or Codex.
                  The guide intentionally does not persist the key.
                </p>
              </details>
              <details>
                <summary><span>The NVIDIA key is missing</span><strong>+</strong></summary>
                <p>Set <code>NVIDIA_API_KEY</code> again in the same terminal that launches SlashToken or Codex. The guide intentionally does not persist the key.</p>
              </details>
              <details>
                <summary><span>Port 8765 is already in use</span><strong>+</strong></summary>
                <p>Stop the earlier SlashToken process or rerun the UI command with <code>--port 8766</code>, then open <code>http://127.0.0.1:8766</code>.</p>
              </details>
              <details>
                <summary><span>The UI never shows <code>codex.connected</code></span><strong>+</strong></summary>
                <p>Keep the UI terminal open, confirm <code>codex login status</code>, then run <code>codex doctor</code>. Restart the UI after Codex authentication succeeds.</p>
              </details>
              <details>
                <summary><span>SlashToken tools do not appear in Codex</span><strong>+</strong></summary>
                <p>Run <code>codex mcp list</code>, confirm the absolute virtual-environment executable is registered, and open a new Codex task after any MCP configuration change. On Windows, use the PowerShell, Git Bash, or Command Prompt block that matches your terminal so Codex receives a real Windows path.</p>
              </details>
              <details>
                <summary><span>The optimized route is rejected</span><strong>+</strong></summary>
                <p>This can be correct behavior. SlashToken rejects candidates when language, protected content, meaning, or minimum-savings checks do not qualify. Use the original route and inspect the reported fallback reason.</p>
              </details>
            </div>
            <div className="docs-experimental-note">
              <p>SlashToken&apos;s approval UI depends on Codex App Server, which OpenAI currently documents as experimental. Check the <DocLink href={CODEX_COMMANDS_DOCS}>developer command reference</DocLink> if a Codex update changes local App Server behavior.</p>
            </div>
          </section>

          <footer className="docs-footer">
            <span>/SlashToken documentation</span>
            <a href={REPOSITORY} target="_blank" rel="noreferrer">View source</a>
          </footer>
        </article>

      </div>
    </>
  );
}
