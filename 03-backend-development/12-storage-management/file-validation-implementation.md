# File Validation

## 1. Definition & Core Concepts
File Validation is the execution of security checks on user-uploaded files, validating sizes, extensions, and content structures before saving them to storage.

## 2. Why It Exists / What Problem It Solves
It blocks malicious files, exploits, and format manipulations from entering application storage and systems.

## 3. What Breaks in Production Without It
- **RCE Exploits:** Attackers execute server instructions by uploading scripts to accessible paths.
- **Resource Exhaustion:** Uploading massive files that fill up disk volumes and exceed network bandwidths.

## 4. Best Practices
- **Limit Max Sizes:** Enforce size restrictions at the proxy level (e.g. 10MB limit).
- **Verify Magic Bytes:** Read the file's header bytes to confirm actual content type, not just trusting client extension strings.
- **Sanitize File Names:** Rename files to random UUID strings to prevent directory traversal attacks.

## 5. Common Mistakes / Anti-Patterns
- **Trusting Content-Type headers:** Relying on client-submitted header values to validate file types.
- **Permissive extensions:** Allowing executable extensions (like .exe, .bat, .sh, .php) in storage.

## 6. Security Considerations
- **Antivirus Scanning:** Run automated virus scans (e.g. ClamAV) on uploads before saving them.

## 7. Performance Considerations
- **Fast Header Scans:** Read only the first few bytes of files to check signatures, avoiding loading full file bodies.

## 8. Scalability Considerations
- **Isolated Sandbox Scanning:** Process uploads in isolated containers to contain potential exploits.

## 9. How Major Companies Implement It
- **Financial Institutions:** Scan all uploaded PDFs and documents for viruses and format manipulations before forwarding them to internal networks.

## 10. Decision Checklist (Validation Strictness)
- Use **Full Magic-byte & Antivirus validation** when:
  - Applications accept files from public, anonymous users.
- Use **Simple Size & Extension validation** when:
  - Working on private, internal admin utilities.

## 11. AI Coding-Agent Guidelines
- Write validators that inspect file magic bytes and enforce size restrictions before saving files.

## 12. Reusable Checklist
- [ ] Maximum file sizes restricted on reverse proxies and applications
- [ ] Magic byte headers checked to confirm file types
- [ ] Executable file extensions explicitly blocked on uploads
- [ ] Files renamed to secure, random UUID strings
- [ ] Antivirus scans active on file uploads
- [ ] Malformed or invalid files immediately rejected with HTTP 400
