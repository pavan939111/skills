# Bandwidth Estimation

## 1. What Question This Answers
"What is the network data ingress and egress rate required to handle peak user traffic, and how does this define network card sizing, load balancer configurations, and CDN needs?"

## 2. Why It Matters at the System-Design Stage
A server can have high CPU and RAM, but if its network card or network switch bandwidth is saturated, requests drop, causing API timeouts. Bandwidth estimation calculates:
- The volume of network traffic flowing in (ingress) and out (egress) of the datacenter.
- Sizing requirements for network pipelines.
- Where static assets (images, assets) must be offloaded to CDNs to protect application servers.
Without this estimation, network cards block traffic during peaks.

## 3. Methodology / How to Work Through It
1. **Analyze Request/Response Payload Sizes:** Estimate the average byte size of HTTP request payloads (ingress) and response payloads (egress).
   - *Reference:* JSON payloads are small (typically 1KB–10KB), while images, media, or vector files are large (100KB–5MB).
2. **Calculate Daily Data Volume:** Multiply average payload size by total daily requests.
3. **Calculate Average Bandwidth (Mbps):**
   $$\text{Average Bandwidth (bps)} = \frac{\text{Total Bytes per Day} \times 8}{86,400\text{ seconds}}$$
   (Convert bytes to bits by multiplying by 8, then divide by 86,400 to get bits/second. Divide by 1,000,000 to get Mbps).
4. **Calculate Peak Bandwidth:** Multiply average bandwidth by the peak traffic surge factor.
5. **Differentiate Ingress and Egress:** Focus on egress, as it is typically much larger for user-facing applications.

## 4. Inputs Needed
- Peak QPS estimates from [Traffic Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/traffic-estimation-strategy-implementation.md).
- Average client asset sizes.

## 5. Outputs Produced
- Feeds into [API Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/06-api-strategy/index.md) and [Storage Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/10-storage-strategy/index.md).

## 6. Worked Example (Photo Sharing Application Feed)
- **Peak Traffic:** 1,000 QPS.
- **Ratios:** 90% read queries, 10% write queries.
- **Payload Sizes:**
  - *Ingress (Upload):* User uploads 1 photo (average size 1MB) during writes.
  - *Egress (Download):* User reads 10 posts containing thumbnails (average size 100KB each) = 1MB total feed download size during reads.
- **Calculations:**
  - *Peak Ingress (Write):* $100\text{ write QPS} \times 1\text{MB} = 100\text{ MB/s} = 800\text{ Mbps}$.
  - *Peak Egress (Read):* $900\text{ read QPS} \times 1\text{MB} = 900\text{ MB/s} = 7,200\text{ Mbps} = 7.2\text{ Gbps}$.
- **Infrastructure Impact:** A peak egress of 7.2 Gbps saturates standard 1Gbps server network cards.
  - *System Decision:* Store and route all user photos directly to AWS S3, caching them globally via CloudFront CDN. This offloads photo delivery egress from the backend servers, reducing server network requirements to simple JSON API payload limits (<100 Mbps).

## 7. Common Mistakes
- **Ignoring Image/Video Sizes:** Sizing servers based on JSON API traffic while serving un-cached large images directly from primary application nodes.
- **Mismatched Ingress/Egress Calculations:** Treating ingress and egress identically. Most web applications are highly asymmetric (egress is 10x-100x larger).
- **Ignoring CDN offloading options:** Trying to scale server network bandwith to handle heavy assets instead of routing them to edge CDNs.

## 8. AI Coding-Agent Guidelines
1. **Estimate Payload Sizes:** Calculate the average bytes of JSON APIs and static assets.
2. **Calculate Peak Bandwidth:** Determine network card requirements in Mbps/Gbps.
3. **Recommend CDN Offloading:** Suggest offloading heavy static assets if egress exceeds 500 Mbps.
4. **Produce Bandwidth Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Network Bandwidth Sizing: [System Name]

### 1. Payload Sizes
- **Average API Request Size (Ingress):** [e.g. 2KB]
- **Average API Response Size (Egress):** [e.g. 8KB]
- **Average Static Asset Size (e.g. Profile Image):** [e.g. 150KB]

### 2. Bandwidth Sizing Calculations (Peak Traffic)
- **Peak Ingress Bandwidth:**
  - [e.g. $200\text{ write QPS} \times 2\text{KB} = 400\text{ KB/s} = 3.2\text{ Mbps}$]
- **Peak Egress Bandwidth:**
  - [e.g. $1,000\text{ read QPS} \times 8\text{KB} = 8,000\text{ KB/s} = 64\text{ Mbps}$]
- **Peak Static Asset Egress (if served directly):**
  - [e.g. $500\text{ asset QPS} \times 150\text{KB} = 75,000\text{ KB/s} = 600\text{ Mbps}$]

### 3. Network Infrastructure Impact
- **Server Network Sizing:** [e.g. Standard 1Gbps network cards on servers are sufficient.]
- **CDN Strategy:** [e.g., Serve all profile images via CloudFront CDN, keeping server network card utilization low.]
```
