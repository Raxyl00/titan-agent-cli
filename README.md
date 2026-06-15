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

# Generate a lightweight version (~375 tokens, perfect for short chats)
titan init --agent=cursor --lite
```

---

## 🧱 The Three Layers

TITAN compresses token footprint across three independent vectors that compose multiplicatively:

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
titan init --agent=<name> [--lite]

# Generate rule files for ALL compatible agents in the directory
titan init --all [--lite]

# Compress a static Markdown file (L3 contextual compression)
titan compress CLAUDE.md

# Scan the codebase for ponytail: comments to audit tech debt
titan debt [--dir=<path>]

# Stream filter to strip terminal/build noise
npm run build 2>&1 | titan filter
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

Se succede qualcosa, non voglio saperne assolutamente nulla. Per qualsiasi problema legale o di responsabilità, fa fede esclusivamente quanto scritto nella licenza MIT (ovvero: il software viene fornito "così com'è", senza alcuna garanzia).

*In plain English: if it breaks, costs you money, or causes issues, it's on you. Check the LICENSE.*

---

## 📄 License

MIT
