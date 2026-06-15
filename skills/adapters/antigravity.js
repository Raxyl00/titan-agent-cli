#!/usr/bin/env node
'use strict';

const { stripFrontmatter } = require('../../src/templates');

const AGENT_ID = 'antigravity';
const OUTPUT_PATH = '.antigravity/skills/titan.md';
const DESCRIPTION = 'Antigravity — plain markdown in .antigravity/skills/';

function transform(masterContent) {
  // Antigravity: plain markdown, skills directory-based
  return stripFrontmatter(masterContent);
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
