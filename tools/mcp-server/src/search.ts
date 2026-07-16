import { Chunk, SearchResult } from './types';
import { stem } from './stemmer';
import { expandQueryTerms } from './synonyms';

// Tokenize and stem query helper
function tokenizeAndStemQuery(text: string): string[] {
  const tokens = text.toLowerCase().split(/[^a-z0-9-+]+/i).filter(Boolean);
  return tokens.map(t => stem(t));
}

export function searchIndex(
  chunks: Chunk[],
  query: string,
  domainFilter?: string,
  limit: number = 5
): SearchResult[] {
  const cleanLimit = Math.max(1, Math.min(20, limit));
  
  // 1. Tokenize query
  const rawTerms = query.toLowerCase().split(/\s+/).map(t => t.trim()).filter(Boolean);
  if (rawTerms.length === 0) {
    return [];
  }
  
  // Expand synonyms
  const expandedTerms = expandQueryTerms(rawTerms, query);
  
  // Stem query terms
  const queryStems = expandedTerms.map(t => stem(t));
  
  // 2. Pre-calculate lengths from precomputed stemmed arrays
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
  
  // 3. Score each chunk using precomputed stems
  const chunkScores: { chunk: Chunk; score: number }[] = [];
  
  for (let i = 0; i < N; i++) {
    const chunk = chunks[i];
    
    // Apply domain filter if provided
    if (domainFilter) {
      const cleanFilter = domainFilter.replace(/\/$/, '').toLowerCase();
      const cleanDocDomain = chunk.domain.toLowerCase();
      if (cleanDocDomain !== cleanFilter) {
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
      chunkScores.push({
        chunk,
        score: totalChunkScore
      });
    }
  }
  
  // 4. Group chunks by parent file path (taking max chunk score per file)
  const fileGroups: Record<string, { bestChunk: Chunk; maxScore: number }> = {};
  
  for (const item of chunkScores) {
    const pathKey = item.chunk.path;
    if (!fileGroups[pathKey] || item.score > fileGroups[pathKey].maxScore) {
      fileGroups[pathKey] = {
        bestChunk: item.chunk,
        maxScore: item.score
      };
    }
  }
  
  // 5. Convert grouped records to SearchResult array
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
      score: Number(group.maxScore.toFixed(4))
    };
  });
  
  // 6. Sort descending by score, then alphabetically
  searchResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.title.localeCompare(b.title);
  });
  
  return searchResults.slice(0, cleanLimit);
}
