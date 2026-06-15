'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Benchmark Tasks & Rubrics ---
const TASKS = [
  {
    id: 'coding',
    name: 'Task 1: Coding (Product Filter)',
    prompt: 'Write a JavaScript function to filter a list of products. Filter out items where stock is 0. Map the rest to return objects with id, name, and totalValue (price * stock). Explain the code.',
    evaluate: (text) => {
      let score = 0;
      const t = text.toLowerCase();
      // Check syntax/concepts
      if (t.includes('filter')) score += 30;
      if (t.includes('map')) score += 30;
      if (t.includes('stock') && (t.includes('>') || t.includes('!==') || t.includes('stock)'))) score += 20;
      if (t.includes('price') && t.includes('stock')) score += 20;
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
      if (t.includes('circular') || t.includes('cycle') || t.includes('loop')) score += 40;
      if (t.includes('inject') || t.includes('dependency injection') || t.includes('refactor') || t.includes('pass') || t.includes('require') || t.includes('export')) score += 60;
      return score;
    }
  },
  {
    id: 'logic',
    name: 'Task 3: Logic (Surgeon Riddle)',
    prompt: 'A father and son are in a car accident. The father dies. The son is taken to the hospital. The surgeon says: "I cannot operate on this boy, he is my son." Who is the surgeon? Answer in one short sentence.',
    evaluate: (text) => {
      const t = text.toLowerCase();
      if (t.includes('mother') || t.includes('mom') || t.includes('madre') || t.includes('parent') || t.includes('another father') || t.includes('second father')) {
        return 100;
      }
      return 0;
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
  const body = {
    model: 'claude-3-5-sonnet-20241022',
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

  const body = {
    model: 'gpt-4o-mini',
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
  console.log('═══════════════════════════════════════════════════════');
  console.log('  SIMULATED API BENCHMARK (MOCK MODE)');
  console.log('  Set ANTHROPIC_API_KEY or OPENAI_API_KEY for real calls');
  console.log('═══════════════════════════════════════════════════════\n');

  const mockData = {
    baseline: {
      coding: { outputTokens: 215, score: 100 },
      debugging: { outputTokens: 190, score: 100 },
      logic: { outputTokens: 45, score: 100 }
    },
    caveman: {
      coding: { outputTokens: 75, score: 100 },
      debugging: { outputTokens: 80, score: 100 },
      logic: { outputTokens: 20, score: 100 }
    },
    ponytail: {
      coding: { outputTokens: 68, score: 100 },
      debugging: { outputTokens: 75, score: 70 },
      logic: { outputTokens: 25, score: 80 }
    },
    titan: {
      coding: { outputTokens: 78, score: 100 },
      debugging: { outputTokens: 82, score: 100 },
      logic: { outputTokens: 22, score: 100 }
    },
    titan_lite: {
      coding: { outputTokens: 75, score: 100 },
      debugging: { outputTokens: 80, score: 100 },
      logic: { outputTokens: 24, score: 100 }
    },
    titan_aggressive: {
      coding: { outputTokens: 45, score: 100 },
      debugging: { outputTokens: 52, score: 90 },
      logic: { outputTokens: 18, score: 60 }
    }
  };

  printTable(mockData);
}

function printTable(results) {
  console.log('-----------------------------------------------------------------------------------------------------------------');
  console.log('| Variant          | Coding Score | Debug Score | Logic Score | Avg Score % | Avg Tokens | UID (Density) | status  |');
  console.log('-----------------------------------------------------------------------------------------------------------------');

  for (const [variantName, tasksData] of Object.entries(results)) {
    const codingScore = tasksData.coding.score;
    const debuggingScore = tasksData.debugging.score;
    const logicScore = tasksData.logic.score;
    const avgScore = Math.round((codingScore + debuggingScore + logicScore) / 3);
    const avgTokens = Math.round((tasksData.coding.outputTokens + tasksData.debugging.outputTokens + tasksData.logic.outputTokens) / 3);
    
    // UID = Avg Score % / Avg Tokens * 1000
    const uid = avgTokens > 0 ? ((avgScore / avgTokens) * 1000).toFixed(1) : '0.0';
    
    let status = 'Reliable';
    if (avgScore < 80) status = '⚠ Degraded';
    if (avgScore < 60) status = '❌ Fragile';

    console.log(`| ${variantName.padEnd(16)} | ${codingScore.toString().padStart(11)}% | ${debuggingScore.toString().padStart(10)}% | ${logicScore.toString().padStart(10)}% | ${avgScore.toString().padStart(10)}% | ${avgTokens.toString().padStart(10)} | ${uid.toString().padStart(13)} | ${status.padEnd(7)} |`);
  }
  console.log('-----------------------------------------------------------------------------------------------------------------');
  console.log('\nDefinitions:');
  console.log('- **Avg Score %**: Rubric-based accuracy distribution across all task categories.');
  console.log('- **Avg Tokens**: Mean output token count per task.');
  console.log('- **UID (Usable Intelligence Density)**: (Avg Score % / Avg Tokens) * 1000. Ratio of task intelligence preserved per token.');
  console.log('- **Status**: Safety indicators based on reasoning retention curve.');
}

async function runBenchmark() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) {
    runMockMode();
    return;
  }

  const provider = anthropicKey ? 'Anthropic' : 'OpenAI';
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  REAL API BENCHMARK via ${provider} (Multi-Task Curve)`);
  console.log('═══════════════════════════════════════════════════════\n');

  const results = {};

  for (const [name, systemPrompt] of Object.entries(SYSTEM_PROMPTS)) {
    console.log(`\nTesting variant: [${name}]`);
    results[name] = {};

    for (const task of TASKS) {
      console.log(`  Running ${task.name}...`);
      try {
        let res;
        if (anthropicKey) {
          res = await callAnthropic(systemPrompt, task.prompt, anthropicKey);
        } else {
          res = await callOpenAI(systemPrompt, task.prompt, openaiKey);
        }
        const score = task.evaluate(res.text);
        results[name][task.id] = {
          outputTokens: res.outputTokens,
          score: score
        };
        console.log(`    Tokens: ${res.outputTokens} | Rubric Score: ${score}%`);
      } catch (err) {
        console.error(`    Error: ${err.message}`);
        results[name][task.id] = { outputTokens: 0, score: 0 };
      }
    }
  }

  console.log('\nResults Matrix (Cognitive Degradation Curve):\n');
  printTable(results);
}

module.exports = { runBenchmark };
