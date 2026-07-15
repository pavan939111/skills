# Social Media System Design Template

## 1. Target Product Shape
High-throughput platform supporting user posts, follows, and dynamic home feeds (timeline generation).

## 2. Requirements Analysis
- **Functional:** Create posts, follow users, read home timeline feeds, comment, like posts.
- **Non-Functional:** Low read latency on feeds (<100ms P95), eventual timeline consistency, write scaling (up to 1,000 posts/sec).

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Active Users: 10,000,000 monthly.
  - Write Volume: 500 posts/second.
  - Read Volume: 50,000 feed queries/second.
- **Sizing Math:**
  - *Storage:* 500 posts/sec $\times$ 10KB payload (text + media link) $\approx 5\text{ MB/second}$ database growth ($\approx 150\text{ TB/year}$).
  - *Bandwidth:* Dynamic timelines feed read: 50,000/sec $\times 100\text{ KB/feed} \approx 5\text{ GB/second}$ egress bandwidth.

## 4. Selected Architecture & Components
- **Architecture Style:** Event-driven microservices.
- **Core Components:**
  - Feed generation service (calculates feeds in background).
  - Post service (writes posts to primary NoSQL).
  - Graph service (manages follower relationships).

## 5. Technology Selection Strategy
- **Primary Datastore:** MongoDB or Cassandra (handles massive write scaling).
- **Feed Cache:** Redis (pre-calculated feeds stored as lists).
- **Messaging:** Apache Kafka (ingests follower feeds events).

## 6. Critical Trade-offs
- **Pre-computed feeds vs. Runtime feeds:** Pre-computes feeds on write (Fan-out-on-write) for regular users, saving read CPU, but queries feeds at runtime (Fan-out-on-read) for users with high follower counts (celebrities) to avoid database write storms.

## 7. Reusable Design Checklist
```markdown
- [ ] User timelines pre-calculated and cached in Redis.
- [ ] Celebrity posts fan out on query runtime, not on post publish.
- [ ] Media assets hosted on CDN with cached egress routes.
```
