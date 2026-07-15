# Elasticsearch Strategy

### 1. The Question Decided
"Should the system deploy Elasticsearch as an isolated full-text search engine, and how are updates synchronized from primary databases?"

### 2. Options Compared
| Dimension | Elasticsearch (Lucene engine) | PostgreSQL (Native FTS - tsvector) | MongoDB (Text indexes) |
|---|---|---|---|
| **Cost (Hosting)** | High (Dedicated nodes) | Low | Low |
| **Search Speed** | Extremely Fast (Inverted index) | Medium-Fast | Medium |
| **Capabilities** | Advanced (Fuzzy, synonyms, highlights)| Basic (Stemming, rank matching)| Basic |
| **Complexity** | High (Sync pipeline required) | Low | Low |
| **Scale Ceiling**| Very High | Medium | Medium |

### 3. Decision Rule
- **Choose Elasticsearch if:** The application has advanced full-text search requirements (e.g. e-commerce search with fuzzy matching, auto-suggestions, synonyms, and localized relevance scoring) and high read QPS.
- **Choose PostgreSQL Native FTS if:** Search workloads are basic keyword matches, and keeping operational infrastructure simple is a priority.

### 4. Red Flags to Revisit
- Search queries fail to match user input because downstream sync events lag behind primary database mutations.
- The Elasticsearch cluster experiences out-of-memory (OOM) crashes due to unoptimized heap configurations or heavy heap aggregations.

### 5. Where to Go Next
- For configuring dedicated search engines and mapping inverted indexes, see [Search Engine Database Selection](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/01-database-selection/search-engine-decision-matrix.md).
- For details on relational vs search engine tradeoffs, see [SQL vs Search Engine Comparison](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/01-database-selection/index.md).
