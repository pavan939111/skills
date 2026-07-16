import * as fs from 'fs';
import * as path from 'path';
import { TopicDoc } from './types';

// Helper to strip markdown syntax
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
    // Remove bold and italic markers: **bold**, *italic*, __bold__, _italic_
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove header markers
    .replace(/^#+\s+/gm, '')
    // Collapse whitespace and newlines
    .replace(/\s+/g, ' ')
    .trim();
    
  return text.substring(0, 300);
}

// Simple YAML frontmatter tag parser
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
    
    // Check if we hit the tags: key
    if (trimmed.startsWith('tags:')) {
      const inlineValue = trimmed.substring(5).trim();
      if (inlineValue) {
        // Handle tags: [tag1, tag2] or tags: tag1, tag2
        const cleanVal = inlineValue.replace(/[\[\]]/g, '');
        const parts = cleanVal.split(',').map(p => p.trim()).filter(Boolean);
        tags.push(...parts);
      } else {
        inTagsList = true;
      }
      continue;
    }
    
    // If we are parsing a multi-line tags list (indented bullets starting with -)
    if (inTagsList) {
      if (trimmed.startsWith('-')) {
        const tag = trimmed.substring(1).trim().replace(/['"]/g, '');
        if (tag) tags.push(tag);
      } else if (trimmed.includes(':')) {
        // Hit another YAML key, stop list parsing
        inTagsList = false;
      }
    }
  }
  
  return tags;
}

export function buildIndex(repoRoot: string): TopicDoc[] {
  const docs: TopicDoc[] = [];
  
  // Excluded top-level domains
  const excludedDomains = new Set(['tools', 'node_modules', '06-frontend-development']);
  
  // Read top-level directories
  const items = fs.readdirSync(repoRoot);
  
  for (const item of items) {
    const fullPath = path.join(repoRoot, item);
    const stat = fs.statSync(fullPath);
    
    if (!stat.isDirectory()) {
      continue;
    }
    
    // Only index folders starting with digits matching the 00-13 pattern (excluding frontend)
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
        // Index this markdown file
        try {
          const content = fs.readFileSync(entryFullPath, 'utf-8');
          const lines = content.split(/\r?\n/);
          
          // 1. Parse Title
          let title = '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) {
              title = trimmed.substring(2).trim();
              break;
            }
          }
          if (!title) {
            title = path.basename(entry, '.md').replace(/-/g, ' ');
          }
          
          // 2. Parse Headers
          const headers: string[] = [];
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
              const cleanHeader = trimmed.replace(/^#+\s+/, '').trim();
              headers.push(cleanHeader);
            }
          }
          
          // 3. Derive Tags
          const tagsSet = new Set<string>();
          
          // Derive tags from filepath segments (exclude number prefixes)
          const segments = entryRelPath.split('/');
          for (const segment of segments) {
            const wordSegment = segment.replace(/^[0-9]+-/, '').replace(/\.md$/, '');
            const words = wordSegment.split('-').map(w => w.toLowerCase().trim()).filter(Boolean);
            words.forEach(w => tagsSet.add(w));
          }
          
          // Parse YAML tags if any
          const yamlTags = parseFrontmatterTags(content);
          yamlTags.forEach(t => tagsSet.add(t.toLowerCase()));
          
          // 4. Parse Snippet
          // Extract body text after the title
          let bodyStartIndex = 0;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('# ')) {
              bodyStartIndex = i + 1;
              break;
            }
          }
          const bodyMd = lines.slice(bodyStartIndex).join('\n');
          const snippet = stripMarkdown(bodyMd);
          
          // Determine subfolder
          const parts = entryRelPath.split('/');
          const subfolder = parts.length > 2 ? parts[parts.length - 2] : domain;
          
          docs.push({
            path: entryRelPath,
            domain,
            subfolder,
            title,
            headers,
            tags: Array.from(tagsSet),
            snippet
          });
        } catch (err) {
          console.error(`Error reading ${entryRelPath}:`, err);
        }
      }
    }
  }
  
  return docs;
}
