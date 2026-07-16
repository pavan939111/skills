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
    "how do I stop one slow downstream service from taking down the whole system",
    "keeping two databases from getting out of sync when one write triggers another system",
    "making sure a user only sees their own company's data in a shared database"
  ];
  
  for (const query of queries) {
    console.log(`\nQuery: "${query}"`);
    const queryVec = await embedText(query);
    
    const scores: { chunk: Chunk; sim: number }[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunkVec = floatArray.subarray(i * dim, (i + 1) * dim);
      const sim = cosineSimilarity(queryVec, chunkVec);
      scores.push({ chunk: chunks[i], sim });
    }
    
    scores.sort((a, b) => b.sim - a.sim);
    
    console.log("Top 5 Semantic-only Matches:");
    for (let i = 0; i < 5; i++) {
      const item = scores[i];
      console.log(`  ${i+1}. Sim: ${item.sim.toFixed(4)} | File: ${item.chunk.path} | Section: ${item.chunk.sectionTitle}`);
    }
  }
}

test();
