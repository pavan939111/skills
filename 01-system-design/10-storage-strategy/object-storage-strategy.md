# Object Storage Strategy

### 1. The Question Decided
"Should the system utilize cloud object storage (e.g. AWS S3) to host unstructured assets (documents, user uploads, reports) instead of application databases or servers filesystems?"

### 2. Options Compared
| Dimension | Object Storage (AWS S3) | Block Storage (VM EBS volume) | Relational Database (BLOB column) |
|---|---|---|---|
| **Cost** | Extremely Low | High | Very High |
| **Read Speed** | Low-Medium (Needs CDN edge) | Fast | Slow (Large blocks lock DB pages) |
| **Metadata Tagging**| Natively supported | System logic needed | Database schema |
| **Availability** | Extremely High (99.999999999%) | Medium | High (Replicated) |
| **Max File Size** | 5 Terabytes | Limited by disk size | Limited by database limits |

### 3. Decision Rule
- **Choose Object Storage if:** Storing static, unstructured files larger than 1MB (e.g. images, audio, CSV exports, backups) that require low-cost persistence and global accessibility.
- **Avoid Object Storage if:** Files require low-latency microsecond random-access edits (use block storage instead).

### 4. Red Flags to Revisit
- Database storage costs spike and backups slow down because the team stores raw user PDF files inside SQL database tables.
- Application servers exhaust storage space because user uploads are stored locally on application VM disks instead of object stores.

### 5. Where to Go Next
- For implementing signed URLs, multipart uploads, and bucket-level configurations, see [Object & File Storage Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/04-file-storage-strategy-implementation.md).
