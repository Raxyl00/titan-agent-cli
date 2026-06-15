#!/usr/bin/env node
'use strict';

const { stripFrontmatter, shiftHeadings } = require('../../src/templates');

const AGENT_ID = 'copilot';
const OUTPUT_PATH = '.github/copilot-instructions.md';
const DESCRIPTION = 'GitHub Copilot — no H1 headings (conflict with system titles), H2+ only';

function transform(masterContent) {
  let body = stripFrontmatter(masterContent);

  // Copilot: H1 headings conflict with system-generated titles.
  // Shift all headings down by 1 level (# → ##, ## → ###, etc.)
  body = shiftHeadings(body, 1);

  return body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
