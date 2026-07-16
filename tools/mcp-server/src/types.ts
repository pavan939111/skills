export interface Chunk {
  path: string;         // relative to repo root (e.g. "03-backend-development/04-architecture-wiring/clean-architecture-implementation.md")
  domain: string;       // top-level folder name (e.g. "03-backend-development")
  subfolder: string;  // immediate parent folder name (e.g. "04-architecture-wiring")
  sectionTitle: string; // current section ## or ### title, or "Introduction" if before any header
  fileTitle: string;    // first "#" heading
  fullText: string;     // complete, untruncated text of that section, stripped of markdown
  tags: string[];       // inherited parent file tags
  
  // Precomputed stems for runtime search optimization
  fileTitleStems: string[];
  sectionTitleStems: string[];
  fullTextStems: string[];
  tagStems: string[];
}

export interface TopicDoc {
  path: string;       // relative to repo root (e.g. "03-backend-development/04-architecture-wiring/clean-architecture-implementation.md")
  domain: string;     // top-level folder name (e.g. "03-backend-development")
  subfolder: string;  // immediate parent folder name (e.g. "04-architecture-wiring")
  title: string;      // first "#" heading
  headers: string[];  // all "##" and "###" headings
  tags: string[];     // derived from filename/folder name + frontmatter tags
  snippet: string;    // first 300 characters of body content, stripped of markdown
}

export interface SearchResult {
  path: string;
  domain: string;
  title: string;
  snippet: string;
  score: number;
}
