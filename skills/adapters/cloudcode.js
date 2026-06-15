#!/usr/bin/env node
'use strict';

const { stripFrontmatter } = require('../../src/templates');

const AGENT_ID = 'cloudcode';
const OUTPUT_PATH = '.claude/skills/titan/titan-core.md';
const DESCRIPTION = 'Claude Code — markdown skill in .claude/skills/';

function transform(masterContent) {
  // Claude Code skills: plain markdown, no frontmatter
  return stripFrontmatter(masterContent);
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
