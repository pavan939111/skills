# File Storage Strategy

### 1. The Question Decided
"Should the system deploy shared network file systems (e.g. AWS EFS, NFS) to allow multiple compute nodes to mount and read/write to a shared folder space?"

### 2. Options Compared
| Dimension | Network File System (EFS/NFS) | Block Storage (EBS) | Object Storage (S3) |
|---|---|---|---|
| **Cost** | Medium-High | Medium | Extremely Low |
| **Concurrency** | Read/Write from thousands of instances | Single VM mounting only | Read/Write from anywhere |
| **POSIX Compliant**| Yes (Standard OS filesystem) | Yes | No (HTTP API only) |
| **Complexity** | High | Low | Low |
| **Latency** | Low-Medium | Extremely Low | Medium |

### 3. Decision Rule
- **Choose Network File Systems if:** Multi-container applications require shared access to a standard POSIX filesystem (e.g., legacy CMS platforms like WordPress that require direct disk file mutations).
- **Avoid Network File Systems if:** Data can be structured into objects (use S3 instead) or requires maximum IOPS disk speeds (use block storage instead).

### 4. Red Flags to Revisit
- Applications lag because network file mounts experience throughput throttling under concurrent file reads.
- Data corruption occurs because two application nodes attempt to write to the same file path simultaneously without file locking coordination.

### 5. Where to Go Next
- For configuring file directories, file formats, and upload safety controls, see [Object & File Storage Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/04-file-storage-strategy-implementation.md).
