#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { processLines } = require('../src/filter');

describe('TITAN Filter', () => {
  it('should remove npm warnings', () => {
    const result = processLines(['npm warn deprecated inflight@1.0.6']);
    assert.deepStrictEqual(result, []);
  });

  it('should remove build success messages', () => {
    const result = processLines(['✓ Build complete in 2.3s']);
    assert.deepStrictEqual(result, []);
  });

  it('should remove empty lines', () => {
    const result = processLines(['', '  ', '']);
    assert.deepStrictEqual(result, []);
  });

  it('should preserve actual content', () => {
    const result = processLines(['src/app.ts: export const x = 1;']);
    assert.deepStrictEqual(result, ['src/app.ts: export const x = 1;']);
  });

  it('should compress stack traces — keep error + first relevant frame', () => {
    const input = [
      'TypeError: Cannot read properties of undefined (reading \'id\')',
      '    at Object.handler (/home/user/project/src/handlers/user.ts:42:15)',
      '    at /home/user/project/node_modules/express/lib/router/layer.js:95:5',
      '    at next (/home/user/project/node_modules/express/lib/router/route.js:137:13)',
      '',
    ];
    const result = processLines(input);
    assert.strictEqual(result.length, 2);
    assert.ok(result[0].includes('TypeError'));
    assert.ok(result[1].includes('user.ts:42'));
  });

  it('should remove Vite startup messages', () => {
    const input = [
      '  VITE v5.0.0  ready in 300ms',
      '  ➜  Local:   http://localhost:3000/',
      '  ➜  Network: http://192.168.1.1:3000/',
    ];
    const result = processLines(input);
    assert.deepStrictEqual(result, []);
  });

  it('should preserve error messages without stack frames', () => {
    const input = ['SyntaxError: Unexpected token }', 'some other line'];
    const result = processLines(input);
    assert.ok(result.some(l => l.includes('SyntaxError')));
    assert.ok(result.some(l => l.includes('some other line')));
  });

  it('should handle full integration scenario', () => {
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
    assert.deepStrictEqual(result, expected);
  });
});
