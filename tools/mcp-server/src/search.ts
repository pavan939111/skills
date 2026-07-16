import { TopicDoc, SearchResult } from './types';

export function searchIndex(
  docs: TopicDoc[],
  query: string,
  domainFilter?: string,
  limit: number = 5
): SearchResult[] {
  const cleanLimit = Math.max(1, Math.min(20, limit));
  const queryTerms = query.toLowerCase().split(/\s+/).map(t => t.trim()).filter(Boolean);
  
  if (queryTerms.length === 0) {
    return [];
  }
  
  const results: SearchResult[] = [];
  
  for (const doc of docs) {
    // Apply domain filter if provided
    if (domainFilter) {
      const cleanFilter = domainFilter.replace(/\/$/, '').toLowerCase();
      const cleanDocDomain = doc.domain.toLowerCase();
      if (cleanDocDomain !== cleanFilter) {
        continue;
      }
    }
    
    let score = 0;
    const docTitleLower = doc.title.toLowerCase();
    const docPathLower = doc.path.toLowerCase();
    const filenameLower = doc.path.split('/').pop()?.toLowerCase() || '';
    
    // Check exact full query matches (highest weight)
    const lowerQuery = query.toLowerCase().trim();
    if (docTitleLower === lowerQuery) {
      score += 30;
    } else if (docTitleLower.includes(lowerQuery)) {
      score += 15;
    }
    
    if (filenameLower.includes(lowerQuery.replace(/\.md$/, '').replace(/-/g, ' '))) {
      score += 12;
    }
    
    // Check term-by-term matches
    for (const term of queryTerms) {
      // 1. Title Match
      if (docTitleLower.includes(term)) {
        score += 8;
      }
      
      // 2. Filename Match
      if (filenameLower.includes(term)) {
        score += 5;
      }
      
      // 3. Tags Match
      let tagMatched = false;
      for (const tag of doc.tags) {
        if (tag === term) {
          score += 6;
          tagMatched = true;
        } else if (tag.includes(term)) {
          score += 3;
          tagMatched = true;
        }
      }
      
      // 4. Headers Match
      let headerMatches = 0;
      for (const header of doc.headers) {
        if (header.toLowerCase().includes(term)) {
          headerMatches++;
        }
      }
      if (headerMatches > 0) {
        // Cap header match score contributions
        score += Math.min(12, headerMatches * 3);
      }
      
      // 5. Snippet Content Match
      if (doc.snippet.toLowerCase().includes(term)) {
        score += 1;
      }
    }
    
    if (score > 0) {
      results.push({
        path: doc.path,
        domain: doc.domain,
        title: doc.title,
        snippet: doc.snippet,
        score
      });
    }
  }
  
  // Sort by score descending, then by title alphabetically
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.title.localeCompare(b.title);
  });
  
  return results.slice(0, cleanLimit);
}
