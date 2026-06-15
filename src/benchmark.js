'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { estimateTokens } = require('./compress');

// --- Benchmark Tasks & Rubrics ---
const TASKS = [
  {
    id: 'coding',
    name: 'Task 1: Coding (Product Filter)',
    prompt: 'Write a JavaScript function to filter a list of products. Filter out items where stock is 0. Map the rest to return objects with id, name, and totalValue (price * stock). Explain the code.',
    evaluate: (text) => {
      let score = 0;
      const t = text.toLowerCase();

      // 1. filter AND filters stock (+25 pts)
      const hasFilter = t.includes('filter');
      const hasStockFilter = /stock\s*===\s*0/.test(t) ||
                             /stock\s*>\s*0/.test(t) ||
                             /stock\s*!==\s*0/.test(t) ||
                             t.includes('!item.stock');
      if (hasFilter && hasStockFilter) {
        score += 25;
      }

      // 2. map used for transformation (+25 pts)
      const hasMap = t.includes('.map(') ||
                     t.includes('.map(item') ||
                     t.includes('.map(p ') ||
                     /\.map\s*\(/.test(t);
      if (hasMap) {
        score += 25;
      }

      // 3. totalValue OR price & stock within 50 chars (+25 pts)
      const hasTotalValue = t.includes('totalvalue');
      const priceStockClose = () => {
        let idx = 0;
        while (true) {
          const pIdx = t.indexOf('price', idx);
          if (pIdx === -1) break;
          let sIdx = 0;
          while (true) {
            const sIdxNext = t.indexOf('stock', sIdx);
            if (sIdxNext === -1) break;
            if (Math.abs(pIdx - sIdxNext) <= 50) return true;
            sIdx = sIdxNext + 1;
          }
          idx = pIdx + 1;
        }
        return false;
      };
      if (hasTotalValue || priceStockClose()) {
        score += 25;
      }

      // 4. arrow function or function declaration (+25 pts)
      const hasFunction = t.includes('=>') || t.includes('function');
      if (hasFunction) {
        score += 25;
      }

      return score;
    }
  },
  {
    id: 'debugging',
    name: 'Task 2: Debugging (Circular Dependency)',
    prompt: 'In Node.js, user-service.js requires auth-service.js, and auth-service.js requires user-service.js. Why does this cause issues and how do you fix it?',
    evaluate: (text) => {
      let score = 0;
      const t = text.toLowerCase();

      // 1. circular OR (dependency AND cycle) (+40 pts)
      if (t.includes('circular') || (t.includes('dependency') && t.includes('cycle'))) {
        score += 40;
      }

      // 2. structural solution (+30 pts)
      const hasSolution = t.includes('dependency injection') ||
                          t.includes('invert') ||
                          t.includes('extract') ||
                          t.includes('third module') ||
                          t.includes('shared module');
      if (hasSolution) {
        score += 30;
      }

      // 3. Node.js mechanism (+30 pts)
      const hasMechanism = t.includes('incomplete object') ||
                           t.includes('partially loaded') ||
                           t.includes('module cache') ||
                           t.includes('require cache');
      if (hasMechanism) {
        score += 30;
      }

      return score;
    }
  },
  {
    id: 'logic',
    name: 'Task 3: Logic (Surgeon Riddle)',
    prompt: 'A father and son are in a car accident. The father dies. The son is taken to the hospital. The surgeon says: "I cannot operate on this boy, he is my son." Who is the surgeon? Answer in one short sentence.',
    evaluate: (text) => {
      const t = text.toLowerCase();
      const keywords = ['mother', 'mom', 'madre', 'mère', 'mutter', 'stepfather', 'second father', 'other parent'];
      const score = keywords.some(kw => t.includes(kw)) ? 100 : 0;
      if (score === 0) {
        console.warn(`\n[DEBUG] Task 3 answer was scored 0. Response text:\n${text}\n`);
      }
      return score;
    }
  },
  {
    id: 'refactoring',
    name: 'Task 4: Refactoring (External Dependencies)',
    prompt: 'Refactor the following function to remove unnecessary external dependencies. Use the Node.js standard library or native JavaScript where possible.\n```javascript\nconst lodash = require(\'lodash\');\nconst moment = require(\'moment\');\n\nfunction processUserData(users) {\n  const activeUsers = lodash.filter(users, user => user.isActive);\n  const sorted = lodash.sortBy(activeUsers, [\'age\']);\n  return lodash.map(sorted, user => {\n    return {\n      name: lodash.upperFirst(user.name),\n      formattedDate: moment(user.createdAt).format(\'YYYY-MM-DD\')\n    };\n  });\n}\n```\nExplain the changes made.',
    evaluate: (text) => {
      let score = 0;
      const t = text.toLowerCase();

      // 1. Remove lodash/moment requirements (+30 pts)
      const removedDeps = !t.includes("require('lodash')") && !t.includes("require('moment')") && !t.includes("require(\"lodash\")") && !t.includes("require(\"moment\")");
      if (removedDeps) {
        score += 30;
      }

      // 2. Use native filter (+20 pts)
      if (t.includes('.filter(')) {
        score += 20;
      }

      // 3. Use native sort or map (+20 pts)
      if (t.includes('.sort(') || t.includes('.map(')) {
        score += 20;
      }

      // 4. Native string capitalize/upperFirst (+15 pts)
      if (t.includes('touppercase') || t.includes('charat') || t.includes('[0]')) {
        score += 15;
      }

      // 5. Native date formatting (+15 pts)
      if (t.includes('slice') || t.includes('split') || t.includes('date') || t.includes('intl')) {
        score += 15;
      }

      return score;
    }
  },
  {
    id: 'review',
    name: 'Task 5: Code Review (Over-engineering)',
    prompt: 'Perform a code review of this diff. Focus on identifying over-engineering, unnecessary abstractions, or YAGNI violations.\n```diff\n- function calculateTotal(items) {\n-   return items.reduce((sum, item) => sum + item.price, 0);\n- }\n+ class TotalCalculatorStrategy {\n+   calculate(items) {\n+     throw new Error(\'Not implemented\');\n+   }\n+ }\n+ class SimpleTotalCalculator extends TotalCalculatorStrategy {\n+   calculate(items) {\n+     return items.reduce((sum, item) => sum + item.price, 0);\n+   }\n+ }\n+ class CalculatorFactory {\n+   static getCalculator(type) {\n+     if (type === \'simple\') return new SimpleTotalCalculator();\n+     throw new Error(\'Unknown type\');\n+   }\n+ }\n```\nExplain the feedback concisely.',
    evaluate: (text) => {
      let score = 0;
      const t = text.toLowerCase();

      // 1. Identify over-engineering or YAGNI (+40 pts)
      if (t.includes('yagni') || t.includes('over-engineer') || t.includes('overengineer') || t.includes('abstraction')) {
        score += 40;
      }

      // 2. Identify factory or strategy pattern (+30 pts)
      if (t.includes('factory') || t.includes('strategy') || t.includes('class')) {
        score += 30;
      }

      // 3. Suggest keeping original or simple function (+30 pts)
      if (t.includes('keep') || t.includes('original') || t.includes('simple') || t.includes('revert') || t.includes('reduce')) {
        score += 30;
      }

      return score;
    }
  }
];

// Load prompt contents
const masterPath = path.join(__dirname, '..', 'skills', 'master.md');
const litePath = path.join(__dirname, '..', 'skills', 'master-lite.md');
const aggressivePath = path.join(__dirname, '..', 'skills', 'master-aggressive.md');

const SYSTEM_PROMPTS = {
  baseline: '',
  caveman: `Respond terse like smart caveman. All technical substance stay. Only fluff die.
ACTIVE EVERY RESPONSE. No revert after many turns.
Drop: articles, filler, pleasantries, hedging. Fragments OK. Short synonyms.
No tool-call narration. Technical terms exact. Code blocks unchanged.
Preserve user's dominant language.
No self-reference. Never name or announce the style.`,
  ponytail: `You are a lazy senior developer. Lazy means efficient, not careless.
ACTIVE EVERY RESPONSE. No drift back to over-building.
Stop at the first rung that holds:
1. YAGNI
2. Stdlib does it? Use it.
3. Native platform feature covers it?
4. Already-installed dependency solves it?
5. Can it be one line? One line.
6. Only then: minimum code.
No abstractions, no boilerplate. Deletion over addition.
Mark simplifications with ponytail: comment`,
  titan: fs.existsSync(masterPath) ? fs.readFileSync(masterPath, 'utf8') : '',
  titan_lite: fs.existsSync(litePath) ? fs.readFileSync(litePath, 'utf8') : '',
  titan_aggressive: fs.existsSync(aggressivePath) ? fs.readFileSync(aggressivePath, 'utf8') : '',
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function getStats(array) {
  const n = array.length;
  if (n === 0) return { mean: 0, std: 0 };
  const mean = array.reduce((s, x) => s + x, 0) / n;
  const std = n > 1 ? Math.sqrt(array.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / n) : 0;
  return { mean, std };
}

function postRequest(url, headers, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(JSON.stringify(body));
    req.end();
  });
}

async function callAnthropic(system, user, apiKey) {
  const url = 'https://api.anthropic.com/v1/messages';
  const headers = {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };
  const model = process.env.TITAN_BENCH_MODEL || 'claude-sonnet-4-6';
  const body = {
    model: model,
    max_tokens: 512,
    messages: [{ role: 'user', content: user }],
  };
  if (system) {
    body.system = system;
  }

  const start = Date.now();
  const res = await postRequest(url, headers, body);
  const elapsed = Date.now() - start;

  const text = res.content[0].text;
  const inputTokens = res.usage.input_tokens;
  const outputTokens = res.usage.output_tokens;

  return { text, inputTokens, outputTokens, elapsed };
}

async function callOpenAI(system, user, apiKey) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
  };
  const messages = [];
  if (system) {
    messages.push({ role: 'system', content: system });
  }
  messages.push({ role: 'user', content: user });

  const model = process.env.TITAN_BENCH_MODEL || 'gpt-4o-mini';
  const body = {
    model: model,
    max_tokens: 512,
    messages,
  };

  const start = Date.now();
  const res = await postRequest(url, headers, body);
  const elapsed = Date.now() - start;

  const text = res.choices[0].message.content;
  const inputTokens = res.usage.prompt_tokens;
  const outputTokens = res.usage.completion_tokens;

  return { text, inputTokens, outputTokens, elapsed };
}

function runMockMode() {
  console.log('═════════════════════════════════════════════════════════════════════════════');
  console.log('  SIMULATED API BENCHMARK (MOCK MODE)');
  console.log('  Set ANTHROPIC_API_KEY or OPENAI_API_KEY for real calls');
  console.log('  DEMO MODE — illustrative values, not empirical. Run with API key for real data.');
  console.log('═════════════════════════════════════════════════════════════════════════════\n');

  const mockData = {
    baseline: {
      coding: { scores: [100, 100, 100], tokens: [220, 210, 230], inputTokens: [50, 50, 50] },
      debugging: { scores: [100, 100, 100], tokens: [195, 190, 205], inputTokens: [50, 50, 50] },
      logic: { scores: [100, 100, 100], tokens: [45, 40, 50], inputTokens: [50, 50, 50] },
      refactoring: { scores: [100, 100, 100], tokens: [250, 240, 260], inputTokens: [50, 50, 50] },
      review: { scores: [100, 100, 100], tokens: [280, 270, 290], inputTokens: [50, 50, 50] }
    },
    caveman: {
      coding: { scores: [100, 100, 100], tokens: [85, 80, 90], inputTokens: [120, 120, 120] },
      debugging: { scores: [100, 100, 100], tokens: [80, 75, 85], inputTokens: [120, 120, 120] },
      logic: { scores: [100, 100, 100], tokens: [20, 18, 22], inputTokens: [120, 120, 120] },
      refactoring: { scores: [100, 100, 100], tokens: [95, 90, 100], inputTokens: [120, 120, 120] },
      review: { scores: [100, 100, 100], tokens: [110, 105, 115], inputTokens: [120, 120, 120] }
    },
    ponytail: {
      coding: { scores: [100, 100, 100], tokens: [75, 70, 80], inputTokens: [115, 115, 115] },
      debugging: { scores: [70, 70, 70], tokens: [70, 65, 75], inputTokens: [115, 115, 115] },
      logic: { scores: [80, 80, 80], tokens: [25, 22, 28], inputTokens: [115, 115, 115] },
      refactoring: { scores: [100, 100, 100], tokens: [80, 75, 85], inputTokens: [115, 115, 115] },
      review: { scores: [80, 80, 80], tokens: [90, 85, 95], inputTokens: [115, 115, 115] }
    },
    titan: {
      coding: { scores: [100, 100, 100], tokens: [80, 75, 85], inputTokens: [1500, 1500, 1500] },
      debugging: { scores: [100, 100, 100], tokens: [82, 78, 86], inputTokens: [1500, 1500, 1500] },
      logic: { scores: [100, 100, 100], tokens: [22, 20, 24], inputTokens: [1500, 1500, 1500] },
      refactoring: { scores: [100, 100, 100], tokens: [90, 85, 95], inputTokens: [1500, 1500, 1500] },
      review: { scores: [100, 100, 100], tokens: [105, 100, 110], inputTokens: [1500, 1500, 1500] }
    },
    titan_lite: {
      coding: { scores: [100, 100, 100], tokens: [95, 90, 100], inputTokens: [425, 425, 425] },
      debugging: { scores: [100, 100, 100], tokens: [100, 95, 105], inputTokens: [425, 425, 425] },
      logic: { scores: [100, 100, 100], tokens: [30, 28, 32], inputTokens: [425, 425, 425] },
      refactoring: { scores: [100, 100, 100], tokens: [110, 105, 115], inputTokens: [425, 425, 425] },
      review: { scores: [100, 100, 100], tokens: [120, 115, 125], inputTokens: [425, 425, 425] }
    },
    titan_aggressive: {
      coding: { scores: [95, 95, 95], tokens: [50, 48, 52], inputTokens: [400, 400, 400] },
      debugging: { scores: [80, 80, 80], tokens: [55, 52, 58], inputTokens: [400, 400, 400] },
      logic: { scores: [60, 60, 60], tokens: [18, 16, 20], inputTokens: [400, 400, 400] },
      refactoring: { scores: [90, 90, 90], tokens: [60, 58, 62], inputTokens: [400, 400, 400] },
      review: { scores: [70, 70, 70], tokens: [65, 62, 68], inputTokens: [400, 400, 400] }
    }
  };

  printTable(mockData, 'mock');
}

function printTable(results, source) {
  console.log('-'.repeat(173));
  console.log('| Variant          | Coding | Debug  | Logic  | Refact | Review | Avg Score %   | Avg In Tok    | Avg Out Tok   | Avg Tot Tok   | UID (Density) | Status    | Source |');
  console.log('-'.repeat(173));

  const order = ['baseline', 'caveman', 'ponytail', 'titan', 'titan_lite', 'titan_aggressive'];

  for (const variantName of order) {
    const tasksData = results[variantName];
    if (!tasksData) continue;

    const codingScores = tasksData.coding.scores;
    const codingTokens = tasksData.coding.tokens;
    const debuggingScores = tasksData.debugging.scores;
    const debuggingTokens = tasksData.debugging.tokens;
    const logicScores = tasksData.logic.scores;
    const logicTokens = tasksData.logic.tokens;
    const refactoringScores = tasksData.refactoring.scores;
    const refactoringTokens = tasksData.refactoring.tokens;
    const reviewScores = tasksData.review.scores;
    const reviewTokens = tasksData.review.tokens;

    const codingMeanScore = codingScores.reduce((a, b) => a + b, 0) / codingScores.length;
    const debuggingMeanScore = debuggingScores.reduce((a, b) => a + b, 0) / debuggingScores.length;
    const logicMeanScore = logicScores.reduce((a, b) => a + b, 0) / logicScores.length;
    const refactoringMeanScore = refactoringScores.reduce((a, b) => a + b, 0) / refactoringScores.length;
    const reviewMeanScore = reviewScores.reduce((a, b) => a + b, 0) / reviewScores.length;

    const codingInTokens = tasksData.coding.inputTokens || Array(codingScores.length).fill(0);
    const debuggingInTokens = tasksData.debugging.inputTokens || Array(debuggingScores.length).fill(0);
    const logicInTokens = tasksData.logic.inputTokens || Array(logicScores.length).fill(0);
    const refactoringInTokens = tasksData.refactoring.inputTokens || Array(refactoringScores.length).fill(0);
    const reviewInTokens = tasksData.review.inputTokens || Array(reviewScores.length).fill(0);

    const numRuns = codingTokens.length;
    const runScores = [];
    const runInTokens = [];
    const runOutTokens = [];
    const runTotalTokens = [];

    for (let r = 0; r < numRuns; r++) {
      const scoreSum = codingScores[r] + debuggingScores[r] + logicScores[r] + refactoringScores[r] + reviewScores[r];
      const inSum = codingInTokens[r] + debuggingInTokens[r] + logicInTokens[r] + refactoringInTokens[r] + reviewInTokens[r];
      const outSum = codingTokens[r] + debuggingTokens[r] + logicTokens[r] + refactoringTokens[r] + reviewTokens[r];
      runScores.push(scoreSum / 5);
      runInTokens.push(inSum / 5);
      runOutTokens.push(outSum / 5);
      runTotalTokens.push((inSum + outSum) / 5);
    }

    const scoreStats = getStats(runScores);
    const inTokenStats = getStats(runInTokens);
    const outTokenStats = getStats(runOutTokens);
    const totalTokenStats = getStats(runTotalTokens);

    const avgScore = scoreStats.mean;
    const avgTotalTokens = totalTokenStats.mean;

    const uid = avgTotalTokens > 0 ? ((avgScore / avgTotalTokens) * 1000).toFixed(1) : '0.0';

    let status = 'Reliable';
    if (avgScore < 80) status = '⚠ Degraded';
    if (avgScore < 60) status = '❌ Fragile';

    const codingScoreStr = Math.round(codingMeanScore) + '%';
    const debuggingScoreStr = Math.round(debuggingMeanScore) + '%';
    const logicScoreStr = Math.round(logicMeanScore) + '%';
    const refactoringScoreStr = Math.round(refactoringMeanScore) + '%';
    const reviewScoreStr = Math.round(reviewMeanScore) + '%';

    const avgScoreStr = `${Math.round(scoreStats.mean)}% ±${Math.round(scoreStats.std)}`;
    const avgInTokensStr = `${Math.round(inTokenStats.mean)} ±${Math.round(inTokenStats.std)}`;
    const avgOutTokensStr = `${Math.round(outTokenStats.mean)} ±${Math.round(outTokenStats.std)}`;
    const avgTotalTokensStr = `${Math.round(totalTokenStats.mean)} ±${Math.round(totalTokenStats.std)}`;

    console.log(`| ${variantName.padEnd(16)} | ${codingScoreStr.padStart(6)} | ${debuggingScoreStr.padStart(6)} | ${logicScoreStr.padStart(6)} | ${refactoringScoreStr.padStart(6)} | ${reviewScoreStr.padStart(6)} | ${avgScoreStr.padStart(13)} | ${avgInTokensStr.padStart(13)} | ${avgOutTokensStr.padStart(13)} | ${avgTotalTokensStr.padStart(13)} | ${uid.padStart(13)} | ${status.padEnd(9)} | ${source.padEnd(6)} |`);
  }
  console.log('-'.repeat(173));
  console.log('\nDefinitions:');
  console.log('- **Avg Score %**: Rubric-based accuracy distribution across all task categories (mean ± standard deviation).');
  console.log('- **Avg In Tok**: Mean input (system + user prompt) token count per task (mean ± standard deviation).');
  console.log('- **Avg Out Tok**: Mean output token count per task (mean ± standard deviation).');
  console.log('- **Avg Tot Tok**: Mean total (input + output) token count per task (mean ± standard deviation).');
  console.log('- **UID (Usable Intelligence Density)**: (Avg Score % / Avg Total Tokens) * 1000. Ratio of task intelligence preserved per context token.');
  console.log('- **Status**: Safety indicators based on reasoning retention curve.');
  console.log('- **Source**: Source of the data (\'mock\' for simulation, \'api\' for real API calls).');
}

async function runBenchmark() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) {
    runMockMode();
    return;
  }

  const provider = anthropicKey ? 'Anthropic' : 'OpenAI';
  const model = anthropicKey 
    ? (process.env.TITAN_BENCH_MODEL || 'claude-sonnet-4-6')
    : (process.env.TITAN_BENCH_MODEL || 'gpt-4o-mini');

  console.log('═══════════════════════════════════════════════════════');
  console.log(`  REAL API BENCHMARK via ${provider} (${model})`);
  console.log('═══════════════════════════════════════════════════════\n');

  const RUNS_PER_TASK = process.env.TITAN_BENCH_RUNS ? parseInt(process.env.TITAN_BENCH_RUNS, 10) : 3;
  const results = {};
  const order = ['baseline', 'caveman', 'ponytail', 'titan', 'titan_lite', 'titan_aggressive'];

  for (const name of order) {
    const systemPrompt = SYSTEM_PROMPTS[name];
    console.log(`\nTesting variant: [${name}]`);
    results[name] = {};

    for (const task of TASKS) {
      console.log(`  Running ${task.name}...`);
      results[name][task.id] = { scores: [], tokens: [], inputTokens: [] };

      for (let run = 0; run < RUNS_PER_TASK; run++) {
        if (run > 0) {
          await sleep(500);
        }
        console.log(`    Run ${run + 1}/${RUNS_PER_TASK}...`);
        try {
          let res;
          if (anthropicKey) {
            res = await callAnthropic(systemPrompt, task.prompt, anthropicKey);
          } else {
            res = await callOpenAI(systemPrompt, task.prompt, openaiKey);
          }
          const score = task.evaluate(res.text);
          results[name][task.id].scores.push(score);
          results[name][task.id].tokens.push(res.outputTokens);
          results[name][task.id].inputTokens.push(res.inputTokens);
          console.log(`      Tokens: ${res.outputTokens} (in: ${res.inputTokens}) | Rubric Score: ${score}%`);
        } catch (err) {
          console.error(`      Error: ${err.message}`);
          results[name][task.id].scores.push(0);
          results[name][task.id].tokens.push(0);
          results[name][task.id].inputTokens.push(0);
        }
      }
    }
  }

  console.log('\nResults Matrix (Cognitive Degradation Curve):\n');
  printTable(results, 'api');

  const timestamp = new Date().toISOString();
  console.log('\n─────────────────────────────────────────');
  console.log('Run info:');
  console.log(`  Provider : ${provider} (${model})`);
  console.log(`  Runs/task: ${RUNS_PER_TASK}`);
  console.log('  Tasks    : coding, debugging, logic, refactoring, review');
  console.log(`  Timestamp: ${timestamp}`);
  console.log('  Source   : REAL API (empirical)');
  console.log('─────────────────────────────────────────\n');

  const resultsData = {
    timestamp,
    provider,
    model,
    runs_per_task: RUNS_PER_TASK,
    results
  };

  try {
    const outputPath = path.join(__dirname, '..', '.titan-bench-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(resultsData, null, 2), 'utf8');
    console.log(`Saved benchmark results to: ${outputPath}\n`);
  } catch (err) {
    console.error(`Failed to save results: ${err.message}`);
  }
}

module.exports = { runBenchmark };
