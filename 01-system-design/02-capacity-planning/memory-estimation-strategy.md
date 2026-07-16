# Memory Estimation

## 1. What Question This Answers
"How much RAM is required for server caches, database buffer pools, and vector indexes, and how does this define server memory sizing and cluster configuration?"

## 2. Why It Matters at the System-Design Stage
Running out of memory leads to out-of-memory (OOM) crashes, or forces the database to spill operations to disk, slowing query performance. Memory estimation calculates:
- Sizing requirements for caching layers (Redis).
- Sizing requirements for database buffer pools (`shared_buffers` or `innodb_buffer_pool_size`).
-Sizing bounds for keeping HNSW vector search indexes cached in RAM.
Without this estimation, memory configuration is arbitrary, leading to slow queries or system crashes.

## 3. Methodology / How to Work Through It
1. **Estimate Caching Database Volumes:** Determine what percentage of the active database rows must reside in Redis cache (standard rule: cache the active working set, e.g. 10% to 20% of high-frequency read rows).
2. **Calculate Average Cache Row Size:** Multiply the estimated row width by the total number of cached records.
3. **Sizing Vector Indexes (pgvector/HNSW):** Calculate vector graph size:
   $$\text{Vector Index RAM} = \text{Total Vectors} \times (\text{Dimensions} \times 4\text{ bytes} + M \times 8\text{ bytes}) \times 1.20\text{ graph overhead}$$
4. **Size Database Buffer Pools:** Ensure the database has sufficient RAM to cache B-Tree indexes for active tables (target buffer cache hit ratio >99%).
5. **Add Operating System & Thread Overhead:** Allocate 20% to 30% safety headroom for host processes and connection threads.

## 4. Inputs Needed
- Active data sizing from Storage Estimation and [Vector Database Design](../../04-database-design/10-ai-and-modern-databases/vector-database-design-strategy.md).
- Peak active user concurrency.

## 5. Outputs Produced
- Feeds into [Caching Strategy](../../13-architecture-decision-records/index.md) and [Database Selection](../../13-architecture-decision-records/index.md).

## 6. Worked Example (SaaS Product Vector Search Cache)
- **Scale:** 1,000,000 document chunks.
- **Vectors:** 1536 dimensions (float32). HNSW settings: $M = 16$.
- **Caching Requirement:** Cache the top 100,000 high-frequency search results (average size per cached JSON payload is 2KB).
- **Calculations:**
  - *Vector Index Size:* $1,000,000 \times (1536 \times 4 + 16 \times 8) \times 1.20 = 7.5\text{ GB}$.
  - *Cache Storage Size:* $100,000 \times 2\text{KB} = 200\text{ MB}$.
  - *Database Buffer Cache (B-Tree indexes for metadata):* Allocate 4GB.
- **Infrastructure Impact:**
  - *Database RAM Sizing:* Relational vector host requires minimum 16GB RAM (7.5GB for HNSW index, 4GB for B-Tree caches, plus 4.5GB OS/Thread headroom).
  - *Redis RAM Sizing:* Cache node requires minimum 1GB RAM (200MB cache payload + headroom).

## 7. Common Mistakes
- **Ignoring Vector Index Graph Overhead:** Allocating memory based only on raw vector float arrays, causing host servers to crash due to HNSW graph memory bloat.
- **Sizing Cache for 100% of Data:** Attempting to store the entire database in memory instead of caching only the active working set, wasting budget.
- **Under-sizing Database Buffer Pools:** Failing to allocate enough RAM for index caching, causing queries to read from disk and slowing latency.

## 8. AI Coding-Agent Guidelines
1. **Identify High-Volume Caches:** Estimate the memory footprint of Redis caches based on the active working set (10-20% of data).
2. **Calculate HNSW Graph RAM:** Apply the vector memory formula for all vector columns.
3. **Set Database Buffer Targets:** Suggest database RAM parameters to maintain index coverage.
4. **Produce Memory Estimation Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Memory Capacity Sizing: [System Name]

### 1. Vector Index RAM Sizing (HNSW)
- **Total Vector Records:** [e.g. 5,000,000 vectors]
- **Dimension Count:** [e.g. 768 dimensions]
- **HNSW M Connections:** [e.g. M = 16]
- **Vector Index Memory Formula:**
  - [e.g. $5,000,000 \times (768 \times 4 + 16 \times 8) \times 1.20 \approx 19.2\text{ GB}$]

### 2. Caching & Buffer Pool Sizing
- **Target Cached Records:** [e.g. 500,000 rows]
- **Average Cache Record Size:** [e.g. 1KB]
- **Total Redis Cache Size:** [e.g. $500,000 \times 1\text{KB} \approx 500\text{ MB}$]
- **Database Buffer Cache Allocation:** [e.g. 8GB (index caching)]

### 3. Server Memory Infrastructure Sizing
- **Database Server Instance RAM:** [e.g. Provision 32GB RAM instance (19.2GB index + 8GB buffer + 4.8GB OS headroom)]
- **Redis Cache Instance RAM:** [e.g. Provision 2GB RAM instance]
```
