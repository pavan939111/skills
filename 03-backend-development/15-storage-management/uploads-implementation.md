# Uploads

## 1. Definition & Core Concepts
Uploads govern how backend applications receive, process, parse, and store files (images, PDF documents) submitted by client API requests.

## 2. Why It Exists / What Problem It Solves
It provides a secure, structured channel for user files, ensuring they are validated, scanned, and stored in persistent objects rather than ephemeral servers.

## 3. What Breaks in Production Without It
- **Server File Exhaustion:** Large uploads fill up server local disks, crashing application containers.
- **Malicious Code Execution:** Attackers upload executable script files (e.g. .php or .js) and trigger them on server paths.

## 4. Best Practices
- **Never Store on Local Containers:** Upload files directly to object storage (like AWS S3) rather than application server disks.
- **Validate File Types:** Check mime-types and file extensions against a strict allowlist.
- **Limit Payload Sizes:** Enforce max upload size limits (e.g. max 5MB) at reverse proxy configurations.

## 5. Common Mistakes / Anti-Patterns
- **Using user file names:** Saving files with the client's file name, risking path traversals. Generate random UUIDs instead.
- **Memory buffering massive files:** Loading entire upload files into memory. Stream payloads directly.

## 6. Security Considerations
- **Content Type Spoofing:** Verify actual file signatures (magic bytes) to validate content type accuracy.

## 7. Performance Considerations
- **Asynchronous Processing:** Offload file processing (like resizing or text extraction) to background workers.

## 8. Scalability Considerations
- **Direct Uploads via Presigned URLs:** Let clients upload files directly to object storage using presigned URLs, bypassing application threads.

## 9. How Major Companies Implement It
- **Airbnb:** Uses presigned S3 URLs to allow clients to upload listing photos directly, keeping application servers lean.

## 10. Decision Checklist (Upload Architectures)
- Use **Direct Uploads (Presigned URLs)** when:
  - Designing systems with high upload volumes or large file sizes (videos, archives).
- Use **Server-mediated Uploads** when:
  - Files are small and require instant, server-side processing before storage.

## 11. AI Coding-Agent Guidelines
- Write upload endpoints that validate types, generate UUID file names, and stream payloads to object storage.

## 12. Reusable Checklist
- [ ] File uploads streamed directly to object storage (no local disk saves)
- [ ] Max upload sizes restricted at reverse proxy and application configs
- [ ] File extensions and magic byte signatures validated against allowlists
- [ ] Uploaded file names renamed to random UUID strings
- [ ] File processing (resizing, extraction) offloaded to background workers
- [ ] Storage containers configured to block public execution access
