#!/usr/bin/env node
'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { initAgent, initAll, listAgents, ADAPTER_IDS } = require('../src/init');

// Create a temp dir inside the project for test output
const TEST_DIR = path.join(__dirname, '..', '.test-output');

describe('TITAN Init', () => {
  before(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  after(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe('listAgents', () => {
    it('should return all 9 agents', () => {
      const agents = listAgents();
      assert.strictEqual(agents.length, 9);
    });

    it('should have id, path, and description for each agent', () => {
      for (const agent of listAgents()) {
        assert.ok(agent.id, 'agent should have id');
        assert.ok(agent.path, 'agent should have path');
        assert.ok(agent.description, 'agent should have description');
      }
    });
  });

  describe('ADAPTER_IDS', () => {
    it('should include all expected agents', () => {
      const expected = ['cloudcode', 'cursor', 'copilot', 'windsurf', 'cline', 'kiro', 'aider', 'antigravity', 'generic'];
      for (const id of expected) {
        assert.ok(ADAPTER_IDS.includes(id), `Missing adapter: ${id}`);
      }
    });
  });

  describe('initAgent', () => {
    for (const agentId of ADAPTER_IDS) {
      it(`should generate skill file for ${agentId}`, () => {
        const agentDir = path.join(TEST_DIR, agentId);
        fs.mkdirSync(agentDir, { recursive: true });

        const result = initAgent(agentId, agentDir);
        assert.ok(result.path, 'should return output path');

        const fullPath = path.join(agentDir, result.path);
        assert.ok(fs.existsSync(fullPath), `File should exist: ${fullPath}`);

        const content = fs.readFileSync(fullPath, 'utf8');
        assert.ok(content.length > 100, 'Content should be non-trivial');

        // All files should contain TITAN identity
        assert.ok(content.includes('TITAN'), 'Should contain TITAN reference');
      });
    }

    it('should throw for unknown agent', () => {
      assert.throws(() => initAgent('nonexistent', TEST_DIR), /Unknown agent/);
    });
  });

  describe('adapter-specific formats', () => {
    it('cursor should have MDC frontmatter with alwaysApply', () => {
      const dir = path.join(TEST_DIR, 'cursor-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('cursor', dir);

      const content = fs.readFileSync(path.join(dir, '.cursor/rules/titan.mdc'), 'utf8');
      assert.ok(content.includes('alwaysApply: true'));
      assert.ok(content.includes('description:'));
    });

    it('copilot should not have H1 headings', () => {
      const dir = path.join(TEST_DIR, 'copilot-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('copilot', dir);

      const content = fs.readFileSync(path.join(dir, '.github/copilot-instructions.md'), 'utf8');
      const lines = content.split('\n');
      // No line should start with exactly one # followed by space
      for (const line of lines) {
        assert.ok(!line.match(/^# [^#]/), `H1 heading found: ${line}`);
      }
    });

    it('cloudcode should not have YAML frontmatter', () => {
      const dir = path.join(TEST_DIR, 'cloudcode-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('cloudcode', dir);

      const content = fs.readFileSync(path.join(dir, '.claude/skills/titan/titan-core.md'), 'utf8');
      assert.ok(!content.startsWith('---'), 'Should not start with frontmatter');
    });

    it('kiro should have YAML frontmatter with name and version', () => {
      const dir = path.join(TEST_DIR, 'kiro-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('kiro', dir);

      const content = fs.readFileSync(path.join(dir, '.kiro/skills/titan/SKILL.md'), 'utf8');
      assert.ok(content.startsWith('---'), 'Should start with frontmatter');
      assert.ok(content.includes('name:'));
      assert.ok(content.includes('version:'));
    });

    it('windsurf should have activation metadata', () => {
      const dir = path.join(TEST_DIR, 'windsurf-format');
      fs.mkdirSync(dir, { recursive: true });
      initAgent('windsurf', dir);

      const content = fs.readFileSync(path.join(dir, '.windsurf/rules/titan.md'), 'utf8');
      assert.ok(content.includes('Always On'));
    });
  });

  describe('lite mode generation', () => {
    it('should generate significantly smaller files when lite: true is passed', () => {
      const dirNormal = path.join(TEST_DIR, 'lite-test-normal');
      const dirLite = path.join(TEST_DIR, 'lite-test-lite');
      fs.mkdirSync(dirNormal, { recursive: true });
      fs.mkdirSync(dirLite, { recursive: true });

      const normalRes = initAgent('cursor', dirNormal);
      const liteRes = initAgent('cursor', dirLite, { lite: true });

      const normalContent = fs.readFileSync(path.join(dirNormal, normalRes.path), 'utf8');
      const liteContent = fs.readFileSync(path.join(dirLite, liteRes.path), 'utf8');

      assert.ok(liteContent.length < normalContent.length * 0.5, 'Lite content should be less than half the size of normal content');
      assert.ok(liteContent.includes('TITAN LITE'), 'Should contain TITAN LITE reference');
    });
  });

  describe('initAll', () => {
    it('should generate files for all agents', () => {
      const dir = path.join(TEST_DIR, 'all-agents');
      fs.mkdirSync(dir, { recursive: true });

      const results = initAll(dir);
      assert.strictEqual(results.length, 9);

      const successes = results.filter(r => r.success);
      assert.strictEqual(successes.length, 9, `Expected 9 successes, got ${successes.length}: ${results.filter(r => !r.success).map(r => `${r.agentId}: ${r.error}`).join(', ')}`);
    });

    it('should generate lite files for all agents when lite: true is passed', () => {
      const dir = path.join(TEST_DIR, 'all-agents-lite');
      fs.mkdirSync(dir, { recursive: true });

      const results = initAll(dir, { lite: true });
      assert.strictEqual(results.length, 9);

      const successes = results.filter(r => r.success);
      assert.strictEqual(successes.length, 9, `Expected 9 successes, got ${successes.length}`);

      // Verify one file is indeed lite
      const cursorFile = path.join(dir, '.cursor/rules/titan.mdc');
      assert.ok(fs.existsSync(cursorFile));
      const content = fs.readFileSync(cursorFile, 'utf8');
      assert.ok(content.includes('TITAN LITE'), 'Generated all files should be in lite mode');
    });
  });
});
