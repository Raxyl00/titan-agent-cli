#!/usr/bin/env node
'use strict';

const { initAgent, initAll, listAgents, ADAPTER_IDS } = require('./init');

const VERSION = require('../package.json').version;

function printHelp() {
  const lines = [
    '',
    `  TITAN v${VERSION} — Token Intelligence Through Agent Narrowing`,
    '',
    '  Usage:',
    '    titan init --agent=<name> [--lite]  Generate skill file (lite uses ~400 tokens)',
    '    titan init --all [--lite]           Generate skill files for all agents',
    '    titan init --list                   List available agents',
    '    titan compress <file>               Compress a memory/context file (L3)',
    '    titan debt [--dir=<path>]           Scan for ponytail: comments',
    '    titan filter                        Stdin/stdout terminal output filter',
    '    titan filter --test                 Run filter self-test',
    '    titan help                          Show this help',
    '    titan version                       Show version',
    '',
    '  Agents:',
  ];

  for (const agent of listAgents()) {
    lines.push(`    ${agent.id.padEnd(14)} → ${agent.path}`);
  }

  lines.push('');
  console.log(lines.join('\n'));
}

function printVersion() {
  console.log(`titan-agent v${VERSION}`);
}

function cmdInit(args) {
  const targetDir = getFlag(args, '--dir') || process.cwd();
  const isLite = args.includes('--lite');
  const initOptions = { lite: isLite };

  // List agents
  if (args.includes('--list')) {
    console.log('\nAvailable agents:\n');
    for (const agent of listAgents()) {
      console.log(`  ${agent.id.padEnd(14)} ${agent.description}`);
      console.log(`  ${''.padEnd(14)} → ${agent.path}\n`);
    }
    return;
  }

  // All agents
  if (args.includes('--all')) {
    console.log(`\nGenerating TITAN ${isLite ? 'LITE ' : ''}skills for all agents in: ${targetDir}\n`);
    const results = initAll(targetDir, initOptions);

    for (const r of results) {
      if (r.success) {
        console.log(`  ✓ ${r.agentId.padEnd(14)} → ${r.path}`);
        if (r.warning) console.log(`    ⚠ ${r.warning}`);
      } else {
        console.log(`  ✗ ${r.agentId.padEnd(14)} → ${r.error}`);
      }
    }

    const ok = results.filter(r => r.success).length;
    console.log(`\n  ${ok}/${results.length} agents generated.\n`);
    return;
  }

  // Single agent
  const agentId = getFlag(args, '--agent');
  if (!agentId) {
    console.error('Error: specify --agent=<name> or --all');
    console.error(`Available agents: ${ADAPTER_IDS.join(', ')}`);
    process.exit(1);
  }

  if (!ADAPTER_IDS.includes(agentId)) {
    console.error(`Error: unknown agent "${agentId}"`);
    console.error(`Available agents: ${ADAPTER_IDS.join(', ')}`);
    process.exit(1);
  }

  try {
    const result = initAgent(agentId, targetDir, initOptions);
    console.log(`\n  ✓ ${agentId} → ${result.path} ${isLite ? '(LITE)' : ''}\n`);
    if (result.warning) console.log(`  ⚠ ${result.warning}\n`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function cmdCompress(args) {
  const file = args[0];
  if (!file) {
    console.error('Error: specify a file to compress');
    console.error('Usage: titan compress <file.md>');
    process.exit(1);
  }

  const { compressFile } = require('./compress');
  try {
    const result = compressFile(file);
    console.log(`\n  File: ${file}`);
    console.log(`  Original:   ${result.originalTokens} tokens`);
    console.log(`  Compressed: ${result.compressedTokens} tokens`);
    console.log(`  Savings:    ${result.savings}% (${result.savedTokens} tokens)`);
    console.log(`  Backup:     ${result.backupPath}\n`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function cmdDebt(args) {
  const targetDir = getFlag(args, '--dir') || process.cwd();
  const noUpgrade = args.includes('--no-upgrade');

  const { scanDebt } = require('./debt');
  const results = scanDebt(targetDir, { noUpgradeOnly: noUpgrade });

  if (results.length === 0) {
    console.log('\n  No ponytail: comments found.\n');
    return;
  }

  console.log(`\n  Found ${results.length} ponytail: debt item(s):\n`);
  for (const item of results) {
    const upgradeIcon = item.upgradePath ? '↑' : '⚠';
    console.log(`  ${upgradeIcon} ${item.file}:${item.line}`);
    console.log(`    ceiling: ${item.ceiling}`);
    if (item.upgradePath) {
      console.log(`    upgrade: ${item.upgradePath}`);
    } else {
      console.log(`    upgrade: (none specified)`);
    }
    console.log('');
  }
}

function cmdFilter(args) {
  // Delegate to filter module
  if (args.includes('--test')) {
    const { selfTest } = require('./filter');
    selfTest();
  } else {
    const { streamMode } = require('./filter');
    streamMode();
  }
}

/**
 * Extract --flag=value from args array.
 */
function getFlag(args, flag) {
  for (const arg of args) {
    if (arg.startsWith(flag + '=')) {
      return arg.slice(flag.length + 1);
    }
  }
  return null;
}

/**
 * Main CLI entry point.
 */
function main(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const subArgs = args.slice(1);

  switch (command) {
    case 'init':
      cmdInit(subArgs);
      break;
    case 'compress':
      cmdCompress(subArgs);
      break;
    case 'debt':
      cmdDebt(subArgs);
      break;
    case 'filter':
      cmdFilter(subArgs);
      break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      printHelp();
      break;
    case 'version':
    case '--version':
    case '-v':
      printVersion();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

module.exports = { main };
