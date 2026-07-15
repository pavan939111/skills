# Object Storage

## 1. Definition & Core Concepts
Object Storage is a computer data storage architecture that manages data as objects (files with metadata and unique identifiers) rather than filesystems, accessed via REST APIs (e.g. AWS S3, Google Cloud Storage).

## 2. Why It Exists / What Problem It Solves
Traditional block filesystems do not scale horizontally. Object storage provides infinite storage capacity, high durability, and simple HTTP retrieval paths.

## 3. What Breaks in Production Without It
- **Data Loss on Rebuilds:** Ephemeral container instances restart, wiping all uploaded files stored on local filesystems.

## 4. Best Practices
- **Configure Private Buckets:** Block public access to buckets by default, using access control lists (ACLs) to manage permissions.
- **Implement Lifecycle Rules:** Configure rules to archive old files to cheaper storage classes (e.g., Glacier) automatically.
- **Enable Versioning:** Turn on bucket versioning to protect against accidental file deletions.

## 5. Common Mistakes / Anti-Patterns
- **Exposing storage keys:** Committing S3 root credentials to repository configuration files.

## 6. Security Considerations
- **IAM Policies:** Run application pods using IAM roles with granular read/write permissions to specific buckets only.

## 7. Performance Considerations
- **Multipart Uploads:** Configure files larger than 100MB to use multipart upload APIs to optimize speed and reliability.

## 8. Scalability Considerations
- **Globally Distributed Storage:** Replicate buckets across cloud regions to optimize read latency for global users.

## 9. How Major Companies Implement It
- **Netflix:** Stores petabytes of video assets in AWS S3, leveraging lifecycle rules and automated replication to manage scale.

## 10. Decision Checklist (Storage Types)
- Use **Object Storage (S3/GCS)** when:
  - Storing user-uploaded files, media assets, documents, and database backups.
- Use **Block Storage (EBS)** when:
  - Storing active database directories requiring low-latency disk writes.

## 11. AI Coding-Agent Guidelines
- Write storage wrappers that interface with object storage client libraries using credentials loaded dynamically from IAM roles.

## 12. Reusable Checklist
- [ ] Buckets configured as private with blocked public access by default
- [ ] Bucket versioning enabled to protect against file overwrites
- [ ] Lifecycle rules configured to archive old files to cold storage
- [ ] Storage client permissions managed via IAM roles (no root keys)
- [ ] Multipart uploads enabled for files exceeding 100MB
- [ ] Object storage endpoints configured and active in testing environments
