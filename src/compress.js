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
 * Split markdown into code and prose blocks.
 * Returns array of { type: 'code'|'prose', content }.
 */
function splitBlocks(content) {
  const blocks = [];
  const codeBlockRegex = /^(```[\s\S]*?^```|^~~~[\s\S]*?^~~~)/gm;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Prose before code block
    if (match.index > lastIndex) {
      blocks.push({ type: 'prose', content: content.slice(lastIndex, match.index) });
    }
    // Code block (preserved verbatim)
    blocks.push({ type: 'code', content: match[0] });
    lastIndex = match.index + match[0].length;
  }

  // Remaining prose
  if (lastIndex < content.length) {
    blocks.push({ type: 'prose', content: content.slice(lastIndex) });
  }

  return blocks;
}

/**
 * Apply L1 compression rules to a prose string.
 * Preserves: URLs, file paths, technical terms in backticks.
 */
function compressProse(text) {
  // Extract and protect inline code, URLs, and file paths
  const protected_items = [];
  let protectedText = text;

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
    if (block.type === 'code') return block.content;
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
