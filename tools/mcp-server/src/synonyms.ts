export const SYNONYMS: Record<string, string[]> = {
  "jwt": ["json", "web", "token"],
  "json web token": ["jwt"],
  "auth": ["authentication", "authorization"],
  "authentication": ["auth"],
  "authorization": ["auth"],
  "db": ["database"],
  "database": ["db"],
  "i18n": ["internationalization"],
  "internationalization": ["i18n"],
  "rag": ["retrieval", "augmented", "generation"],
  "retrieval augmented generation": ["rag"],
  "cqrs": ["command", "query", "responsibility", "segregation"],
  "command query responsibility segregation": ["cqrs"],
  "k8s": ["kubernetes"],
  "kubernetes": ["k8s"],
  "ci/cd": ["continuous", "integration", "deployment"],
  "continuous integration continuous deployment": ["ci/cd"],
  "cicd": ["continuous", "integration", "deployment"]
};

// Expand terms list with synonyms dynamically
export function expandQueryTerms(terms: string[], rawQuery: string): string[] {
  const expanded = new Set<string>(terms);
  const normalizedQuery = rawQuery.toLowerCase().trim();
  
  // 1. Single term matching
  for (const term of terms) {
    if (SYNONYMS[term]) {
      SYNONYMS[term].forEach(syn => expanded.add(syn));
    }
  }
  
  // 2. Multi-word phrase matching
  for (const key of Object.keys(SYNONYMS)) {
    if (key.includes(" ") && normalizedQuery.includes(key)) {
      SYNONYMS[key].forEach(syn => expanded.add(syn));
    }
  }
  
  return Array.from(expanded);
}
