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
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const raw = match[1];
  const body = match[2];
  const frontmatter = {};

  let currentKey = null;
  let currentValue = '';
  let inMultiline = false;
  let inArray = false;
  let arrayItems = [];

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();

    // Array item
    if (inArray && trimmed.startsWith('- ')) {
      arrayItems.push(trimmed.slice(2).trim());
      continue;
    }

    // End of array — save and process current line
    if (inArray && !trimmed.startsWith('- ')) {
      frontmatter[currentKey] = arrayItems;
      inArray = false;
      arrayItems = [];
      currentKey = null;
    }

    // End of multiline — save and process current line
    if (inMultiline && /^\S/.test(line)) {
      frontmatter[currentKey] = currentValue.trim();
      inMultiline = false;
      currentKey = null;
      currentValue = '';
    }

    // Multiline continuation
    if (inMultiline) {
      currentValue += ' ' + trimmed;
      continue;
    }

    // Key-value pair
    const kvMatch = trimmed.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2];

      if (val === '>' || val === '|') {
        inMultiline = true;
        currentValue = '';
      } else if (val === '') {
        // Could be array start
        inArray = true;
        arrayItems = [];
      } else {
        // Remove surrounding quotes
        frontmatter[currentKey] = val.replace(/^["']|["']$/g, '');
      }
    }
  }

  // Flush remaining
  if (inMultiline && currentKey) {
    frontmatter[currentKey] = currentValue.trim();
  }
  if (inArray && currentKey) {
    frontmatter[currentKey] = arrayItems;
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
