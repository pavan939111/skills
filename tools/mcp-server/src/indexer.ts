import * as fs from 'fs';
import * as path from 'path';
import { Chunk } from './types';
import { stem } from './stemmer';

// Helper to strip markdown formatting elements completely
export function stripMarkdown(md: string): string {
  let text = md;
  // Remove frontmatter if present
  if (text.startsWith('---')) {
    const nextTriple = text.indexOf('---', 3);
    if (nextTriple !== -1) {
      text = text.substring(nextTriple + 3);
    }
  }
  
  text = text
    // Remove custom block alerts like > [!NOTE], > [!TIP]
    .replace(/^>\s*\[![A-Z]+\]/gm, '')
    // Remove leading > from blockquotes
    .replace(/^>\s*/gm, '')
    // Remove markdown links but keep text: [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove inline code backticks: `code` -> code
    .replace(/`([^`]+)`/g, '$1')
    // Remove bold and italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove header markers
    .replace(/^#+\s+/gm, '')
    // Collapse multiple spaces and newlines into single spaces
    .replace(/\s+/g, ' ')
    .trim();
    
  return text;
}

// Helper to tokenize and stem text
function tokenizeAndStem(text: string): string[] {
  const tokens = text.toLowerCase().split(/[^a-z0-9-+]+/i).filter(Boolean);
  return tokens.map(t => stem(t));
}

// Parse YAML tags from frontmatter block
function parseFrontmatterTags(content: string): string[] {
  const tags: string[] = [];
  if (!content.startsWith('---')) {
    return tags;
  }
  
  const endIdx = content.indexOf('---', 3);
  if (endIdx === -1) {
    return tags;
  }
  
  const frontmatter = content.substring(3, endIdx);
  const lines = frontmatter.split(/\r?\n/);
  let inTagsList = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('tags:')) {
      const inlineValue = trimmed.substring(5).trim();
      if (inlineValue) {
        const cleanVal = inlineValue.replace(/[\[\]]/g, '');
        const parts = cleanVal.split(',').map(p => p.trim()).filter(Boolean);
        tags.push(...parts);
      } else {
        inTagsList = true;
      }
      continue;
    }
    
    if (inTagsList) {
      if (trimmed.startsWith('-')) {
        const tag = trimmed.substring(1).trim().replace(/['"]/g, '');
        if (tag) tags.push(tag);
      } else if (trimmed.includes(':')) {
        inTagsList = false;
      }
    }
  }
  
  return tags;
}

export function buildIndex(repoRoot: string): Chunk[] {
  const chunks: Chunk[] = [];
  const excludedDomains = new Set(['tools', 'node_modules', '06-frontend-development']);
  
  const items = fs.readdirSync(repoRoot);
  
  for (const item of items) {
    const fullPath = path.join(repoRoot, item);
    const stat = fs.statSync(fullPath);
    
    if (!stat.isDirectory()) {
      continue;
    }
    
    const isDomainDir = /^(?:0[0-9]|1[0-3])-[a-zA-Z0-9-]/.test(item);
    if (!isDomainDir || excludedDomains.has(item)) {
      continue;
    }
    
    crawlDir(repoRoot, item, item);
  }
  
  function crawlDir(baseRoot: string, relPath: string, domain: string) {
    const fullDirPath = path.join(baseRoot, relPath);
    const entries = fs.readdirSync(fullDirPath);
    
    for (const entry of entries) {
      const entryRelPath = path.posix.join(relPath, entry);
      const entryFullPath = path.join(baseRoot, entryRelPath);
      const stat = fs.statSync(entryFullPath);
      
      if (stat.isDirectory()) {
        crawlDir(baseRoot, entryRelPath, domain);
      } else if (stat.isFile() && entry.endsWith('.md')) {
        try {
          const content = fs.readFileSync(entryFullPath, 'utf-8');
          const lines = content.split(/\r?\n/);
          
          // 1. Resolve File Title
          let fileTitle = '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) {
              fileTitle = trimmed.substring(2).trim();
              break;
            }
          }
          if (!fileTitle) {
            fileTitle = path.basename(entry, '.md').replace(/-/g, ' ');
          }
          
          // 2. Derive File tags
          const tagsSet = new Set<string>();
          const segments = entryRelPath.split('/');
          for (const segment of segments) {
            const wordSegment = segment.replace(/^[0-9]+-/, '').replace(/\.md$/, '');
            const words = wordSegment.split('-').map(w => w.toLowerCase().trim()).filter(Boolean);
            words.forEach(w => tagsSet.add(w));
          }
          
          const yamlTags = parseFrontmatterTags(content);
          yamlTags.forEach(t => tagsSet.add(t.toLowerCase()));
          const inheritedTags = Array.from(tagsSet);
          
          const parts = entryRelPath.split('/');
          const subfolder = parts.length > 2 ? parts[parts.length - 2] : domain;
          
          // 3. Chunking by ## and ### headers
          let currentSectionTitle = 'Introduction';
          let currentSectionLines: string[] = [];
          
          const saveCurrentChunk = () => {
            const textRaw = currentSectionLines.join('\n').trim();
            const fullText = stripMarkdown(textRaw);
            
            // Only index if the chunk has meaningful content
            if (fullText.length > 5 || currentSectionTitle !== 'Introduction') {
              chunks.push({
                path: entryRelPath,
                domain,
                subfolder,
                sectionTitle: currentSectionTitle,
                fileTitle,
                fullText,
                tags: inheritedTags,
                // Precompute stems at index generation time
                fileTitleStems: tokenizeAndStem(fileTitle),
                sectionTitleStems: tokenizeAndStem(currentSectionTitle),
                fullTextStems: tokenizeAndStem(fullText),
                tagStems: inheritedTags.map(t => stem(t))
              });
            }
          };
          
          // Process file lines (excluding frontmatter from line counts to be clean)
          let startLine = 0;
          if (content.startsWith('---')) {
            const endIdx = content.indexOf('---', 3);
            if (endIdx !== -1) {
              const frontmatterLinesCount = content.substring(0, endIdx + 3).split(/\r?\n/).length;
              startLine = frontmatterLinesCount;
            }
          }
          
          for (let i = startLine; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
              // Save previous section chunk
              saveCurrentChunk();
              
              // Start new section chunk
              currentSectionTitle = trimmed.replace(/^#+\s+/, '').trim();
              currentSectionLines = [];
            } else {
              // Skip the top level title '# ' line as it is recorded in fileTitle
              if (trimmed.startsWith('# ')) {
                continue;
              }
              currentSectionLines.push(line);
            }
          }
          
          // Save the final remaining chunk
          saveCurrentChunk();
          
        } catch (err) {
          console.error(`Error reading ${entryRelPath}:`, err);
        }
      }
    }
  }
  
  return chunks;
}
