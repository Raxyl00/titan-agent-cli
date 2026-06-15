#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// All available adapters
const ADAPTER_IDS = [
  'cloudcode', 'cursor', 'copilot', 'windsurf',
  'cline', 'kiro', 'aider', 'antigravity', 'generic',
];

/**
 * Load an adapter module by agent ID.
 */
function loadAdapter(agentId) {
  const adapterPath = path.join(__dirname, '..', 'skills', 'adapters', `${agentId}.js`);
  if (!fs.existsSync(adapterPath)) {
    throw new Error(`Unknown agent: ${agentId}. Available: ${ADAPTER_IDS.join(', ')}`);
  }
  return require(adapterPath);
}

/**
 * Read the master SKILL.md content.
 */
function readMaster(options = {}) {
  let filename = 'master.md';
  if (options.lite) {
    filename = 'master-lite.md';
  } else if (options.aggressive) {
    filename = 'master-aggressive.md';
  }
  const masterPath = path.join(__dirname, '..', 'skills', filename);
  if (!fs.existsSync(masterPath)) {
    throw new Error(`Master skill file not found: ${masterPath}`);
  }
  return fs.readFileSync(masterPath, 'utf8');
}

/**
 * Ensure directory exists (mkdir -p).
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Initialize TITAN skill for a specific agent.
 * Returns { path, warning? } for the generated file.
 */
function initAgent(agentId, targetDir, options = {}) {
  const adapter = loadAdapter(agentId);
  const master = readMaster(options);
  const content = adapter.transform(master);

  // Handle adapters with custom output path logic (e.g., aider)
  let outputPath = adapter.OUTPUT_PATH;
  let warning = null;

  if (adapter.getOutputPath) {
    const result = adapter.getOutputPath(targetDir);
    outputPath = result.path;
    warning = result.warning;
  }

  const fullPath = path.join(targetDir, outputPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, 'utf8');

  return { path: outputPath, warning };
}

/**
 * Initialize TITAN for all agents.
 * Returns array of { agentId, path, warning? }.
 */
function initAll(targetDir, options = {}) {
  const results = [];

  for (const agentId of ADAPTER_IDS) {
    try {
      const result = initAgent(agentId, targetDir, options);
      results.push({ agentId, ...result, success: true });
    } catch (err) {
      results.push({ agentId, success: false, error: err.message });
    }
  }

  return results;
}

/**
 * List all available adapters with descriptions.
 */
function listAgents() {
  return ADAPTER_IDS.map(id => {
    const adapter = loadAdapter(id);
    return {
      id: adapter.AGENT_ID,
      path: adapter.OUTPUT_PATH,
      description: adapter.DESCRIPTION,
    };
  });
}

module.exports = { initAgent, initAll, listAgents, ADAPTER_IDS };
