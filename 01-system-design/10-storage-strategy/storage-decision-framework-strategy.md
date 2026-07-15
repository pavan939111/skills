# Storage Decision Framework

### 1. The Question Decided
"What is the overall structured decision path used to map application asset types to appropriate cloud storage tiers and CDN policies?"

### 2. Options Compared
| Asset Class / Requirement | Database Table | Object Storage (S3) | Object Storage + CDN | EFS / NFS |
|---|---|---|---|---|
| **Under 10KB ACID Config** | Best Match | Poor | Poor | Poor |
| **User Profile Images** | Poor | Fair | Best Match | Poor |
| **CMS Disk File System** | Poor | Poor | Poor | Best Match |

### 3. Decision Rule
- **Follow the storage allocation logic tree:**
  - *If* asset is small, metadata-bound, and requires ACID consistency, *then* store in **relational database columns**.
  - *If* asset is unstructured file $>100\text{KB}$, *then* store in **Object Storage (S3)**.
  - *If* asset is public static asset served globally, *then* cache via **Edge CDN**.

### 4. Red Flags to Revisit
- Application load times slow down because static files are routed through the application logic container instead of being served from edge CDN nodes.
- File upload operations fail because application server local disks fill to 100% capacity.

### 5. Where to Go Next
- For configuring storage client drivers, signed URLs, and file validations, see [Object & File Storage Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/04-file-storage-strategy-implementation.md).
- For database backup schedules and retention, see [Backup Strategies Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/backup-strategies-strategy.md).
