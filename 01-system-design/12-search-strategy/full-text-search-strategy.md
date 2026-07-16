# Full-Text Search Strategy

### 1. The Question Decided
"Should full-text search capability run natively inside primary SQL databases or be offloaded to dedicated indexes?"

### 2. Options Compared
| Dimension | Database-Native FTS | Dedicated Search Index (Lucene) |
|---|---|---|
| **Cost** | Low (Zero added infra) | High |
| **Complexity** | Low | High (Sync lag, index pipelines) |
| **Language Support**| Basic stemming | Advanced dictionaries, custom tokenizers |
| **Write Impact** | Medium (FTS indexes write-bound) | Zero (Writes offloaded) |
| **Query Speed** | Low-Medium | Very Fast |

### 3. Decision Rule
- **Choose Database-Native FTS if:** Product search volumes are low, queries are simple keyword matches on a few columns, and keeping deployment overhead minimal is a priority.
- **Choose Dedicated Search Index if:** Search QPS is high (>500 QPS), or search requires complex query tokenization, fuzzy spelling corrections, and synonyms.

### 4. Red Flags to Revisit
- Transactional database writes fail because updating complex FTS indexes on write queries locks database tables.
- Users report poor search matches because native database search cannot handle fuzzy spelling variants or synonyms.

### 5. Where to Go Next
- For configuring database-native full-text search and setting up dedicated search indexes, see [Search Engine Database Selection](../../04-database-design/01-database-selection/search-engine-decision-matrix.md).
