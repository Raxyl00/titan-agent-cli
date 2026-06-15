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
    '    titan init --agent=<name> [--lite|--balanced|--aggressive]  Generate skill file',
    '    titan init --all [--lite|--balanced|--aggressive]           Generate skill files for all agents',
    '    titan init --list                                           List available agents',
    '    titan compress <file>                                       Compress a memory/context file (L3)',
    '    titan debt [--dir=<path>]                                   Scan for ponytail: comments',
    '    titan filter                                                Stdin/stdout terminal output filter',
    '    titan filter --test                                         Run filter self-test',
    '    titan benchmark                                             Run L1/L2/L3 token savings benchmark',
    '    titan report [--reset]                                      Display ANSI savings dashboard',
    '    titan help                                                  Show this help',
    '    titan version                                               Show version',
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
  const isAggressive = args.includes('--aggressive');
  const initOptions = { lite: isLite, aggressive: isAggressive };

  let modeName = 'BALANCED';
  if (isLite) modeName = 'LITE';
  if (isAggressive) modeName = 'AGGRESSIVE';

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
    console.log(`\nGenerating TITAN ${modeName} skills for all agents in: ${targetDir}\n`);
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
    console.log(`\n  ✓ ${agentId} → ${result.path} (${modeName})\n`);
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

async function cmdBenchmark(args) {
  const { runBenchmark } = require('./benchmark');
  try {
    await runBenchmark();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function cmdReport(args) {
  const os = require('os');
  const fs = require('fs');
  const path = require('path');

  const homeDir = os.homedir();
  const statsFile = path.join(homeDir, '.titan', 'stats.json');

  if (args.includes('--reset')) {
    const defaultStats = {
      totalLinesFiltered: 0,
      totalCharsSaved: 0,
      totalTokensSaved: 0,
      runsCount: 0
    };
    try {
      fs.writeFileSync(statsFile, JSON.stringify(defaultStats, null, 2), 'utf8');
      console.log('\n  ✓ Savings statistics have been reset.\n');
    } catch (e) {
      console.error(`Error resetting stats: ${e.message}`);
    }
    return;
  }

  let stats = {
    totalLinesFiltered: 0,
    totalCharsSaved: 0,
    totalTokensSaved: 0,
    runsCount: 0
  };

  if (fs.existsSync(statsFile)) {
    try {
      stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    } catch (e) {
      // standard fallback
    }
  }

  const costSaved = (stats.totalTokensSaved || 0) * 0.000003;

  console.log('\n  ┌────────────────────────────────────────────────────────┐');
  console.log('  │   TITAN Context Savings Dashboard                      │');
  console.log('  └────────────────────────────────────────────────────────┘');
  console.log(`    Active Runs Tracked:   ${(stats.runsCount || 0).toString().padStart(6)}`);
  console.log(`    Total Lines Filtered:  ${(stats.totalLinesFiltered || 0).toString().padStart(6)}`);
  console.log(`    Characters Compressed: ${(stats.totalCharsSaved || 0).toString().padStart(6)}`);
  console.log(`    Estimated Tokens Saved: ${(stats.totalTokensSaved || 0).toString().padStart(6)}`);
  console.log(`    Financial Savings:     $${costSaved.toFixed(4)}`);
  console.log('  ┌────────────────────────────────────────────────────────┐');

  const tokens = stats.totalTokensSaved || 0;
  let level = 0;
  if (tokens > 0) level = Math.min(25, Math.ceil(tokens / 500));
  const bar = '█'.repeat(level) + '░'.repeat(25 - level);
  console.log(`    Performance Tier:     [${bar}] ${tokens} saved`);
  console.log('  └────────────────────────────────────────────────────────┘\n');
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
    case 'benchmark':
      cmdBenchmark(subArgs);
      break;
    case 'report':
      cmdReport(subArgs);
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
