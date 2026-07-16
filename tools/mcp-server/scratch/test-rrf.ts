import * as fs from 'fs';
import * as path from 'path';
import { Chunk, SearchResult } from '../src/types';
import { embedText, cosineSimilarity } from '../src/embeddings';
import { stem } from '../src/stemmer';
import { expandQueryTerms } from '../src/synonyms';

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
    const rawTerms = query.toLowerCase().split(/\s+/).map(t => t.trim()).filter(Boolean);
    const queryStems = expandQueryTerms(rawTerms, query).map(t => stem(t));
    const N = chunks.length;
    
    const docLengths = chunks.map(chunk => chunk.fullTextStems.length);
    const totalLength = docLengths.reduce((sum, len) => sum + len, 0);
    const avgdl = totalLength / N || 1.0;
    
    const df: Record<string, number> = {};
    queryStems.forEach(stemmedTerm => {
      let count = 0;
      for (const chunk of chunks) {
        if (chunk.fullTextStems.includes(stemmedTerm)) {
          count++;
        }
      }
      df[stemmedTerm] = count;
    });
    
    const idf: Record<string, number> = {};
    queryStems.forEach(stemmedTerm => {
      const docFreq = df[stemmedTerm] || 0;
      idf[stemmedTerm] = Math.log((N - docFreq + 0.5) / (docFreq + 0.5) + 1.0);
    });
    
    const k1 = 1.5;
    const b = 0.75;
    
    const bm25ChunkScores: { chunk: Chunk; score: number }[] = [];
    
    for (let i = 0; i < N; i++) {
      const chunk = chunks[i];
      let totalChunkScore = 0;
      const bodyTokens = chunk.fullTextStems;
      const dl = docLengths[i];
      
      for (const stemmedTerm of queryStems) {
        let tf = bodyTokens.filter(t => t === stemmedTerm).length;
        const fileTitleStems = chunk.fileTitleStems;
        const sectionTitleStems = chunk.sectionTitleStems;
        const tagStems = chunk.tagStems;
        
        const isInFileTitle = fileTitleStems.includes(stemmedTerm);
        const isInSectionTitle = sectionTitleStems.includes(stemmedTerm);
        const isInTags = tagStems.includes(stemmedTerm);
        
        if (tf === 0 && (isInFileTitle || isInSectionTitle || isInTags)) {
          tf = 1.0;
        }
        
        if (tf > 0) {
          const tfNumerator = tf * (k1 + 1);
          const tfDenominator = tf + k1 * (1.0 - b + b * (dl / avgdl));
          let termScore = idf[stemmedTerm] * (tfNumerator / tfDenominator);
          
          let multiplier = 1.0;
          // Clean up boost for generic terms (IDF < 2.0)
          if (idf[stemmedTerm] >= 2.0) {
            if (isInFileTitle) {
              multiplier = 3.0;
            } else if (isInSectionTitle) {
              multiplier = 2.0;
            } else if (isInTags) {
              multiplier = 2.0;
            }
          }
          
          totalChunkScore += termScore * multiplier;
        }
      }
      
      if (totalChunkScore > 0.001) {
        bm25ChunkScores.push({ chunk, score: totalChunkScore });
      }
    }
    
    bm25ChunkScores.sort((a, b) => b.score - a.score);
    
    // Semantic
    const queryVec = await embedText(query);
    const semanticChunkScores: { chunk: Chunk; score: number }[] = [];
    for (let i = 0; i < N; i++) {
      const chunkVec = floatArray.subarray(i * dim, (i + 1) * dim);
      const sim = cosineSimilarity(queryVec, chunkVec);
      if (sim > 0.05) {
        semanticChunkScores.push({ chunk: chunks[i], score: sim });
      }
    }
    semanticChunkScores.sort((a, b) => b.score - a.score);
    
    // RRF
    const topBm25 = bm25ChunkScores.slice(0, 100);
    const topSemantic = semanticChunkScores.slice(0, 100);
    
    const bm25RankMap = new Map<Chunk, number>();
    const semanticRankMap = new Map<Chunk, number>();
    
    topBm25.forEach((item, index) => { bm25RankMap.set(item.chunk, index + 1); });
    topSemantic.forEach((item, index) => { semanticRankMap.set(item.chunk, index + 1); });
    
    const allScored = new Set<Chunk>([...bm25RankMap.keys(), ...semanticRankMap.keys()]);
    const fileGroups: Record<string, { bestChunk: Chunk; maxScore: number }> = {};
    
    for (const chunk of allScored) {
      const bm25Rank = bm25RankMap.get(chunk);
      const semanticRank = semanticRankMap.get(chunk);
      
      const bm25Part = bm25Rank !== undefined ? 1.0 / (60 + bm25Rank) : 0.0;
      const semanticPart = semanticRank !== undefined ? 1.0 / (60 + semanticRank) : 0.0;
      
      const rrfScore = bm25Part + semanticPart;
      const pathKey = chunk.path;
      if (!fileGroups[pathKey] || rrfScore > fileGroups[pathKey].maxScore) {
        fileGroups[pathKey] = { bestChunk: chunk, maxScore: rrfScore };
      }
    }
    
    const results = Object.keys(fileGroups).map(pathKey => ({
      path: pathKey,
      title: fileGroups[pathKey].bestChunk.fileTitle,
      score: fileGroups[pathKey].maxScore
    }));
    results.sort((a, b) => b.score - a.score);
    
    console.log("Top 3 Hybrid Results:");
    for (let i = 0; i < Math.min(3, results.length); i++) {
      console.log(`  ${i+1}. Score: ${results[i].score.toFixed(6)} | File: ${results[i].path} | Title: ${results[i].title}`);
    }
  }
}

test();
