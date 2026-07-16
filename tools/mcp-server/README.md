# Knowledge Base MCP Server

A Model Context Protocol (MCP) server that exposes the engineering knowledge base at the repo root to any compatible AI tool/agent (e.g. Claude Desktop, Claude Code, Cursor, Windsurf) over `stdio` transport. It enables AI tools to dynamically discover, search, read, and navigate the repository's markdown topic files without needing absolute file paths upfront.

## Tools Provided

1.  `search_knowledge` (Parameters: `query` (required), `domain` (optional), `limit` (optional)): Matches search terms against document titles, headers, tags, filenames, and contents using a local relevance scoring algorithm.
2.  `get_topic` (Parameters: `path` (required)): Returns the full raw markdown content of a repo-relative topic file.
3.  `list_domains` (Parameters: none): Lists all 14 active top-level engineering layers/domains with their descriptions and topic counts.
4.  `get_domain_overview` (Parameters: `domain` (required)): Returns a specific domain's main index/README summary file containing its subfolder map.
5.  `get_related` (Parameters: `path` (required)): Parses markdown relative links in a file and returns them, allowing agents to follow cross-reference trails across domains.

---

## Setup and Build

1.  **Install dependencies**:
    ```bash
    cd tools/mcp-server
    npm install
    ```

2.  **Generate the Search Index**:
    This generates the `index.json` search database by crawling all repo-relative files.
    ```bash
    npm run build-index
    ```

3.  **Compile the TypeScript code**:
    ```bash
    npm run build
    ```

---

## Configuration Guides

Register this server in your target tool configurations by pointing to the compiled Node executable:

### 1. Claude Desktop Config
Add this to your `claude_desktop_config.json` (typically located in `%APPDATA%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

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

### 2. Cursor Config
Go to **Settings** > **Features** > **MCP** and register a new server:
- **Name**: `Knowledge Base`
- **Type**: `stdio`
- **Command**: `node <ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js`

### 3. Claude Code Config
Add it using the Claude Code command-line tool:
```bash
claude mcp add knowledge-base node <ABSOLUTE_PATH_TO_REPO>/tools/mcp-server/dist/src/index.js
```
