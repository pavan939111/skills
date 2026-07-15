# Research Agents

## 1. Definition & Core Concepts
A Research Agent is an autonomous system designed to gather, evaluate, synthesize, and report on complex information from multiple external sources (such as the web, academic databases, APIs, and file systems).

## 2. Why It Exists / What Problem It Solves
Traditional search engines return links, and simple RAG queries are limited to static databases. Research agents can perform multi-step web browsing, evaluate source credibility, extract key facts, refine search terms based on intermediate findings, and compile structured reports.

## 3. What Breaks in Production Without It
- **Shallow Reporting:** The system outputs superficial answers because it cannot browse multiple pages to correlate conflicting facts.
- **Out-of-Date Syntheses:** Failing to search live web repositories, leading to reports that miss recent market changes or news events.
- **Low Source Credibility:** The agent cites unverified blog posts or low-quality sources as authoritative facts.

## 4. Best Practices
- **Implement Multi-Step Search Queries:** Train agents to generate and run search queries from different angles to compile a broad set of candidate sources.
- **Evaluate Source Authority:** Instruct the agent to check source metadata (domain name, publication date, citation counts) before extracting facts.
- **Verify Cross-references:** Check that facts extracted from one source are validated by other independent sources before including them in the final report.

## 5. Common Mistakes / Anti-Patterns
- **Infinite Browsing Loops:** The agent follows link after link, browsing dozens of pages without refining its query or compiling outputs.
- **Caching stale search results:** Serving old search cache hits for real-time market data requests.

## 6. Security Considerations
- **Malicious Web Exploits:** Ensure browser execution tools (e.g. Playwright, Puppeteer) are hosted in isolated sandboxes to prevent malicious websites from executing exploits on the agent's host network.

## 7. Performance Considerations
- **Page Loading Latency:** Headless browsing is slow. Use fast HTML scrapers (like BeautifulSoup) for simple text extraction, reserving full browser tools only for JavaScript-heavy pages.

## 8. Scalability Considerations
- **IP Rotation and Rate Limits:** High-frequency web scraping can lead to target sites blocking the agent's IP. Implement proxy pools and IP rotation middleware.

## 9. How Major Companies Implement It
- **Perplexity AI:** Uses a highly parallelized research pipeline that dispatches queries to multiple search engines, fetches text contents, and synthesizes answers with clear inline citations.

## 10. Decision Checklist (Research Strategy)
- Use **Multi-step Browser Agents** when:
  - You need to perform deep investigative research, synthesize market trends, or cross-reference academic journals.
- Use **Direct API Search (RAG)** when:
  - You need to answer quick, factual questions with pre-indexed internal datasets.

## 11. AI Coding-Agent Guidelines
- Write search and page-fetching tools that compress HTML payloads to clean Markdown text before sending them to the agent's context window.

## 12. Reusable Checklist
- [ ] Multi-turn query generator refines search terms iteratively
- [ ] Headless browser runs inside isolated container sandbox
- [ ] HTML content converted to clean markdown to save context window tokens
- [ ] Source authority and publication date checked during ingestion
- [ ] Cross-referencing logic validates facts across multiple sources
- [ ] Proxy pools and IP rotation configured to bypass search rate limits
