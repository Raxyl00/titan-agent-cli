'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseFrontmatter, buildFrontmatter } = require('../src/templates');

describe('Templates Frontmatter', () => {
  describe('parseFrontmatter', () => {
    it('should parse Cursor .mdc style frontmatter', () => {
      const input = `---
description: "A test description with block scalar or quoted string"
globs:
  - "*.js"
  - "*.ts"
alwaysApply: true
---
Body content here.`;
      
      const { frontmatter, body } = parseFrontmatter(input);
      assert.strictEqual(frontmatter.description, 'A test description with block scalar or quoted string');
      assert.deepEqual(frontmatter.globs, ['*.js', '*.ts']);
      assert.strictEqual(frontmatter.alwaysApply, true);
      assert.strictEqual(body.trim(), 'Body content here.');
    });

    it('should parse Kiro SKILL.md style frontmatter', () => {
      const input = `---
name: test-skill
description: >
  A multiline description
  folded nicely.
version: 0.1.0
license: MIT
---
Body text`;
      
      const { frontmatter, body } = parseFrontmatter(input);
      assert.strictEqual(frontmatter.name, 'test-skill');
      assert.ok(frontmatter.description.includes('A multiline description'));
      assert.strictEqual(frontmatter.version, '0.1.0');
      assert.strictEqual(frontmatter.license, 'MIT');
      assert.strictEqual(body.trim(), 'Body text');
    });

    it('should handle unquoted string and list block scalars', () => {
      const input = `---
name: simple-name
description: |
  Line 1
  Line 2
---
body`;
      const { frontmatter } = parseFrontmatter(input);
      assert.strictEqual(frontmatter.name, 'simple-name');
      assert.strictEqual(frontmatter.description, 'Line 1\nLine 2');
    });

    it('should log warning for unsupported keys but not crash', () => {
      const originalWarn = console.warn;
      let warned = false;
      console.warn = (msg) => {
        if (msg.includes('Unsupported frontmatter key "invalidKey"')) {
          warned = true;
        }
      };
      
      const input = `---
invalidKey: oops
name: valid-name
---
body`;
      const { frontmatter } = parseFrontmatter(input);
      console.warn = originalWarn;
      
      assert.ok(warned, 'Should log a warning for unsupported keys');
      assert.strictEqual(frontmatter.name, 'valid-name');
      assert.strictEqual(frontmatter.invalidKey, 'oops');
    });

    it('should handle malformed frontmatter gracefully', () => {
      const input = `---
name: unclosed
body without close delimiter`;
      const { frontmatter, body } = parseFrontmatter(input);
      assert.deepEqual(frontmatter, {});
      assert.strictEqual(body, input);
    });
  });

  describe('buildFrontmatter', () => {
    it('should generate valid frontmatter string', () => {
      const obj = {
        name: 'test',
        version: '1.0.0',
        alwaysApply: true,
        globs: ['*.js']
      };
      const result = buildFrontmatter(obj);
      assert.ok(result.startsWith('---'));
      assert.ok(result.endsWith('---'));
      assert.ok(result.includes('name: "test"'));
      assert.ok(result.includes('alwaysApply: true'));
      assert.ok(result.includes('globs: ["*.js"]'));
    });
  });
});
