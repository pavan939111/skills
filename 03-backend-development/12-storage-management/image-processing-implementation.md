# Image Processing

## 1. Definition & Core Concepts
Image Processing is the backend practice of manipulating user-uploaded images (resizing, cropping, compressing, formatting) to optimize page load speeds and storage configurations.

## 2. Why It Exists / What Problem It Solves
Users upload high-resolution photos that are megabytes in size. Displaying these raw photos on mobile apps slows down rendering and increases bandwidth bills. Processing converts files into optimized web formats.

## 3. What Breaks in Production Without It
- **High Bandwidth Bills:** Serving raw, uncompressed images, leading to large bandwidth charges.
- **API Latency:** Large images block rendering pipelines and exceed mobile memory limits.

## 4. Best Practices
- **Compress and Resize:** Resize images to maximum target displays and compress formats (e.g. converting to WebP or AVIF).
- **Process in Background:** Offload image tasks to queues to keep API routes fast.
- **Cache Processed Assets:** Store resized images in S3 and cache them using CDNs.

## 5. Common Mistakes / Anti-Patterns
- **Synchronous processing:** Running image processing code blocks synchronously on web API threads.
- **Overwriting source images:** Replacing original files, making re-processing impossible.

## 6. Security Considerations
- **Image Bomb Defenses:** Restrict image parsing libraries from processing images with massive dimensions (e.g. 50,000x50,000 pixels) to prevent crash exploits.

## 7. Performance Considerations
- **Native Image Libraries:** Use optimized, compiled native image libraries (like sharp in Node or Pillow in Python).

## 8. Scalability Considerations
- **On-Demand Processing Services:** Use dynamic, serverless image processing pipelines (e.g., AWS Serverless Image Handler) to resize images on demand.

## 9. How Major Companies Implement It
- **Instagram:** Automatically resizes and recompiles user photos into multiple optimized dimensions and formats instantly in background pipelines.

## 10. Decision Checklist (Processing Locations)
- Use **Background Workers / Serverless Pipelines** when:
  - Images are processed dynamically and cached at scale via CDNs.
- Use **Synchronous Native Libraries** when:
  - App scale is small, images are tiny, and immediate confirmations are required.

## 11. AI Coding-Agent Guidelines
- Write image optimizer methods that leverage native packages to compress inputs, saving outputs in separate directories.

## 12. Reusable Checklist
- [ ] Images resized and compressed into web-friendly formats (WebP/AVIF)
- [ ] Image tasks offloaded to background worker queues
- [ ] Original source image preserved in private backup directories
- [ ] Native, compiled image libraries (sharp/Pillow) active
- [ ] Image dimension checks block pixel bomb attacks
- [ ] Processed image variants cached at CDN edge locations
