'use strict';

const fs = require('fs');
const path = require('path');
const { estimateTokens } = require('../src/compress');

const rootDir = path.join(__dirname, '..');
const files = {
  'master.md': 'skills/master.md',
  'master-lite.md': 'skills/master-lite.md',
  'master-aggressive.md': 'skills/master-aggressive.md'
};

console.log('\nActual Token Counts (estimated via estimateTokens):');
console.log('--------------------------------------------------');

for (const [name, relPath] of Object.entries(files)) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const tokens = estimateTokens(content);
    console.log(`  ${name.padEnd(22)}: ~${tokens} tokens (${content.length} chars)`);
  } else {
    console.log(`  ${name.padEnd(22)}: File not found`);
  }
}
console.log('--------------------------------------------------\n');
