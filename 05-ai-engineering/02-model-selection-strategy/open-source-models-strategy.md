# Open-Source Models

## 1. Definition & Core Concepts
Open-source models (or open-weights models) are AI models whose weights are publicly released, allowing teams to host, modify, and fine-tune them on private infrastructure (e.g. Meta Llama 3, Mistral Mixtral, Google Gemma).

## 2. Why It Exists / What Problem It Solves
Open-weights models eliminate dependencies on third-party APIs. They allow full data privacy, custom hosting optimizations, offline execution, and targeted fine-tuning, drastically cutting cost at high scale.

## 3. What Breaks in Production Without It
- **Compliance Violations:** Sending regulated patient data or financial ledgers to third-party endpoints, triggering regulatory audits.
- **Uncapped API costs:** Running high-volume query tasks (millions of requests/day) on closed APIs, creating unsustainable bills.
- **Service outages:** External provider downtime breaks the application's core functionality.

## 4. Best Practices
- **Use dedicated inference servers:** Deploy weights on engines like vLLM, Ollama, or Hugging Face TGI to optimize throughput via continuous batching.
- **Apply quantization:** Run models in 4-bit or 8-bit quantized formats (AWQ, GPTQ) to double speed and halve VRAM requirements.
- **Enforce non-root execution:** Secure inference containers.

## 5. Common Mistakes / Anti-Patterns
- **Unquantized deployment:** Deploying raw FP16 weights on expensive GPUs when quantized formats offer the same quality at a fraction of the cost.
- **Under-provisioning GPU RAM:** Hosting weights without leaving memory margins for KV caches, causing out-of-memory crashes under load.

## 6. Security Considerations
- **Model Poisoning:** Download weights only from trusted, verified repositories (like official Hugging Face organization cards) to prevent malicious code execution.

## 7. Performance Considerations
- **PagedAttention:** Ensure the inference server uses PagedAttention to prevent VRAM fragmentation during generation loops.

## 8. Scalability Considerations
- **Cold start delays:** Open-source models take minutes to load weights into VRAM. Use warm standby replicas.

## 9. How Major Companies Implement It
- **Brave Browser:** Hosts Llama and Mistral models internally to power privacy-respecting search and chat features.
- **Uber:** Fine-tunes and runs open-source models in private data centers to extract details from driver reports.

## 10. Decision Checklist (Open-Source Selection)
- Use **Open-Source Models** when:
  - Strict compliance dictates that data must not leave private subnets.
  - Query volume is extremely high, and self-hosting is cheaper than API costs.
  - Advanced fine-tuning on custom domains is required.
- Avoid **Open-Source Models** when:
  - The team has no GPU/Kubernetes DevOps engineering capacity.
  - The feature requires largest scale frontier model reasoning.

## 11. AI Coding-Agent Guidelines
- Configure open-source models using standard OpenAI-compatible endpoints (like vLLM) to make switching between providers simple.

## 12. Reusable Checklist
- [ ] Model weights sourced from official, verified repositories
- [ ] Quantization (AWQ/GPTQ) enabled to reduce memory footprints
- [ ] Inference server (vLLM/TGI) deployed with continuous batching active
- [ ] GPU RAM allocations leave 20% safety margin for KV cache
- [ ] Non-root execution active inside Docker containers
- [ ] Model server metrics (requests latency, token rate) linked to observability
