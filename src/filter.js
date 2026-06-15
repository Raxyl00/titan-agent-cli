#!/usr/bin/env node
'use strict';

const readline = require('readline');
const os = require('os');
const fs = require('fs');
const path = require('path');

// --- Noise Patterns ---
// Build system chatter, success messages, and uninformative output
const NOISE_PATTERNS = [
  /^\s*$/,
  // npm
  /npm warn/i,
  /npm notice/i,
  /npm info/i,
  // Generic info/notice
  /^\[info\]/i,
  /^\[notice\]/i,
  /ℹ️/,
  // Build success
  /✓\s*(Build|Compile|Done|Success|Complete)/i,
  /bundled successfully/i,
  /compiled successfully/i,
  /webpack compiled/i,
  /ready on/i,
  /✓\s*in\s*\d+/,
  // Tools
  /husky/i,
  /eslint.*ok/i,
  /passed/i,
  // Vite
  /^\s*VITE v/,
  /^\s*➜\s*(Local|Network):/,
  /^\s*ready in \d+/i,
  // esbuild
  /^\s*\[esbuild\].*done/i,
  // TypeScript
  /^\s*Found 0 errors/,
  // Cargo
  /^\s*Compiling\s/,
  /^\s*Finished\s/,
  /^\s*Downloading\s/,
  // Go
  /^go: downloading/,
  // Generic
  /^\s*watching for file changes/i,
  /^\s*waiting for changes/i,
];

const STACK_NOISE = /node_modules/;

function isNoise(line) {
  return NOISE_PATTERNS.some(p => p.test(line));
}

function filterStackLine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('at ')) return trimmed;
  if (STACK_NOISE.test(trimmed)) return null;
  return trimmed;
}

function isStackFrame(line) {
  return /^\s+at\s/.test(line);
}

function logSavings(inputChars, outputChars, linesFiltered) {
  const charsSaved = Math.max(0, inputChars - outputChars);
  if (charsSaved === 0 && linesFiltered === 0) return;
  const tokensSaved = Math.round(charsSaved / 4);

  const homeDir = os.homedir();
  const titanDir = path.join(homeDir, '.titan');
  const statsFile = path.join(titanDir, 'stats.json');

  try {
    if (!fs.existsSync(titanDir)) {
      fs.mkdirSync(titanDir, { recursive: true });
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
        // use default stats if corrupt
      }
    }

    stats.totalLinesFiltered = (stats.totalLinesFiltered || 0) + linesFiltered;
    stats.totalCharsSaved = (stats.totalCharsSaved || 0) + charsSaved;
    stats.totalTokensSaved = (stats.totalTokensSaved || 0) + tokensSaved;
    stats.runsCount = (stats.runsCount || 0) + 1;

    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf8');
  } catch (err) {
    // silently catch to prevent stream crashes
  }
}

/**
 * Process an array of lines, filtering noise and compressing stack traces.
 */
function processLines(lines) {
  const output = [];
  let inStack = false;
  let stackLines = [];
  let errorHeader = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isNoise(line)) continue;

    // Detect error header
    if (/(?:Error|TypeError|ReferenceError|SyntaxError|RangeError):/.test(line) && !inStack) {
      errorHeader = line;
      inStack = true;
      stackLines = [];
      continue;
    }

    if (inStack) {
      if (isStackFrame(line)) {
        stackLines.push(line);
        continue;
      }
      // End of stack trace
      if (errorHeader) {
        output.push(errorHeader);
        const firstRelevant = stackLines
          .map(filterStackLine)
          .filter(Boolean);
        if (firstRelevant.length > 0) {
          output.push(firstRelevant[0]);
        }
        errorHeader = null;
        stackLines = [];
        inStack = false;
      }
    }

    output.push(line);
  }

  // Flush remaining stack
  if (errorHeader) {
    output.push(errorHeader);
    const firstRelevant = stackLines.map(filterStackLine).filter(Boolean);
    if (firstRelevant.length > 0) output.push(firstRelevant[0]);
  }

  return output;
}

/**
 * Stream mode: read stdin line by line, filter, write to stdout.
 */
function streamMode() {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  const buffer = [];
  let flushing = false;
  let totalInputChars = 0;
  let totalOutputChars = 0;
  let totalInputLinesCount = 0;

  function flush() {
    if (flushing) return;
    flushing = true;
    const batch = buffer.splice(0);
    const result = processLines(batch);
    for (const line of result) {
      process.stdout.write(line + '\n');
      totalOutputChars += line.length + 1;
    }
    flushing = false;
  }

  rl.on('line', line => {
    totalInputLinesCount++;
    totalInputChars += line.length + 1;
    buffer.push(line);
    if (buffer.length >= 100) flush();
  });

  rl.on('close', () => {
    flush();
    logSavings(totalInputChars, totalOutputChars, totalInputLinesCount);
  });
}

/**
 * Self-test: verify filtering works correctly.
 */
function selfTest() {
  const input = [
    '',
    'npm warn deprecated inflight@1.0.6',
    '✓ Build complete in 2.3s',
    '',
    'src/app.ts: export const x = 1;',
    'ℹ️ Compiled successfully',
    '',
    'TypeError: Cannot read properties of undefined (reading \'id\')',
    '    at Object.handler (/home/user/project/src/handlers/user.ts:42:15)',
    '    at /home/user/project/node_modules/express/lib/router/layer.js:95:5',
    '    at next (/home/user/project/node_modules/express/lib/router/route.js:137:13)',
    '    at /home/user/project/src/middleware/auth.ts:18:9',
    '',
    '✓ Tests passed',
    'npm notice New minor version available',
    '',
    'src/utils.ts: const y = 2;',
  ];

  const expected = [
    'src/app.ts: export const x = 1;',
    'TypeError: Cannot read properties of undefined (reading \'id\')',
    'at Object.handler (/home/user/project/src/handlers/user.ts:42:15)',
    'src/utils.ts: const y = 2;',
  ];

  const result = processLines(input);

  const pass = JSON.stringify(result) === JSON.stringify(expected);
  process.stdout.write(`TITAN filter self-test: ${pass ? 'PASS ✓' : 'FAIL ✗'}\n`);
  if (!pass) {
    process.stdout.write(`Expected: ${JSON.stringify(expected, null, 2)}\n`);
    process.stdout.write(`Got:      ${JSON.stringify(result, null, 2)}\n`);
    process.exit(1);
  }
}

// Direct execution
if (require.main === module) {
  if (process.argv[2] === '--test') {
    selfTest();
  } else {
    streamMode();
  }
}

module.exports = { processLines, streamMode, selfTest };
