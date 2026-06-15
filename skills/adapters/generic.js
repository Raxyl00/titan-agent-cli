#!/usr/bin/env node
'use strict';

const { stripFrontmatter, prependNote } = require('../../src/templates');

const AGENT_ID = 'generic';
const OUTPUT_PATH = 'system-prompt.md';
const DESCRIPTION = 'Generic — plain markdown system prompt, copy-paste into any LLM agent';

function transform(masterContent) {
  let body = stripFrontmatter(masterContent);

  const header = [
    '<!-- TITAN Agent Compression Framework -->',
    '<!-- Copy this content into your LLM agent\'s system prompt -->',
    '<!-- Source: https://github.com/your-repo/titan-agent -->',
  ].join('\n');

  return header + '\n\n' + body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
