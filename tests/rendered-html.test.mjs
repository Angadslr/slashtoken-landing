import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const serverUrl = new URL(
    "../.vercel/output/functions/__server.func/index.mjs",
    import.meta.url,
  );
  serverUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: server } = await import(serverUrl.href);
  return server.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
  );
}

test("server-renders the paper-and-ink SlashToken landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SlashToken<\/title>/i);
  assert.match(html, /A local gateway that sends a cheaper prompt only after it proves equivalent\./);
  assert.match(html, /Angad Srivastava/);
  assert.match(html, /Oregon State University/);
  assert.match(html, /Install locally/);
  assert.match(html, /Read the method/);
  assert.match(html, /\/SlashToken/);
  assert.match(html, /href="\/docs"[^>]*>Docs</i);
  assert.match(html, /Angadslr\/Token-Optimizer/);
  assert.match(html, /zh-code-001/);
  assert.match(html, /original\.route/);
  assert.match(html, /verified\.candidate/);
  assert.match(html, /decision\.receipt/);
  assert.match(html, /Protect names, numbers, URLs, code, quotes, IDs/);
  assert.match(html, /Compile a compact-English candidate/);
  assert.match(html, /local-only · prompts not persisted/);
  assert.match(html, /git clone https:\/\/github\.com\/Angadslr\/Token-Optimizer\.git/);
  assert.doesNotMatch(html, /Cross-Lingual Token Optimization/i);
  assert.doesNotMatch(html, /The shortest prompt may be in another language/i);
  assert.doesNotMatch(html, /Try it in Codex/i);
  assert.doesNotMatch(html, /38%|34%|MVP/i);
  assert.doesNotMatch(html, /InteractiveWavesBackground|hero-waves|Instrument_Serif|c7ff9f/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|PRODFLOW|Inquire Now|Lorem ipsum/i);
});

test("renders the engineering-brief reader journey without lime-kit sections", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Chinese, Arabic, Turkish, and Japanese/);
  assert.match(html, /protects exact values, produces a compact-English candidate/);
  assert.match(html, /process_batch/);
  assert.match(html, /ERR-2048/);
  assert.match(html, /approve\(candidate\)/);
  assert.match(html, /Send the winner, or the original/);
  assert.match(html, /does not claim lossless translation/);
  assert.match(html, /High-stakes prompts are not transformed in v1/);
  assert.match(html, /4271 exact tokens/);
  assert.match(html, /2440 exact tokens/);
  assert.match(html, /original\.route/);
  assert.match(html, /verified\.candidate/);
  assert.match(html, /project\.path/);
  assert.match(html, /codex\.model/);
  assert.match(html, /optimize\.language/);
  assert.match(html, /Cropped view of a longer prompt/);
  assert.doesNotMatch(html, /operator-console-screenshot\.png/);
  assert.ok(html.indexOf('id="receipt"') < html.indexOf('id="method"'));
  assert.ok(html.indexOf('id="method"') < html.indexOf('id="instrument"'));
  assert.ok(html.indexOf('id="instrument"') < html.indexOf('id="boundaries"'));
  assert.ok(html.indexOf('id="boundaries"') < html.indexOf('id="output-policy"'));
  assert.ok(html.indexOf('id="output-policy"') < html.indexOf('id="install"'));
  assert.match(html, /Less narration\. Same requirements\./);
  assert.match(html, /optimize\.output/);
  assert.match(html, /model_verbosity: low/);
  assert.match(html, /agentic_coding/);
  assert.match(html, /SlashToken never rewrites a completed answer/);
  assert.match(html, /Made-up example for illustration/);
  assert.doesNotMatch(html, /CROSS-LANGUAGE COMPILER|Same request\.|Different token bill/i);
  assert.doesNotMatch(html, /Average input-token savings|Also reduces output waste|diagram-node|node-number/i);
});

test("server-renders complete beginner installation documentation", async () => {
  const response = await render("/docs");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SlashToken Docs — Install locally<\/title>/i);
  assert.match(html, /Install SlashToken locally/);
  assert.match(html, /Show commands for/);
  assert.match(html, /role="tab"[^>]*aria-selected="true"[^>]*>\s*macOS/i);
  assert.match(html, /Windows · PowerShell/);
  assert.match(html, /git clone https:\/\/github\.com\/Angadslr\/Token-Optimizer\.git/);
  assert.match(html, /\.venv\/bin\/python -m pip install -e/);
  assert.match(html, /\.\\\.venv\\Scripts\\python\.exe -m pip install -e/);
  assert.match(html, /NVIDIA_API_KEY/);
  assert.match(html, /docs\.api\.nvidia\.com\/nim\/re\/docs\/api-quickstart/);
  assert.match(html, /05A \/ Approval UI/);
  assert.match(html, /05B \/ MCP/);
  assert.match(html, /Choose how to try SlashToken/);
  assert.match(html, /Local UI connected to Codex/);
  assert.match(html, /See and approve a shorter multilingual prompt before Codex receives it/);
  assert.match(html, /Use SlashToken inside Codex/);
  assert.match(html, /Multilingual transformation is unavailable here/);
  assert.match(html, /can only reduce unnecessary redundancy in tasks/);
  assert.match(html, /MCP does not intercept the current prompt/);
  assert.match(html, /cannot reduce the input tokens consumed by the current Codex turn/);
  assert.match(html, /Adjust reasoning effort and Codex defaults/);
  assert.match(html, /model_reasoning_effort = &quot;high&quot;/);
  assert.match(html, /Settings → Configuration → Open config\.toml/);
  assert.match(html, /approval_policy = &quot;on-request&quot;/);
  assert.match(html, /sandbox_mode = &quot;workspace-write&quot;/);
  assert.match(html, /pre-send optimization path for Codex/);
  assert.match(html, /separate request to SlashToken(?:&apos;|&#x27;)s configured NVIDIA\/DeepSeek provider/);
  assert.match(html, /does not replace or rewrite the prompt already submitted to Codex/);
  assert.match(html, /https:\/\/learn\.chatgpt\.com\/docs\/glossary/);
  assert.match(html, /https:\/\/learn\.chatgpt\.com\/docs\/extend\/mcp/);
  assert.match(html, /codex mcp add slashtoken/);
  assert.match(html, /analyze_prompt/);
  assert.match(html, /Coming soon/);
  assert.match(html, /Resolve common setup problems/);
  assert.match(html, /currently documents as experimental/);
  assert.match(html, /aria-label="Copy macOS · Terminal commands"/);
  assert.doesNotMatch(html, /EARLY MVP DOCUMENTATION|Instrument_Serif|c7ff9f/i);
  assert.doesNotMatch(html, /ON THIS PAGE/);
  assert.doesNotMatch(html, /Choose either workflow/);
});

test("documentation navigation targets real sections", async () => {
  const response = await render("/docs");
  const html = await response.text();
  const sectionIds = [
    "quickstart",
    "prerequisites",
    "install",
    "api-key",
    "choose-path",
    "approval-ui",
    "mcp",
    "codex-config",
    "codex-setup-prompt",
    "verify",
    "troubleshooting",
  ];

  for (const id of sectionIds) {
    assert.match(html, new RegExp(`href="#${id}"`, "i"));
    assert.match(html, new RegExp(`id="${id}"`, "i"));
  }

  assert.match(html, /aria-current="page"[^>]*>Docs/i);
});
