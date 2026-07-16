import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from 'fs';
import * as path from 'path';
import { searchIndex } from './search';
import { Chunk } from './types';

const server = new Server(
  {
    name: "knowledge-base-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Resolve repository root relative to the running file
const repoRoot = path.resolve(__dirname, '../../..');
const indexFilePath = path.resolve(__dirname, '../index.json');

// Helper to load index
function loadIndex(): Chunk[] {
  if (!fs.existsSync(indexFilePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(indexFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse index file:", err);
    return [];
  }
}

// Register Tools Schema
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_knowledge",
        description: "Search the engineering knowledge base by query terms. Returns matching files, their paths, titles, and body snippets.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query keywords (e.g., 'JWT authentication', 'sharding')."
            },
            domain: {
              type: "string",
              description: "Optional top-level domain folder constraint (e.g., '03-backend-development')."
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return (default 5, max 20)."
            }
          },
          required: ["query"]
        }
      },
      {
        name: "get_topic",
        description: "Read and retrieve the full content of a specific research topic file in the repository.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The repository-relative path to the topic markdown file (e.g., '03-backend-development/09-error-handling/index.md')."
            }
          },
          required: ["path"]
        }
      },
      {
        name: "list_domains",
        description: "List all 14 top-level engineering layers/domains in the knowledge base, showing their descriptions and completed topic counts.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "get_domain_overview",
        description: "Retrieve the index/README overview for a specific engineering domain to see its subfolder layout and reference map.",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "The top-level folder name (e.g., '04-database-design')."
            }
          },
          required: ["domain"]
        }
      },
      {
        name: "get_related",
        description: "Find and list other knowledge base topics cross-referenced (linked) within a specific file.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The repository-relative path to the file to check for links."
            }
          },
          required: ["path"]
        }
      }
    ]
  };
});

// Handle Tool Executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case "search_knowledge": {
        const query = String(args?.query || "");
        const domain = args?.domain ? String(args.domain) : undefined;
        const limit = args?.limit ? Number(args.limit) : 5;
        
        const docs = loadIndex();
        const results = searchIndex(docs, query, domain, limit);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2)
            }
          ]
        };
      }
      
      case "get_topic": {
        const targetPath = String(args?.path || "");
        
        // Prevent path traversal
        const normalized = path.normalize(targetPath).replace(/\\/g, '/');
        if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Path must be relative to repository root and stay within the workspace."
              }
            ],
            isError: true
          };
        }
        
        const fullPath = path.join(repoRoot, normalized);
        if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
          return {
            content: [
              {
                type: "text",
                text: `Error: File not found at path: ${targetPath}`
              }
            ],
            isError: true
          };
        }
        
        const text = fs.readFileSync(fullPath, 'utf-8');
        return {
          content: [
            {
              type: "text",
              text
            }
          ]
        };
      }
      
      case "list_domains": {
        const readmePath = path.join(repoRoot, 'README.md');
        const domains: any[] = [];
        
        if (fs.existsSync(readmePath)) {
          const content = fs.readFileSync(readmePath, 'utf-8');
          const lines = content.split(/\r?\n/);
          
          // Regex matching: | [`domain/`](./domain/index.md) | Description | count | ...
          // also matches unlinked: | `06-frontend-development/` | ...
          const regex = /\|\s*\[?`([^`/]+)\/?`\]?(?:\([^)]+\))?\s*\|\s*([^|]+)\|\s*([0-9]+)\s*\|\s*([^|]+)\|/;
          
          for (const line of lines) {
            const match = line.match(regex);
            if (match) {
              const domName = match[1].trim();
              // Exclude 06-frontend-development as required
              if (domName === '06-frontend-development') {
                continue;
              }
              domains.push({
                domain: domName,
                description: match[2].trim(),
                topicCount: parseInt(match[3].trim(), 10),
                status: match[4].trim()
              });
            }
          }
        }
        
        // Fallback to disk scan if root table parse yields nothing
        if (domains.length === 0) {
          const items = fs.readdirSync(repoRoot);
          for (const item of items) {
            const fullPath = path.join(repoRoot, item);
            if (fs.statSync(fullPath).isDirectory() && /^(?:0[0-9]|1[0-3])-[a-zA-Z0-9-]/.test(item)) {
              if (item === '06-frontend-development') continue;
              
              // Count md files in this directory recursively
              let count = 0;
              const countMD = (dir: string) => {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                  const fp = path.join(dir, file);
                  if (fs.statSync(fp).isDirectory()) {
                    countMD(fp);
                  } else if (file.endsWith('.md')) {
                    count++;
                  }
                }
              };
              try {
                countMD(fullPath);
              } catch (_) {}
              
              domains.push({
                domain: item,
                description: "Engineering knowledge domain",
                topicCount: count
              });
            }
          }
        }
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(domains, null, 2)
            }
          ]
        };
      }
      
      case "get_domain_overview": {
        const domain = String(args?.domain || "");
        
        // Prevent path traversal
        const cleanDomain = path.normalize(domain).replace(/\\/g, '/');
        if (cleanDomain.startsWith('..') || path.isAbsolute(cleanDomain)) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Domain path must stay within the workspace."
              }
            ],
            isError: true
          };
        }
        
        const dirPath = path.join(repoRoot, cleanDomain);
        if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Domain directory not found: ${domain}`
              }
            ],
            isError: true
          };
        }
        
        // Return README.md or index.md if present
        let overviewPath = path.join(dirPath, 'README.md');
        if (!fs.existsSync(overviewPath)) {
          overviewPath = path.join(dirPath, 'index.md');
        }
        
        if (!fs.existsSync(overviewPath)) {
          return {
            content: [
              {
                type: "text",
                text: `Error: No README.md or index.md overview file exists inside ${domain}/`
              }
            ],
            isError: true
          };
        }
        
        const text = fs.readFileSync(overviewPath, 'utf-8');
        return {
          content: [
            {
              type: "text",
              text
            }
          ]
        };
      }
      
      case "get_related": {
        const targetPath = String(args?.path || "");
        
        // Prevent path traversal
        const normalized = path.normalize(targetPath).replace(/\\/g, '/');
        if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Path must stay within the workspace."
              }
            ],
            isError: true
          };
        }
        
        const fullPath = path.join(repoRoot, normalized);
        if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
          return {
            content: [
              {
                type: "text",
                text: `Error: File not found: ${targetPath}`
              }
            ],
            isError: true
          };
        }
        
        const content = fs.readFileSync(fullPath, 'utf-8');
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const related: { path: string; linkText: string }[] = [];
        
        let match;
        const docDir = path.dirname(normalized);
        
        while ((match = linkRegex.exec(content)) !== null) {
          const linkText = match[1].trim();
          const target = match[2].split('#')[0].trim();
          
          if (!target || target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('#')) {
            continue;
          }
          
          // Resolve target relative to docDir
          const resolved = path.join(docDir, target);
          const relativeToRepo = path.relative('', resolved).replace(/\\/g, '/');
          
          related.push({
            path: relativeToRepo,
            linkText
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(related, null, 2)
            }
          ]
        };
      }
      
      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (err: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${err.message}`
        }
      ],
      isError: true
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Knowledge Base MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error starting MCP Server:", error);
  process.exit(1);
});
