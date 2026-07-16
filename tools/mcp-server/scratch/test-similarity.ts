import * as fs from 'fs';
import * as path from 'path';
import { embedText, cosineSimilarity } from '../src/embeddings';
import { Chunk } from '../src/types';

const indexFilePath = path.resolve(__dirname, '../index.json');
const embeddingsBinPath = path.resolve(__dirname, '../embeddings.bin');

async function test() {
  const chunks: Chunk[] = JSON.parse(fs.readFileSync(indexFilePath, 'utf-8'));
  const buffer = fs.readFileSync(embeddingsBinPath);
  const floatArray = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.length / 4);
  const dim = 384;

  const queries = [
    { name: "Query 1 (circuit breaker)", text: "how do I stop one slow downstream service from taking down the whole system" },
    { name: "Query 2 (outbox/sync)", text: "keeping two databases from getting out of sync when one write triggers another system" },
    { name: "Query 3 (multi-tenancy)", text: "making sure a user only sees their own company's data in a shared database" },
    { name: "Query 4 (nonsense)", text: "how do I bake a sourdough loaf" }
  ];

  for (const query of queries) {
    console.log(`\n======================================================`);
    console.log(`${query.name}: "${query.text}"`);
    console.log(`======================================================`);
    
    const queryVec = await embedText(query.text);
    const scores: { chunk: Chunk; sim: number }[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunkVec = floatArray.subarray(i * dim, (i + 1) * dim);
      const sim = cosineSimilarity(queryVec, chunkVec);
      scores.push({ chunk: chunks[i], sim });
    }
    
    scores.sort((a, b) => b.sim - a.sim);
    
    console.log("Top 20 raw similarity scores:");
    for (let i = 0; i < 20; i++) {
      const item = scores[i];
      console.log(`  ${i+1}. Sim: ${item.sim.toFixed(4)} | File: ${item.chunk.path} | Section: ${item.chunk.sectionTitle}`);
    }
  }
}

test();
