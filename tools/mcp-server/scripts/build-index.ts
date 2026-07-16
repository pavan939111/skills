import * as fs from 'fs';
import * as path from 'path';
import { buildIndex } from '../src/indexer';

function run() {
  const scriptDir = __dirname;
  // repoRoot is three levels up from tools/mcp-server/scripts/
  const repoRoot = path.resolve(scriptDir, '../../..');
  const indexOutputFile = path.resolve(scriptDir, '../index.json');
  
  console.log(`Crawl starting from repo root: ${repoRoot}`);
  console.log('Crawling and parsing markdown files...');
  
  const startTime = Date.now();
  const docs = buildIndex(repoRoot);
  const duration = Date.now() - startTime;
  
  console.log(`Crawl completed! Found ${docs.length} chunks.`);
  
  fs.writeFileSync(indexOutputFile, JSON.stringify(docs, null, 2), 'utf-8');
  console.log(`Successfully wrote index file to: ${indexOutputFile} (${duration}ms)`);
}

run();
