'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { scanFile } = require('../src/debt');

const TEST_DIR = path.join(__dirname, '..', '.test-debt-output');

describe('Debt scanFile', () => {
  before(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  after(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  it('should scan JS file with ponytail: comments', () => {
    const file = path.join(TEST_DIR, 'test.js');
    const content = `
      // ponytail: simple lock, use Redis if multi-node
      const lock = true;
      /* ponytail: static array, db query if dataset grows */
      const items = [];
    `;
    fs.writeFileSync(file, content, 'utf8');

    const results = scanFile(file);
    assert.strictEqual(results.length, 2);
    assert.strictEqual(results[0].ceiling, 'simple lock');
    assert.strictEqual(results[0].upgradePath, 'use Redis if multi-node');
    assert.strictEqual(results[1].ceiling, 'static array');
    assert.strictEqual(results[1].upgradePath, 'db query if dataset grows');
  });

  it('should scan Python file with ponytail: comments', () => {
    const file = path.join(TEST_DIR, 'test.py');
    const content = `
# ponytail: local cache, use memcached if distributed
cache = {}
    `;
    fs.writeFileSync(file, content, 'utf8');

    const results = scanFile(file);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].ceiling, 'local cache');
    assert.strictEqual(results[0].upgradePath, 'use memcached if distributed');
  });

  it('should scan YAML file with ponytail: comments', () => {
    const file = path.join(TEST_DIR, 'test.yaml');
    const content = `
# ponytail: mock auth, use OAuth2 for prod
auth: mock
    `;
    fs.writeFileSync(file, content, 'utf8');

    const results = scanFile(file);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].ceiling, 'mock auth');
    assert.strictEqual(results[0].upgradePath, 'use OAuth2 for prod');
  });

  it('should scan Markdown file with ponytail: comments', () => {
    const file = path.join(TEST_DIR, 'test.md');
    const content = `
<!-- ponytail: local storage, use Postgres in future -->
Some documentation
    `;
    fs.writeFileSync(file, content, 'utf8');

    const results = scanFile(file);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].ceiling, 'local storage');
    assert.strictEqual(results[0].upgradePath, 'use Postgres in future');
  });
});
