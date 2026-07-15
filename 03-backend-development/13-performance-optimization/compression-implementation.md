# Compression

## 1. Backend Application Context
Compression is the process of reducing payload sizes (using gzip or brotli) before sending them over networks, optimizing bandwidth usage.

## 2. Backend-Specific Pitfalls
- **Compresing small payloads:** Applying compression algorithms to tiny JSON responses, wasting CPU cycles for negligible bandwidth gains. Configure threshold sizes.

## 3. Code-Shape Example
`	ypescript
// Enable Gzip/Brotli compression middleware in NestJS
import * as compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    // Only compress responses exceeding 1KB
    return compression.filter(req, res);
  },
  threshold: 1024
}));
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [Performance Engineering](../../production_principles/performance-and-scale/01-performance-engineering.md)
