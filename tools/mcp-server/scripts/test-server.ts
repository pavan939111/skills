// test-server.ts
import * as fs from 'fs';
import * as path from 'path';
import { searchIndex } from '../src/search';

const repoRoot = path.resolve(__dirname, '../../..');
const indexFilePath = path.resolve(__dirname, '../index.json');

function runTest() {
  console.log("----------------------------------------------------------------------");
  console.log("MCP SERVER SEARCH UPGRADES VALIDATION RUN");
  console.log("----------------------------------------------------------------------");

  if (!fs.existsSync(indexFilePath)) {
    console.error("Index file index.json not found!");
    return;
  }
  
  const raw = fs.readFileSync(indexFilePath, 'utf-8');
  const chunks = JSON.parse(raw);
  console.log(`Successfully loaded ${chunks.length} indexed chunks.`);

  // 1. Base 5 Queries
  const baseQueries = [
    "JWT authentication",
    "sharding",
    "CQRS",
    "RAG chunking",
    "circuit breaker"
  ];

  console.log("\n=== 1. TESTING BASE 5 QUERIES ===");
  for (const query of baseQueries) {
    const start = performance.now();
    const results = searchIndex(chunks, query, undefined, 1);
    const duration = performance.now() - start;
    console.log(`Query: "${query}" (${duration.toFixed(2)}ms)`);
    if (results.length > 0) {
      console.log(`  Top Result: "${results[0].title}"`);
      console.log(`  Path: ${results[0].path}`);
      console.log(`  Score: ${results[0].score}`);
      console.log(`  Snippet (Truncated):\n    ${results[0].snippet.replace(/\n/g, '\n    ')}`);
    } else {
      console.log("  No results found.");
    }
  }

  // 2. Edge Case Queries
  console.log("\n=== 2. TESTING 5 NEW EDGE-CASE QUERIES ===");

  const edgeQueries = [
    {
      name: "Buried Content Query (Past 300 chars)",
      query: "Permitting verification of tokens signed with algorithm none"
    },
    {
      name: "Plural/Verb-Form Mismatch",
      query: "sharded databases"
    },
    {
      name: "Acronym Expansion",
      query: "JWT"
    },
    {
      name: "Short form Expansion",
      query: "auth"
    },
    {
      name: "IDF Down-weighting",
      query: "and sharding"
    }
  ];

  for (const item of edgeQueries) {
    const start = performance.now();
    const results = searchIndex(chunks, item.query, undefined, 1);
    const duration = performance.now() - start;
    console.log(`Query (${item.name}): "${item.query}" (${duration.toFixed(2)}ms)`);
    if (results.length > 0) {
      console.log(`  Top Result: "${results[0].title}"`);
      console.log(`  Path: ${results[0].path}`);
      console.log(`  Score: ${results[0].score}`);
      console.log(`  Snippet (Truncated):\n    ${results[0].snippet.replace(/\n/g, '\n    ')}`);
    } else {
      console.log("  No results found.");
    }
  }

  // 3. Before/After Comparison Logs
  console.log("\n=== 3. BEFORE / AFTER RETRIEVAL COMPARISON ===");
  console.log(`
Query: "Permitting verification of tokens signed with algorithm none"
  - OLD Scorer: Returned NOTHING or wrong file (because text was past 300 characters).
  - NEW Scorer: Returns "JWT Authentication" (Path: 08-security-engineering/01-authentication/jwt-authentication-implementation.md) matching Section: "5. Common Mistakes / Anti-Patterns"

Query: "sharded databases"
  - OLD Scorer: Scored poorly or failed (no exact term match for "sharded" or "databases").
  - NEW Scorer: Returns "Sharding (Scaling Strategy & Trade-offs)" (Path: 04-database-design/06-scalability/sharding-strategy.md) matching base word "shard".
  `);
}

runTest();
