#!/usr/bin/env node
'use strict';

const { runBenchmark } = require('../src/benchmark');

runBenchmark().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
