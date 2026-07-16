# Blob Storage Strategy

### 1. The Question Decided
"Should binary large objects (BLOBs) be stored directly inside database bytea/blob columns or offloaded to object stores?"

### 2. Options Compared
| Dimension | Database BLOB Column | Object Storage (AWS S3) |
|---|---|---|
| **Cost (Compute & Storage)**| High (Database storage is expensive) | Extremely Low |
| **Write/Read Latency** | Low (Single query reads) | Medium (HTTP lookup) |
| **Transactional Consistency**| High (ACID boundary) | Low (Needs transaction outbox logic) |
| **Database Bloat Risk** | Extremely High (Index fragmentation) | Zero |
| **Access Control** | Database grants | Signed URLs / IAM |

### 3. Decision Rule
- **Choose Database BLOB columns if:** Files are extremely small (<10KB) and require strict, synchronous ACID transaction integrity alongside row records (e.g. storing security cryptographic keys).
- **Choose Object Storage if:** Files are larger than 100KB, to prevent database page cache pollution and maintain low database backup times.

### 4. Red Flags to Revisit
- Database backups take hours to complete because tablespaces are bloated with gigabytes of raw image bytes.
- Database index lookups slow down because the page cache is saturated with binary payloads instead of indexing trees.

### 5. Where to Go Next
- For configuring file ingestion, data streams, and database BLOB offsets, see [Object & File Storage Implementation](../../04-database-design/file-storage-strategy.md).
