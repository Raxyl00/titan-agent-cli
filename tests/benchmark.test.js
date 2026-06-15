'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { runBenchmark } = require('../src/benchmark');

describe('Benchmark Suite Output', () => {
  it('should run mock mode and output only English results', async () => {
    // Save original console.log and env variables
    const originalLog = console.log;
    const originalEnv = { ...process.env };
    
    // Clear API keys to force mock mode
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
    
    const logs = [];
    console.log = (...args) => {
      logs.push(args.join(' '));
    };
    
    try {
      await runBenchmark();
    } finally {
      console.log = originalLog;
      process.env = originalEnv;
    }
    
    const allText = logs.join('\n');
    
    // Check that there is no Italian warning
    assert.ok(!allText.includes('valori illustrativi, non empirici'), 'Should not contain Italian demo message');
    assert.ok(allText.includes('SIMULATED API BENCHMARK'), 'Should mention Simulated API Benchmark');
    assert.ok(allText.includes('UID (Density)'), 'Should print table with UID column');
    assert.ok(allText.includes('Variant'), 'Should print table with Variant column');
  });
});
