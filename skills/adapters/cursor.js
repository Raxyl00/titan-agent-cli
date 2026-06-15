#!/usr/bin/env node
'use strict';

const { stripFrontmatter, buildFrontmatter } = require('../../src/templates');

const AGENT_ID = 'cursor';
const OUTPUT_PATH = '.cursor/rules/titan.mdc';
const DESCRIPTION = 'Cursor — .mdc format with YAML frontmatter (description, globs, alwaysApply)';

function transform(masterContent) {
  const body = stripFrontmatter(masterContent);

  // Cursor .mdc requires its own frontmatter
  const cursorFrontmatter = buildFrontmatter({
    description: 'TITAN token compression framework — L1 linguistic, L2 structural, L3 contextual compression. Preserves reasoning, tool-use, and code correctness.',
    globs: [],
    alwaysApply: true,
  });

  return cursorFrontmatter + '\n\n' + body;
}

module.exports = { AGENT_ID, OUTPUT_PATH, DESCRIPTION, transform };
