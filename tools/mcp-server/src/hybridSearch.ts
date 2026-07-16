import * as fs from 'fs';
import * as path from 'path';
import { Chunk, SearchResult } from './types';
import { embedText, cosineSimilarity } from './embeddings';
import { stem } from './stemmer';
import { expandQueryTerms } from './synonyms';

const scriptDir = __dirname;
const embeddingsBinPath = path.resolve(scriptDir, '../embeddings.bin');

// Helper to load raw binary Float32Array embeddings from file
let cachedFloatArray: Float32Array | null = null;
function loadEmbeddingsBinary(): Float32Array {
  if (cachedFloatArray) {
    return cachedFloatArray;
  }
  
  if (!fs.existsSync(embeddingsBinPath)) {
    throw new Error(`embeddings.bin not found at: ${embeddingsBinPath}. Please run npm run build-embeddings first.`);
  }
  
  const buffer = fs.readFileSync(embeddingsBinPath);
  const totalFloats = buffer.length / 4;
  cachedFloatArray = new Float32Array(buffer.buffer, buffer.byteOffset, totalFloats);
  return cachedFloatArray;
}

export async function hybridSearch(
  chunks: Chunk[],
  query: string,
  domainFilter?: string,
  limit: number = 5
): Promise<SearchResult[]> {
  const cleanLimit = Math.max(1, Math.min(20, limit));
  const rawTerms = query.toLowerCase().split(/\s+/).map(t => t.trim()).filter(Boolean);
  if (rawTerms.length === 0) {
    return [];
  }
  
  // ----------------------------------------------------
  // PART 1: BM25 Chunk Scoring
  // ----------------------------------------------------
  const queryStems = expandQueryTerms(rawTerms, query).map(t => stem(t));
  const N = chunks.length;
  if (N === 0) return [];
  
  const docLengths = chunks.map(chunk => chunk.fullTextStems.length);
  const totalLength = docLengths.reduce((sum, len) => sum + len, 0);
  const avgdl = totalLength / N || 1.0;
  
  // Compute Document Frequency (DF) across the chunks using precomputed stems
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
  
  // Compute IDF for each query stem
  const idf: Record<string, number> = {};
  queryStems.forEach(stemmedTerm => {
    const docFreq = df[stemmedTerm] || 0;
    idf[stemmedTerm] = Math.log((N - docFreq + 0.5) / (docFreq + 0.5) + 1.0);
  });
  
  // BM25 parameters
  const k1 = 1.5;
  const b = 0.75;
  
  const bm25ChunkScores: { chunk: Chunk; score: number }[] = [];
  
  for (let i = 0; i < N; i++) {
    const chunk = chunks[i];
    
    // Filter by domain
    if (domainFilter) {
      const cleanFilter = domainFilter.replace(/\/$/, '').toLowerCase();
      if (chunk.domain.toLowerCase() !== cleanFilter) {
        continue;
      }
    }
    
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
      bm25ChunkScores.push({
        chunk,
        score: totalChunkScore
      });
    }
  }
  
  // Sort BM25 chunks descending to compute rank
  bm25ChunkScores.sort((a, b) => b.score - a.score);
  
  // ----------------------------------------------------
  // PART 2: Semantic Chunk Scoring (Cosine Similarity)
  // ----------------------------------------------------
  const queryVector = await embedText(query);
  const floatArray = loadEmbeddingsBinary();
  const embeddingDim = 384;
  const semanticChunkScores: { chunk: Chunk; score: number }[] = [];
  
  for (let i = 0; i < N; i++) {
    const chunk = chunks[i];
    
    // Filter by domain
    if (domainFilter) {
      const cleanFilter = domainFilter.replace(/\/$/, '').toLowerCase();
      if (chunk.domain.toLowerCase() !== cleanFilter) {
        continue;
      }
    }
    
    const chunkVector = floatArray.subarray(i * embeddingDim, (i + 1) * embeddingDim);
    const sim = cosineSimilarity(queryVector, chunkVector);
    
    if (sim > 0.05) {
      semanticChunkScores.push({
        chunk,
        score: sim
      });
    }
  }
  
  // Sort Semantic chunks descending to compute rank
  semanticChunkScores.sort((a, b) => b.score - a.score);
  
  // ----------------------------------------------------
  // PART 3: Reciprocal Rank Fusion (RRF) Integration
  // ----------------------------------------------------
  // Limit to top 100 scored candidates per ranking channel to prune tail noise
  const topBm25Chunks = bm25ChunkScores.slice(0, 100);
  const topSemanticChunks = semanticChunkScores.slice(0, 100);
  
  const bm25RankMap = new Map<Chunk, number>();
  const semanticRankMap = new Map<Chunk, number>();
  
  topBm25Chunks.forEach((item, index) => {
    bm25RankMap.set(item.chunk, index + 1); // 1-based rank
  });
  
  topSemanticChunks.forEach((item, index) => {
    semanticRankMap.set(item.chunk, index + 1);
  });
  
  // Combine unique chunks from both top-100 lists
  const allScoredChunks = new Set<Chunk>([
    ...bm25RankMap.keys(),
    ...semanticRankMap.keys()
  ]);
  
  const fileGroups: Record<string, { bestChunk: Chunk; maxScore: number }> = {};
  
  // RRF Constant k = 60
  const RRF_K = 60;
  
  for (const chunk of allScoredChunks) {
    const bm25Rank = bm25RankMap.get(chunk);
    const semanticRank = semanticRankMap.get(chunk);
    
    const bm25Part = bm25Rank !== undefined ? 1.0 / (RRF_K + bm25Rank) : 0.0;
    const semanticPart = semanticRank !== undefined ? 1.0 / (RRF_K + semanticRank) : 0.0;
    
    const rrfScore = bm25Part + semanticPart;
    
    const pathKey = chunk.path;
    if (!fileGroups[pathKey] || rrfScore > fileGroups[pathKey].maxScore) {
      fileGroups[pathKey] = {
        bestChunk: chunk,
        maxScore: rrfScore
      };
    }
  }
  
  // ----------------------------------------------------
  // PART 4: Grouping results back to file level
  // ----------------------------------------------------
  const searchResults: SearchResult[] = Object.keys(fileGroups).map(pathKey => {
    const group = fileGroups[pathKey];
    const chunk = group.bestChunk;
    
    const cleanSectionTitle = chunk.sectionTitle === 'Introduction' 
      ? 'Introduction' 
      : `Section: ${chunk.sectionTitle}`;
      
    const truncatedText = chunk.fullText.length > 500 
      ? chunk.fullText.substring(0, 500) + '...' 
      : chunk.fullText;
      
    const snippet = `[Matched ${cleanSectionTitle}]\n${truncatedText}`;
    
    return {
      path: chunk.path,
      domain: chunk.domain,
      title: chunk.fileTitle,
      snippet,
      score: Number(group.maxScore.toFixed(6))
    };
  });
  
  // Sort descending by RRF score, then alphabetically
  searchResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.title.localeCompare(b.title);
  });
  
  // Slice to cleanLimit
  const finalResults = searchResults.slice(0, cleanLimit);
  
  // ----------------------------------------------------
  // PART 5: High-Confidence Semantic Match Promotion
  // ----------------------------------------------------
  // Verified confidence threshold = 0.37
  const CONFIDENCE_THRESHOLD = 0.37;
  const candidatesMap = new Map<string, SearchResult>();
  
  // Check top 10 semantic chunks to find high-confidence candidates not present in RRF top list
  for (let k = 0; k < Math.min(10, topSemanticChunks.length); k++) {
    const item = topSemanticChunks[k];
    if (item.score > CONFIDENCE_THRESHOLD) {
      const parentPath = item.chunk.path;
      const isAlreadyInRRF = finalResults.some(r => r.path === parentPath);
      
      if (!isAlreadyInRRF && !candidatesMap.has(parentPath)) {
        const cleanSectionTitle = item.chunk.sectionTitle === 'Introduction' 
          ? 'Introduction' 
          : `Section: ${item.chunk.sectionTitle}`;
          
        const truncatedText = item.chunk.fullText.length > 500 
          ? item.chunk.fullText.substring(0, 500) + '...' 
          : item.chunk.fullText;
          
        const snippet = `[Matched ${cleanSectionTitle}]\n${truncatedText}`;
        
        // Calculate a mathematically compatible RRF score based on semantic rank alone:
        // rrfScore = 1 / (60 + semanticRank)
        const semanticRank = k + 1;
        const compatibleRRFScore = 1.0 / (RRF_K + semanticRank);
        
        candidatesMap.set(parentPath, {
          path: item.chunk.path,
          domain: item.chunk.domain,
          title: item.chunk.fileTitle,
          snippet,
          score: Number(compatibleRRFScore.toFixed(6)), // Store compatible RRF score
          promoted: true,
          promotedReason: "high-confidence semantic match"
        });
      }
    }
  }
  
  const candidates = Array.from(candidatesMap.values());
  // Sort candidates descending by RRF-compatible score
  candidates.sort((a, b) => b.score - a.score);
  
  // Promote at most 3 candidates to avoid completely replacing the entire RRF list
  const maxPromotions = Math.min(3, candidates.length);
  for (let i = 0; i < maxPromotions; i++) {
    const candidate = candidates[i];
    if (finalResults.length < cleanLimit) {
      finalResults.push(candidate);
    } else {
      // Find the lowest-scoring unpromoted result
      let lowestUnpromotedIdx = -1;
      for (let j = finalResults.length - 1; j >= 0; j--) {
        if (!finalResults[j].promoted) {
          lowestUnpromotedIdx = j;
          break;
        }
      }
      if (lowestUnpromotedIdx !== -1) {
        finalResults[lowestUnpromotedIdx] = candidate;
      } else {
        break;
      }
    }
  }
  
  // Sort the final results descending by score
  finalResults.sort((a, b) => b.score - a.score);
  
  return finalResults;
}
