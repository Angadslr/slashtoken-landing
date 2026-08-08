import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished SlashToken landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SlashToken<\/title>/i);
  assert.doesNotMatch(html, /Cross-Lingual Token Optimization/i);
  assert.match(html, /The shortest prompt may be in another language\.\.\./);
  assert.match(html, /Multilingual prompts, fewer tokens\./);
  assert.match(html, /Same request/);
  assert.match(html, /Different token bill/);
  assert.match(html, /Angadslr\/Token-Optimizer/);
  assert.match(html, /Inspect the source/);
  assert.match(html, /href="\/docs"[^>]*>Docs</i);
  assert.match(html, /href="\/docs"[^>]*class="header-docs-link"/i);
  assert.doesNotMatch(html, /aria-label="Primary navigation"|aria-controls="mobile-navigation"/i);
  assert.match(html, /href="\/docs#quickstart"[^>]*>\s*Try it in Codex/i);
  assert.doesNotMatch(html, /Explore the repository/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|PRODFLOW|Inquire Now|Lorem ipsum/i);
});

test("renders the multilingual-first reader journey and real repository links", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /https:\/\/github\.com\/Angadslr\/Token-Optimizer/);
  assert.match(html, /Validation gates/);
  assert.match(html, /38%/);
  assert.match(html, /Average input-token savings/);
  assert.match(html, /OBSERVED IN EARLY MVP TESTS/);
  assert.match(html, /34%/);
  assert.match(html, /OBSERVED IN EARLY MVP TESTS/);
  assert.match(html, /projects with more than 10 million output tokens/i);
  assert.match(html, /Results vary by model, language/);
  assert.doesNotMatch(html, /30%/);
  assert.match(html, /Initial source languages/);
  assert.match(html, /internal representation can change language/i);
  assert.match(html, /id="optimization-flow"/i);
  assert.match(html, /CROSS-LANGUAGE COMPILER/i);
  assert.match(html, /PROTECTED-VALUE BYPASS/);
  assert.match(html, /Meaning is verified/);
  assert.match(html, /id="output-efficiency"/i);
  assert.match(html, /Secondary capability/);
  assert.match(html, /Also reduces output waste/);
  assert.ok(html.indexOf('id="how-it-works"') < html.indexOf('id="optimization-flow"'));
  assert.ok(html.indexOf('id="optimization-flow"') < html.indexOf('id="output-efficiency"'));
  assert.ok(html.indexOf('id="output-efficiency"') < html.indexOf('id="open-source"'));
  assert.doesNotMatch(html, /model_verbosity|developerInstructions|CHATBOT_OUTPUT_POLICY/);
  assert.doesNotMatch(html, /Product principles|Developer surfaces/i);
  assert.doesNotMatch(html, /Original route selected|02 \/ FALLBACK|id="evidence"/i);
});

test("server-renders complete beginner installation documentation", async () => {
  const response = await render("/docs");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SlashToken Docs — Install the MVP<\/title>/i);
  assert.match(html, /EARLY MVP DOCUMENTATION/);
  assert.match(html, /Install SlashToken\./);
  assert.match(html, /SHOW COMMANDS FOR/);
  assert.match(html, /role="tab"[^>]*aria-selected="true"[^>]*>\s*macOS/i);
  assert.match(html, /Windows · PowerShell/);
  assert.match(html, /git clone https:\/\/github\.com\/Angadslr\/Token-Optimizer\.git/);
  assert.match(html, /\.venv\/bin\/python -m pip install -e/);
  assert.match(html, /\.\\\.venv\\Scripts\\python\.exe -m pip install -e/);
  assert.match(html, /NVIDIA_API_KEY/);
  assert.match(html, /docs\.api\.nvidia\.com\/nim\/re\/docs\/api-quickstart/);
  assert.match(html, /05A \/ APPROVAL UI/);
  assert.match(html, /05B \/ MCP/);
  assert.match(html, /Choose how to try the MVP/);
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
  assert.match(html, /Coming soon\./);
  assert.match(html, /Resolve common setup problems/);
  assert.match(html, /currently documents as experimental/);
  assert.match(html, /aria-label="Copy macOS · Terminal commands"/);
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

  assert.doesNotMatch(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /aria-current="page"[^>]*>Docs/i);
});
