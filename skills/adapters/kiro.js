#!/usr/bin/env node
'use strict';

const { parseFrontmatter, buildFrontmatter } = require('../../src/templates');

const AGENT_ID = 'kiro';
const OUTPUT_PATH = '.kiro/skills/titan/SKILL.md';
const DESCRIPTION = 'Kiro — SKILL.md with YAML frontmatter in .kiro/skills/';

function transform(masterContent) {
  const { frontmatter, body } = parseFrontmatter(masterContent);

  // Kiro supports SKILL.md with frontmatter — preserve and adapt
  const kiroFrontmatter = buildFrontmatter({
    name: frontmatter.name || 'titan',
    description: frontmatter.description || 'Unified token compression framework for LLM agents.',
    version: frontmatter.version || '0.1.0',
    license: frontmatter.license || 'MIT',
  });

  return kiroFrontmatter + '\n\n' + body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
