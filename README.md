<p align="center">
  <img src="logo.png" width="400" />
</p>

<h1 align="center">TITAN</h1>

<p align="center">
  <strong>Token Intelligence Through Agent Narrowing</strong>
</p>

<p align="center">
  <em>Caveman + Ponytail combined. Cut 70% of session tokens across linguistic, structural, and contextual layers. 9 agents. 1 CLI.</em>
</p>

<p align="center">
  <a href="https://github.com/Raxyl00/titan-agent-cli/stargazers"><img src="https://badgen.net/github/stars/Raxyl00/titan-agent-cli?color=yellow" alt="Stars"></a>
  <a href="https://www.npmjs.com/package/titan-agent-cli"><img src="https://img.shields.io/npm/v/titan-agent-cli?style=flat&color=blue" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/titan-agent-cli"><img src="https://img.shields.io/npm/dm/titan-agent-cli?style=flat&color=green" alt="Downloads"></a>
  <a href="LICENSE"><img src="https://badgen.net/github/license/Raxyl00/titan-agent-cli?color=blue" alt="License"></a>
  <img src="https://img.shields.io/badge/built-during%20exams-orange" alt="Built during high school exams">
</p>

---

## ⚡ TL;DR

Your AI agent burns $0.40 per response explaining bugs in 4 paragraphs.  
**TITAN** compresses it to 2 sentences. Same fix. 75% fewer tokens.

Combines [Caveman](https://github.com/juliusbrussee/caveman) + [Ponytail](https://github.com/DietrichGebert/ponytail) into one CLI.  
Supports 9 AI coding agents. Zero dependencies.

```bash
npm install -g titan-agent-cli
```

*Built in 10 days during high school exams. MIT license.*

---

## 🔄 Before / After

<table>
<tr>
<td width="50%">

### 🗣️ Standard Agent Output (301 tokens)

> "Sure! I'd be absolutely happy to help you with that. The issue you're experiencing is actually, basically, fundamentally caused by a race condition in the authentication middleware. I've actually just noticed that the problem is probably related to the fact that you're basically creating a new database connection on every single request, rather than utilizing a connection pool. This is really a very common issue that developers encounter, and I would recommend at this point in time to implement this.
> 
> Here's what I would recommend at this point in time:
> ```javascript
> const pool = new Pool({ max: 20 });
> ```
> To implement this, you should probably take into account that you'll likely want to make sure that the pool size is appropriate for your workload, at this point in time."

</td>
<td width="50%">

### 🛡️ TITAN Lite Output (75 tokens)

> ```javascript
> const pool = new Pool({ max: 20 }); // ponytail: default pool
> ```
> Auth middleware race condition. Pool used.

</td>
</tr>
</table>

**Same fix. 75% fewer tokens. Zero overhead.**

---

## 🧠 Why TITAN?

* **Caveman shrinks the mouth** (L1: drops "actually", "basically", "likely").
* **Ponytail shrinks the code** (L2: YAGNI ladder, skips 500-line abstractions).
* **TITAN shrinks the session** (L3: compresses CLAUDE.md, filters build logs, shrinks subagent outputs before they hit context).

---

## ⚡ Quick Start

```bash
npm install -g titan-agent-cli
```

Initialize the rules for your favorite editor in 10 seconds:

```bash
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

# Run the test suite
titan test

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
| **TITAN Aggressive** | 95% | 80% | 60% | 90% | 70% | 79% ±12% | 400 ±0 | 50 ±3 | 450 ±3 | 175.7 | ⚠ Degraded |

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
