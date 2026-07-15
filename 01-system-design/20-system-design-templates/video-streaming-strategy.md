# Video Streaming System Design Template

## 1. Target Product Shape
Global content delivery platform supporting video uploads, transcoding, storage, and low-latency playback delivery.

## 2. Requirements Analysis
- **Functional:** Upload raw videos, transcode into multiple resolutions (1080p, 720p, etc.), stream via HLS/DASH protocols.
- **Non-Functional:** Low buffering latency, high global caching efficiency, high write throughput for transcoding queues.

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Active Streamers: 10,000 concurrent viewers.
  - Video Size Average: 1 Gigabyte per movie stream.
- **Sizing Math:**
  - *Bandwidth:* 10,000 viewers $\times 5\text{ Mbps stream rate} \approx 50\text{ Gbps}$ aggregate network egress capacity.
  - *Storage:* 1,000 new movies/month $\times 10\text{ GB (multi-bitrate formats)} \approx 10\text{ TB/month}$ object storage.

## 4. Selected Architecture & Components
- **Architecture Style:** Event-driven pipeline with global CDN distribution.
- **Core Components:**
  - Transcoding Cluster (converts raw MP4 to HLS chunks).
  - Content Delivery Network (caches video segments at edge regions).
  - Metadata Database (stores video catalog index).

## 5. Technology Selection Strategy
- **Primary Catalog DB:** PostgreSQL (normalised catalog relational mappings).
- **Asset Storage:** AWS S3 (segmented video segments storage).
- **CDN:** CloudFront or Cloudflare (global edge cache nodes).
- **Queue/Messaging:** AWS SQS (coordinates jobs for transcoding runners).

## 6. Critical Trade-offs
- **Edge Caching vs. Instant Updates:** Video chunks are aggressively cached on CDNs (high TTL), accepting minor catalog data drift during updates.
- **Async Transcoding:** Video uploads are handled asynchronously, delaying stream availability to save compute costs.

## 7. Reusable Design Checklist
```markdown
- [ ] Video files split into 2-10 second HLS/DASH segments (.ts files).
- [ ] CDN configured with CORS policies and token-signed cookie routes.
- [ ] Transcoding jobs split and processed concurrently in worker containers.
```
