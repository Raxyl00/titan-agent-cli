#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { compress, compressProse, splitBlocks, estimateTokens } = require('../src/compress');

describe('TITAN Compress', () => {
  describe('splitBlocks', () => {
    it('should split prose and code blocks', () => {
      const input = 'Some prose\n```js\nconst x = 1;\n```\nMore prose';
      const blocks = splitBlocks(input);
      assert.strictEqual(blocks.length, 3);
      assert.strictEqual(blocks[0].type, 'prose');
      assert.strictEqual(blocks[1].type, 'code');
      assert.strictEqual(blocks[2].type, 'prose');
    });

    it('should handle content with no code blocks', () => {
      const blocks = splitBlocks('Just prose here');
      assert.strictEqual(blocks.length, 1);
      assert.strictEqual(blocks[0].type, 'prose');
    });

    it('should handle content that is only a code block', () => {
      const input = '```\ncode only\n```';
      const blocks = splitBlocks(input);
      assert.ok(blocks.some(b => b.type === 'code'));
    });
  });

  describe('compressProse', () => {
    it('should drop articles', () => {
      const result = compressProse('The component re-renders');
      assert.ok(!result.startsWith('The '));
    });

    it('should drop filler words', () => {
      const result = compressProse('I just really want to basically test this');
      assert.ok(!result.includes('just'));
      assert.ok(!result.includes('really'));
      assert.ok(!result.includes('basically'));
    });

    it('should drop hedging', () => {
      const result = compressProse('This is likely caused by a bug');
      assert.ok(!result.includes('likely'));
    });

    it('should replace verbose phrases', () => {
      const result = compressProse('We need to utilize this functionality');
      assert.ok(result.includes('use'));
      assert.ok(result.includes('feature'));
    });

    it('should preserve inline code', () => {
      const result = compressProse('The `lru_cache` function is likely the best choice');
      assert.ok(result.includes('`lru_cache`'));
    });

    it('should preserve URLs', () => {
      const result = compressProse('Visit https://example.com/the/path for the details');
      assert.ok(result.includes('https://example.com/the/path'));
    });

    it('should collapse double spaces', () => {
      const result = compressProse('word  word');
      assert.ok(!result.includes('  '));
    });
  });

  describe('compress (full pipeline)', () => {
    it('should compress prose but preserve code blocks', () => {
      const input = 'The component is likely broken.\n```js\nconst x = 1;\n```\nThe fix is simple.';
      const result = compress(input);

      // Code block preserved
      assert.ok(result.compressed.includes('const x = 1;'));

      // Some compression happened
      assert.ok(result.savings > 0);
      assert.ok(result.compressedTokens < result.originalTokens);
    });

    it('should report token statistics', () => {
      const result = compress('The quick brown fox jumps over the lazy dog. Actually, it is quite simply a very basic sentence.');
      assert.ok(typeof result.originalTokens === 'number');
      assert.ok(typeof result.compressedTokens === 'number');
      assert.ok(typeof result.savings === 'number');
      assert.ok(typeof result.savedTokens === 'number');
    });
  });

  describe('estimateTokens', () => {
    it('should estimate roughly 4 chars per token', () => {
      const tokens = estimateTokens('hello world');
      assert.ok(tokens > 0);
      assert.ok(tokens <= 5);
    });
  });
});
