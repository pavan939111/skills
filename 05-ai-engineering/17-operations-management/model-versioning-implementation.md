# Model Versioning

## 1. Definition & Core Concepts
Model Versioning is the operational practice of tracking, labeling, pinning, and auditing the specific versions of AI models (both proprietary API endpoints and self-hosted model weights) used across system environments.

## 2. Why It Exists / What Problem It Solves
Model providers continuously update their models (e.g. updating GPT-4o behind a generic endpoint name). These updates can change model reasoning pathways, output formats, and prompt alignment, introducing unexpected regressions. Model versioning ensures reproducibility and consistency by pinning specific model releases and managing transition pathways.

## 3. What Breaks in Production Without It
- **Silent Output Degradation:** A provider updates their default model alias, causing your structured JSON parsers to suddenly break because the new version outputs different schema formatting.
- **Inability to Roll Back:** A new fine-tuned model version is deployed but performs poorly on edge cases, and there is no simple deployment configuration to roll back to the previous version immediately.
- **Auditing Failures:** Regulatory audits cannot verify which exact model weights generated a controversial legal or medical recommendation three months ago.

## 4. Best Practices
- **Pin Explicit Model Versions:** Always use specific dated versions (e.g., `gpt-4o-2024-08-06` instead of `gpt-4o`) in production environment files.
- **Track Weight Hashes:** For self-hosted open-weights models (e.g., LLaMA, Mistral), calculate and lock the SHA-256 hash of the weight files in model registries.
- **Version Fine-Tuned Models:** Treat fine-tuned models as distinct assets. Tag them with a schema indicating base model, training dataset date, and hyperparameter run IDs.

## 5. Common Mistakes / Anti-Patterns
- **Using generic API aliases:** Pointing production code directly to generic aliases like `gpt-4-latest` or `claude-3-opus`, exposing applications to unannounced upstream behavioral changes.
- **Failing to lock embedding models:** Changing embedding models without rebuilding existing vector database indices, which renders all previous search embeddings incompatible.

## 6. Security Considerations
- **Supply chain vulnerabilities:** Verify the authenticity of downloaded model weights by checking signatures against official publisher keys to prevent model-tampering attacks.

## 7. Performance Considerations
- **Cold-start durations:** Transitioning between self-hosted model versions requires downloading new multi-gigabyte weight tensors. Cache model weights locally on GPU nodes to minimize transition delays.

## 8. Scalability Considerations
- **Model Registry integration:** Centralize version definitions in a registry system (e.g., MLflow, Hugging Face Enterprise Hub) to distribute model deployments across global Kubernetes clusters.

## 9. How Major Companies Implement It
- **Spotify:** Configures internal gateways to route model traffic using explicit version strings, verifying that all client queries pass versioned evaluation tests before updating production route pointers.

## 10. Decision Checklist (Model Versioning Tiers)
- Enforce **Strict Version Pinning** when:
  - Working on enterprise APIs, structured output interfaces, and critical customer-facing products.
- Use **Alias/Latest Models** when:
  - Designing local playgrounds, sandbox experimentation scripts, or internal testing suites.

## 11. AI Coding-Agent Guidelines
- Ensure that model identifiers in configuration schemas are strictly checked against a registry of approved, versioned model tags.

## 12. Reusable Checklist
- [ ] Explicitly dated/versioned model names pinned in configuration files
- [ ] SHA-256 weight hashes verified for self-hosted model files
- [ ] Fine-tuned model outputs tagged with training data and parameter run IDs
- [ ] Embedding model version locked and change alerts set on vector tables
- [ ] Model registry system active for tracking active production versions
- [ ] API gateway proxies block generic/unpinned vendor model strings
