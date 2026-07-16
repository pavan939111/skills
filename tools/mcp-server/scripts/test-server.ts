// test-server.ts
import * as fs from 'fs';
import * as path from 'path';
import { searchIndex } from '../src/search';
import { hybridSearch } from '../src/hybridSearch';

const repoRoot = path.resolve(__dirname, '../../..');
const indexFilePath = path.resolve(__dirname, '../index.json');

async function runTest() {
  console.log("----------------------------------------------------------------------");
  console.log("MCP SERVER HYBRID SEARCH VALIDATION RUN");
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
    const results = await hybridSearch(chunks, query, undefined, 1);
    const duration = performance.now() - start;
    console.log(`Query: "${query}" (${duration.toFixed(2)}ms)`);
    if (results.length > 0) {
      console.log(`  Top Result: "${results[0].title}"`);
      console.log(`  Path: ${results[0].path}`);
      console.log(`  RRF Score: ${results[0].score}`);
    } else {
      console.log("  No results found.");
    }
  }

  // 2. Semantic Queries comparing BM25 vs Hybrid
  console.log("\n=== 2. TESTING 3 CRITICAL SEMANTIC CONSTRUCTS (BM25 vs HYBRID) ===");

  const semanticQueries = [
    {
      label: "Cascading Failures / Isolation",
      query: "how do I stop one slow downstream service from taking down the whole system"
    },
    {
      label: "Distributed Inconsistencies / Transactions",
      query: "keeping two databases from getting out of sync when one write triggers another system"
    },
    {
      label: "Tenant Isolation / Data Leakage",
      query: "making sure a user only sees their own company's data in a shared database"
    }
  ];

  for (const item of semanticQueries) {
    console.log(`\nScenario: ${item.label}`);
    console.log(`Query: "${item.query}"`);
    
    // Run BM25-only
    const bm25Start = performance.now();
    const bm25Results = searchIndex(chunks, item.query, undefined, 1);
    const bm25Duration = performance.now() - bm25Start;
    
    // Run Hybrid
    const hybridStart = performance.now();
    const hybridResults = await hybridSearch(chunks, item.query, undefined, 1);
    const hybridDuration = performance.now() - hybridStart;
    
    console.log(`  - BM25-only Result (${bm25Duration.toFixed(2)}ms):`);
    if (bm25Results.length > 0) {
      console.log(`    Title: "${bm25Results[0].title}"`);
      console.log(`    Path:  ${bm25Results[0].path}`);
      console.log(`    Score: ${bm25Results[0].score}`);
    } else {
      console.log("    Title: [NO RESULTS FOUND]");
    }
    
    console.log(`  - Hybrid Result (${hybridDuration.toFixed(2)}ms):`);
    if (hybridResults.length > 0) {
      console.log(`    Title: "${hybridResults[0].title}"`);
      console.log(`    Path:  ${hybridResults[0].path}`);
      console.log(`    Score: ${hybridResults[0].score}`);
      console.log(`    Snippet (Truncated):\n      ${hybridResults[0].snippet.replace(/\n/g, '\n      ')}`);
    } else {
      console.log("    Title: [NO RESULTS FOUND]");
    }
  }
}

runTest();
