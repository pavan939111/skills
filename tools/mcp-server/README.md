# Engineering Knowledge Base MCP Server

A local Model Context Protocol (MCP) server that gives any MCP-compatible AI tool — Claude Desktop, Claude Code, Cursor, Windsurf, Antigravity, VS Code extensions, etc. — direct, searchable access to this repository's engineering knowledge base (system design, backend, database, AI engineering, and every other domain folder). No copy-pasting files into chat, no manually pointing the agent at paths — the agent just asks a question in plain language and gets back the right file.

Everything runs 100% locally. No API keys, no accounts, no data leaves your machine.

---

## What this actually does

Once connected, your AI tool can call five tools against the knowledge base instead of guessing file paths or scanning the whole repo:

| Tool | What it's for |
|---|---|
| `search_knowledge` | The main one. Ask a question or describe a topic in plain language, get back the most relevant files — even if the file doesn't share exact keywords with your question. |
| `get_topic` | Once search points at a file, read its full content. |
| `list_domains` | See the top-level knowledge domains available (system design, database design, AI engineering, etc.). |
| `get_domain_overview` | See everything inside one domain before drilling in. |
| `get_related` | Follow the cross-reference links a file points to (e.g. a Decision Brief pointing to its implementation deep-dive). |

You never need to know a file's path in advance — that's the whole point.

---

## Prerequisites

- **Node.js 18 or newer** (check with `node -v`)
- **npm** (ships with Node.js)
- An internet connection **once**, for the initial setup — after that, everything runs fully offline.

---

## Quickstart

From the repository root:

```bash
cd tools/mcp-server
npm install
npm run build-index
npm run build-embeddings
npm run build
```

That's it — the server is ready. Skip to [Connect it to your AI tool](#connect-it-to-your-ai-tool) below.

(The `build-embeddings` step downloads a small local AI model — `all-MiniLM-L6-v2`, ~90MB — the very first time it runs, then caches it on your machine. Every run after that is fully offline. This is the only network access this tool ever needs.)

---

## Setup, step by step

1. **Install dependencies**
   ```bash
   cd tools/mcp-server
   npm install
   ```

2. **Build the search index** — walks every markdown file in the knowledge base, splits each into section-level chunks, and prepares them for search.
   ```bash
   npm run build-index
   ```

3. **Precompute semantic embeddings** — generates AI-searchable vectors for every chunk, so the server can match your question by *meaning*, not just keywords.
   ```bash
   npm run build-embeddings
   ```
   First run downloads the local embedding model (one-time, ~90MB). After that, every rebuild only re-embeds content that actually changed — usually finishes in a second or two.

4. **Compile the server**
   ```bash
   npm run build
   ```

You now have a working server at `tools/mcp-server/dist/src/index.js`. It doesn't need to stay running in a terminal — your AI tool starts and stops it automatically each time you use it, via the config below.

---

## Connect it to your AI tool

Every tool below needs the same two things: the command `node`, and the absolute path to `dist/src/index.js`. Replace `<ABSOLUTE_PATH_TO_REPO>` with the full path to where you cloned this repository on your machine.

### Claude Desktop
Edit `claude_desktop_config.json`:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": ["<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"]
    }
  }
}
```
Restart Claude Desktop after saving.

### Claude Code (terminal)
```bash
claude mcp add knowledge-base node "<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"
```

### Cursor
Settings → Features → MCP → **+ Add New MCP Server**:
- **Name:** `Knowledge Base`
- **Type:** `command` (or `stdio`)
- **Command:** `node "<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"`

### Windsurf
Edit `mcp_config.json`:
- Windows: `%USERPROFILE%\.codeium\windsurf\mcp_config.json`
- macOS/Linux: `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": ["<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"]
    }
  }
}
```

### Antigravity (Gemini)
Edit `%USERPROFILE%\.gemini\config\mcp.json` (or the workspace-level `.agents/mcp.json`):

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": ["<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"]
    }
  }
}
```

### VS Code (Codex or other MCP extensions)
- **Command/Executable:** `node`
- **Arguments:** `["<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"]`

After connecting, ask your AI tool something like *"what MCP tools do you have?"* to confirm it sees `search_knowledge`, `get_topic`, `list_domains`, `get_domain_overview`, and `get_related`.

---

## How to actually use it

You don't call these tools yourself — you just talk to your AI assistant normally, and it decides when to use them. For example:

> **You:** "How should I handle authentication with JWTs in the backend?"
> **What happens:** the agent calls `search_knowledge("JWT authentication")`, gets back `08-security-engineering/01-authentication/jwt-authentication-implementation.md` as the top result, then calls `get_topic` on it to read the full guide before answering you.

> **You:** "How do I stop one slow service from taking down everything else?"
> **What happens:** even though this doesn't mention "circuit breaker" at all, semantic search still surfaces `circuit-breaker-strategy.md` because it understands the *concept*, not just the words.

> **You:** "What's in the database design section?"
> **What happens:** the agent calls `list_domains` or `get_domain_overview("04-database-design")` to see the full topic map before answering.

If you want to prompt this more directly, just say things like *"search the knowledge base for X"* or *"check the engineering knowledge base before answering."*

---

## Keeping it up to date

Whenever you edit, add, or remove a file in the knowledge base, refresh the index:

```bash
cd tools/mcp-server
npm run build-index
npm run build-embeddings
```

You don't need to rebuild the whole thing from scratch — the embedding step only recomputes vectors for content that actually changed (tracked by content hash), so a small edit typically finishes in a second or two, not minutes. No need to re-run `npm run build` unless you changed the server's own TypeScript code (`src/*.ts`), not the knowledge base content itself.

---

## How search works, in brief

Every query blends two signals, so it finds the right file whether you use exact terminology or just describe the problem:

- **Keyword matching (BM25):** finds files that share your exact words — best for acronyms, framework names, and precise terms ("CQRS", "JWT", "sharding").
- **Semantic matching (local AI embeddings):** finds files that match your *meaning*, even with zero shared words — best for describing a problem in your own terms.
- **Combined ranking (Reciprocal Rank Fusion):** merges both signals, with a safeguard that never lets a semantic guess bump out a result your exact words already nailed.

Everything — the search index, the embedding model, the ranking — runs on your machine. Nothing is sent anywhere.

---

## Troubleshooting

**"embeddings.bin not found" error when searching** — you skipped the build steps. Run `npm run build-index` then `npm run build-embeddings` before `npm run build`.

**Search results look stale after editing a file** — you edited content but didn't rebuild the index. Run the two commands in [Keeping it up to date](#keeping-it-up-to-date).

**First search feels slow, then fast after that** — normal. The first query of a session loads the local embedding model into memory; every query after that is fast.

**Your AI tool doesn't see the server at all** — double-check the absolute path in your config actually points to `dist/src/index.js` (not `src/index.ts`), and that you ran `npm run build` at least once so `dist/` exists. Restart your AI tool after changing its MCP config.

---

## Technical reference

- **Server:** Node.js + TypeScript, `@modelcontextprotocol/sdk`, stdio transport
- **Keyword search:** custom BM25 implementation with stemming and a domain-specific synonym table (JWT ↔ JSON Web Token, auth ↔ authentication, etc.)
- **Semantic search:** `Xenova/all-MiniLM-L6-v2`, 384-dimension embeddings, mean-pooled and L2-normalized, running fully offline via `@xenova/transformers`
- **Chunking:** section-level (one chunk per `##`/`###` heading), not whole-file — sharper ranking precision and tighter embeddings than indexing entire files at once
- **Incremental updates:** SHA-256 content-hash cache (`embedding-cache.json`) — only changed sections get re-embedded on rebuild
- **Zero runtime network calls** — the only network access this tool ever makes is the one-time model download on first setup

### Registered tools

- `search_knowledge(query, domain?, limit?)` — hybrid search across the whole knowledge base, or scoped to one domain
- `get_topic(path)` — full content of a specific file
- `list_domains()` — every top-level domain with its description and topic count
- `get_domain_overview(domain)` — a domain's full subfolder/topic map
- `get_related(path)` — cross-reference links a file points to
