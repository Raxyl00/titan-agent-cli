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
