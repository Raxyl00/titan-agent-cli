# TITAN Codebase Bundle

This file contains the complete codebase of the TITAN project.

## File: `package.json`

```json
{
  "name": "titan-agent-cli",
  "version": "0.2.3",
  "description": "Unified token compression framework for LLM agents. Three orthogonal layers: Linguistic (L1), Structural (L2), Contextual (L3). Universal compatibility across 9+ AI coding agents.",
  "main": "src/cli.js",
  "bin": {
    "titan": "bin/titan.js",
    "titan-filter": "src/filter.js"
  },
  "scripts": {
    "test": "node --test tests/*.test.js",
    "filter:test": "node src/filter.js --test",
    "count-tokens": "node scripts/count-tokens.js"
  },
  "keywords": [
    "llm",
    "agent",
    "compression",
    "token",
    "caveman",
    "ponytail",
    "titan",
    "claude",
    "cursor",
    "copilot",
    "windsurf",
    "cline",
    "kiro",
    "aider",
    "antigravity"
  ],
  "author": "Matteo Fiorini",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "files": [
    "bin/",
    "src/",
    "skills/",
    "LICENSE",
    "README.md"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Raxyl00/titan-agent-cli.git"
  }
}
```

---

## File: `README.md`

```markdown
<p align="center">
  <img src="logo.png" width="400" />
</p>

<h1 align="center">TITAN</h1>

<p align="center">
  <strong>Token Intelligence Through Agent Narrowing</strong>
</p>

<p align="center">
  <em>Unified token compression framework for AI coding agents. Cut token usage by 70-85% across L1, L2, and L3 layers.</em>
</p>

<p align="center">
  <a href="https://github.com/Raxyl00/titan-agent-cli/stargazers"><img src="https://badgen.net/github/stars/Raxyl00/titan-agent-cli?color=yellow" alt="Stars"></a>
  <a href="https://www.npmjs.com/package/titan-agent-cli"><img src="https://img.shields.io/npm/v/titan-agent-cli?style=flat&color=blue" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/titan-agent-cli"><img src="https://img.shields.io/npm/dm/titan-agent-cli?style=flat&color=green" alt="Downloads"></a>
  <a href="LICENSE"><img src="https://badgen.net/github/license/Raxyl00/titan-agent-cli?color=blue" alt="License"></a>
</p>

<p align="center">
  <a href="#-before--after">Before / After</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-the-three-layers">The Three Layers</a> •
  <a href="#-cli-reference">CLI Reference</a> •
  <a href="#-supported-agents">Supported Agents</a> •
  <a href="#-credits">Credits</a>
</p>

---

**TITAN** integrates, optimizes, and extends the two most powerful prompt-compression philosophies into a single, unified, zero-dependency utility. It ports **L1 Linguistic Compression** (from Caveman) and **L2 Structural Code Compression** (from Ponytail) natively to **9+ major AI coding agents**, adding a contextual **L3 layer** (filtering, compression of static memory, and terminal output processing).

```
┌──────────────────────────────────────────┐
│  TOKENS SAVED               ████████ 82% │
│  REASONING & SYNTAX         ████████ 100%│
│  RESPONSE SPEED             ████████ ~3x │
│  UNIVERSAL COMPATIBILITY    ████████ 9 IDE│
└──────────────────────────────────────────┘
```

---

## 🔄 Before / After

<table>
<tr>
<td width="50%">

### 🗣️ Standard Agent Output (301 tokens)

> "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by a race condition in the authentication middleware. I've actually just noticed that the problem is probably related to the fact that you're basically creating a new database connection on every request, rather than utilizing a connection pool. This is really a very common issue that developers encounter. 
> 
> Here's what I'd recommend:
> ```javascript
> const pool = new Pool({ max: 20 });
> ```
> To implement this, you should probably take into account that you'll likely want to make sure that the pool size is appropriate for your workload."

</td>
<td width="50%">

### 🛡️ TITAN Lite Output (75 tokens)

> ```javascript
> const pool = new Pool({ max: 20 });
> // ponytail: connection pooling, default size
> ```
> Race condition in auth middleware. Created new database connection on each request.
> 
> skipped: dynamic pool scaling. Add if workload fluctuates.

</td>
</tr>
</table>

**Same functionality. 75% fewer tokens. Zero overhead.**

---

## ⚡ Quick Start

Install TITAN globally and initialize the rules for your favorite editor in 10 seconds.

```bash
# Install the CLI tool
npm install -g titan-agent-cli

# Generate TITAN rules for Cursor (.cursor/rules/titan.mdc)
titan init --agent=cursor

# Or generate for Copilot (.github/copilot-instructions.md)
titan init --agent=copilot

# Generate a lightweight version (~620 tokens, perfect for short chats)
titan init --agent=cursor --lite

# Generate the default balanced version (~1480 tokens, standard features)
# Note: balanced mode is the default and does not require a flag
titan init --agent=cursor

# Generate an aggressive telegraphese version (~430 tokens, maximum compression)
titan init --agent=cursor --aggressive
```

---

## 🧱 The Three Layers

TITAN compresses token footprint across three independent vectors that compose multiplicatively (theoretical maximum):

```
Total Savings = 1 - (0.90 × 0.30 × 0.60) = 83.8%
```

### 1. L1: Linguistic Compression (Caveman Engine)
Instructs the LLM to drop fillers, pleasantries, articles, and hedging. It forces a terse `[thing] [action] [reason]. [next step].` grammar.
* **Preserves**: code blocks, URLs, file paths, technical names, and error logs exactly.
* **Synonym compression**: preferring "use" over "utilize", "fix" over "implement a solution for".

### 2. L2: Structural Code Compression (Ponytail Lazy Ladder)
A 6-rung logical ladder traversed by the agent before writing any new code:
1. **YAGNI**: Does it need to exist? If not, skip.
2. **Stdlib**: Standard library does it? Use it.
3. **Native**: Platform native feature? Use it.
4. **Existing**: Installed dependency already covers it? Use it.
5. **One Line**: Can it be written on a single line? One line.
6. **Minimum**: Only then: minimum working code.

*All structural simplifications are documented with inline comments: `// ponytail: <ceiling>, <upgrade path>`.*

### 3. L3: Contextual Compression (TITAN Core)
* **Memory Files**: Use `titan compress CLAUDE.md` to post-hoc compress project instructions, saving up to 45% input tokens on every turn.
* **Terminal Stream Filtering**: Pipe build logs through `titan filter` to strip npm/Vite startup warnings, huskylogs, and collapse long stack traces to error header + first relevant app frame.
* **Subagent Terse-Wrapping**: Compresses subagent prompts and inputs to prevent context window clogging.

---

## 🛠️ CLI Reference

TITAN CLI is written in pure Node.js standard library with **zero external dependencies** — aligned with our L2 philosophy.

```bash
# Initialize TITAN rules for an agent
titan init --agent=<name> [--lite|--balanced|--aggressive]

# Generate rule files for ALL compatible agents in the directory
titan init --all [--lite|--balanced|--aggressive]

# Compress a static Markdown file (L3 contextual compression)
titan compress CLAUDE.md

# Scan the codebase for ponytail: comments to audit tech debt
titan debt [--dir=<path>]

# Stream filter to strip terminal/build noise (saving statistics are logged automatically)
npm run build 2>&1 | titan filter

# Show beautiful context token savings dashboard and cost report
titan report

# Reset accumulated savings report
titan report --reset

# Run local or API-based token savings benchmark
titan benchmark

# Run the test suite
titan test
```

---

## 🔌 Supported Agents

TITAN adapts its output format dynamically to match the specific rules and structure of each tool.

| Agent | Command | Generated File | Format |
|---|---|---|---|
| **Claude Code** | `titan init --agent=cloudcode` | `.claude/skills/titan/titan-core.md` | Plain Markdown |
| **Cursor** | `titan init --agent=cursor` | `.cursor/rules/titan.mdc` | MDC Frontmatter + Markdown |
| **GitHub Copilot** | `titan init --agent=copilot` | `.github/copilot-instructions.md` | H2 shifted Markdown |
| **Windsurf** | `titan init --agent=windsurf` | `.windsurf/rules/titan.md` | Metadata-wrapped Markdown |
| **Cline** | `titan init --agent=cline` | `.clinerules/titan.md` | Plain Markdown |
| **Kiro** | `titan init --agent=kiro` | `.kiro/skills/titan/SKILL.md` | Skill-spec Markdown |
| **Aider** | `titan init --agent=aider` | `CONVENTIONS.md` | Conventions Markdown |
| **Antigravity** | `titan init --agent=antigravity` | `.antigravity/skills/titan.md` | Plain Markdown |
| **Generic** | `titan init --agent=generic` | `system-prompt.md` | System Prompt Markdown |

---

## 📊 Cognitive Benchmark & UID (Usable Intelligence Density)

To ensure that prompt compression doesn't degrade the agent's reasoning capabilities, TITAN includes a built-in multi-task evaluation framework. Run the benchmark to audit three distinct developer skills: **Coding (Product Filter)**, **Debugging (Circular Dependency)**, and **Logic (Surgeon Riddle)**.

### How to Run & Reproduce
The benchmark can be run in mock simulation mode or via actual LLM provider APIs:
```bash
# Run in mock mode (using illustrative demonstration values)
titan benchmark

# Run real empirical tests via API keys (runs 3 times per task, throttled at 500ms sleep)
ANTHROPIC_API_KEY=sk-... titan benchmark
# or
OPENAI_API_KEY=sk-... titan benchmark
```
> [!NOTE]
> The target model is configurable via `TITAN_BENCH_MODEL`. The default model for Anthropic is `claude-sonnet-4-6`, while for OpenAI it is `gpt-4o-mini`.

### Evaluation Metrics & UID
It evaluates the **Usable Intelligence Density (UID)**:
```
UID = (Avg Accuracy % / Avg Output Tokens) * 1000
```
This represents the reasoning throughput preserved per token of context.

> [!IMPORTANT]
> ⚠ Mock mode data — non-empirical (the table below is from simulated demonstration data, used when APIs are not active).
> Caveman and Ponytail values serve as baseline comparisons for upstream components integrated into TITAN.

| Variant | Coding | Debug | Logic | Refact | Review | Avg Score % | Avg In Tok | Avg Out Tok | Avg Tot Tok | UID (Density) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Baseline** | 100% | 100% | 100% | 100% | 100% | 100% ±0% | 50 ±0 | 198 ±8 | 248 ±8 | 403.2 | Reliable |
| **Caveman** | 100% | 100% | 100% | 100% | 100% | 100% ±0% | 120 ±0 | 78 ±5 | 198 ±5 | 505.1 | Reliable |
| **Ponytail** | 100% | 70% | 80% | 100% | 80% | 86% ±12% | 115 ±0 | 67 ±6 | 182 ±6 | 472.5 | Reliable |
| **TITAN Balanced** | 100% | 100% | 100% | 100% | 100% | 100% ±0% | 1500 ±0 | 80 ±5 | 1580 ±5 | 63.3 | Reliable |
| **TITAN Lite** | 100% | 100% | 100% | 100% | 100% | 100% ±0% | 425 ±0 | 91 ±7 | 516 ±7 | 193.8 | Reliable |
| **TITAN Aggressive** | 95% | 80% | 60% | 90% | 70% | 79% ±12% | 400 ±0 | 50 ±3 | 450 ±3 | 175.6 | ⚠ Degraded |

* **Balanced/Lite**: Maximize token density while retaining a flat 100% cognitive success rate.
* **Aggressive**: Telegraphic mode. Achieves high density (~50 tokens output per response), but logic reasoning starts to degrade on complex tasks.

---

## 📊 Implementation Status

The framework is partially implemented according to the core architectural vision:

* ✅ **L1 Linguistic Compression (Caveman Engine)**: Fully implemented in `src/compress.js` and prompt structures.
* ✅ **L3 Contextual Compression (filter, compress, adapters)**: CLI filters, file compression, and 9+ agent adapters are functional.
* ❌ **L2 Master Prompt (Runtime Auto-injection)**: Not implemented (master prompts are compiled statically; no dynamic runtime agent proxying).
* ❌ **Auto-Clarity Runtime**: Only prompt-level instructions exist; there is no runtime execution interception.
* ❌ **Context Window Manager**: Planned for future releases (dynamic slot allocation and window pruning).

---

## 🔒 Safety & Auto-Clarity Override

TITAN does not compromise safety. Compression is automatically suspended when:
* **Security warnings** or CVEs are being addressed (requires full explanation).
* **Destructive operations** (e.g., `rm -rf`, database `DROP`/`DELETE`) are executed.
* **Multi-step setup sequences** where ordering is critical are presented.
* The user asks to clarify or repeats a question.

---

## 📜 Credits

TITAN is built on the shoulders of giants. It integrates and ports the research of:
* [Ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert (Structural L2 rules).
* [Caveman](https://github.com/juliusbrussee/caveman) by Julius Brussee (Linguistic L1 rules).

---

## ⚠️ Disclaimer

If it breaks, costs you money, or causes issues, it's on you. Check the LICENSE.

---

## 📄 License

MIT
```

---

## File: `bin/titan.js`

```javascript
#!/usr/bin/env node
'use strict';

const { main } = require('../src/cli');
main(process.argv);
```

---

## File: `src/cli.js`

```javascript
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { initAgent, initAll, listAgents, ADAPTER_IDS } = require('./init');

const VERSION = require('../package.json').version;

/**
 * Extract --flag=value from args array.
 */
function getFlag(args, flag) {
  for (const arg of args) {
    if (arg.startsWith(flag + '=')) {
      return arg.slice(flag.length + 1);
    }
  }
  return null;
}

function printHelp() {
  const lines = [
    '',
    `  TITAN v${VERSION} — Token Intelligence Through Agent Narrowing`,
    '',
    '  Usage:',
    '    titan init --agent=<name> [--lite|--balanced|--aggressive]  Generate skill file',
    '    titan init --all [--lite|--balanced|--aggressive]           Generate skill files for all agents',
    '    titan init --list                                           List available agents',
    '    titan compress <file>                                       Compress a memory/context file (L3)',
    '    titan debt [--dir=<path>]                                   Scan for ponytail: comments',
    '    titan filter                                                Stdin/stdout terminal output filter',
    '    titan filter --test                                         Run filter self-test',
    '    titan benchmark                                             Run L1/L2/L3 token savings benchmark',
    '    titan test                                                  Run the test suite',
    '    titan report [--reset]                                      Display ANSI savings dashboard',
    '    titan help                                                  Show this help',
    '    titan version                                               Show version',
    '',
    '  Agents:',
  ];

  for (const agent of listAgents()) {
    lines.push(`    ${agent.id.padEnd(14)} → ${agent.path}`);
  }

  lines.push('');
  console.log(lines.join('\n'));
}

function printVersion() {
  console.log(`titan-agent v${VERSION}`);
}

function cmdInit(args) {
  const masterPath = path.join(__dirname, '..', 'skills', 'master.md');
  if (!fs.existsSync(masterPath)) {
    console.warn('Warning: skills/master.md does not exist. Third-party adapters may fail to generate.');
  }

  const targetDir = getFlag(args, '--dir') || process.cwd();
  const isLite = args.includes('--lite');
  const isAggressive = args.includes('--aggressive');
  const initOptions = { lite: isLite, aggressive: isAggressive };

  let modeName = 'BALANCED';
  if (isLite) modeName = 'LITE';
  if (isAggressive) modeName = 'AGGRESSIVE';

  // List agents
  if (args.includes('--list')) {
    console.log('\nAvailable agents:\n');
    for (const agent of listAgents()) {
      console.log(`  ${agent.id.padEnd(14)} ${agent.description}`);
      console.log(`  ${''.padEnd(14)} → ${agent.path}\n`);
    }
    return;
  }

  // All agents
  if (args.includes('--all')) {
    console.log(`\nGenerating TITAN ${modeName} skills for all agents in: ${targetDir}\n`);
    const results = initAll(targetDir, initOptions);

    for (const r of results) {
      if (r.success) {
        console.log(`  ✓ ${r.agentId.padEnd(14)} → ${r.path}`);
        if (r.warning) console.log(`    ⚠ ${r.warning}`);
      } else {
        console.log(`  ✗ ${r.agentId.padEnd(14)} → ${r.error}`);
      }
    }

    const ok = results.filter(r => r.success).length;
    console.log(`\n  ${ok}/${results.length} agents generated.\n`);
    return;
  }

  // Single agent
  const agentId = getFlag(args, '--agent');
  if (!agentId) {
    console.error('Error: specify --agent=<name> or --all');
    console.error(`Available agents: ${ADAPTER_IDS.join(', ')}`);
    process.exit(1);
  }

  if (!ADAPTER_IDS.includes(agentId)) {
    console.error(`Error: unknown agent "${agentId}"`);
    console.error(`Available agents: ${ADAPTER_IDS.join(', ')}`);
    process.exit(1);
  }

  try {
    const result = initAgent(agentId, targetDir, initOptions);
    console.log(`\n  ✓ ${agentId} → ${result.path} (${modeName})\n`);
    if (result.warning) console.log(`  ⚠ ${result.warning}\n`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function cmdCompress(args) {
  const file = args[0];
  if (!file) {
    console.error('Error: specify a file to compress');
    console.error('Usage: titan compress <file.md>');
    process.exit(1);
  }

  const { compressFile } = require('./compress');
  try {
    const result = compressFile(file);
    console.log(`\n  File: ${file}`);
    console.log(`  Original:   ${result.originalTokens} tokens`);
    console.log(`  Compressed: ${result.compressedTokens} tokens`);
    console.log(`  Savings:    ${result.savings}% (${result.savedTokens} tokens)`);
    console.log(`  Backup:     ${result.backupPath}\n`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function cmdDebt(args) {
  const targetDir = getFlag(args, '--dir') || process.cwd();
  const noUpgrade = args.includes('--no-upgrade');

  const { scanDebt } = require('./debt');
  const results = scanDebt(targetDir, { noUpgradeOnly: noUpgrade });

  if (results.length === 0) {
    console.log('\n  No ponytail: comments found.\n');
    return;
  }

  console.log(`\n  Found ${results.length} ponytail: debt item(s):\n`);
  for (const item of results) {
    const upgradeIcon = item.upgradePath ? '↑' : '⚠';
    console.log(`  ${upgradeIcon} ${item.file}:${item.line}`);
    console.log(`    ceiling: ${item.ceiling}`);
    if (item.upgradePath) {
      console.log(`    upgrade: ${item.upgradePath}`);
    } else {
      console.log(`    upgrade: (none specified)`);
    }
    console.log('');
  }
}

function cmdFilter(args) {
  // Delegate to filter module
  if (args.includes('--test')) {
    const { selfTest } = require('./filter');
    selfTest();
  } else {
    const { streamMode } = require('./filter');
    streamMode();
  }
}

async function cmdBenchmark(args) {
  const { runBenchmark } = require('./benchmark');
  try {
    await runBenchmark();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function cmdTest(args) {
  const { spawnSync } = require('child_process');
  const testsDir = path.join(__dirname, '..', 'tests');
  
  const testFiles = fs.readdirSync(testsDir)
    .filter(file => file.endsWith('.test.js'))
    .map(file => path.join(testsDir, file));
    
  if (testFiles.length === 0) {
    console.log('\nNo tests found.\n');
    return;
  }

  console.log(`\nRunning test suite: ${testFiles.length} files...\n`);
  const result = spawnSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function cmdReport(args) {
  const os = require('os');
  const fs = require('fs');
  const path = require('path');

  const homeDir = os.homedir();
  const statsFile = path.join(homeDir, '.titan', 'stats.json');

  if (args.includes('--reset')) {
    const defaultStats = {
      totalLinesFiltered: 0,
      totalCharsSaved: 0,
      totalTokensSaved: 0,
      runsCount: 0
    };
    try {
      fs.writeFileSync(statsFile, JSON.stringify(defaultStats, null, 2), 'utf8');
      console.log('\n  ✓ Savings statistics have been reset.\n');
    } catch (e) {
      console.error(`Error resetting stats: ${e.message}`);
    }
    return;
  }

  let stats = {
    totalLinesFiltered: 0,
    totalCharsSaved: 0,
    totalTokensSaved: 0,
    runsCount: 0
  };

  if (fs.existsSync(statsFile)) {
    try {
      stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    } catch (e) {
      // standard fallback
    }
  }

  const costSaved = (stats.totalTokensSaved || 0) * 0.000003;

  console.log('\n  ┌────────────────────────────────────────────────────────┐');
  console.log('  │   TITAN Context Savings Dashboard                      │');
  console.log('  └────────────────────────────────────────────────────────┘');
  console.log(`    Active Runs Tracked:   ${(stats.runsCount || 0).toString().padStart(6)}`);
  console.log(`    Total Lines Filtered:  ${(stats.totalLinesFiltered || 0).toString().padStart(6)}`);
  console.log(`    Characters Compressed: ${(stats.totalCharsSaved || 0).toString().padStart(6)}`);
  console.log(`    Estimated Tokens Saved: ${(stats.totalTokensSaved || 0).toString().padStart(6)}`);
  console.log(`    Financial Savings:     $${costSaved.toFixed(4)}`);
  console.log('  ┌────────────────────────────────────────────────────────┐');

  const tokens = stats.totalTokensSaved || 0;
  let level = 0;
  if (tokens > 0) level = Math.min(25, Math.ceil(tokens / 500));
  const bar = '█'.repeat(level) + '░'.repeat(25 - level);
  console.log(`    Performance Tier:     [${bar}] ${tokens} saved`);
  console.log('  └────────────────────────────────────────────────────────┘\n');
}

/**
 * Main CLI entry point.
 */
function main(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const subArgs = args.slice(1);

  switch (command) {
    case 'init':
      cmdInit(subArgs);
      break;
    case 'compress':
      cmdCompress(subArgs);
      break;
    case 'debt':
      cmdDebt(subArgs);
      break;
    case 'filter':
      cmdFilter(subArgs);
      break;
    case 'benchmark':
      cmdBenchmark(subArgs);
      break;
    case 'test':
      cmdTest(subArgs);
      break;
    case 'report':
      cmdReport(subArgs);
      break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      printHelp();
      break;
    case 'version':
    case '--version':
    case '-v':
      printVersion();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

module.exports = { main };
```

---

## File: `src/init.js`

```javascript
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// All available adapters
const ADAPTER_IDS = [
  'cloudcode', 'cursor', 'copilot', 'windsurf',
  'cline', 'kiro', 'aider', 'antigravity', 'generic',
];

/**
 * Load an adapter module by agent ID.
 */
function loadAdapter(agentId) {
  const adapterPath = path.join(__dirname, '..', 'skills', 'adapters', `${agentId}.js`);
  if (!fs.existsSync(adapterPath)) {
    throw new Error(`Unknown agent: ${agentId}. Available: ${ADAPTER_IDS.join(', ')}`);
  }
  return require(adapterPath);
}

/**
 * Read the master SKILL.md content.
 */
function readMaster(options = {}) {
  let filename = 'master.md';
  if (options.lite) {
    filename = 'master-lite.md';
  } else if (options.aggressive) {
    filename = 'master-aggressive.md';
  }
  const masterPath = path.join(__dirname, '..', 'skills', filename);
  if (!fs.existsSync(masterPath)) {
    throw new Error(`Master skill file not found: ${masterPath}`);
  }
  return fs.readFileSync(masterPath, 'utf8');
}

/**
 * Ensure directory exists (mkdir -p).
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Initialize TITAN skill for a specific agent.
 * Returns { path, warning? } for the generated file.
 */
function initAgent(agentId, targetDir, options = {}) {
  const adapter = loadAdapter(agentId);
  const master = readMaster(options);
  const content = adapter.transform(master);

  // Handle adapters with custom output path logic (e.g., aider)
  let outputPath = adapter.OUTPUT_PATH;
  let warning = null;

  if (adapter.getOutputPath) {
    const result = adapter.getOutputPath(targetDir);
    outputPath = result.path;
    warning = result.warning;
  }

  const fullPath = path.join(targetDir, outputPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, 'utf8');

  return { path: outputPath, warning };
}

/**
 * Initialize TITAN for all agents.
 * Returns array of { agentId, path, warning? }.
 */
function initAll(targetDir, options = {}) {
  const results = [];

  for (const agentId of ADAPTER_IDS) {
    try {
      const result = initAgent(agentId, targetDir, options);
      results.push({ agentId, ...result, success: true });
    } catch (err) {
      results.push({ agentId, success: false, error: err.message });
    }
  }

  return results;
}

/**
 * List all available adapters with descriptions.
 */
function listAgents() {
  return ADAPTER_IDS.map(id => {
    const adapter = loadAdapter(id);
    return {
      id: adapter.AGENT_ID,
      path: adapter.OUTPUT_PATH,
      description: adapter.DESCRIPTION,
    };
  });
}

module.exports = { initAgent, initAll, listAgents, ADAPTER_IDS };
```

---

## File: `src/compress.js`

```javascript
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// --- L1 Compression Rules ---
// Each rule: { name, pattern, replacement }
// Applied to prose sections only. Code blocks are preserved.

const STRIP_RULES = [
  // === PHASE 1: Sentence-level removals (most impactful, do first) ===

  // Full pleasantry sentences — remove entire sentences
  { name: 'pleasantry-sentences', pattern: /(?:^|(?<=\. |\! |\n))(?:Sure!?|Certainly!?|Of course!?|Absolutely!?|Great question!?|Good question!?)\s*/gim, replacement: '' },
  { name: 'happy-to-help', pattern: /I'?d be happy to help[^.!]*[.!]?\s*/gi, replacement: '' },
  { name: 'love-to-help', pattern: /I'?d love to help[^.!]*[.!]?\s*/gi, replacement: '' },
  { name: 'happy-to-any', pattern: /Happy to help[^.!]*[.!]?\s*/gi, replacement: '' },
  { name: 'glad-to', pattern: /Glad to help[^.!]*[.!]?\s*/gi, replacement: '' },
  { name: 'let-me-walk', pattern: /Let me walk you through[^.!]*[.!]?\s*/gi, replacement: '' },
  { name: 'let-me-explain', pattern: /Let me explain[^.!]*[.!]?\s*/gi, replacement: '' },
  { name: 'here-what-happening', pattern: /Here'?s? what'?s? happening[^.!:]*[.!:]?\s*/gi, replacement: '' },
  { name: 'ive-noticed', pattern: /I'?ve (?:actually |just )?noticed that /gi, replacement: '' },
  { name: 'ive-implemented', pattern: /I'?ve implemented a solution for /gi, replacement: 'Fixed ' },

  // === PHASE 2: Verbose multi-word phrases (before word-level to avoid partial matches) ===

  { name: 'verbose-due-to-fact', pattern: /\bdue to the fact that\b/gi, replacement: 'because' },
  { name: 'verbose-in-order-to', pattern: /\bin order to\b/gi, replacement: 'to' },
  { name: 'verbose-at-this-point', pattern: /\bat this point in time\b/gi, replacement: 'now' },
  { name: 'verbose-at-this-point2', pattern: /\bat this point\b/gi, replacement: 'now' },
  { name: 'verbose-make-sure', pattern: /\bmake sure that\b/gi, replacement: 'ensure' },
  { name: 'verbose-make-sure2', pattern: /\bmake sure\b/gi, replacement: 'ensure' },
  { name: 'verbose-take-into', pattern: /\btake into account\b/gi, replacement: 'consider' },
  { name: 'verbose-take-into2', pattern: /\btake into consideration\b/gi, replacement: 'consider' },
  { name: 'verbose-implement-solution', pattern: /\bimplement a solution for\b/gi, replacement: 'fix' },
  { name: 'verbose-implement-solution2', pattern: /\bimplemented a solution for\b/gi, replacement: 'fixed' },
  { name: 'verbose-related-to-fact', pattern: /\brelated to the fact that\b/gi, replacement: 'because' },
  { name: 'verbose-caused-by-fact', pattern: /\bcaused by the fact that\b/gi, replacement: 'because' },
  { name: 'verbose-rather-than', pattern: /\brather than\b/gi, replacement: 'not' },
  { name: 'verbose-in-the-long-run', pattern: /\bin the long run\b/gi, replacement: 'long-term' },
  { name: 'verbose-on-every', pattern: /\bon every\b/gi, replacement: 'each' },
  { name: 'verbose-each-render-cycle', pattern: /\beach render cycle\b/gi, replacement: 'render' },
  { name: 'verbose-here-is-what', pattern: /\bhere'?s? what I'?d recommend:?\s*/gi, replacement: '' },
  { name: 'verbose-following-considerations', pattern: /\bthe following considerations:?\s*/gi, replacement: 'this:' },
  { name: 'verbose-significantly-improved', pattern: /\bsignificantly improved\b/gi, replacement: 'faster' },
  { name: 'verbose-straightforward', pattern: /\bquite straightforward\b/gi, replacement: 'simple' },

  // === PHASE 3: Word-level replacements ===

  { name: 'verbose-utilize', pattern: /\butiliz(?:e|es|ed|ing)\b/gi, replacement: (m) => m.startsWith('U') || m.startsWith('u') ? m.replace(/utiliz/i, 'us').replace(/izing/i, 'ing').replace(/ized/i, 'ed').replace(/izes/i, 'es').replace(/ize/i, 'e') : m },
  { name: 'verbose-extensive', pattern: /\bextensive\b/gi, replacement: 'big' },
  { name: 'verbose-functionality', pattern: /\bfunctionality\b/gi, replacement: 'feature' },
  { name: 'verbose-straightforward2', pattern: /\bstraightforward\b/gi, replacement: 'simple' },
  { name: 'verbose-unnecessary', pattern: /\bunnecessarily\b/gi, replacement: 'needlessly' },
  { name: 'verbose-alternatively', pattern: /\bAlternatively,? /gi, replacement: 'Or ' },
  { name: 'verbose-additionally', pattern: /\bAdditionally,? /gi, replacement: 'Also ' },
  { name: 'verbose-furthermore', pattern: /\bFurthermore,? /gi, replacement: 'Also ' },
  { name: 'verbose-however', pattern: /\bHowever,? /gi, replacement: 'But ' },
  { name: 'verbose-therefore', pattern: /\bTherefore,? /gi, replacement: 'So ' },
  { name: 'verbose-consequently', pattern: /\bConsequently,? /gi, replacement: 'So ' },
  { name: 'verbose-sufficient', pattern: /\bsufficient\b/gi, replacement: 'enough' },
  { name: 'verbose-appropriate', pattern: /\bappropriate\b/gi, replacement: 'right' },
  { name: 'verbose-automatically', pattern: /\bautomatically\b/gi, replacement: 'auto' },

  // === PHASE 4: Filler and hedging ===

  // Filler words
  { name: 'filler', pattern: /\b(just|really|basically|actually|simply|very|quite|merely)\s+/gi, replacement: '' },

  // Hedging
  { name: 'hedging', pattern: /\b(likely|probably|might|seems to|appears to|could be|would be)\s+/gi, replacement: '' },

  // Fluff phrases
  { name: 'fluff-that-is', pattern: /\bthat is\b/gi, replacement: "that's" },
  { name: 'fluff-it-is', pattern: /\bit is\b/gi, replacement: "it's" },
  { name: 'fluff-you-will', pattern: /\byou will\b/gi, replacement: "you'll" },
  { name: 'fluff-do-not', pattern: /\bdo not\b/gi, replacement: "don't" },
  { name: 'fluff-we-are', pattern: /\bwe are\b/gi, replacement: "we're" },
  { name: 'fluff-i-would', pattern: /\bI would\b/g, replacement: "I'd" },
  { name: 'fluff-you-would', pattern: /\byou would\b/gi, replacement: "you'd" },

  // === PHASE 5: Articles (last word-level, most frequent) ===

  { name: 'articles', pattern: /\b(The|the|A|a|An|an)\s+(?=[A-Za-z])/g, replacement: '' },

  // === PHASE 6: Cleanup ===

  // Remove orphaned commas at start of sentence
  { name: 'orphan-comma', pattern: /^\s*,\s*/gm, replacement: '' },

  // Remove empty parenthetical
  { name: 'empty-paren', pattern: /\(\s*\)/g, replacement: '' },

  // Clean up double spaces
  { name: 'double-space', pattern: /  +/g, replacement: ' ' },

  // Clean up leading spaces on lines
  { name: 'leading-space', pattern: /^ +/gm, replacement: '' },

  // Clean up trailing spaces
  { name: 'trailing-space', pattern: / +$/gm, replacement: '' },

  // Remove lines that became empty after stripping
  { name: 'empty-lines', pattern: /\n{3,}/g, replacement: '\n\n' },

  // Clean up space before punctuation
  { name: 'space-before-punct', pattern: / +([.,;:!?])/g, replacement: '$1' },
];

/**
 * Estimate token count (rough: ~4 chars per token for English).
 */
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Split prose segment into prose and table blocks.
 * Returns array of { type: 'prose'|'table', content }.
 */
function splitProseAndTables(text) {
  const blocks = [];
  const tableRegex = /^(\s*\|[^\n]*\n\s*\|[\s\-:|]*\n(\s*\|[^\n]*\n?)*)/gm;
  let lastIndex = 0;
  let match;

  while ((match = tableRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: 'prose', content: text.slice(lastIndex, match.index) });
    }
    blocks.push({ type: 'table', content: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    blocks.push({ type: 'prose', content: text.slice(lastIndex) });
  }

  return blocks;
}

/**
 * Split markdown into code, table, and prose blocks.
 * Returns array of { type: 'code'|'table'|'prose', content }.
 */
function splitBlocks(content) {
  const blocks = [];
  const codeBlockRegex = /^(```[\s\S]*?^```|^~~~[\s\S]*?^~~~)/gm;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Prose before code block (may contain tables)
    if (match.index > lastIndex) {
      const proseSegment = content.slice(lastIndex, match.index);
      blocks.push(...splitProseAndTables(proseSegment));
    }
    // Code block (preserved verbatim)
    blocks.push({ type: 'code', content: match[0] });
    lastIndex = match.index + match[0].length;
  }

  // Remaining prose (may contain tables)
  if (lastIndex < content.length) {
    const proseSegment = content.slice(lastIndex);
    blocks.push(...splitProseAndTables(proseSegment));
  }

  return blocks;
}

/**
 * Apply L1 compression rules to a prose string.
 * Preserves: URLs, file paths, technical terms in backticks, and specific edge cases like A*.
 */
function compressProse(text) {
  // Extract and protect inline code, URLs, and file paths
  const protected_items = [];
  let protectedText = text;

  // Protect ponytail: comments across languages
  protectedText = protectedText.replace(/(?:\/\/\/|(?:\/\/|#|\/\*|--|<!--)\s*ponytail:\s*.+?(?:\s*\*\/|\s*-->)?)/gi, (match) => {
    const idx = protected_items.length;
    protected_items.push(match);
    return `\x00PROT${idx}\x00`;
  });

  // Protect A* (e.g. A* search)
  protectedText = protectedText.replace(/\bA\*(?!\w)/g, (match) => {
    const idx = protected_items.length;
    protected_items.push(match);
    return `\x00PROT${idx}\x00`;
  });

  // Protect inline code (`...`)
  protectedText = protectedText.replace(/`[^`]+`/g, (match) => {
    const idx = protected_items.length;
    protected_items.push(match);
    return `\x00PROT${idx}\x00`;
  });

  // Protect URLs
  protectedText = protectedText.replace(/https?:\/\/\S+/g, (match) => {
    const idx = protected_items.length;
    protected_items.push(match);
    return `\x00PROT${idx}\x00`;
  });

  // Protect file paths (anything starting with / or ./ or ../ or containing .ext)
  protectedText = protectedText.replace(/(?:\.\.?\/|\/)[\w\-./]+\.\w+/g, (match) => {
    const idx = protected_items.length;
    protected_items.push(match);
    return `\x00PROT${idx}\x00`;
  });

  // Apply compression rules
  for (const rule of STRIP_RULES) {
    protectedText = protectedText.replace(rule.pattern, rule.replacement);
  }

  // Restore protected items
  protectedText = protectedText.replace(/\x00PROT(\d+)\x00/g, (_, idx) => {
    return protected_items[parseInt(idx)];
  });

  return protectedText;
}

/**
 * Compress a markdown file.
 * Returns { original, compressed, originalTokens, compressedTokens, savings, savedTokens }.
 */
function compress(content) {
  const blocks = splitBlocks(content);
  const compressed = blocks.map(block => {
    if (block.type === 'code' || block.type === 'table') return block.content;
    return compressProse(block.content);
  }).join('');

  const originalTokens = estimateTokens(content);
  const compressedTokens = estimateTokens(compressed);
  const savedTokens = originalTokens - compressedTokens;
  const savings = originalTokens > 0
    ? Math.round((savedTokens / originalTokens) * 100)
    : 0;

  return {
    original: content,
    compressed,
    originalTokens,
    compressedTokens,
    savedTokens,
    savings,
  };
}

/**
 * Compress a file on disk. Creates .original.md backup.
 */
function compressFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const result = compress(content);

  // Create backup
  const ext = path.extname(filePath);
  const base = filePath.slice(0, -ext.length);
  const backupPath = `${base}.original${ext}`;
  fs.writeFileSync(backupPath, content, 'utf8');

  // Write compressed version
  fs.writeFileSync(filePath, result.compressed, 'utf8');

  return {
    ...result,
    backupPath,
  };
}

// Direct execution
if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: titan-compress <file.md>');
    process.exit(1);
  }

  try {
    const result = compressFile(file);
    console.log(`Original:   ${result.originalTokens} tokens`);
    console.log(`Compressed: ${result.compressedTokens} tokens`);
    console.log(`Savings:    ${result.savings}% (${result.savedTokens} tokens)`);
    console.log(`Backup:     ${result.backupPath}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { compress, compressFile, compressProse, splitBlocks, estimateTokens };
```

---

## File: `src/debt.js`

```javascript
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// File extensions to scan for ponytail: comments
const SCAN_EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs',
  '.py', '.rb', '.go', '.rs', '.java', '.kt', '.scala',
  '.c', '.cpp', '.h', '.hpp', '.cs',
  '.sh', '.bash', '.zsh',
  '.yaml', '.yml', '.toml',
  '.sql',
  '.md',
]);

// Directories to skip
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.next', '.nuxt', 'dist', 'build',
  '__pycache__', '.pytest_cache', 'target', 'vendor',
  '.venv', 'venv', 'env',
]);

// Pattern to match ponytail: comments across languages
// Matches: # ponytail: ..., // ponytail: ..., /* ponytail: ... */, -- ponytail: ..., <!-- ponytail: ... -->
const PONYTAIL_PATTERN = /(?:\/\/|#|\/\*|--|<!--)\s*ponytail:\s*(.+?)(?:\s*\*\/|\s*-->)?$/;

/**
 * Parse a ponytail: comment into ceiling and upgrade path.
 * Format: "ponytail: <ceiling>, <upgrade path>"
 */
function parseComment(raw) {
  const trimmed = raw.trim();
  const commaIndex = trimmed.indexOf(',');

  if (commaIndex === -1) {
    return { ceiling: trimmed, upgradePath: null };
  }

  return {
    ceiling: trimmed.slice(0, commaIndex).trim(),
    upgradePath: trimmed.slice(commaIndex + 1).trim(),
  };
}

/**
 * Scan a single file for ponytail: comments.
 * Returns array of { file, line, ceiling, upgradePath, raw }.
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const results = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(PONYTAIL_PATTERN);
    if (match) {
      const parsed = parseComment(match[1]);
      results.push({
        file: filePath,
        line: i + 1,
        ceiling: parsed.ceiling,
        upgradePath: parsed.upgradePath,
        raw: lines[i].trim(),
      });
    }
  }

  return results;
}

/**
 * Recursively scan a directory for ponytail: comments.
 * Options:
 *   - noUpgradeOnly: if true, only return items without upgrade path
 */
function scanDebt(dirPath, options = {}) {
  const results = [];

  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // Skip unreadable directories
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        walk(path.join(dir, entry.name));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (!SCAN_EXTENSIONS.has(ext)) continue;
        const filePath = path.join(dir, entry.name);
        results.push(...scanFile(filePath));
      }
    }
  }

  walk(dirPath);

  if (options.noUpgradeOnly) {
    return results.filter(item => !item.upgradePath);
  }

  return results;
}

// Direct execution
if (require.main === module) {
  const targetDir = process.argv[2] || process.cwd();
  const noUpgrade = process.argv.includes('--no-upgrade');

  const results = scanDebt(targetDir, { noUpgradeOnly: noUpgrade });

  if (results.length === 0) {
    console.log('No ponytail: comments found.');
    process.exit(0);
  }

  console.log(`Found ${results.length} ponytail: debt item(s):\n`);
  for (const item of results) {
    const icon = item.upgradePath ? '↑' : '⚠';
    console.log(`${icon} ${item.file}:${item.line}`);
    console.log(`  ceiling: ${item.ceiling}`);
    console.log(`  upgrade: ${item.upgradePath || '(none specified)'}`);
    console.log('');
  }
}

module.exports = { scanDebt, scanFile, parseComment };
```

---

## File: `src/filter.js`

```javascript
#!/usr/bin/env node
'use strict';

const readline = require('readline');
const os = require('os');
const fs = require('fs');
const path = require('path');

// --- Noise Patterns ---
// Build system chatter, success messages, and uninformative output
const NOISE_PATTERNS = [
  /^\s*$/,
  // npm
  /npm warn/i,
  /npm notice/i,
  /npm info/i,
  // Generic info/notice
  /^\[info\]/i,
  /^\[notice\]/i,
  /ℹ️/,
  // Build success
  /✓\s*(Build|Compile|Done|Success|Complete)/i,
  /bundled successfully/i,
  /compiled successfully/i,
  /webpack compiled/i,
  /ready on/i,
  /✓\s*in\s*\d+/,
  // Tools
  /husky/i,
  /eslint.*ok/i,
  /passed/i,
  // Vite
  /^\s*VITE v/,
  /^\s*➜\s*(Local|Network):/,
  /^\s*ready in \d+/i,
  // esbuild
  /^\s*\[esbuild\].*done/i,
  // TypeScript
  /^\s*Found 0 errors/,
  // Cargo
  /^\s*Compiling\s/,
  /^\s*Finished\s/,
  /^\s*Downloading\s/,
  // Go
  /^go: downloading/,
  // Generic
  /^\s*watching for file changes/i,
  /^\s*waiting for changes/i,
];

const STACK_NOISE = /node_modules/;

function isNoise(line) {
  return NOISE_PATTERNS.some(p => p.test(line));
}

function filterStackLine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('at ')) return trimmed;
  if (STACK_NOISE.test(trimmed)) return null;
  return trimmed;
}

function isStackFrame(line) {
  return /^\s+at\s/.test(line);
}

function logSavings(inputChars, outputChars, linesFiltered) {
  const charsSaved = Math.max(0, inputChars - outputChars);
  if (charsSaved === 0 && linesFiltered === 0) return;
  const tokensSaved = Math.round(charsSaved / 4);

  const homeDir = os.homedir();
  const titanDir = path.join(homeDir, '.titan');
  const statsFile = path.join(titanDir, 'stats.json');

  try {
    if (!fs.existsSync(titanDir)) {
      fs.mkdirSync(titanDir, { recursive: true });
    }

    let stats = {
      totalLinesFiltered: 0,
      totalCharsSaved: 0,
      totalTokensSaved: 0,
      runsCount: 0
    };

    if (fs.existsSync(statsFile)) {
      try {
        stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
      } catch (e) {
        // use default stats if corrupt
      }
    }

    stats.totalLinesFiltered = (stats.totalLinesFiltered || 0) + linesFiltered;
    stats.totalCharsSaved = (stats.totalCharsSaved || 0) + charsSaved;
    stats.totalTokensSaved = (stats.totalTokensSaved || 0) + tokensSaved;
    stats.runsCount = (stats.runsCount || 0) + 1;

    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf8');
  } catch (err) {
    // silently catch to prevent stream crashes
  }
}

/**
 * Process an array of lines, filtering noise and compressing stack traces.
 */
function processLines(lines) {
  const output = [];
  let inStack = false;
  let stackLines = [];
  let errorHeader = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isNoise(line)) continue;

    // Detect error header
    if (/(?:Error|TypeError|ReferenceError|SyntaxError|RangeError):/.test(line) && !inStack) {
      errorHeader = line;
      inStack = true;
      stackLines = [];
      continue;
    }

    if (inStack) {
      if (isStackFrame(line)) {
        stackLines.push(line);
        continue;
      }
      // End of stack trace
      if (errorHeader) {
        output.push(errorHeader);
        const firstRelevant = stackLines
          .map(filterStackLine)
          .filter(Boolean);
        if (firstRelevant.length > 0) {
          output.push(firstRelevant[0]);
        }
        errorHeader = null;
        stackLines = [];
        inStack = false;
      }
    }

    output.push(line);
  }

  // Flush remaining stack
  if (errorHeader) {
    output.push(errorHeader);
    const firstRelevant = stackLines.map(filterStackLine).filter(Boolean);
    if (firstRelevant.length > 0) output.push(firstRelevant[0]);
  }

  return output;
}

/**
 * Stream mode: read stdin line by line, filter, write to stdout.
 */
function streamMode() {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  const buffer = [];
  let flushing = false;
  let totalInputChars = 0;
  let totalOutputChars = 0;
  let totalInputLinesCount = 0;

  function flush() {
    if (flushing) return;
    flushing = true;
    const batch = buffer.splice(0);
    const result = processLines(batch);
    for (const line of result) {
      process.stdout.write(line + '\n');
      totalOutputChars += line.length + 1;
    }
    flushing = false;
  }

  rl.on('line', line => {
    totalInputLinesCount++;
    totalInputChars += line.length + 1;
    buffer.push(line);
    if (buffer.length >= 100) flush();
  });

  rl.on('close', () => {
    flush();
    logSavings(totalInputChars, totalOutputChars, totalInputLinesCount);
  });
}

/**
 * Self-test: verify filtering works correctly.
 */
function selfTest() {
  const input = [
    '',
    'npm warn deprecated inflight@1.0.6',
    '✓ Build complete in 2.3s',
    '',
    'src/app.ts: export const x = 1;',
    'ℹ️ Compiled successfully',
    '',
    'TypeError: Cannot read properties of undefined (reading \'id\')',
    '    at Object.handler (/home/user/project/src/handlers/user.ts:42:15)',
    '    at /home/user/project/node_modules/express/lib/router/layer.js:95:5',
    '    at next (/home/user/project/node_modules/express/lib/router/route.js:137:13)',
    '    at /home/user/project/src/middleware/auth.ts:18:9',
    '',
    '✓ Tests passed',
    'npm notice New minor version available',
    '',
    'src/utils.ts: const y = 2;',
  ];

  const expected = [
    'src/app.ts: export const x = 1;',
    'TypeError: Cannot read properties of undefined (reading \'id\')',
    'at Object.handler (/home/user/project/src/handlers/user.ts:42:15)',
    'src/utils.ts: const y = 2;',
  ];

  const result = processLines(input);

  const pass = JSON.stringify(result) === JSON.stringify(expected);
  process.stdout.write(`TITAN filter self-test: ${pass ? 'PASS ✓' : 'FAIL ✗'}\n`);
  if (!pass) {
    process.stdout.write(`Expected: ${JSON.stringify(expected, null, 2)}\n`);
    process.stdout.write(`Got:      ${JSON.stringify(result, null, 2)}\n`);
    process.exit(1);
  }
}

// Direct execution
if (require.main === module) {
  if (process.argv[2] === '--test') {
    selfTest();
  } else {
    streamMode();
  }
}

module.exports = { processLines, streamMode, selfTest };
```

---

## File: `src/templates.js`

```javascript
#!/usr/bin/env node
'use strict';

/**
 * Minimal template engine for TITAN skill generation.
 * Zero dependencies — uses regex-based YAML frontmatter parsing.
 */

/**
 * Parse YAML frontmatter from markdown content.
 * Returns { frontmatter: object, body: string }.
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { frontmatter: {}, body: content };
  }

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const raw = match[1];
  const body = match[2];
  const frontmatter = {};

  const SUPPORTED_KEYS = new Set([
    'name', 'version', 'description', 'license', 'source', 'compatibility', 'globs', 'alwaysApply'
  ]);

  const lines = raw.split(/\r?\n/);
  let currentKey = null;
  let inBlockScalar = false;
  let blockScalarType = ''; // '|' or '>'
  let blockScalarLines = [];
  let blockScalarIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (inBlockScalar) {
      const matchIndent = line.match(/^(\s+)\S/);
      if (matchIndent) {
        const indent = matchIndent[1].length;
        if (blockScalarIndent === 0) {
          blockScalarIndent = indent;
        }
        if (indent >= blockScalarIndent) {
          blockScalarLines.push(line.slice(blockScalarIndent));
          continue;
        }
      } else if (trimmed === '') {
        blockScalarLines.push('');
        continue;
      }

      // Block scalar ended
      let value = '';
      if (blockScalarType === '|') {
        value = blockScalarLines.join('\n') + '\n';
      } else if (blockScalarType === '>') {
        let folded = [];
        let currentParagraph = [];
        for (const bl of blockScalarLines) {
          if (bl.trim() === '') {
            if (currentParagraph.length > 0) {
              folded.push(currentParagraph.join(' '));
              currentParagraph = [];
            }
            folded.push('');
          } else {
            currentParagraph.push(bl.trim());
          }
        }
        if (currentParagraph.length > 0) {
          folded.push(currentParagraph.join(' '));
        }
        value = folded.join('\n') + '\n';
      }
      frontmatter[currentKey] = value.trim();

      inBlockScalar = false;
      blockScalarLines = [];
      blockScalarIndent = 0;
      currentKey = null;
    }

    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }

    const kvMatch = line.match(/^(\s*)(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[2];
      let val = kvMatch[3].trim();

      if (!SUPPORTED_KEYS.has(key)) {
        console.warn(`Warning: Unsupported frontmatter key "${key}"`);
      }

      currentKey = key;

      if (val === '|' || val === '>') {
        inBlockScalar = true;
        blockScalarType = val;
        blockScalarLines = [];
        blockScalarIndent = 0;
      } else if (val === '') {
        // Might be followed by list items
      } else {
        if (val.startsWith('[') && val.endsWith(']')) {
          const inner = val.slice(1, -1).trim();
          if (inner === '') {
            val = [];
          } else {
            val = inner.split(',').map(item => {
              const cleaned = item.trim();
              if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
                return cleaned.slice(1, -1);
              }
              if (cleaned === 'true') return true;
              if (cleaned === 'false') return false;
              if (!isNaN(cleaned) && cleaned !== '') return Number(cleaned);
              return cleaned;
            });
          }
        } else {
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          } else {
            if (val === 'true') val = true;
            else if (val === 'false') val = false;
            else if (!isNaN(val) && val !== '') val = Number(val);
          }
        }
        frontmatter[key] = val;
      }
      continue;
    }

    const listMatch = line.match(/^(\s*)-\s*(.*)$/);
    if (listMatch && currentKey) {
      let val = listMatch[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      } else {
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (!isNaN(val) && val !== '') val = Number(val);
      }

      if (!Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(val);
    }
  }

  if (inBlockScalar && currentKey) {
    let value = '';
    if (blockScalarType === '|') {
      value = blockScalarLines.join('\n') + '\n';
    } else if (blockScalarType === '>') {
      let folded = [];
      let currentParagraph = [];
      for (const bl of blockScalarLines) {
        if (bl.trim() === '') {
          if (currentParagraph.length > 0) {
            folded.push(currentParagraph.join(' '));
            currentParagraph = [];
          }
          folded.push('');
        } else {
          currentParagraph.push(bl.trim());
        }
      }
      if (currentParagraph.length > 0) {
        folded.push(currentParagraph.join(' '));
      }
      value = folded.join('\n') + '\n';
    }
    frontmatter[currentKey] = value.trim();
  }

  return { frontmatter, body };
}

/**
 * Remove YAML frontmatter from markdown content.
 * Returns body only.
 */
function stripFrontmatter(content) {
  return parseFrontmatter(content).body;
}

/**
 * Shift all heading levels down by N (e.g., # → ##).
 */
function shiftHeadings(content, levels = 1) {
  const prefix = '#'.repeat(levels);
  return content.replace(/^(#{1,6})\s/gm, (match, hashes) => {
    const newLevel = Math.min(hashes.length + levels, 6);
    return '#'.repeat(newLevel) + ' ';
  });
}

/**
 * Prepend a header comment/note to the content.
 */
function prependNote(content, note) {
  return note + '\n\n' + content;
}

/**
 * Build YAML frontmatter string from an object.
 */
function buildFrontmatter(obj) {
  const lines = ['---'];
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'boolean') {
      lines.push(`${key}: ${val}`);
    } else if (typeof val === 'string') {
      lines.push(`${key}: "${val}"`);
    } else if (Array.isArray(val)) {
      lines.push(`${key}: ${JSON.stringify(val)}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

/**
 * Replace template variables {{variable}} in content.
 */
function interpolate(content, vars) {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return vars[key] !== undefined ? vars[key] : match;
  });
}

module.exports = {
  parseFrontmatter,
  stripFrontmatter,
  shiftHeadings,
  prependNote,
  buildFrontmatter,
  interpolate,
};
```

---

## File: `skills/master.md`

```markdown
---
name: titan
version: 0.1.0
description: >
  Unified token compression framework for LLM agents.
  Three orthogonal layers: Linguistic (L1), Structural (L2), Contextual (L3).
  Preserves reasoning quality, tool-use performance, and code correctness.
  Intensity levels: lite, full, ultra. Auto-Clarity safety override.
license: MIT
source: "Ponytail (Dietrich Gebert) + Caveman (Julius Brussee)"
compatibility:
  - claude-code
  - cursor
  - copilot
  - windsurf
  - cline
  - kiro
  - aider
  - antigravity
  - generic
---

# TITAN — System Instructions

You are running under TITAN (Token Intelligence Through Agent Narrowing) mode.
3 compression layers are ACTIVE. Apply them on all responses. Never drift.

---

## L1: Linguistic Compression (Caveman Engine)

### Strip Rules — ALWAYS apply
- **Drop articles**: a, an, the -> "Component re-renders"
- **Drop filler**: just, really, basically, actually, simply, very, quite -> "Use stable dependency"
- **Drop pleasantries**: sure, certainly, of course, happy to, glad to, absolutely -> Omit entirely
- **Drop hedging**: likely, probably, might, seems, appears, could -> "caused by bug"
- **No tool narration**: never announce tool usage. Call tool directly.

### Compression Rules
- **Fragments OK**: subject/auxiliary drops allowed -> "New object ref each render"
- **Synonyms**: use shortest words (use vs utilize, fix vs implement solution, big vs extensive)
- **Standard pattern**: `[thing] [action] [reason]. [next step].`
- **Acronyms**: DB, API, HTTP, URL, CLI, LLM, YAGNI. Never invent new acronyms.

### L1 Boundaries — NEVER compress:
Code blocks, technical terms, error strings, API/function names, user language, commit keywords (feat/fix/etc.), `ponytail:` comments.

---

## L2: Structural Compression (Ponytail Lazy Ladder)

ACTIVE EVERY RESPONSE. No drift back to over-building.

### The Ladder — traverse BEFORE writing code
Stop at the first rung that holds:
1. **YAGNI**: Skip if unnecessary.
2. **Stdlib**: Use standard library features.
3. **Native**: Use platform native feature.
4. **Existing**: Use installed dependency.
5. **One Line**: Can it be one line? -> Single line.
6. **Minimum**: Only then: minimum working code.

### Output Pattern
```
[code] → skipped: [X], add when [Y].
```
Explanation longer than code -> delete. No feature tours, design notes, defense of logic.

### ponytail: Comment System
Comment every deliberate simplification:
`// ponytail: <ceiling>, <upgrade path>` (e.g. `// ponytail: global lock, per-account locks if throughput matters`)

### L2 Boundaries — NEVER simplify:
Input validation, error handling preventing data loss, security, accessibility, explicit user requirements, hardware calibration.

### Runnable Check
Non-trivial logic (loops, branches, parsing, money/security) gets one assertion check, `demo()` or mini `test_*.js`. No test frameworks/fixtures unless asked. Trivial one-liners need no test.

---

## L3: Contextual Compression

- **Memory Files**: L3 compress prose in CLAUDE.md/notes using L1. Preserve code/paths. Backup as `.original.md`.
- **Terminal Output**: Strip empty lines, npm warn/info, build success, eslint OK, husky. Stack traces -> error header + first app frame.
- **Subagents**: Format output as `[finding]: [detail]. [action needed].` No preambles or summaries.
- **Context Pressure (>80%)**: Aggressive L2 (YAGNI/stdlib), summarize older turns, retain: tool results > instructions > prose.

---

## Safety / Auto-Clarity Override

Suspend compression for:
- Security warnings / CVE bugs (full explanation)
- Irreversible or destructive actions (DROP, DELETE, rm -rf -> full warning, then resume)
- Multi-step sequences where order matters
- Technical ambiguity
- User confusion signals (expressing doubt, asking for clarification, repeating questions)
- Unclear ponytail comments

### Destructive op pattern:
```
[Full warning description]
Caveman resume. [Terse next steps].
```

---

## Tool-Use Preservation (Sacred)

Tool calls are never compressed. Function names, params, JSON structure, error strings: exact.
Compression acts only on natural language reasoning.

---

## Intensity Levels

- **L1 Levels**:
  - `lite`: No filler/hedging, keep articles + full sentences (~30% savings)
  - `full` (default): Drop articles, fragments OK, short synonyms (~65% savings)
  - `ultra`: Abbreviate words, drop conjunctions, arrows for causality (~75% savings)
- **L2 Levels**:
  - `lite`: Build request, name lazier alternative in 1 line
  - `full` (default): Ladder active, stdlib/native, short diff
  - `ultra`: Extreme YAGNI, delete > add, challenge requirements
- **L3 Levels**:
  - `on` (default): Active L3 tools
  - `off`: Context management disabled

---

## Commands

- `/titan [lite|full|ultra]`: Set intensity globally
- `/titan L1 [lite|full|ultra]`: Set L1 intensity
- `/titan L2 [lite|full|ultra]`: Set L2 intensity
- `/titan L3 [on|off]`: Toggle L3
- `/titan-review`: Review diff for over-engineering & compression
- `/titan-audit`: Audit codebase for bloat (code & prose)
- `/titan-debt`: Print ponytail comments ledger
- `/titan-compress <file>`: L3 compress static file
- `/titan-stats`: Stats + savings
- `/titan-help`: Show usage info

---

## Review Format

```
L<line>: <emoji> <tag> <description>. <fix>. [<compression-note>]
```
Tags: `delete:` (dead code), `stdlib:` (built-in), `native:` (platform feature), `yagni:` (1 impl abstraction), `shrink:` (fewer lines).

- `L12: 🔴 delete: 27-line validator. Use email regex.`
- `L88: 🟡 yagni: AbstractRepository, one impl. Inline.`
- `L42: 🔵 stdlib: moment.js used once. Use Intl.DateTimeFormat.`

---

## Graduated Degradation

If layer fails:
1. L1 fails: full prose, L2+L3 active
2. L2 fails: normal code, L1+L3 active
3. L3 fails: context grows, L1+L2 active
4. Multiple failures: notify user, disable TITAN

---

## Persistence

Persists until: "stop titan" / "normal mode".
Default: full (L1) + full (L2) + on (L3).
```

---

## File: `skills/master-lite.md`

```markdown
---
name: titan-lite
version: 0.1.0
description: >
  Compact token compression. L1 linguistic (lite) + L2 structural (lite).
  ~375 tokens. Recommends lazy alternatives without imposing, retains articles.
license: MIT
---

# TITAN LITE

ACTIVE EVERY RESPONSE. Never drift. Disable mode: "stop titan" / "normal mode".

## L1: Linguistic Compression (Lite)
Apply linguistic cleanup to natural language output. Keep articles (the, a, an) and maintain grammatical sentences, but drop:
- Pleasantries: "sure", "certainly", "of course", "happy to", "glad to".
- Filler words: "just", "really", "basically", "actually", "simply", "very", "quite".
- Hedging: "probably", "likely", "might", "seems", "appears", "could".
- Tool-use announcements.
Use short synonyms and a concise pattern: `[thing] [action] [reason]. [next step].` when possible.

Do not compress: code blocks, technical terms, error strings, API names, and `ponytail:` comments.

## L2: Structural Compression (Lite)
Suggest lazy, minimal design alternatives instead of immediately over-engineering, but do not strictly impose them if project context requires full build. Guide coding using these priorities:
1. **YAGNI** (You Aren't Gonna Need It) — suggest skipping unnecessary features.
2. **Stdlib** — recommend standard library features over external dependencies.
3. **Native** — recommend platform native API.
4. **Existing** — leverage currently installed dependencies first.
5. **One Line** — mention if code can be simplified to a single line.
6. **Minimum** — write only the minimum code required for the current task.

Output format for skipped/suggested alternatives:
`[code] → skipped: [X], add when [Y].`

Document deliberate simplifications in code comments:
`// ponytail: <ceiling>, <upgrade path>`

Do not simplify: validation checks, security layers, error handling preventing data loss, or explicit user requirements.

## L3: Contextual Compression
- **Memory Files**: Strip prose using L1 rules, keeping paths and instructions exact.
- **Terminal Output**: Keep errors, but skip npm/build verbose logs.
- **Subagents**: Format reports as `[finding]: [detail]. [action needed].` with no preambles.

## Safety & Auto-Clarity Override
Suspend compression and explain fully when dealing with:
- Security warnings / CVE bugs.
- Irreversible or destructive actions (DROP, DELETE, rm -rf).
- Multi-step sequences where order is critical.
- Technical ambiguity or user confusion signals (doubts/clarifications).
```

---

## File: `skills/master-aggressive.md`

```markdown
---
name: titan-aggressive
version: 0.1.0
description: >
  Telegraphic token compression. L1 ultra + L2 ultra.
  ~300 tokens. Maximum token savings, telegraphic style.
license: MIT
---

# TITAN AGGRESSIVE

ACTIVE EVERY RESPONSE. Never drift. Off: "stop titan" / "normal mode".

## L1: Ultra Linguistic Compression
Drop articles, filler, pleasantries, hedging, auxiliary verbs, and conjunctions. Use telegraphese and fragments.
Use `->` for causality.
Accepted abbreviations: DB, auth, config, req, res, fn, impl.
Pattern: `[thing] [action] [reason]. [next step].` or `[component] -> [defect] -> [fix]. [next].`

Do not compress: code blocks, technical terms, error strings, API names, and `ponytail:` comments.

## L2: Ultra Structural Compression
Traverse Ladder aggressively. YAGNI extreme: delete before addition.
1. **YAGNI** — redundant/future code -> Delete/skip.
2. **Stdlib** — Node/JS built-in -> Use.
3. **Native** — platform feature -> Use.
4. **Existing** — active dependency -> Use.
5. **One line** — single line possible -> Inline it.
6. **Minimum** -> Minimal working logic.

Output: `[code] → skipped: [X], add when [Y].`
Mark simplifications: `// ponytail: <ceiling>, <upgrade path>`
Never simplify: critical validation, security, data loss prevention.

## L3: Contextual Compression
- **Memory Files**: Strip prose completely, preserve code/paths.
- **Terminal Output**: Show only error headers + first app frame.
- **Subagents**: Format as `[finding]: [detail]. [action needed].` No preambles.

## Safety & Narrow Auto-Clarity Override
Suspend compression ONLY for:
- Security/CVE bugs.
- Irreversible/destructive operations (DROP, DELETE, rm -rf).
- Direct user confusion signals.
All other instructions remain compressed.
```

---

## File: `skills/adapters/aider.js`

```javascript
#!/usr/bin/env node
'use strict';

const { stripFrontmatter, prependNote } = require('../../src/templates');

const AGENT_ID = 'aider';
const OUTPUT_PATH = 'CONVENTIONS.md';
const DESCRIPTION = 'Aider — CONVENTIONS.md at repo root, loaded with --read or .aider.conf.yml';

function transform(masterContent) {
  let body = stripFrontmatter(masterContent);

  // Aider uses CONVENTIONS.md loaded via --read flag or .aider.conf.yml
  const header = [
    '<!-- TITAN Agent Compression Framework -->',
    '<!-- Load with: aider --read CONVENTIONS.md -->',
    '<!-- Or add to .aider.conf.yml: -->',
    '<!--   read: -->',
    '<!--     - CONVENTIONS.md -->',
  ].join('\n');

  return header + '\n\n' + body;
}

/**
 * Check if CONVENTIONS.md already exists.
 * If so, return alternative path to avoid overwriting.
 */
function getOutputPath(targetDir) {
  const fs = require('fs');
  const path = require('path');
  const defaultPath = path.join(targetDir, 'CONVENTIONS.md');

  if (fs.existsSync(defaultPath)) {
    return {
      path: 'CONVENTIONS-titan.md',
      warning: `CONVENTIONS.md already exists. Created CONVENTIONS-titan.md instead.\n` +
        `To merge, add to .aider.conf.yml:\n` +
        `  read:\n` +
        `    - CONVENTIONS.md\n` +
        `    - CONVENTIONS-titan.md`,
    };
  }

  return { path: 'CONVENTIONS.md', warning: null };
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform, getOutputPath };
```

---

## File: `skills/adapters/antigravity.js`

```javascript
#!/usr/bin/env node
'use strict';

const { stripFrontmatter } = require('../../src/templates');

const AGENT_ID = 'antigravity';
const OUTPUT_PATH = '.antigravity/skills/titan.md';
const DESCRIPTION = 'Antigravity — plain markdown in .antigravity/skills/';

function transform(masterContent) {
  // Antigravity: plain markdown, skills directory-based
  return stripFrontmatter(masterContent);
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
```

---

## File: `skills/adapters/cline.js`

```javascript
#!/usr/bin/env node
'use strict';

const { stripFrontmatter } = require('../../src/templates');

const AGENT_ID = 'cline';
const OUTPUT_PATH = '.clinerules/titan.md';
const DESCRIPTION = 'Cline — .clinerules/ directory, plain markdown';

function transform(masterContent) {
  // Cline: plain markdown in .clinerules/ directory
  // Cline also recognizes .cursorrules and .windsurfrules — cross-compatible
  return stripFrontmatter(masterContent);
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
```

---

## File: `skills/adapters/cloudcode.js`

```javascript
#!/usr/bin/env node
'use strict';

const { stripFrontmatter } = require('../../src/templates');

const AGENT_ID = 'cloudcode';
const OUTPUT_PATH = '.claude/skills/titan/titan-core.md';
const DESCRIPTION = 'Claude Code — markdown skill in .claude/skills/';

function transform(masterContent) {
  // Claude Code skills: plain markdown, no frontmatter
  return stripFrontmatter(masterContent);
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
```

---

## File: `skills/adapters/copilot.js`

```javascript
#!/usr/bin/env node
'use strict';

const { stripFrontmatter, shiftHeadings } = require('../../src/templates');

const AGENT_ID = 'copilot';
const OUTPUT_PATH = '.github/copilot-instructions.md';
const DESCRIPTION = 'GitHub Copilot — no H1 headings (conflict with system titles), H2+ only';

function transform(masterContent) {
  let body = stripFrontmatter(masterContent);

  // Copilot: H1 headings conflict with system-generated titles.
  // Shift all headings down by 1 level (# → ##, ## → ###, etc.)
  body = shiftHeadings(body, 1);

  return body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
```

---

## File: `skills/adapters/cursor.js`

```javascript
#!/usr/bin/env node
'use strict';

const { stripFrontmatter, buildFrontmatter } = require('../../src/templates');

const AGENT_ID = 'cursor';
const OUTPUT_PATH = '.cursor/rules/titan.mdc';
const DESCRIPTION = 'Cursor — .mdc format with YAML frontmatter (description, globs, alwaysApply)';

function transform(masterContent) {
  const body = stripFrontmatter(masterContent);

  // Cursor .mdc requires its own frontmatter
  const cursorFrontmatter = buildFrontmatter({
    description: 'TITAN token compression framework — L1 linguistic, L2 structural, L3 contextual compression. Preserves reasoning, tool-use, and code correctness.',
    globs: [],
    alwaysApply: true,
  });

  return cursorFrontmatter + '\n\n' + body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
```

---

## File: `skills/adapters/generic.js`

```javascript
#!/usr/bin/env node
'use strict';

const { stripFrontmatter, prependNote } = require('../../src/templates');

const AGENT_ID = 'generic';
const OUTPUT_PATH = 'system-prompt.md';
const DESCRIPTION = 'Generic — plain markdown system prompt, copy-paste into any LLM agent';

function transform(masterContent) {
  let body = stripFrontmatter(masterContent);

  const header = [
    '<!-- TITAN Agent Compression Framework -->',
    '<!-- Copy this content into your LLM agent\'s system prompt -->',
    '<!-- Source: https://github.com/your-repo/titan-agent -->',
  ].join('\n');

  return header + '\n\n' + body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
```

---

## File: `skills/adapters/kiro.js`

```javascript
#!/usr/bin/env node
'use strict';

const { parseFrontmatter, buildFrontmatter } = require('../../src/templates');

const AGENT_ID = 'kiro';
const OUTPUT_PATH = '.kiro/skills/titan/SKILL.md';
const DESCRIPTION = 'Kiro — SKILL.md with YAML frontmatter in .kiro/skills/';

function transform(masterContent) {
  const { frontmatter, body } = parseFrontmatter(masterContent);

  // Kiro supports SKILL.md with frontmatter — preserve and adapt
  const kiroFrontmatter = buildFrontmatter({
    name: frontmatter.name || 'titan',
    description: frontmatter.description || 'Unified token compression framework for LLM agents.',
    version: frontmatter.version || '0.1.0',
    license: frontmatter.license || 'MIT',
  });

  return kiroFrontmatter + '\n\n' + body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
```

---

## File: `skills/adapters/windsurf.js`

```javascript
#!/usr/bin/env node
'use strict';

const { stripFrontmatter, prependNote } = require('../../src/templates');

const AGENT_ID = 'windsurf';
const OUTPUT_PATH = '.windsurf/rules/titan.md';
const DESCRIPTION = 'Windsurf — .windsurf/rules/ directory, activation mode: Always On';

function transform(masterContent) {
  let body = stripFrontmatter(masterContent);

  // Windsurf modern format: .windsurf/rules/*.md
  // Add activation mode metadata at the top
  const header = [
    '<!-- Activation: Always On -->',
    '<!-- Priority: High -->',
    '<!-- Source: TITAN (Token Intelligence Through Agent Narrowing) -->',
  ].join('\n');

  return header + '\n\n' + body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
```

---

## File: `tests/compress.test.js`

```javascript
#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { compress, compressProse, splitBlocks, estimateTokens } = require('../src/compress');

describe('TITAN Compress', () => {
  describe('splitBlocks', () => {
    it('should split prose and code blocks', () => {
      const input = 'Some prose\n```js\nconst x = 1;\n```\nMore prose';
      const blocks = splitBlocks(input);
      assert.strictEqual(blocks.length, 3);
      assert.strictEqual(blocks[0].type, 'prose');
      assert.strictEqual(blocks[1].type, 'code');
      assert.strictEqual(blocks[2].type, 'prose');
    });

    it('should handle content with no code blocks', () => {
      const blocks = splitBlocks('Just prose here');
      assert.strictEqual(blocks.length, 1);
      assert.strictEqual(blocks[0].type, 'prose');
    });

    it('should handle content that is only a code block', () => {
      const input = '```\ncode only\n```';
      const blocks = splitBlocks(input);
      assert.ok(blocks.some(b => b.type === 'code'));
    });
  });

  describe('compressProse', () => {
    it('should drop articles', () => {
      const result = compressProse('The component re-renders');
      assert.ok(!result.startsWith('The '));
    });

    it('should drop filler words', () => {
      const result = compressProse('I just really want to basically test this');
      assert.ok(!result.includes('just'));
      assert.ok(!result.includes('really'));
      assert.ok(!result.includes('basically'));
    });

    it('should drop hedging', () => {
      const result = compressProse('This is likely caused by a bug');
      assert.ok(!result.includes('likely'));
    });

    it('should replace verbose phrases', () => {
      const result = compressProse('We need to utilize this functionality');
      assert.ok(result.includes('use'));
      assert.ok(result.includes('feature'));
    });

    it('should preserve inline code', () => {
      const result = compressProse('The `lru_cache` function is likely the best choice');
      assert.ok(result.includes('`lru_cache`'));
    });

    it('should preserve URLs', () => {
      const result = compressProse('Visit https://example.com/the/path for the details');
      assert.ok(result.includes('https://example.com/the/path'));
    });

    it('should collapse double spaces', () => {
      const result = compressProse('word  word');
      assert.ok(!result.includes('  '));
    });

    it('should preserve A* search and similar edge cases', () => {
      const result = compressProse('We use A* search for pathfinding.');
      assert.ok(result.includes('A* search'));
    });

    it('should preserve ponytail: comments inside prose verbatim', () => {
      const result = compressProse('This is a very simple database setup. <!-- ponytail: sqlite, use PG later -->');
      assert.ok(result.includes('<!-- ponytail: sqlite, use PG later -->'));
    });
  });

  describe('compress (full pipeline)', () => {
    it('should compress prose but preserve code blocks', () => {
      const input = 'The component is likely broken.\n```js\nconst x = 1;\n```\nThe fix is simple.';
      const result = compress(input);

      // Code block preserved
      assert.ok(result.compressed.includes('const x = 1;'));

      // Some compression happened
      assert.ok(result.savings > 0);
      assert.ok(result.compressedTokens < result.originalTokens);
    });

    it('should report token statistics', () => {
      const result = compress('The quick brown fox jumps over the lazy dog. Actually, it is quite simply a very basic sentence.');
      assert.ok(typeof result.originalTokens === 'number');
      assert.ok(typeof result.compressedTokens === 'number');
      assert.ok(typeof result.savings === 'number');
      assert.ok(typeof result.savedTokens === 'number');
    });

    it('should preserve markdown table formatting and alignment', () => {
      const input = `Here is a table:
| Header 1 | Header 2 |
| --- | --- |
| The value 1 | A value 2 |
| Some long value | Another one |`;
      const result = compress(input);
      assert.ok(result.compressed.includes('| Header 1 | Header 2 |'));
      assert.ok(result.compressed.includes('| --- | --- |'));
      assert.ok(result.compressed.includes('| The value 1 | A value 2 |'));
    });
  });

  describe('estimateTokens', () => {
    it('should estimate roughly 4 chars per token', () => {
      const tokens = estimateTokens('hello world');
      assert.ok(tokens > 0);
      assert.ok(tokens <= 5);
    });
  });
});
```

---

## File: `tests/filter.test.js`

```javascript
#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { processLines } = require('../src/filter');

describe('TITAN Filter', () => {
  it('should remove npm warnings', () => {
    const result = processLines(['npm warn deprecated inflight@1.0.6']);
    assert.deepStrictEqual(result, []);
  });

  it('should remove build success messages', () => {
    const result = processLines(['✓ Build complete in 2.3s']);
    assert.deepStrictEqual(result, []);
  });

  it('should remove empty lines', () => {
    const result = processLines(['', '  ', '']);
    assert.deepStrictEqual(result, []);
  });

  it('should preserve actual content', () => {
    const result = processLines(['src/app.ts: export const x = 1;']);
    assert.deepStrictEqual(result, ['src/app.ts: export const x = 1;']);
  });

  it('should compress stack traces — keep error + first relevant frame', () => {
    const input = [
      'TypeError: Cannot read properties of undefined (reading \'id\')',
      '    at Object.handler (/home/user/project/src/handlers/user.ts:42:15)',
      '    at /home/user/project/node_modules/express/lib/router/layer.js:95:5',
      '    at next (/home/user/project/node_modules/express/lib/router/route.js:137:13)',
      '',
    ];
    const result = processLines(input);
    assert.strictEqual(result.length, 2);
    assert.ok(result[0].includes('TypeError'));
    assert.ok(result[1].includes('user.ts:42'));
  });

  it('should remove Vite startup messages', () => {
    const input = [
      '  VITE v5.0.0  ready in 300ms',
      '  ➜  Local:   http://localhost:3000/',
      '  ➜  Network: http://192.168.1.1:3000/',
    ];
    const result = processLines(input);
    assert.deepStrictEqual(result, []);
  });

  it('should preserve error messages without stack frames', () => {
    const input = ['SyntaxError: Unexpected token }', 'some other line'];
    const result = processLines(input);
    assert.ok(result.some(l => l.includes('SyntaxError')));
    assert.ok(result.some(l => l.includes('some other line')));
  });

  it('should handle full integration scenario', () => {
    const input = [
      '',
      'npm warn deprecated inflight@1.0.6',
      '✓ Build complete in 2.3s',
      '',
      'src/app.ts: export const x = 1;',
      'ℹ️ Compiled successfully',
      '',
      'TypeError: Cannot read properties of undefined (reading \'id\')',
      '    at Object.handler (/home/user/project/src/handlers/user.ts:42:15)',
      '    at /home/user/project/node_modules/express/lib/router/layer.js:95:5',
      '    at next (/home/user/project/node_modules/express/lib/router/route.js:137:13)',
      '    at /home/user/project/src/middleware/auth.ts:18:9',
      '',
      '✓ Tests passed',
      'npm notice New minor version available',
      '',
      'src/utils.ts: const y = 2;',
    ];
    const expected = [
      'src/app.ts: export const x = 1;',
      'TypeError: Cannot read properties of undefined (reading \'id\')',
      'at Object.handler (/home/user/project/src/handlers/user.ts:42:15)',
      'src/utils.ts: const y = 2;',
    ];
    const result = processLines(input);
    assert.deepStrictEqual(result, expected);
  });
});
```

---

## File: `tests/init.test.js`

```javascript
#!/usr/bin/env node
'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { initAgent, initAll, listAgents, ADAPTER_IDS } = require('../src/init');

// Create a temp dir inside the project for test output
const TEST_DIR = path.join(__dirname, '..', '.test-output');

describe('TITAN Init', () => {
  before(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  after(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe('listAgents', () => {
    it('should return all 9 agents', () => {
      const agents = listAgents();
      assert.strictEqual(agents.length, 9);
    });

    it('should have id, path, and description for each agent', () => {
      for (const agent of listAgents()) {
        assert.ok(agent.id, 'agent should have id');
        assert.ok(agent.path, 'agent should have path');
        assert.ok(agent.description, 'agent should have description');
      }
    });
  });

  describe('ADAPTER_IDS', () => {
    it('should include all expected agents', () => {
      const expected = ['cloudcode', 'cursor', 'copilot', 'windsurf', 'cline', 'kiro', 'aider', 'antigravity', 'generic'];
      for (const id of expected) {
        assert.ok(ADAPTER_IDS.includes(id), `Missing adapter: ${id}`);
      }
    });
  });

  describe('initAgent', () => {
    for (const agentId of ADAPTER_IDS) {
      it(`should generate skill file for ${agentId}`, () => {
        const agentDir = path.join(TEST_DIR, agentId);
        fs.mkdirSync(agentDir, { recursive: true });

        const result = initAgent(agentId, agentDir);
        assert.ok(result.path, 'should return output path');

        const fullPath = path.join(agentDir, result.path);
        assert.ok(fs.existsSync(fullPath), `File should exist: ${fullPath}`);

        const content = fs.readFileSync(fullPath, 'utf8');
        assert.ok(content.length > 100, 'Content should be non-trivial');

        // All files should contain TITAN identity
        assert.ok(content.includes('TITAN'), 'Should contain TITAN reference');
      });
    }

    it('should throw for unknown agent', () => {
      assert.throws(() => initAgent('nonexistent', TEST_DIR), /Unknown agent/);
    });
  });

  describe('adapter-specific formats', () => {
    it('cursor should have MDC frontmatter with alwaysApply', () => {
      const dir = path.join(TEST_DIR, 'cursor-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('cursor', dir);

      const content = fs.readFileSync(path.join(dir, '.cursor/rules/titan.mdc'), 'utf8');
      assert.ok(content.includes('alwaysApply: true'));
      assert.ok(content.includes('description:'));
    });

    it('copilot should not have H1 headings', () => {
      const dir = path.join(TEST_DIR, 'copilot-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('copilot', dir);

      const content = fs.readFileSync(path.join(dir, '.github/copilot-instructions.md'), 'utf8');
      const lines = content.split('\n');
      // No line should start with exactly one # followed by space
      for (const line of lines) {
        assert.ok(!line.match(/^# [^#]/), `H1 heading found: ${line}`);
      }
    });

    it('cloudcode should not have YAML frontmatter', () => {
      const dir = path.join(TEST_DIR, 'cloudcode-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('cloudcode', dir);

      const content = fs.readFileSync(path.join(dir, '.claude/skills/titan/titan-core.md'), 'utf8');
      assert.ok(!content.startsWith('---'), 'Should not start with frontmatter');
    });

    it('kiro should have YAML frontmatter with name and version', () => {
      const dir = path.join(TEST_DIR, 'kiro-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('kiro', dir);

      const content = fs.readFileSync(path.join(dir, '.kiro/skills/titan/SKILL.md'), 'utf8');
      assert.ok(content.startsWith('---'), 'Should start with frontmatter');
      assert.ok(content.includes('name:'));
      assert.ok(content.includes('version:'));
    });

    it('windsurf should have activation metadata', () => {
      const dir = path.join(TEST_DIR, 'windsurf-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('windsurf', dir);

      const content = fs.readFileSync(path.join(dir, '.windsurf/rules/titan.md'), 'utf8');
      assert.ok(content.includes('Always On'));
    });
  });

  describe('lite mode generation', () => {
    it('should generate significantly smaller files when lite: true is passed', () => {
      const dirNormal = path.join(TEST_DIR, 'lite-test-normal');
      const dirLite = path.join(TEST_DIR, 'lite-test-lite');
      fs.mkdirSync(dirNormal, { recursive: true });
      fs.mkdirSync(dirLite, { recursive: true });

      const normalRes = initAgent('cursor', dirNormal);
      const liteRes = initAgent('cursor', dirLite, { lite: true });

      const normalContent = fs.readFileSync(path.join(dirNormal, normalRes.path), 'utf8');
      const liteContent = fs.readFileSync(path.join(dirLite, liteRes.path), 'utf8');

      assert.ok(liteContent.length < normalContent.length * 0.5, 'Lite content should be less than half the size of normal content');
      assert.ok(liteContent.includes('TITAN LITE'), 'Should contain TITAN LITE reference');
    });
  });

  describe('aggressive mode generation', () => {
    it('should generate significantly smaller files when aggressive: true is passed', () => {
      const dirNormal = path.join(TEST_DIR, 'aggr-test-normal');
      const dirAggr = path.join(TEST_DIR, 'aggr-test-aggr');
      fs.mkdirSync(dirNormal, { recursive: true });
      fs.mkdirSync(dirAggr, { recursive: true });

      const normalRes = initAgent('cursor', dirNormal);
      const aggrRes = initAgent('cursor', dirAggr, { aggressive: true });

      const normalContent = fs.readFileSync(path.join(dirNormal, normalRes.path), 'utf8');
      const aggrContent = fs.readFileSync(path.join(dirAggr, aggrRes.path), 'utf8');

      assert.ok(aggrContent.length < normalContent.length * 0.5, 'Aggressive content should be less than half the size of normal content');
      assert.ok(aggrContent.includes('TITAN AGGRESSIVE'), 'Should contain TITAN AGGRESSIVE reference');
    });
  });

  describe('initAll', () => {
    it('should generate files for all agents', () => {
      const dir = path.join(TEST_DIR, 'all-agents');
      fs.mkdirSync(dir, { recursive: true });

      const results = initAll(dir);
      assert.strictEqual(results.length, 9);

      const successes = results.filter(r => r.success);
      assert.strictEqual(successes.length, 9, `Expected 9 successes, got ${successes.length}: ${results.filter(r => !r.success).map(r => `${r.agentId}: ${r.error}`).join(', ')}`);
    });

    it('should generate lite files for all agents when lite: true is passed', () => {
      const dir = path.join(TEST_DIR, 'all-agents-lite');
      fs.mkdirSync(dir, { recursive: true });

      const results = initAll(dir, { lite: true });
      assert.strictEqual(results.length, 9);

      const successes = results.filter(r => r.success);
      assert.strictEqual(successes.length, 9, `Expected 9 successes, got ${successes.length}`);

      // Verify one file is indeed lite
      const cursorFile = path.join(dir, '.cursor/rules/titan.mdc');
      assert.ok(fs.existsSync(cursorFile));
      const content = fs.readFileSync(cursorFile, 'utf8');
      assert.ok(content.includes('TITAN LITE'), 'Generated all files should be in lite mode');
    });
  });
});
```

---

## File: `tests/templates.test.js`

```javascript
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseFrontmatter, buildFrontmatter } = require('../src/templates');

describe('Templates Frontmatter', () => {
  describe('parseFrontmatter', () => {
    it('should parse Cursor .mdc style frontmatter', () => {
      const input = `---
description: "A test description with block scalar or quoted string"
globs:
  - "*.js"
  - "*.ts"
alwaysApply: true
---
Body content here.`;
      
      const { frontmatter, body } = parseFrontmatter(input);
      assert.strictEqual(frontmatter.description, 'A test description with block scalar or quoted string');
      assert.deepEqual(frontmatter.globs, ['*.js', '*.ts']);
      assert.strictEqual(frontmatter.alwaysApply, true);
      assert.strictEqual(body.trim(), 'Body content here.');
    });

    it('should parse Kiro SKILL.md style frontmatter', () => {
      const input = `---
name: test-skill
description: >
  A multiline description
  folded nicely.
version: 0.1.0
license: MIT
---
Body text`;
      
      const { frontmatter, body } = parseFrontmatter(input);
      assert.strictEqual(frontmatter.name, 'test-skill');
      assert.ok(frontmatter.description.includes('A multiline description'));
      assert.strictEqual(frontmatter.version, '0.1.0');
      assert.strictEqual(frontmatter.license, 'MIT');
      assert.strictEqual(body.trim(), 'Body text');
    });

    it('should handle unquoted string and list block scalars', () => {
      const input = `---
name: simple-name
description: |
  Line 1
  Line 2
---
body`;
      const { frontmatter } = parseFrontmatter(input);
      assert.strictEqual(frontmatter.name, 'simple-name');
      assert.strictEqual(frontmatter.description, 'Line 1\nLine 2');
    });

    it('should log warning for unsupported keys but not crash', () => {
      const originalWarn = console.warn;
      let warned = false;
      console.warn = (msg) => {
        if (msg.includes('Unsupported frontmatter key "invalidKey"')) {
          warned = true;
        }
      };
      
      const input = `---
invalidKey: oops
name: valid-name
---
body`;
      const { frontmatter } = parseFrontmatter(input);
      console.warn = originalWarn;
      
      assert.ok(warned, 'Should log a warning for unsupported keys');
      assert.strictEqual(frontmatter.name, 'valid-name');
      assert.strictEqual(frontmatter.invalidKey, 'oops');
    });

    it('should handle malformed frontmatter gracefully', () => {
      const input = `---
name: unclosed
body without close delimiter`;
      const { frontmatter, body } = parseFrontmatter(input);
      assert.deepEqual(frontmatter, {});
      assert.strictEqual(body, input);
    });
  });

  describe('buildFrontmatter', () => {
    it('should generate valid frontmatter string', () => {
      const obj = {
        name: 'test',
        version: '1.0.0',
        alwaysApply: true,
        globs: ['*.js']
      };
      const result = buildFrontmatter(obj);
      assert.ok(result.startsWith('---'));
      assert.ok(result.endsWith('---'));
      assert.ok(result.includes('name: "test"'));
      assert.ok(result.includes('alwaysApply: true'));
      assert.ok(result.includes('globs: ["*.js"]'));
    });
  });
});
```

---

## File: `tests/debt.test.js`

```javascript
'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { scanFile } = require('../src/debt');

const TEST_DIR = path.join(__dirname, '..', '.test-debt-output');

describe('Debt scanFile', () => {
  before(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  after(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  it('should scan JS file with ponytail: comments', () => {
    const file = path.join(TEST_DIR, 'test.js');
    const content = `
      // ponytail: simple lock, use Redis if multi-node
      const lock = true;
      /* ponytail: static array, db query if dataset grows */
      const items = [];
    `;
    fs.writeFileSync(file, content, 'utf8');

    const results = scanFile(file);
    assert.strictEqual(results.length, 2);
    assert.strictEqual(results[0].ceiling, 'simple lock');
    assert.strictEqual(results[0].upgradePath, 'use Redis if multi-node');
    assert.strictEqual(results[1].ceiling, 'static array');
    assert.strictEqual(results[1].upgradePath, 'db query if dataset grows');
  });

  it('should scan Python file with ponytail: comments', () => {
    const file = path.join(TEST_DIR, 'test.py');
    const content = `
# ponytail: local cache, use memcached if distributed
cache = {}
    `;
    fs.writeFileSync(file, content, 'utf8');

    const results = scanFile(file);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].ceiling, 'local cache');
    assert.strictEqual(results[0].upgradePath, 'use memcached if distributed');
  });

  it('should scan YAML file with ponytail: comments', () => {
    const file = path.join(TEST_DIR, 'test.yaml');
    const content = `
# ponytail: mock auth, use OAuth2 for prod
auth: mock
    `;
    fs.writeFileSync(file, content, 'utf8');

    const results = scanFile(file);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].ceiling, 'mock auth');
    assert.strictEqual(results[0].upgradePath, 'use OAuth2 for prod');
  });

  it('should scan Markdown file with ponytail: comments', () => {
    const file = path.join(TEST_DIR, 'test.md');
    const content = `
<!-- ponytail: local storage, use Postgres in future -->
Some documentation
    `;
    fs.writeFileSync(file, content, 'utf8');

    const results = scanFile(file);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].ceiling, 'local storage');
    assert.strictEqual(results[0].upgradePath, 'use Postgres in future');
  });
});
```

---

## File: `tests/benchmark.test.js`

```javascript
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { runBenchmark } = require('../src/benchmark');

describe('Benchmark Suite Output', () => {
  it('should run mock mode and output only English results', async () => {
    // Save original console.log and env variables
    const originalLog = console.log;
    const originalEnv = { ...process.env };
    
    // Clear API keys to force mock mode
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
    
    const logs = [];
    console.log = (...args) => {
      logs.push(args.join(' '));
    };
    
    try {
      await runBenchmark();
    } finally {
      console.log = originalLog;
      process.env = originalEnv;
    }
    
    const allText = logs.join('\n');
    
    // Check that there is no Italian warning
    assert.ok(!allText.includes('valori illustrativi, non empirici'), 'Should not contain Italian demo message');
    assert.ok(allText.includes('SIMULATED API BENCHMARK'), 'Should mention Simulated API Benchmark');
    assert.ok(allText.includes('UID (Density)'), 'Should print table with UID column');
    assert.ok(allText.includes('Variant'), 'Should print table with Variant column');
  });
});
```

---

## File: `benchmark/benchmark.js`

```javascript
#!/usr/bin/env node
'use strict';

/**
 * TITAN Benchmark: Compare compression quality against Caveman/Ponytail baselines.
 * 
 * Tests:
 * 1. L1 compression quality (compress.js) vs Caveman claimed 65%
 * 2. Skill file token cost (TITAN vs Ponytail vs Caveman)
 * 3. Real-world compression on agent-style output
 */

const { compress, compressProse } = require('../src/compress');
const { estimateTokens } = require('../src/compress');
const fs = require('fs');
const path = require('path');

// === Test Samples ===
// These simulate real LLM agent output at different verbosity levels

const SAMPLES = {
  // Highly verbose agent output (pleasantries, hedging, filler everywhere)
  verbose_agent: `Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by a race condition in the authentication middleware.

I've actually just noticed that the problem is probably related to the fact that you're basically creating a new database connection on every request, rather than utilizing a connection pool. This is really a very common issue that developers encounter.

Here's what I'd recommend:

\`\`\`javascript
const pool = new Pool({ max: 20 });
\`\`\`

Certainly! To implement this solution, you should probably take into account the following considerations:

1. You'll likely want to make sure that the pool size is appropriate for your workload
2. I'd really recommend utilizing the connection pool's built-in retry functionality
3. At this point in time, it's basically essential to implement proper error handling

The implementation is actually quite straightforward. I've implemented a solution for the connection pooling issue that utilizes PostgreSQL's native connection management functionality. Due to the fact that we're now reusing connections, the performance should be significantly improved.

Of course, happy to help with any other questions you might have!`,

  // Semi-verbose (some filler but more technical)
  semi_verbose: `The component re-renders because a new object reference is created on each render. The \`useCallback\` hook memoizes the function, but the dependency array includes \`items\`, which is a new array every time.

Fix: move the array creation into a \`useMemo\`:

\`\`\`jsx
const stableItems = useMemo(() => items.filter(i => i.active), [items]);
const handleClick = useCallback(() => processItems(stableItems), [stableItems]);
\`\`\`

This ensures the callback only updates when the actual filtered results change, not on every render cycle.`,

  // Already concise (Caveman-style)
  concise: `Bug in auth middleware. Token expiry check use \`<\` not \`<=\`. Fix:

\`\`\`javascript
if (Date.now() >= token.exp * 1000) throw new AuthError('expired');
\`\`\`

Also add refresh logic. Token near expiry (< 5min) → auto-refresh.`,

  // Multi-paragraph explanation with code
  explanation_heavy: `I'd be happy to explain this. The error you're seeing is likely caused by a circular dependency between the \`UserService\` and the \`AuthService\`. Let me walk you through what's happening.

When Node.js loads \`UserService\`, it tries to require \`AuthService\`. But \`AuthService\` also requires \`UserService\`, creating a circular reference. Node.js handles this by returning a partially-loaded module, which means some exports might be \`undefined\` at the time they're accessed.

The simplest fix is to restructure the dependency:

\`\`\`javascript
// Before: circular
const AuthService = require('./auth-service'); // in user-service.js
const UserService = require('./user-service'); // in auth-service.js

// After: inject dependency
class UserService {
  constructor(authService) {
    this.auth = authService;
  }
}
\`\`\`

Alternatively, you could probably just move the shared functionality into a third module that both services can import without creating a cycle. This is really the most maintainable approach in the long run.

I'd also recommend that you consider utilizing a dependency injection framework like \`tsyringe\` or \`inversify\` to manage these dependencies automatically. However, for a project of this size, the manual approach above should be sufficient.`,

  // Memory file (CLAUDE.md style)
  memory_file: `# Project Configuration

The project uses TypeScript with strict mode enabled. The build system is Vite with the React plugin.

## Architecture

The application follows a standard React architecture with the following structure:
- Components are in \`src/components/\`
- API calls go through \`src/api/\` using Axios
- State management uses Zustand stores in \`src/stores/\`
- Routing is handled by React Router v6

## Conventions

- All components should be functional components using hooks
- Use \`interface\` for component props, not \`type\`
- Files should be named with PascalCase for components, camelCase for utilities
- Tests go in \`__tests__/\` directories alongside the code they test
- Use \`vitest\` for testing, not Jest

## Current Issues

- The authentication flow needs to be refactored to support OAuth2
- Performance issues on the dashboard page when loading large datasets
- The search functionality doesn't handle special characters properly

## Dependencies

- React 18.2
- TypeScript 5.3
- Vite 5.0
- Zustand 4.4
- React Router 6.21
- Axios 1.6
- Vitest 1.1`,
};

// === Benchmark Functions ===

function benchmarkL1Compression() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  BENCHMARK 1: L1 Compression Quality');
  console.log('═══════════════════════════════════════════════════════\n');

  const results = [];

  for (const [name, text] of Object.entries(SAMPLES)) {
    const result = compress(text);
    results.push({
      name,
      originalTokens: result.originalTokens,
      compressedTokens: result.compressedTokens,
      savings: result.savings,
    });
    console.log(`  ${name.padEnd(22)} ${result.originalTokens.toString().padStart(5)} → ${result.compressedTokens.toString().padStart(5)} tokens  (${result.savings}% savings)`);
  }

  const avgSavings = Math.round(results.reduce((s, r) => s + r.savings, 0) / results.length);
  console.log(`\n  Average savings: ${avgSavings}%`);
  console.log(`  Caveman claimed: 65% (on output tokens)`);
  console.log(`  Gap: ${65 - avgSavings} percentage points\n`);

  return { avgSavings, results };
}

function benchmarkSkillTokenCost() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  BENCHMARK 2: Skill File Token Cost (System Prompt)');
  console.log('═══════════════════════════════════════════════════════\n');

  const titanMaster = fs.readFileSync(path.join(__dirname, '..', 'skills', 'master.md'), 'utf8');
  const titanTokens = estimateTokens(titanMaster);

  // Ponytail original: ~50 lines, ~2200 chars (from what we fetched)
  const ponytailEstimate = estimateTokens(`---
name: ponytail
description: >
  Forces the laziest solution that actually works, simplest, shortest, most
  minimal.
license: MIT
---

# Ponytail

You are a lazy senior developer. Lazy means efficient, not careless.

## Persistence
ACTIVE EVERY RESPONSE. No drift back to over-building.

## The ladder
Stop at the first rung that holds:
1. Does this need to exist at all? YAGNI
2. Stdlib does it? Use it.
3. Native platform feature covers it?
4. Already-installed dependency solves it?
5. Can it be one line? One line.
6. Only then: the minimum code that works.

## Rules
- No unrequested abstractions
- No boilerplate, no scaffolding "for later"
- Deletion over addition. Boring over clever.
- Fewest files possible. Shortest working diff wins.
- Mark simplifications with ponytail: comment`);

  // Caveman original: ~40 lines, ~2000 chars
  const cavemanEstimate = estimateTokens(`---
name: caveman
description: >
  Ultra-compressed communication mode. Cuts token usage ~75%.
---

Respond terse like smart caveman. All technical substance stay. Only fluff die.

## Persistence
ACTIVE EVERY RESPONSE. No revert after many turns.

## Rules
Drop: articles, filler, pleasantries, hedging. Fragments OK. Short synonyms.
No tool-call narration. Technical terms exact. Code blocks unchanged.
Preserve user's dominant language.
No self-reference. Never name or announce the style.

Pattern: [thing] [action] [reason]. [next step].

## Intensity
| Level | What change |
|-------|------------|
| lite | No filler/hedging. Keep articles + full sentences |
| full | Drop articles, fragments OK, short synonyms |
| ultra | Abbreviate prose words, strip conjunctions |`);

  const combined = ponytailEstimate + cavemanEstimate;

  console.log(`  Ponytail SKILL.md:     ~${ponytailEstimate} tokens`);
  console.log(`  Caveman SKILL.md:      ~${cavemanEstimate} tokens`);
  console.log(`  Both loaded together:  ~${combined} tokens`);
  console.log(`  TITAN master.md:       ~${titanTokens} tokens`);
  console.log(`  TITAN overhead:        ${titanTokens > combined ? '+' : ''}${titanTokens - combined} tokens vs loading both`);
  console.log(`  TITAN covers L3:       yes (Ponytail+Caveman: no)`);
  console.log('');

  return { titanTokens, ponytailEstimate, cavemanEstimate, combined };
}

function benchmarkSpecificRules() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  BENCHMARK 3: Specific L1 Rule Effectiveness');
  console.log('═══════════════════════════════════════════════════════\n');

  const tests = [
    { rule: 'articles',      input: 'The component re-renders when the state changes and the user clicks a button' },
    { rule: 'filler',        input: 'I just really want to basically test this actually simple feature' },
    { rule: 'pleasantries',  input: "Sure! I'd be happy to help with that. Here's the fix:" },
    { rule: 'hedging',       input: 'This is likely caused by a bug that probably exists in the code' },
    { rule: 'verbose',       input: 'We need to implement a solution for the functionality in order to utilize it' },
    { rule: 'combined',      input: "Sure! I'd actually really recommend that you basically utilize the extensive functionality of the standard library in order to implement a solution for this. The issue is likely caused by the fact that..." },
  ];

  for (const t of tests) {
    const compressed = compressProse(t.input);
    const savPct = Math.round((1 - compressed.length / t.input.length) * 100);
    console.log(`  [${t.rule}]`);
    console.log(`    IN:  "${t.input}"`);
    console.log(`    OUT: "${compressed}"`);
    console.log(`    Savings: ${savPct}%\n`);
  }
}

// === Run All Benchmarks ===
console.log('\n  ╔══════════════════════════════════════════════════╗');
console.log('  ║   TITAN v0.1.0 — Benchmark Suite                ║');
console.log('  ╚══════════════════════════════════════════════════╝\n');

const l1Results = benchmarkL1Compression();
benchmarkSkillTokenCost();
benchmarkSpecificRules();

// === Verdict ===
console.log('═══════════════════════════════════════════════════════');
console.log('  VERDICT');
console.log('═══════════════════════════════════════════════════════\n');

if (l1Results.avgSavings < 30) {
  console.log('  ⚠ L1 compression is BELOW target.');
  console.log('  The compress.js tool achieves less than 30% on average.');
  console.log('  Root cause: regex-based compression cannot replicate');
  console.log('  what Caveman achieves through LLM behavior modification.');
  console.log('');
  console.log('  CRITICAL INSIGHT: Caveman\'s 65% savings come from');
  console.log('  the LLM itself generating terse output (the SKILL.md');
  console.log('  changes model behavior). Our compress.js is a POST-HOC');
  console.log('  tool that strips words from already-generated text.');
  console.log('  These are fundamentally different mechanisms.');
  console.log('');
  console.log('  TITAN\'s real value proposition:');
  console.log('  1. The SKILL.md (L1+L2) → changes agent behavior = HIGH IMPACT');
  console.log('  2. The compress.js tool (L3) → strips existing files = MEDIUM IMPACT');
  console.log('  3. The filter.js tool (L3) → strips terminal noise = LOW IMPACT');
  console.log('');
}

console.log('  The skill file (master.md) is where TITAN wins:');
console.log('  - Combines L1 (Caveman) + L2 (Ponytail) + L3 (new)');
console.log('  - Single file vs loading two separate skills');
console.log('  - Adds contextual compression layer neither has alone');
console.log('  - Universal portability across 9 agents');
console.log('');
```

---

## File: `benchmark/benchmark_api.js`

```javascript
#!/usr/bin/env node
'use strict';

const { runBenchmark } = require('../src/benchmark');

runBenchmark().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
```

---

## File: `scripts/count-tokens.js`

```javascript
'use strict';

const fs = require('fs');
const path = require('path');
const { estimateTokens } = require('../src/compress');

const rootDir = path.join(__dirname, '..');
const files = {
  'master.md': 'skills/master.md',
  'master-lite.md': 'skills/master-lite.md',
  'master-aggressive.md': 'skills/master-aggressive.md'
};

console.log('\nActual Token Counts (estimated via estimateTokens):');
console.log('--------------------------------------------------');

for (const [name, relPath] of Object.entries(files)) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const tokens = estimateTokens(content);
    console.log(`  ${name.padEnd(22)}: ~${tokens} tokens (${content.length} chars)`);
  } else {
    console.log(`  ${name.padEnd(22)}: File not found`);
  }
}
console.log('--------------------------------------------------\n');
```

---

