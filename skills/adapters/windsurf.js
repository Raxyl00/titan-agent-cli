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
