# Search Engine

## 1. Definition & Core Concepts

A Search Engine database (or Search Index, e.g., Elasticsearch, OpenSearch) is a NoSQL document-based database optimized for real-time full-text search, complex aggregations, and log analytics.

Core pieces:
- **Inverted Index:** The core data structure mapping every unique tokenized word to a list of documents in which it appears, enabling instant text search.
- **Text Analysis (Tokenization & Stemming):** Breaking text blocks into individual words (tokens), converting them to lowercase, and reducing them to their base form (e.g., "running" becomes "run").
- **BM25 Relevance Scoring:** The TF-IDF based ranking algorithm that determines search result relevance based on term frequency and document length.
- **Shards (Primary & Replica):** Partitioning indices into smaller physical segments (shards) distributed across cluster nodes to enable parallel querying and redundancy.

*(Boundary Note: UI search box components, application-level search clients (e.g. elasticsearch-js), and search query builders belong in `backend-development/`. This document covers database selection, shard sizing, indexing structures, and memory configurations.)*

## 2. Why It Exists / What Problem It Solves

Relational and standard Document databases use B-Tree indexes, which perform poorly when searching inside long text fields (e.g. running `LIKE '%word%'` scans entire tables). They cannot handle fuzzy matching (typos), synonyms, text highlighting, or language stemming. Search engines parse and organize text ahead of time into inverted indexes, returning ranked search results in milliseconds across terabytes of textual data.

## 3. What Breaks in Production Without It (or When Misapplied)

- **OutOfMemory (OOM) Heap Crashes from Aggregations:** Performing aggregations, sorting, or parent-child queries on unindexed text fields, which forces the engine to load massive arrays of data (fielddata) into JVM memory, crashing the node.
- **Split-Brain Cluster Divergence:** Cluster nodes lose network connection. If node configuration limits are misconfigured, both sides of the network elect a master node, leading to divergent, corrupted indexes.
- **Mapping Explosions:** Using dynamic mapping on documents with random JSON keys. The search engine creates metadata indexes for thousands of fields, exhausting cluster memory and stalling updates.
- **Over-Sharding Memory Exhaustion:** Creating too many small indexes and shards (e.g., daily index partitioning with 1 shard per day). The cluster spends more CPU and memory managing shard metadata than executing queries, causing cluster-wide slowdowns.

## 4. Best Practices

- **Enforce Explicit Index Mapping:** Never rely on dynamic mapping in production. Define strict field types, analyzer settings, and disable dynamic mapping (`"dynamic": "strict"`) to prevent mapping explosions.
- **Keep Shard Sizes Between 10GB and 50GB:** Size shards correctly. A cluster with a few large shards performs better than a cluster with thousands of tiny shards.
- **Separate Text vs. Keyword Fields:**
  - Use `text` fields for full-text search (analyzed, tokenized).
  - Use `keyword` fields for sorting, filtering, and aggregations (not tokenized).
- **Configure Dedicated Cluster Node Roles:** In production, do not run all tasks on single nodes. Deploy dedicated Master nodes, Data nodes, and Coordinating (query-router) nodes.
- **Batch Index Writes (Bulk API):** Never index documents individually. Group writes into bulk payloads (e.g., 1,000 to 5,000 documents per batch) to optimize index segments.
- **Size JVM Heap space at 50% of RAM:** Set the engine's JVM heap space to exactly 50% of the server's RAM (limiting it to maximum 32GB to respect JVM compressed ordinary object pointers). Leave the remaining 50% for the OS page cache to manage disk file lookups.

## 5. Common Mistakes / Anti-Patterns

- **Using Search Engine as Primary Database:** Treating Elasticsearch as the single source of truth database. Search engines do not support transactions, can lose data during cluster splits, and are eventually consistent.
- **Aggregating on High-Cardinality Text Fields:** Running terms aggregations on analyzed `text` fields instead of `keyword` fields, leading to heavy JVM garbage collection pauses.
- **Frequent Index Refreshes:** Setting the index refresh interval to less than 1 second, forcing the engine to continuously write small physical segments, slowing down indexing performance.
- **Deep Pagination Queries:** Requesting page 1,000 using standard offset parameters (e.g. `from: 10000, size: 10`). The engine must retrieve and sort all 10,010 documents from every shard. Use `search_after` or scroll APIs for deep pagination.

## 6. Security Considerations

- **Secure Node Inter-Communication:** Configure TLS encryption for all traffic between nodes in the cluster to prevent packet sniffing.
- **Index-Level Role-Based Access (RBAC):** Restrict access permissions on a per-index level. For example, ensure standard API keys cannot query the operational logs index.

## 7. Performance Considerations

- **Tune Refresh Intervals for High Write Paths:** During bulk migrations, set `index.refresh_interval: -1` and disable replica count to maximize indexing speed, restoring them once migration completes.

## 8. Scalability Considerations

- **Horizontal Shard Balancing:** Distribute primary and replica shards evenly across distinct physical server nodes to ensure search queries run in parallel without bottlenecking single servers.

## 9. How Major Companies Implement It

- **Stripe:** Routes transaction histories and merchant metadata to Elasticsearch clusters, allowing merchants to search their accounts for payments, disputes, or refunds with instant autocomplete and filter options.
- **Netflix:** Monitors streaming quality metrics and application errors by shipping logs to massive OpenSearch clusters, query-indexing terabytes of data daily to generate operations dashboards.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Search Engines (Elasticsearch, OpenSearch)** when:
  - You need full-text search (fuzzy matching, autocomplete, synonyms, language stemming).
  - You need to run complex multi-dimensional aggregations over massive datasets.
  - You are building log analytics, security monitoring, or diagnostic dashboards.
- Use **Relational or Document Databases** when:
  - The database is the primary, write-authoritative source of truth.
  - Strict ACID transaction consistency across multiple writes is required.
  - The access pattern is simple key-based queries or joins.

## 11. AI Coding-Agent Implementation Guidelines

- Always define index schema configurations explicitly with `"dynamic": "strict"`.
- Never use analyzed `text` fields for sorting, filtering, or aggregations — use `keyword` fields.
- Always use bulk API endpoints when performing indexing operations in loops.
- Never write deep pagination queries using `from` and `size` parameters — use `search_after` interfaces instead.
- Always configure connection parameters to handle round-robin routing across coordinating nodes.
- Never store raw binary files (images/PDFs) inside search index documents — store reference URLs.

## 12. Reusable Checklist

- [ ] Index mappings defined explicitly with dynamic mapping disabled (`"dynamic": "strict"`)
- [ ] JVM heap size configured to exactly 50% of host RAM (max 32GB)
- [ ] Node roles (Master, Data, Coordinating) isolated in cluster configurations
- [ ] Fields targeted for aggregations, sorting, or filtering typed as `keyword`
- [ ] Index write requests batched using the Bulk API
- [ ] Deep pagination queries use `search_after` (no high `from` offset bounds)
- [ ] Inter-node and client-to-node TLS encryption active
- [ ] Shard sizes planned to stay within the 10GB to 50GB size limits
- [ ] Search engine is synchronized asynchronously from primary database (not used as primary storage)
