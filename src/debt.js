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
