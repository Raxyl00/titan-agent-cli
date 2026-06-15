# TITAN: Unified LLM Agent Compression Framework

## Reverse Engineering & System Design of Ponytail + Caveman Integration

---

## Executive Summary

**TITAN** (Token Intelligence Through Agent Narrowing) is a unified compression framework for LLM agents designed to reduce token consumption across three orthogonal dimensions — linguistic, structural, and contextual — without degrading reasoning and tool-use capabilities. The system emerges from the deep reverse engineering of two complementary open-source repositories: **Ponytail** by Dietrich Gebert and **Caveman** by Julius Brussee.

The analysis reveals that Ponytail and Caveman operate on fundamentally different levels of compression. Ponytail acts at the **structural** level (modifying code-building decisions before they are generated), while Caveman acts at the **linguistic** level (compressing the natural language already generated). Integrating them into a three-level architecture — Linguistic (L1), Structural (L2), and Contextual (L3) — yields a compound savings estimate of **70% to 85%** of total session tokens while preserving technical correctness and reasoning depth.

Empirical data collected from the official benchmarks of both repositories confirm this complementarity. Ponytail reduces generated code by **80-94%** (3-6x fewer lines, 47-77% lower cost), while Caveman reduces output tokens by **~75%** (65% on average across 10 different tasks) and compresses context files (CLAUDE.md, project notes) by **~46%**. These savings are orthogonal: compressing natural language does not affect the amount of generated code, and vice versa.

The TITAN framework proposes a modular architecture where an agent reasoning core coordinates three specialized compression layers, each equipped with fallback mechanisms (Auto-Clarity for the linguistic layer, YAGNI-gate for the structural layer, and LRU eviction for the contextual layer) ensuring operational safety in critical scenarios.

---

## PHASE 1 — Deep Reverse Engineering

### 1.1 Ponytail: Anatomy of a Behavioral Constraint System

#### 1.1.1 System Type and Point of Intervention

Ponytail is an **agent middleware** that functions as a **reasoning modifier**. Its point of intervention is **system prompt shaping** — the entire ruleset is injected as system instructions at the beginning of each session and remains active in every turn ("ACTIVE EVERY RESPONSE. No drift back to over-building"). Unlike a simple prompt trick, Ponytail does not limit the model's expressive capabilities: it modifies the decision-making process that precedes the generation of output.

The core mechanism is the **"Lazy Ladder"** — a 6-rung decision hierarchy that the agent must traverse before writing any code:

| Rung | Decision | Token Impact |
|------|----------|--------------|
| 1. YAGNI | "Does this need to exist?" → if no, skip | 100% elimination |
| 2. Stdlib | Does the standard library do it? → use it | ~85% code reduction |
| 3. Native | Does a platform native feature cover it? | ~70% code reduction |
| 4. Existing | Does an installed dependency solve it? | ~50% code reduction |
| 5. One Line | Can it be one line? → one line | ~30% code reduction |
| 6. Minimum | Only then: the minimum working code | ~15% code reduction |

This ladder is a **reflex**, not a research project ("The ladder is a reflex, not a research project. Two rungs work → take the higher one and move on"). The agent does not need to exhaustively analyze all options: it must stop at the first rung that holds and proceed.

#### 1.1.2 Real Token Reduction Mechanism

Token usage reduction occurs across two simultaneous dimensions:

**Dimension 1: Reduction of generated code (output tokens)** — The Lazy Ladder drastically reduces the lines of code produced. The official Ponytail benchmark measures `code_loc` (non-empty, non-comment lines of code inside fenced blocks) across 5 everyday tasks (email validator, debounce, CSV sum, countdown timer, rate limiter) using 3 models (Haiku, Sonnet, Opus) and 3 arms (baseline, caveman, ponytail). The reported results show **80-94% less code** compared to the baseline without the skill. This translates directly to fewer output tokens to process and store in the conversation context.

**Dimension 2: Reduction of explanations (output tokens)** — Ponytail enforces a strict output format: "Code first. Then at most three short lines: what was skipped, when to add it." The pattern is `[code] → skipped: [X], add when [Y].` This automatically eliminates "feature tours", "design notes", and "paragraphs defending a simplification" that constitute complexity smuggled back in as prose. An explanation longer than the code itself must be deleted.

**Dimension 3: Prevention of context growth** — By generating fewer files and fewer lines per file, Ponytail reduces the context accumulated in the session. If an agent generates 5 files instead of 1, each subsequent editing operation must load all those files into the context. The savings compound over time.

#### 1.1.3 The "ponytail:" Comment System

A critical and often underestimated mechanism is the `ponytail:` comment system. Every deliberate simplification must be marked with a comment naming the limit (ceiling) and the migration path (upgrade path). Example: `# ponytail: global lock, per-account locks if throughput matters`.

This system performs three functions in the compression pipeline:

1. **Accountability**: makes explicit what has been sacrificed, preventing drift toward overly simplistic solutions.
2. **Debt tracking**: the `/ponytail-debt` command collects all comments into a ledger, preventing a deferral from becoming permanent ("later means never").
3. **Token self-documenting**: the comment is concise (pattern: `ponytail: <ceiling>, <upgrade path>`) and adds few tokens compared to the defensive prose that would otherwise accompany each choice.

#### 1.1.4 Safety Rules and Boundaries

Ponytail clearly defines what CANNOT be simplified: input validation at trust boundaries, error handling that prevents data loss, security measures, accessibility basics, and anything explicitly requested by the user. Hardware is a special case: "a real clock drifts, a real sensor reads off" — calibration is necessary in the physical world even when the theoretical model does not require it.

Correctness rules also dictate that "lazy code without its check is unfinished": every non-trivial logic (branch, loop, parser, money/security path) must leave behind ONE runnable check — an `assert`-based `demo()`/`__main__` self-check or a small `test_*.py`. No frameworks, no fixtures, no per-function suites unless asked. Here too YAGNI applies: trivial one-liners need no test.

#### 1.1.5 The Review Subsystem

Ponytail includes three specialized review commands:

* `/ponytail-review`: Reviews the current diff for over-engineering, returning a delete-list with the format `L<line>: <tag> <what>. <replacement>.` where the tags are: `delete:` (dead code), `stdlib:` (hand-rolled → built-in), `native:` (dependency → platform feature), `yagni:` (abstraction with one implementation), `shrink:` (same logic, fewer lines).
* `/ponytail-audit`: Reviews the entire repository, using the same format but repo-wide, ranked by impact.
* `/ponytail-debt`: Ledger tracking of `ponytail:` comments.

These commands do not automatically apply changes — they are one-shot reports. This is critical: the final decision remains human, preventing a "simplification cascade" where an automatic system eliminates too much.

#### 1.1.6 Modular Intensity

Ponytail supports three intensity levels:

| Level | Behavior | Ideal Use |
|-------|----------|-----------|
| **lite** | Builds what is asked, names the laziest alternative in one line | Exploratory usage, early project phases |
| **full** (default) | Enforces the ladder, stdlib and native first, shortest diff | Daily development, safe default |
| **ultra** | Extremist YAGNI, deletion before addition, challenges requirements | Legacy codebases, technical cleanup |

The level persists until explicitly changed or the session ends, ensuring consistency over time.

---

### 1.2 Caveman: Anatomy of an Output Compression Engine

#### 1.2.1 System Type and Point of Intervention

Caveman is an **output compressor** that operates as a **prompt layer**. Its point of intervention is **output rewriting**: it transforms the natural language already produced by the model into a minimal form that preserves 100% of the technical substance. The Caveman README states explicitly: **"Caveman only affects output tokens — thinking/reasoning tokens untouched. Caveman no make brain smaller. Caveman make mouth smaller."**

Unlike Ponytail, which influences the upstream decision-making process, Caveman intervenes downstream: the model reasons normally, then the response is "cavemanized" before being presented to the user. This distinction is fundamental to understanding the composition of the two systems.

#### 1.2.2 Real Token Reduction Mechanism

Caveman relies on a set of precise, deterministic linguistic rules:

| Category | Elements Removed | Example |
|----------|------------------|---------|
| **Articles** | a, an, the | "The component re-renders" → "Component re-renders" |
| **Filler words** | just, really, basically, actually, simply | "I'd recommend" → "Use" |
| **Pleasantries** | sure, certainly, of course, happy to | "Sure! I'd be happy to help" → (omitted) |
| **Hedging** | likely, probably, might, seems | "is likely caused by" → "caused by" |
| **Tool-call narration** | "I'll search for that" | (omitted, run directly) |

It also relies on active compression rules:

| Rule | Example |
|------|---------|
| **Fragments OK** | Sentences without subject or auxiliary verb |
| **Short synonyms** | big instead of extensive, fix instead of "implement a solution for" |
| **Standard pattern** | `[thing] [action] [reason]. [next step].` |
| **Acronyms OK** | DB, API, HTTP — never invent new abbreviations |

The results are documented in the official benchmark: across 10 different tasks, Caveman reduces output tokens from an average of 1214 to 294, representing an **average savings of 65%** (range 22-87%).

#### 1.2.3 Intentional Preservation: What is NOT Compressed

A critical aspect of Caveman's design is its **selective compression**. The system has an explicit boundary:

* **Code blocks unchanged**: code is never modified or abbreviated.
* **Technical terms exact**: technical terms remain intact.
* **Error strings verbatim**: errors are quoted exactly.
* **API names preserved**: API names are not touched.
* **User's dominant language preserved**: Caveman compresses the style, not the language.
* **Commit-type keywords** (feat/fix/docs/etc.) remain unaltered.

This is essential for tool-use performance: if Caveman compressed function names or API call parameters, it would break tool calling.

#### 1.2.4 The Auto-Clarity System

Caveman includes a fallback mechanism called **Auto-Clarity** that suspends compression in critical scenarios:

* Security warnings (CVE-class bugs need full explanation).
* Irreversible action confirmations.
* Multi-step sequences where the order of fragments could be misread.
* When compression itself creates technical ambiguity.
* When the user asks to clarify or repeats a question.

Documented example: for a destructive operation like `DROP TABLE users`, Caveman first emits a full warning in normal prose ("Warning: This will permanently delete all rows..."), then resumes caveman mode ("Caveman resume. Verify backup exist first.").

This mechanism is critical for the **safety of the integrated system**: without Auto-Clarity, a compressed agent might express dangerous confirmations ambiguously.

#### 1.2.5 The caveman-compress Subsystem

An often overlooked but high-impact component is `caveman-compress`: a tool that compresses project memory files (CLAUDE.md, project notes, todo lists) into caveman-speak. The benchmark documents savings of **38-60%** on real files, with an average of **46%**.

The importance of this subsystem lies in **time multiplication**: unlike per-turn compression (which saves tokens once), compressing CLAUDE.md reduces input tokens for **every session**. If a 706-token file is compressed to 285, the savings is 421 tokens × the number of sessions. Over 100 sessions, this results in **42,100 tokens saved** from a single compression operation.

#### 1.2.6 The Cavecrew Subsystem (Subagent Compression)

Cavecrew is a system of specialized subagents (investigator, builder, reviewer) that output in caveman format. The real benefit is in **context window management**: the results of subagent calls are injected into the main context verbatim. A vanilla Explore that returns 2000 tokens of prose costs 2000 tokens of budget. The same result from a cavecrew-investigator returns ~700 tokens. Across 20 delegations in a session, "that's the difference between context exhaustion and finishing the task."

#### 1.2.7 Modular Intensity

Caveman offers 6 intensity levels — significantly more granular than Ponytail:

| Level | Characteristics | Estimated Savings |
|-------|-----------------|-------------------|
| **lite** | No filler/hedging, articles and full sentences | ~30% |
| **full** (default) | Drop articles, fragments OK, short synonyms | ~65% |
| **ultra** | Abbreviate prose words (DB/auth/config/req/res/fn/impl), strip conjunctions, arrows for causality | ~75% |
| **wenyan-lite** | Semi-classical Chinese, drop filler/hedging | ~50% |
| **wenyan-full** | Maximum classical terseness, fully 文言文 | ~80% |
| **wenyan-ultra** | Extreme abbreviation with classical Chinese feel | ~85% |

The wenyan levels are an interesting linguistic exploration demonstrating how compression can extend beyond English — 文言文 (classical Chinese) is intrinsically more concise than modern English or Chinese.

---

## PHASE 2 — Critical Differences: Ponytail vs Caveman

### 2.1 Behavioral vs Structural Compression

The fundamental difference between the two systems is the **locus of compression**. Ponytail compresses **behavior** — it modifies the agent's decision-making behavior before it generates output. Caveman compresses **output** — it transforms the language after it has been generated.

| Dimension | Ponytail | Caveman |
|-----------|----------|---------|
| **When it acts** | Before generation (upstream) | After generation (downstream) |
| **What it modifies** | Decision of what to build | How the built output is expressed |
| **Persistence** | Every turn, throughout the session | Every turn, throughout the session |
| **Point of intervention** | System prompt → reasoning → output | Output → rewriting |

This distinction has huge practical consequences: Ponytail can decide not to write a component at all (YAGNI → 0 tokens generated), while Caveman can only compress what has been said. At the same time, Caveman can compress Ponytail's explanation prose, and Ponytail can generate less code for Caveman to compress.

### 2.2 Reasoning Depth Reduction vs Code Reduction

| Aspect | Ponytail | Caveman |
|--------|----------|---------|
| **Thinking tokens** | Indirectly reduced (fewer decisions to make) | Explicitly NOT touched ("thinking/reasoning tokens untouched") |
| **Code tokens** | Massively reduced (-80-94%) | Untouched ("Code blocks unchanged") |
| **Prose tokens** | Partially reduced (strict output pattern) | Massively reduced (-65% average) |
| **Context tokens** | Indirectly reduced (fewer files generated) | Directly reduced (caveman-compress, cavecrew) |

Ponytail reduces reasoning depth by simplifying the problem: if a cache can be `@lru_cache(maxsize=1000)`, the agent does not need to reason about TTL, eviction policies, thread safety, and statistics tracking. Caveman leaves reasoning intact but compresses its expression.

### 2.3 Static Rules vs Runtime Shaping

| Feature | Ponytail | Caveman |
|---------|----------|---------|
| **Rule format** | Decision ladder (6 rungs) + output pattern | Linguistic rewrite rules + intensity levels |
| **Runtime adaptation** | Limited (3 fixed levels) | Extended (6 levels + auto-clarity) |
| **Context awareness** | Yes (trust boundaries, hardware) | Yes (security, irreversible actions) |
| **Failover** | No explicit failover | Automatic Auto-Clarity override |

Ponytail has a more structured but less adaptive ruleset. Caveman has a more flexible ruleset with an automatic fallback mechanism (Auto-Clarity) that Ponytail lacks.

### 2.4 Implicit vs Explicit Token Savings

| Type of Savings | Ponytail | Caveman |
|-----------------|----------|---------|
| **Explicit** (directly measurable) | code_loc (-80-94%), cost reduction (-47-77%) | output_tokens (-65%), input_tokens (-46% memory files) |
| **Implicit** (compounding over time) | Fewer files in repo → less context for future sessions | Compressed CLAUDE.md → savings in every new session |
| **Compounding** | Less complexity → fewer bugs → fewer fixes → fewer tokens | Subagent compressed → more delegations possible → larger tasks completed |

Ponytail's implicit savings are particularly significant: a codebase with fewer files and fewer abstractions generates less context for all future sessions. It is a "one-time investment, perpetual return."

### 2.5 Failure Modes: Where the System Breaks

#### Ponytail Failure Modes

| Scenario | Problem | Mitigation |
|----------|---------|-------------|
| **Excessive simplification** | Extreme YAGNI might skip necessary features | "lite" level as default for new projects; explicit user override |
| **Over-simplification cascade** | `ponytail:` comments without marked upgrade path | `/ponytail-debt` for tracking; the comment itself is accountability |
| **Hardware/platform mismatch** | "One line" solutions might fail on real devices | Explicit rule: "Hardware is never the ideal on paper" — calibration knob always included |
| **Team friction** | "Lazy" code can appear "sloppy" to junior developers | `ponytail:` comment convention as documentation of choice |
| **Tool-use degradation** | If applied to tool-call parameters, it might over-simplify | Explicit boundary: governs what you build, not how you talk; tool calls are separate |

#### Caveman Failure Modes

| Scenario | Problem | Mitigation |
|----------|---------|-------------|
| **Ambiguity in multi-step sequences** | Fragments without conjunctions can create ambiguous order | Auto-Clarity: drop caveman for sequential operations |
| **Lost nuance in security contexts** | "Bug in auth" might be too concise for CVE-class | Auto-Clarity for security findings: full explanation + reference |
| **Tool-call narration removal** | "No tool-call narration" might confuse users expecting confirmation | Tool result is the feedback; narration is redundant |
| **Language interference** | Stylistic compression might affect comprehension in non-native languages | Preserve user's dominant language — compresses style, not language |
| **Context strip over-aggressive** | `caveman-compress` might eliminate necessary information | Automatic `.original.md` backup; code/URLs/paths byte-preserved |

### 2.6 Complementarity Matrix

The following matrix shows how the two systems complement each other in a unified framework:

| Pipeline Stage | Ponytail Contribution | Caveman Contribution | TITAN Integration |
|---------------|----------------------|---------------------|-------------------|
| **Input preprocessing** | — | `caveman-compress` for memory files | L3: Contextual Compression |
| **Reasoning phase** | Lazy Ladder (decision gate) | — (thinking untouched) | L2: Structural gate upstream |
| **Code generation** | YAGNI → minimum code | Code blocks unchanged | L2 primary, L1 bypass for code |
| **Explanation prose** | Pattern `[code] → skipped: X` | Article/filler drop, fragment mode | L1 + L2 combined |
| **Tool use** | — | Preserved verbatim | Tool-Call Shaper (standard format) |
| **Context management** | Fewer files generated | `cavecrew` subagents (-60%) | L3: LRU + subagent shrink |
| **Review/audit** | `/ponytail-review` tags | `/caveman-review` one-liners | Unified review format |

---

## FASE 3 — 3-Level Token Compression Model

The analysis of both repositories allows the definition of a formal three-level compression model, where each level operates on an orthogonal dimension of LLM token usage.

### 3.1 Level 1: Linguistic Compression (LOW IMPACT — 5-15%)

The linguistic level is the most intuitive but also the least impactful in absolute terms. It compresses **how** the model expresses concepts, not the **content**.

**Mechanisms (derived from Caveman):**

| Technique | Savings | Example |
|-----------|---------|---------|
| Article drop | ~2-3% | "The component" → "Component" |
| Filler strip | ~3-5% | "I'd recommend using" → "Use" |
| Hedging removal | ~2-3% | "is likely caused by" → "caused by" |
| Synonym compression | ~1-2% | "implement a solution for" → "fix" |
| Fragment mode | ~2-3% | "Your component re-renders because" → "New object ref each render" |

**Limits:** The linguistic level cannot compress code (explicit boundary), cannot compress technical terms, and has a physical floor determined by the need to preserve understandability. The maximum practical savings is ~15% (Caveman ultra on highly verbose prose), with a realistic ~5-10% on already concise technical texts.

**Key insight:** Linguistic compression is **low impact but high frequency** — applied to every single turn, on every type of output, its cumulative effect becomes significant. Furthermore, it does not require changes to the agent's reasoning, making it the "safest" form of compression to implement.

### 3.2 Level 2: Structural Compression (CORE — 60-85%)

The structural level is the most impactful and the most complex to implement correctly. It compresses the **generated content** by modifying the agent's decisions on what to build.

**Mechanisms (derived from Ponytail):**

| Technique | Savings | Example |
|-----------|---------|---------|
| YAGNI elimination | 100% (of task) | "Do you actually need a cache?" → skip |
| Stdlib substitution | ~85% | Hand-rolled 120-line TTLCache → `@lru_cache` 1 line |
| Native platform leverage | ~70% | flatpickr + wrapper + stylesheet → `<input type="date">` |
| Existing dep reuse | ~50% | No new dependency for features already covered |
| One-line minimization | ~30% | Multi-file class hierarchy → single function |

**The fundamental principle:** Structural compression does not "compress" in the traditional computer science sense (lossless transformation of representation). It is a **lossy transformation** that intentionally discards unnecessary complexity. The "loss" is designated and accountable through the `ponytail:` comments system.

**Key insight:** The real gain is structural, not linguistic. An agent that generates 5 files (controller, service, repository, schema, exception) instead of 1 not only generates more initial tokens, but increases the context window for all future operations on those files. Structural savings have a **compounding effect** over time.

### 3.3 Level 3: Contextual Compression (HIGH IMPACT — 40-60%)

The contextual level compresses what the agent "remembers" and "sees" during a session. It is the least explored level by the two repositories but has the highest potential impact on long sessions.

**Mechanisms (hybrid Ponytail + Caveman + TITAN extensions):**

| Technique | Source | Savings | Description |
|-----------|--------|-----------|-------------|
| Memory file compression | Caveman `compress` | ~46% | CLAUDE.md, project notes in caveman prose |
| Subagent output shrink | Caveman `cavecrew` | ~60% | Subagent tool results in compressed format |
| Context window strip | TITAN extension | ~30-40% | Elimination of redundant turns from history |
| MCP description shrink | TITAN extension | ~25-35% | Compression of MCP tool descriptions |
| LRU eviction | TITAN extension | variable | Prioritized context eviction under pressure |

**Key insight:** The contextual layer is the only one acting on **input tokens** (rather than output). Input tokens cost less than output tokens for most LLM providers, but they are more frequent: every turn of the conversation is re-sent as context. A CLAUDE.md file compressed from 706 to 285 tokens saves 421 tokens at **every turn** of every session.

### 3.4 Mathematical Composition Model

The three levels are **orthogonal** — they compose multiplicatively:

```
Total Savings = 1 - (1 - L1_savings) × (1 - L2_savings) × (1 - L3_savings)
```

With conservative values:
- L1 (linguistic): 10% → factor 0.90
- L2 (structural): 70% → factor 0.30
- L3 (contextual): 40% → factor 0.60

```
Total Remaining = 0.90 × 0.30 × 0.60 = 0.162
Total Savings = 1 - 0.162 = 83.8%
```

This means that a fully implemented TITAN framework could reduce total session token usage by approximately **84%** compared to an unconstrained agent — while keeping technical correctness and reasoning depth intact.

**Important note:** This is a theoretical upper bound. In practice, the levels do not compose perfectly: L2 (Ponytail) reduces the amount of prose generated, decreasing L1's (Caveman) scope. Conversely, when Ponytail decides YAGNI (0 output), Caveman has nothing to compress. Realistic savings are estimated between **70% and 80%**.

---

## PHASE 4 — Design of the Unified TITAN System

### 4.1 Architectural Principles

TITAN is designed based on five principles derived from the analysis of the two repositories:

**P1: Orthogonality** — The three levels of compression are independent. The failure of one level does not compromise the others.

**P2: Accountability** — Every simplification must be traceable (`ponytail:` comments system) and reversible (debt ledger).

**P3: Safety Override** — Automatic fallback mechanisms (Auto-Clarity) for critical operations: security, irreversible actions, multi-step sequences.

**P4: Intensity Modularity** — Adjustable compression levels (lite/full/ultra) to adapt to the operational context.

**P5: Tool-Use Preservation** — The format and content of tool calls are never compressed. Compression acts on reasoning and language, never on executive instructions.

### 4.2 System Architecture

#### 4.2.1 Core Components

The TITAN system is divided into six main components:

**1. Hybrid Reasoner** — Combines Ponytail's Lazy Ladder with Caveman's linguistic rules. The reasoner first applies the structural decision gate (L2), then routes the output through the linguistic compressor (L1). This ensures that the decision of what to build is independent of how to describe it.

**2. Debt Tracker** — A simplification tracking system based on `ponytail:` comments. It collects, catalogs, and flags debt items without an upgrade path. Includes integration with version control for temporal tracking.

**3. Mode Router** — Manages intensity levels for each compression layer. L1 can be lite/full/ultra independently of L2. Allows configurations like "L2=full (build minimum) + L1=lite (clear explanations)" for onboarding scenarios.

**4. Auto-Clarity Override** — Automatic fallback system based on Caveman's rules but extended to L2. When an operation is classified as security-relevant or irreversible, all compression levels are suspended until the critical operation is complete.

**5. Tool-Call Shaper** — Standardized formatter for tool calls. Separates executive content (preserved verbatim) from explanatory content (compressed). Ensures L1 and L2 do not "leak" into the JSON format of API calls.

**6. Token Profiler** — Real-time token usage and savings monitoring system. Provides metrics per level (L1/L2/L3 savings) and per component (code/prose/context/tool). Includes provider-based USD cost estimation.

#### 4.2.2 Execution Pipeline

```
INPUT (User Query + Context)
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  L3: CONTEXTUAL COMPRESSION                         │
│  - Memory file compression (caveman-compress)       │
│  - Context window strip (redundancy)                │
│  - MCP description shrink                           │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  L2: STRUCTURAL COMPRESSION (Ponytail Ladder)       │
│  - YAGNI gate → Stdlib → Native → One-line          │
│  - Output pattern: [code] → skipped: X              │
│  - Debt tracking via ponytail: comments             │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  L1: LINGUISTIC COMPRESSION (Caveman Engine)        │
│  - Article/filler/hedging drop                      │
│  - Fragment mode, synonym compression               │
│  - Auto-Clarity override for safety                 │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  TITAN AGENT REASONING CORE                         │
│  - Hybrid reasoning (L1 + L2 coordination)          │
│  - Tool-call shaping (preserved verbatim)           │
│  - Safety override integration                      │
└─────────────────────────────────────────────────────┘
    │
    ├──→ TOOL USE (preserved, uncompressed)
    │
    ▼
OUTPUT (Compressed Response + Tool Calls)
```

### 4.3 Implementation Specifications

#### 4.3.1 Unified SKILL.md Format

TITAN's SKILL.md format inherits the frontmatter structure of both repositories:

```yaml
---
name: titan
description: >
  Unified token compression framework. Structural (Ponytail Ladder) + Linguistic (Caveman Engine)
  + Contextual (Strip & Shrink) compression. Preserves reasoning quality and tool-use performance.
  Intensity levels: lite, full, ultra. Auto-Clarity safety override.
license: MIT
---
```

The body of the file integrates the rules of both systems with TITAN extensions:

**L2 Section (Structural)** — Integrates Ponytail's Lazy Ladder with context strip extensions:

* The ladder remains unchanged (YAGNI → Stdlib → Native → Existing → One-line → Minimum).
* Added L3 pre-check rule: "Before building, check context window pressure. If >80%, prefer YAGNI → Stdlib more aggressively."
* `ponytail:` comments system remains unchanged.

**L1 Section (Linguistic)** — Integrates Caveman's rules with L2 coordination extensions:

* Drop rules (articles, filler, pleasantries, hedging) remain unchanged.
* Added L2 coordination rule: "When L2 produces code with `ponytail:` comment, preserve comment verbatim. Do not compress ponytail: markers."
* Auto-Clarity override extended to L2: "When L2 defers a decision (e.g., 'add when throughput matters'), express the condition clearly even in full/ultra mode."

**L3 Section (Contextual)** — New section integrating caveman-compress, cavecrew, and TITAN extensions:

* Memory file compression: apply caveman ruleset to CLAUDE.md and project notes (preserve code blocks, URLs, paths).
* Subagent output format: structured caveman output for investigator/builder/reviewer.
* Context window management: LRU eviction with priority (tool results > user queries > agent prose).

#### 4.3.2 Command System

TITAN inherits and unifies the commands of both repositories:

| Command | Function | Level |
|---------|----------|---------|
| `/titan [lite\|full\|ultra]` | Set global intensity (all layers) | All |
| `/titan L1 [lite\|full\|ultra]` | Set L1 intensity only | L1 |
| `/titan L2 [lite\|full\|ultra]` | Set L2 intensity only | L2 |
| `/titan L3 [on\|off]` | Toggle L3 (contextual) | L3 |
| `/titan-review` | Unified review: over-engineering + comment compression | L1+L2 |
| `/titan-audit` | Repo-wide audit for bloat (code + prose) | L1+L2 |
| `/titan-debt` | Ledger tracking with upgrade path analysis | L2 |
| `/titan-compress <file>` | Compress memory file in caveman prose | L3 |
| `/titan-stats` | Token usage + savings per level + USD estimate | All |
| `/titan-help` | Reference card with all commands | — |

#### 4.3.3 Unified Review Format

TITAN proposes a review format that combines Ponytail's tags with Caveman's conciseness:

```
L<line>: <emoji> <ponytail-tag> <caveman-description>. <fix>. [<l1-compression-note>]
```

Examples:
* `L12: 🔴 delete: 27-line validator class. "@" in email, 1 line. L1: could be "use stdlib"`
* `L88: 🟡 yagni: AbstractRepository, one impl. Inline until second exists. L1: pattern clear`
* `L42: 🔵 stdlib: moment.js for one format. Intl.DateTimeFormat, 0 deps. L1: obvious swap`

The `l1-compression-note` field is optional and indicates whether the suggested fix is "obvious" (compressible) or requires explanation (non-compressible).

#### 4.3.4 Persistence System

TITAN inherits the persistence system of both repositories:

* **Session persistence**: The active mode persists until explicitly changed or the session ends ("Off only: 'stop titan' / 'normal mode'").
* **Flag file**: For agents supporting hooks (Claude Code, Codex), a `.titan-active` flag file indicates the current mode.
* **Config file**: `~/.config/titan/config.json` for the user's default mode.
* **Environment variable**: `TITAN_DEFAULT_MODE` for overrides.
* **Rule files**: Adaptations for Cursor (`.cursor/rules/titan.mdc`), Windsurf, Cline, Copilot, Kiro, Aider, Antigravity.

### 4.4 Safety Considerations

#### 4.4.1 Auto-Clarity Integration

Caveman's Auto-Clarity is extended in TITAN to cover L2 decisions:

* **Security warnings**: Drop compression for CVE-class findings.
* **Irreversible actions**: Full prose for destructive operations (DROP, DELETE, `rm -rf`).
* **L2 ambiguity**: When a `ponytail:` comment is unclear about its ceiling, expand to a full explanation.
* **Multi-step sequences**: Full grammar with conjunctions when order matters.
* **User confusion signals**: If the user repeats a question or asks for clarification, switch to lite mode for that turn.

#### 4.4.2 Tool-Use Preservation

The format of tool calls is sacred in TITAN:

* **Function names**: Never compressed (Caveman rule: "Code symbols, function names, API names: never abbreviate").
* **Parameter values**: Never simplified (Ponytail rule: "input validation at trust boundaries" includes tool parameters).
* **JSON structure**: Preserved exactly (compression acts on natural language, never on structured data).
* **Error strings**: Quoted verbatim (Caveman rule: "Errors quoted exact").

#### 4.4.3 Graduated Degradation

In case of a layer failure, TITAN implements graduated degradation:

1. L1 failure → fallback to full prose, L2 and L3 continue operating.
2. L2 failure → fallback to normal code generation, L1 compresses the prose, L3 manages context.
3. L3 failure → context window grows normally, L1 and L2 continue compressing output.
4. Multiple failures → gradual rollback to normal mode with notification to user.

### 4.5 Original TITAN Extensions

Beyond the integration of the two repositories, TITAN introduces three original extensions:

#### 4.5.1 Context Window Manager

A context window management system that implements:

* **LRU eviction with priority**: Tokens are prioritized (tool results > user instructions > agent prose > system prompts) and evicted in reverse order as the limit approaches.
* **Semantic deduplication**: Identifies and removes redundant information in the conversation history (e.g., repetitions of the same concept in different turns).
* **Compression on pressure**: When the context window exceeds 80%, historical messages are re-processed through L1 to reclaim space.

#### 4.5.2 MCP Tool Description Shrink

A middleware that compresses the descriptions of MCP (Model Context Protocol) tools while maintaining the essential semantics:

* Removes redundant examples from descriptions.
* Compresses descriptive prose through L1.
* Preserves JSON schema of parameter definitions.
* Estimated savings: 25-35% on complex tool descriptions.

#### 4.5.3 Token Profiler

A real-time monitoring system that provides:

* **Per-level metrics**: Tokens saved by L1, L2, L3 separately.
* **Per-component metrics**: Code vs prose vs context vs tool.
* **Cost estimation**: USD estimation based on provider and model.
* **Session summary**: Total savings at the end of each session.
* **Trend analysis**: Savings over time, per project, per task type.

---

## PHASE 5 — Quantitative Analysis and Benchmarks

### 5.1 Summary of Empirical Data

The data collected from the official benchmarks of the two repositories provide the quantitative foundations for the TITAN model.

**Ponytail Benchmark** (5 tasks × 3 models × 3 arms × 10 runs):

| Metric | Average Value | Range |
|--------|---------------|-------|
| Code reduction (code_loc) | 87% | 80-94% |
| Cost reduction | 62% | 47-77% |
| Speedup | 4.5x | 3-6x |

The three arms of the benchmark are: baseline (no skill), caveman (Caveman's SKILL.md as system prompt), and ponytail (Ponytail's SKILL.md as system prompt). Interestingly, Ponytail includes Caveman as a comparison arm — the two systems have already been benchmarked against each other, albeit indirectly.

**Caveman Benchmark** (10 tasks × 10 trials, Claude API):

| Task | Normal | Caveman | Savings |
|------|--------|---------|-----------|
| React re-render bug | 1180 | 159 | 87% |
| Auth middleware fix | 704 | 121 | 83% |
| PostgreSQL connection pool | 2347 | 380 | 84% |
| Fix rebase vs merge | 702 | 292 | 58% |
| Callback → async/await refactor | 387 | 301 | 22% |
| Microservices vs monolith | 446 | 310 | 30% |
| PR security review | 678 | 398 | 41% |
| Docker multi-stage build | 1042 | 290 | 72% |
| PostgreSQL race condition | 1200 | 232 | 81% |
| React error boundary | 3454 | 456 | 87% |
| **Average** | **1214** | **294** | **65%** |

**Caveman-Compress Benchmark** (5 real files):

| File | Original | Compressed | Savings |
|------|---------:|-----------:|----------:|
| claude-md-preferences.md | 706 | 285 | 59.6% |
| project-notes.md | 1145 | 535 | 53.3% |
| claude-md-project.md | 1122 | 636 | 43.3% |
| todo-list.md | 627 | 388 | 38.1% |
| mixed-with-code.md | 888 | 560 | 36.9% |
| **Average** | **898** | **481** | **46%** |

### 5.2 TITAN Projection

Combining empirical data with the composition model, we can estimate TITAN's performance:

| Scenario | L1 Savings | L2 Savings | L3 Savings | Total Savings |
|----------|-----------|-----------|-----------|--------------|
| **Conservative** | 8% | 60% | 30% | 73.6% |
| **Realistic** | 10% | 70% | 40% | 83.8% |
| **Aggressive** | 15% | 80% | 50% | 89.5% |
| **Maximum (short task)** | 15% | 94% | 60% | 94.9% |

The "Maximum" scenario represents a short task where Ponytail applies YAGNI (100% L2 savings on that task) and Caveman compresses the explanation to the limit, with L3 compressing CLAUDE.md and the context window. This is a theoretical upper bound and is unsustainable on long tasks.

### 5.3 Break-Even Analysis

Implementing TITAN carries an initial cost (setup, configuration, learning). The break-even point depends on usage:

| User Profile | Tokens/Session | TITAN Savings | Break-Even (sessions) |
|--------------|----------------|----------------|----------------------|
| Occasional developer | 50K | 35K (70%) | 1-2 |
| Full-time developer | 500K | 350K (70%) | <1 |
| Team (5 people) | 2.5M | 1.75M (70%) | <1 |
| Enterprise (50 people) | 25M | 17.5M (70%) | <1 |

At typical LLM API costs ($3-15 per million tokens), the savings per session are immediately significant. For a full-time developer (500K tokens/session), the savings is ~$1-5/session — on the scale of hundreds of sessions/year, this becomes $200-1000/year of direct savings, in addition to the indirect benefit of completing longer sessions without context exhaustion.

---

## Conclusions and Recommendations

### Summary of Findings

The analysis of Ponytail and Caveman reveals two complementary systems acting on orthogonal dimensions of LLM token usage. Ponytail compresses **generated content** by modifying the agent's decision-making process (structural compression). Caveman compresses the **expression language** by transforming the generated prose (linguistic compression). Their integration into a three-level framework — with the addition of contextual compression — produces an estimated compound savings of 70% to 85%.

### Implementation Recommendations

1. **Phase 1 (Immediate)**: Implement L1 (Caveman engine) + partial L3 (caveman-compress for memory files). This is the safest entry point: it acts on outputs without modifying reasoning, with an automatic fallback (Auto-Clarity).
2. **Phase 2 (Short-term)**: Add L2 (Ponytail Ladder) in "lite" mode. Allows the user to see lazy alternatives without imposing them. Collect feedback before moving to "full".
3. **Phase 3 (Medium-term)**: Activate full L3 (subagent shrink, context window manager, MCP shrink) and L2 in "full" mode. Integrate the Debt Tracker to monitor simplifications.
4. **Phase 4 (Long-term)**: Activate "ultra" L2 for mature codebases. Implement the Token Profiler for continuous monitoring. Explore provider-specific optimizations (OpenAI, Anthropic, Google have different costs and limits).

### Limitations of the Framework

1. **Task-dependent performance**: Tasks that necessarily require long outputs (documentation, tutorials, architectural explanations) benefit less from compression. The Caveman benchmark shows a savings range of 22% to 87% depending on the task.
2. **Team coordination**: If some team members use TITAN and others do not, the codebase may become heterogeneous. The `ponytail:` comment convention helps but does not completely solve this.
3. **Learning curve**: The rules of both systems require familiarity. The "lite" level mitigates this but does not eliminate it.
4. **Language coverage**: Caveman preserves the user's dominant language, but the compression rules are optimized for English. Other languages may have different compression patterns.

### Future Directions

1. **Fine-tuned compression model**: Caveman has already explored this direction with `cavegemma` (Gemma 4 31B fine-tuned on caveman pairs). A model fine-tuned on pairs (uncompressed → compressed) could internalize the rules of both levels.
2. **Dynamic compression**: Instead of fixed levels (lite/full/ultra), a system that adapts compression based on context (task type, user preference, context window pressure).
3. **Cross-agent standardization**: A standard compression format that works uniformly across 30+ agents (Claude Code, Codex, Gemini, Cursor, Windsurf, Cline, Copilot, etc.).

---

## References

1. Gebert, D. (2025). *Ponytail: The lazy senior dev*. GitHub repository. https://github.com/DietrichGebert/ponytail
2. Brussee, J. (2025). *Caveman: Why use many token when few do trick*. GitHub repository. https://github.com/juliusbrussee/caveman
3. Brussee, J. (2025). *Caveman ecosystem: caveman-code, cavemem, cavekit, cavegemma*. GitHub organization.
4. Promptfoo (2025). *Eval framework for LLMs*. https://www.promptfoo.dev/
5. Anthropic (2025). *Claude Code documentation*. https://docs.anthropic.com/en/docs/claude-code
6. ArXiv (2026). *"Brevity Constraints Reverse Performance Hierarchies in Language Models"*. arXiv:2604.00025
7. OpenAI (2025). *Token counting and pricing*. https://openai.com/pricing
8. Model Context Protocol (2025). *MCP specification*. https://modelcontextprotocol.io/
9. Gebert, D. (2025). *Agent portability documentation* (Ponytail docs/agent-portability.md).
10. Brussee, J. (2025). *Caveman security documentation* (caveman-compress/SECURITY.md).

---

*Report generated from deep reverse engineering analysis of Ponytail (DietrichGebert) and Caveman (JuliusBrussee) repositories. System design proposed: TITAN (Token Intelligence Through Agent Narrowing).*
