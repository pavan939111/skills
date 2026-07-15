# AI Research Agent Template

## 1. Definition & Core Concepts
An AI Research Agent is a template designed to browse the web, scrape page content, cross-reference data from multiple sources, compile structured markdown reports, and insert citations.

## 2. Why It Exists / What Problem It Solves
Traditional search engines return links, and linear RAG is limited to static databases. Research tasks require exploring the live web, evaluating source credibility, synthesizing contradictory claims, and writing comprehensive documents with inline citations.

## 3. What Breaks in Production Without It
- **Shallow/Outdated Outputs:** The agent fails to search live web repositories, missing recent trends, news, or competitor updates.
- **Hallucinated Citations:** The model generates reports but invents source URLs or citations that do not exist.
- **Web Scraping Blocks:** The agent's IP is blocked by target web servers during high-frequency scraping.

## 4. Best Practices
- **Model Selection:** Use reasoning models (e.g. GPT-4o, Claude 3.5 Sonnet) for synthesis and planning, and fast models for page summarization.
- **Context/Prompt/Knowledge Strategy:** Convert scraped HTML pages to clean markdown before injecting them into the context window. Provide structured report templates.
- **Agent/RAG Pattern:** Implement a ReAct agent loop. The agent calls web search, page fetch, and file writer tools dynamically.
- **Evaluation:** Run automated judges checking for citation validity, document relevance, and writing quality metrics.
- **Deployment:** Host scraping browsers (e.g. Playwright) in containerized sandboxes, utilizing IP rotation proxies.

## 5. Common Mistakes / Anti-Patterns
- **Browsing JavaScript-heavy pages without headless browsers:** Relying on simple HTTP GET requests that fail to render single-page applications.
- **Infinite Browsing Loops:** Letting the agent follow links indefinitely without progress constraints.

## 6. Security Considerations
- **Isolated Scrapers:** Run headless browsers in container environments that are isolated from internal enterprise databases.

## 7. Performance Considerations
- **Text Pre-filtering:** Strip styling scripts, image assets, navigation bars, and headers from scraped HTML pages before processing.

## 8. Scalability Considerations
- **Proxy rotation:** Route headless browser requests through rotating residential proxies to bypass scraper blocking systems.

## 9. How Major Companies Implement It
- **Perplexity AI:** Uses a highly parallelized search-scramble pipeline that retrieves search results, fetches text from top pages concurrently, and summarizes findings with citations.

## 10. Decision Checklist (Research Agent Configurations)
- **Model Selection:** GPT-4o / Claude 3.5 Sonnet (Primary).
- **Scraping Engine:** Headless Playwright running inside isolated containers.
- **Proxy Provider:** Rotating proxy networks with IP session stickiness.
- **Report Format:** Markdown with verified markdown citations.

## 11. AI Coding-Agent Guidelines
- Write scraping utilities that compress HTML bodies to semantic text representations before feeding them to the agent's context.

## 12. Reusable Checklist
- [ ] Research agent executes inside isolated browser containers
- [ ] Scraping logic converts HTML to clean, readable markdown
- [ ] Rotating proxy pools configured to prevent IP blocks
- [ ] Citations verified by testing if scraped source links are valid
- [ ] Run loops limited to maximum turn count (e.g., max 8 crawls)
- [ ] Report template enforces strict formatting and source disclosures
