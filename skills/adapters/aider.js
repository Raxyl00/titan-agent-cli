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
