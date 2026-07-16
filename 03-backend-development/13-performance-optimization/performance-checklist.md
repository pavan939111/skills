# Performance Checklist

## 1. Backend Application Context
The Performance Checklist is an audit tool used to verify that caches, async loops, stream channels, compressions, and database joins comply with latency standards.

## 2. Backend-Specific Pitfalls
- **Signing off checklist without load testing:** Deploying configurations without testing under peak concurrency thresholds.

## 3. Code-Shape Example
`markdown
### Performance PR Review Guidelines:
- [ ] Database relations loaded via joins on looped checks (no N+1 queries)
- [ ] Caches configure expiry limits and handle invalidations
- [ ] Large files and queries stream outputs (no full memory buffers)
- [ ] Batch operations use chunk limits (e.g. max 500 rows per write)
- [ ] Code avoids blocking synchronous operations inside async routes
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- Performance Engineering
