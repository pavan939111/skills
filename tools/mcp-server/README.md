# Engineering Knowledge Base MCP Server

A Model Context Protocol (MCP) server that exposes the repo's engineering knowledge base to any compatible AI-powered IDE or tool (e.g., Antigravity, Cursor, Windsurf, Claude Desktop, Claude Code, etc.) over a secure `stdio` transport. 

It provides advanced **hybrid search** (combining BM25 keyword relevance and semantic vector embeddings via Reciprocal Rank Fusion) and structural navigation of the repository's markdown topic files without requiring clients to know absolute paths.

---

## Technical Stack

- **Server Core:** Node.js + TypeScript using `@modelcontextprotocol/sdk`
- **Search Engine:** Local BM25 Scorer + Synonym Expansions + Custom suffix stemmer
- **Semantic Model:** `Xenova/all-MiniLM-L6-v2` (384-dimension embeddings, running 100% locally offline on CPU via `@xenova/transformers`)
- **Incremental Cache:** SHA-256 hash-based persistent cache map (`embedding-cache.json`) to allow sub-2-second incremental re-embeddings.
- **Dependency Isolation:** 0 external network API dependencies at query runtime. The embedding model is cached locally after a one-time build setup download.

---

## Setup and Build

Follow these steps in your shell to build and initialize the server:

1. **Install Dependencies**:
   ```bash
   cd tools/mcp-server
   npm install
   ```

2. **Generate the Search Index**:
   Parses all repository content files, constructs section-level chunks, and calculates content hashes.
   ```bash
   npm run build-index
   ```

3. **Precompute Semantic Embeddings**:
   Calculates 384-dimensional vector embeddings for all chunks. 
   *(Note: The very first run will download the local MiniLM ONNX model from Hugging Face and save it to your local system cache; subsequent rebuilds will read directly from the persistent `embedding-cache.json` map instantly.)*
   ```bash
   npm run build-embeddings
   ```

4. **Compile TypeScript**:
   ```bash
   npm run build
   ```

---

## IDE Configuration Guides

Register this MCP server inside your preferred AI-powered IDE using the configurations below:

### 1. Antigravity IDE (Gemini Coding Assistant)
Register the server in your user settings configuration at `%USERPROFILE%\.gemini\config\mcp.json` (or inside the workspace customization root `.agents/mcp.json`):

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": [
        "<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"
      ]
    }
  }
}
```

### 2. Cursor
1. Open Cursor and navigate to **Settings** > **Features** > **MCP**.
2. Click **+ Add New MCP Server**.
3. Configure the server:
   - **Name:** `Knowledge Base`
   - **Type:** `command` (or `stdio`)
   - **Command:** `node "<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"`
4. Click **Save**.

### 3. Windsurf (Codeium Cascade)
Add the server definition to your global Windsurf MCP configuration file located at `%USERPROFILE%\.codeium\windsurf\mcp_config.json` (Windows) or `~/.codeium/windsurf/mcp_config.json` (macOS/Linux):

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": [
        "<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"
      ]
    }
  }
}
```

### 4. VS Code (via Codex or other MCP Extensions)
If using the Codex extension or generic MCP clients in VS Code, add the server to your settings profile:

- **Command/Executable:** `node`
- **Arguments:** `["<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"]`

### 5. Claude Desktop
Add the configuration block to your `claude_desktop_config.json` file located at `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "node",
      "args": [
        "<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"
      ]
    }
  }
}
```

### 6. Claude Code (Terminal CLI)
Add the server directly using the Claude CLI:
```bash
claude mcp add knowledge-base node "<ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js"
```

---

## Registered Tools

Once active, the server registers the following tools with the client:

*   `search_knowledge` (`query`, `domain`, `limit`): Searches the database using hybrid RRF scoring. Matches concepts even when no literal keywords overlap.
*   `get_topic` (`path`): Returns the full raw markdown content of a file.
*   `list_domains` (): Lists the active engineering layers/domains (excluding `06-frontend-development`).
*   `get_domain_overview` (`domain`): Returns a domain's main index and subfolder map.
*   `get_related` (`path`): Lists linked references in a file to follow cross-reference trails.
