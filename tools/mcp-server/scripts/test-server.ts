// test-server.ts
import * as fs from 'fs';
import * as path from 'path';
import { searchIndex } from '../src/search';
import { buildIndex } from '../src/indexer';

const repoRoot = path.resolve(__dirname, '../../..');
const indexFilePath = path.resolve(__dirname, '../index.json');

function runTest() {
  console.log("----------------------------------------------------------------------");
  console.log("MCP SERVER KNOWLEDGE BASE VALIDATION RUN");
  console.log("----------------------------------------------------------------------");

  if (!fs.existsSync(indexFilePath)) {
    console.error("Index file index.json not found!");
    return;
  }
  
  const raw = fs.readFileSync(indexFilePath, 'utf-8');
  const docs = JSON.parse(raw);
  console.log(`Successfully loaded ${docs.length} indexed documents.`);

  // Test Queries
  const testQueries = [
    "JWT authentication",
    "sharding",
    "CQRS",
    "RAG chunking",
    "circuit breaker"
  ];

  console.log("\n=== 1. TESTING SEARCH KNOWLEDGE ===");
  const pathForGetTopic: string[] = [];
  
  for (const query of testQueries) {
    const results = searchIndex(docs, query, undefined, 3);
    console.log(`\nQuery: "${query}"`);
    if (results.length > 0) {
      const top = results[0];
      console.log(`  Top Result: "${top.title}"`);
      console.log(`  Path: ${top.path}`);
      console.log(`  Score: ${top.score}`);
      console.log(`  Snippet: "${top.snippet}"`);
      pathForGetTopic.push(top.path);
    } else {
      console.log("  No results found.");
    }
  }

  // Test get_topic
  console.log("\n=== 2. TESTING GET TOPIC ===");
  if (pathForGetTopic.length > 0) {
    const testPath = pathForGetTopic[0];
    console.log(`Retrieving topic: ${testPath}`);
    const fullPath = path.join(repoRoot, testPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      console.log("  File Read: SUCCESS");
      console.log(`  Total Lines: ${lines.length}`);
      console.log(`  First 5 lines:\n${lines.slice(0, 5).join('\n')}`);
    } else {
      console.log("  File Read: FAILED (File not found on disk)");
    }
  }

  // Test list_domains
  console.log("\n=== 3. TESTING LIST DOMAINS ===");
  const readmePath = path.join(repoRoot, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const regex = /\|\s*\[?`([^`/]+)\/?`\]?(?:\([^)]+\))?\s*\|\s*([^|]+)\|\s*([0-9]+)\s*\|\s*([^|]+)\|/;
    const parsedDomains = [];
    
    for (const line of lines) {
      const match = line.match(regex);
      if (match) {
        const domName = match[1].trim();
        if (domName === '06-frontend-development') {
          continue;
        }
        parsedDomains.push({
          domain: domName,
          description: match[2].trim(),
          topicCount: parseInt(match[3].trim(), 10),
          status: match[4].trim()
        });
      }
    }
    console.log(`Parsed ${parsedDomains.length} domains from README.md:`);
    parsedDomains.forEach(d => {
      console.log(`  - ${d.domain} (${d.topicCount} topics): ${d.description}`);
    });
  } else {
    console.log("README.md not found to test domain listing.");
  }
}

runTest();
