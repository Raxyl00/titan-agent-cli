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
