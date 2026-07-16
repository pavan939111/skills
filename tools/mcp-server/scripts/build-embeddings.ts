import * as fs from 'fs';
import * as path from 'path';
import { embedText } from '../src/embeddings';
import { Chunk } from '../src/types';

// Helper to truncate text cleanly at a sentence boundary before 1000 characters
function truncateToContextWindow(text: string, maxChars: number = 1000): string {
  if (text.length <= maxChars) {
    return text;
  }
  
  const sub = text.substring(0, maxChars);
  const lastPeriod = Math.max(
    sub.lastIndexOf('. '),
    sub.lastIndexOf('! '),
    sub.lastIndexOf('? ')
  );
  
  if (lastPeriod > maxChars * 0.8) {
    return sub.substring(0, lastPeriod + 1).trim();
  }
  
  const lastSpace = sub.lastIndexOf(' ');
  if (lastSpace > maxChars * 0.5) {
    return sub.substring(0, lastSpace).trim() + '...';
  }
  
  return sub.trim() + '...';
}

async function run() {
  const scriptDir = __dirname;
  const indexFilePath = path.resolve(scriptDir, '../index.json');
  const embeddingsBinPath = path.resolve(scriptDir, '../embeddings.bin');
  const cacheFilePath = path.resolve(scriptDir, '../embedding-cache.json');
  
  console.log("Starting incremental semantic embeddings generation...");
  
  if (!fs.existsSync(indexFilePath)) {
    console.error("Error: index.json does not exist. Please run npm run build-index first.");
    process.exit(1);
  }
  
  // 1. Load Chunks
  const raw = fs.readFileSync(indexFilePath, 'utf-8');
  const chunks: Chunk[] = JSON.parse(raw);
  const chunksCount = chunks.length;
  console.log(`Loaded ${chunksCount} chunks from index.json.`);
  
  // 2. Load Cache if exists
  let cache: Record<string, number[]> = {};
  if (fs.existsSync(cacheFilePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
      console.log(`Loaded existing embedding cache with ${Object.keys(cache).length} entries.`);
    } catch (err) {
      console.warn("Could not parse embedding-cache.json, starting with clean cache.", err);
    }
  } else {
    console.log("No embedding cache found. Starting a fresh cold build.");
  }
  
  const embeddingDim = 384;
  const buffer = Buffer.alloc(chunksCount * embeddingDim * 4);
  
  const startTime = Date.now();
  let reusedCount = 0;
  let recomputedCount = 0;
  
  // Set to keep track of active hashes in this build
  const activeHashes = new Set<string>();
  
  // 3. Process each chunk
  for (let i = 0; i < chunksCount; i++) {
    const chunk = chunks[i];
    const hash = chunk.contentHash;
    activeHashes.add(hash);
    
    let vectorArray: number[] | null = null;
    
    if (cache[hash]) {
      vectorArray = cache[hash];
      reusedCount++;
    } else {
      // Recompute embedding
      const cleanText = truncateToContextWindow(chunk.fullText);
      try {
        const vectorFloat = await embedText(cleanText);
        vectorArray = Array.from(vectorFloat);
        // Add to cache
        cache[hash] = vectorArray;
        recomputedCount++;
        
        if (recomputedCount % 100 === 0) {
          console.log(`  Processed ${recomputedCount} fresh embeddings...`);
        }
      } catch (err) {
        console.error(`Error embedding chunk ${i} (${chunk.path}):`, err);
        process.exit(1);
      }
    }
    
    // Write Float32 values (Little Endian) into flat binary buffer
    if (vectorArray) {
      for (let j = 0; j < embeddingDim; j++) {
        buffer.writeFloatLE(vectorArray[j], (i * embeddingDim + j) * 4);
      }
    }
  }
  
  // 4. Prune stale cache entries
  let prunedCount = 0;
  const cacheHashes = Object.keys(cache);
  for (const hash of cacheHashes) {
    if (!activeHashes.has(hash)) {
      delete cache[hash];
      prunedCount++;
    }
  }
  
  // 5. Save updated cache & bin files
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8');
  fs.writeFileSync(embeddingsBinPath, buffer);
  
  const elapsed = (Date.now() - startTime) / 1000;
  
  console.log("\n=== INCREMENTAL BUILD STATS ===");
  console.log(`- Total chunks processed       : ${chunksCount}`);
  console.log(`- Served from cache (reused)   : ${reusedCount}`);
  console.log(`- Freshly embedded (computed)  : ${recomputedCount}`);
  console.log(`- Stale entries pruned         : ${prunedCount}`);
  console.log(`- Cache entries database count : ${Object.keys(cache).length}`);
  console.log(`- Ingest time elapsed          : ${elapsed.toFixed(2)}s`);
  console.log(`- Output file path             : ${embeddingsBinPath}`);
  console.log(`- Actual bin file size         : ${fs.statSync(embeddingsBinPath).size} bytes`);
  console.log("===============================\n");
}

run().catch(err => {
  console.error("Fatal build error:", err);
  process.exit(1);
});
