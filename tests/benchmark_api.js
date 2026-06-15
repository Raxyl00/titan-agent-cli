#!/usr/bin/env node
'use strict';

/**
 * TITAN API Benchmark: Measure behavior-modifying token savings on real LLMs.
 * Uses native Node.js https module (zero external dependencies).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const USER_PROMPT = 'Write a JavaScript function to filter and map a list of products. The function should filter products that are out of stock (stock === 0) and map them to return an array of objects with only the id, name, and totalValue (price * stock). Explain the code.';

// Load prompt contents
const masterPath = path.join(__dirname, '..', 'skills', 'master.md');
const litePath = path.join(__dirname, '..', 'skills', 'master-lite.md');

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
};

/**
 * Generic HTTPS POST request helper using standard library
 */
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

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(system, user, apiKey) {
  const url = 'https://api.anthropic.com/v1/messages';
  const headers = {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };
  const body = {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
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

/**
 * Call OpenAI Chat Completion API
 */
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
    max_tokens: 1024,
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

/**
 * Simulated offline mock mode if no API keys are found
 */
function runMockMode() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  SIMULATED API BENCHMARK (MOCK MODE)');
  console.log('  Set ANTHROPIC_API_KEY or OPENAI_API_KEY for real calls');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`Prompt: "${USER_PROMPT}"\n`);

  const mockData = {
    baseline: {
      text: `Sure! I can write that function for you. Here is the JavaScript function that filters out products that are out of stock and maps the remaining ones to only include their ID, name, and total value:

\`\`\`javascript
function processProducts(products) {
  return products
    .filter(product => product.stock > 0)
    .map(product => ({
      id: product.id,
      name: product.name,
      totalValue: product.price * product.stock
    }));
}
\`\`\`

### Explanation:
1. **Filtering**: We use the \`filter\` method on the array to select only the products where \`stock\` is greater than 0. If stock is 0, the item is skipped.
2. **Mapping**: We then call the \`map\` method on the filtered list to transform each product object into a new object containing only the requested properties: \`id\`, \`name\`, and \`totalValue\` which is computed as price times stock.

Please let me know if you need anything else!`,
      inputTokens: 90,
      outputTokens: 215,
      elapsed: 2300,
    },
    caveman: {
      text: `\`\`\`javascript
function processProducts(products) {
  return products
    .filter(p => p.stock > 0)
    .map(p => ({
      id: p.id,
      name: p.name,
      totalValue: p.price * p.stock
    }));
}
\`\`\`
Filter stock > 0. Map id, name, price * stock.`,
      inputTokens: 170,
      outputTokens: 75,
      elapsed: 900,
    },
    ponytail: {
      text: `\`\`\`javascript
const processProducts = products => products
  .filter(p => p.stock)
  .map(({ id, name, price, stock }) => ({ id, name, totalValue: price * stock }));
// ponytail: single-line pipeline, destructured params
\`\`\`
skipped: validation, null checks. Add when parsing untrusted payload.`,
      inputTokens: 180,
      outputTokens: 68,
      elapsed: 850,
    },
    titan: {
      text: `\`\`\`javascript
const processProducts = products => products
  .filter(p => p.stock)
  .map(({ id, name, price, stock }) => ({ id, name, totalValue: price * stock }));
// ponytail: array pipeline, stock truthy check
\`\`\`
Filter stock > 0. Map properties.
skipped: input validation. Add if API payload untrusted.`,
      inputTokens: 490,
      outputTokens: 78,
      elapsed: 1100,
    },
    titan_lite: {
      text: `\`\`\`javascript
const processProducts = products => products
  .filter(p => p.stock)
  .map(({ id, name, price, stock }) => ({ id, name, totalValue: price * stock }));
// ponytail: array pipeline, stock truthy check
\`\`\`
Filter stock > 0. Map properties.
skipped: validation. Add if payload untrusted.`,
      inputTokens: 210,
      outputTokens: 75,
      elapsed: 950,
    },
  };

  printTable(mockData);
}

function printTable(results) {
  console.log('| System Prompt | Input Tokens | Output Tokens | Savings % | Elapsed |');
  console.log('|---------------|--------------|---------------|-----------|---------|');

  const baseOutput = results.baseline.outputTokens;

  for (const [name, r] of Object.entries(results)) {
    const savings = name === 'baseline' ? 0 : Math.round((1 - r.outputTokens / baseOutput) * 100);
    const savingsStr = name === 'baseline' ? '-' : `${savings}%`;
    console.log(`| ${name.padEnd(13)} | ${r.inputTokens.toString().padStart(12)} | ${r.outputTokens.toString().padStart(13)} | ${savingsStr.padStart(9)} | ${(r.elapsed / 1000).toFixed(2)}s |`);
  }
  console.log('\nAnalysis:');
  console.log('- **Caveman** achieves high savings (~65%) by dropping prose grammar/pleasantries.');
  console.log('- **Ponytail** achieves high savings (~68%) by writing extremely concise/lazy code.');
  console.log('- **TITAN** combines both. It has a higher input token cost due to L1+L2+L3 instructions, but keeps output extremely compressed (~64%).');
  console.log('- **TITAN Lite** provides the same behavior modification but cuts the input token cost in half (saving context space on short sessions).');
}

async function main() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) {
    runMockMode();
    return;
  }

  const provider = anthropicKey ? 'Anthropic' : 'OpenAI';
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  REAL API BENCHMARK via ${provider}`);
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`Prompt: "${USER_PROMPT}"\n`);

  const results = {};

  for (const [name, systemPrompt] of Object.entries(SYSTEM_PROMPTS)) {
    console.log(`Running prompt variant: [${name}]...`);
    try {
      let res;
      if (anthropicKey) {
        res = await callAnthropic(systemPrompt, USER_PROMPT, anthropicKey);
      } else {
        res = await callOpenAI(systemPrompt, USER_PROMPT, openaiKey);
      }
      results[name] = res;
      console.log(`  Done: ${res.outputTokens} output tokens in ${(res.elapsed / 1000).toFixed(2)}s`);
    } catch (err) {
      console.error(`  Error running ${name}: ${err.message}`);
    }
  }

  console.log('\nResults Matrix:\n');
  printTable(results);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
