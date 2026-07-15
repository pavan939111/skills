# Multimodal Models

## 1. Definition & Core Concepts
Multimodal models are AI models capable of processing and generating combinations of text, image, audio, and video inputs concurrently (e.g. GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, LLaVA).

## 2. Why It Exists / What Problem It Solves
Traditional pipelines require cascading models (e.g., OCR model $\rightarrow$ translation model $\rightarrow$ text model), causing latency, accumulation of errors, and high compute cost. Multimodal models integrate these tasks into a single inference hop.

## 3. What Breaks in Production Without It
- **Slow Pipeline Latency:** Multi-model cascades take seconds, causing timeouts on real-time routes.
- **Lost Context Details:** Separators discard structural details (e.g. table formatting, chart alignments) that multimodal models read natively.
- **Accidental transcription failures:** OCR engines misidentifying skewed characters.

## 4. Best Practices
- **Pre-compress image assets:** Downscale images (e.g., to $512\times512$ or $1024\times1024$) and compress formats before sending payloads to optimize token consumption.
- **Segment video feeds:** Sample video files (e.g., 1 frame per second) instead of uploading raw files.
- **Set prompt guidance:** Clearly instruct the model on the expected reading grid format (e.g. column-by-column vs row-by-row).

## 5. Common Mistakes / Anti-Patterns
- **Uploading massive images:** Sending raw 20MB TIFF images, consuming thousands of context tokens.
- **OCR cascading for simple tables:** Using complex layout libraries when direct image feeds to multimodal models are more reliable.

## 6. Security Considerations
- **Indirect Prompt Injection:** Attackers hide instructions inside images (e.g., white-on-white text) to bypass system filters.

## 7. Performance Considerations
- **Image prefill latency:** Processing images requires high GPU prefill capacities. Cache image vector states if queries are repeated.

## 8. Scalability Considerations
- **Payload size limits:** High-resolution images increase request payload sizes, risking gateway timeouts.

## 9. How Major Companies Implement It
- **Airbnb:** Uses vision models to inspect host room photos against listing attributes to identify safety violations.
- **Uber Eats:** Integrates vision models to transcribe restaurant menu photos into structured JSON files automatically.

## 10. Decision Checklist (Multimodal Selection)
- Use **Multimodal Models** when:
  - Input data includes charts, diagrams, screenshots, or receipts.
  - OCR transcription must preserve layout context.
  - Multi-stage pipelines (e.g. Whisper + LLM) are too slow.
- Avoid **Multimodal Models** when:
  - Inputs are strictly text-only, to prevent extra billing fees.

## 11. AI Coding-Agent Guidelines
- Always implement base64 compression wrappers to minimize image file sizes before sending requests.

## 12. Reusable Checklist
- [ ] Image assets compressed and downscaled before API submission
- [ ] Image tokens cost calculated in transaction margins
- [ ] Multi-stage OCR cascades replaced with single vision model hops where appropriate
- [ ] Security rules active to filter indirect prompt injections in images
- [ ] Video files partitioned into frames snapshots
- [ ] Fallback paths configured to handle malformed image formats
