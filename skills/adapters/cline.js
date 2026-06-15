#!/usr/bin/env node
'use strict';

const { stripFrontmatter } = require('../../src/templates');

const AGENT_ID = 'cline';
const OUTPUT_PATH = '.clinerules/titan.md';
const DESCRIPTION = 'Cline — .clinerules/ directory, plain markdown';

function transform(masterContent) {
  // Cline: plain markdown in .clinerules/ directory
  // Cline also recognizes .cursorrules and .windsurfrules — cross-compatible
  return stripFrontmatter(masterContent);
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
