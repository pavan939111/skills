# Dataset Curation Implementation

> [!NOTE]
> For the mathematical theory of datasets and fine-tuning, see [Fine-Tuning Fundamentals](../../00-ai-foundations/fine-tuning-fundamentals-theory.md).

## 1. Definition & Core Concepts
Dataset Curation is the practice of collecting, cleaning, formatting, and validating prompt-response pairs to prepare training datasets for fine-tuning Large Language Models.

Core concepts:
- **Formatting Schemas:** Formatting schemas like ChatML or ShareGPT represent conversation histories.
- **Deduplication:** Locating and removing near-identical instructions using MinHash LSH or embeddings similarity checks.
- **Instruction Quality Filtering:** Filtering out empty completions, code execution failures, or formatting syntax errors.

## 2. Why It Exists / What Problem It Solves
"Garbage in, garbage out." Fine-tuning on unstructured, duplicate, or incorrect responses degrades LLM capabilities, whereas clean formatting teaches model adapters strict compliance, tone consistency, and custom output constraints.

## 3. What Breaks in Production Without It
- **Model Overfitting and Repetition:** Training on duplicate instructions causes model loss values to crash, leading to repetitive token loops during inference.
- **Format Inconsistencies:** The model fails to emit clean JSON, breaking downstream API parsers.
- **Catastrophic Hallucinations:** The model replicates formatting bugs or reasoning errors present in raw training datasets.

## 4. Best Practices
- **Standardize on ChatML Schema:** Format dataset arrays using strict ChatML syntax to prevent system prompt bypasses:
  ```json
  [{"role": "system", "content": "You are a compiler."},
   {"role": "user", "content": "Compiling logic..."},
   {"role": "assistant", "content": "Output..."}]
  ```
- **Apply MinHash LSH Deduplication:** Run deduplication pipelines on text collections to prune examples with Jaccard similarity > 0.8.
- **Configure Quality Validation Filters:** Filter datasets to remove conversations containing low token counts, incomplete statements, or programming syntax errors.

## 5. Common Mistakes / Anti-Patterns
- **Tuning on Unmasked Prompts:** Including prompt inputs in training loss computations, which forces the model to memorize prompts instead of focusing on assistant outputs.
- **Volume Over Quality:** Training on 100,000 unverified conversations instead of curating 1,000 high-quality, verified examples.

## 6. Security Considerations
- **PII Scrubbing:** Scan dataset files using regex libraries or pre-trained classification models (e.g. Microsoft Presidio) to strip names, emails, API keys, and tokens.
- **Context Injection Prevention:** Sanitize datasets to prevent the injection of malicious instruction overrides inside user prompts.

## 7. Performance Considerations
- **Token Packing:** Group multiple short training sequences into a single context window (e.g., 4096 tokens) using packing algorithms to maximize training iterations.
- **Data Loaders Optimization:** Pre-tokenize datasets and store them in memory-mapped format to avoid I/O bottlenecks.

## 8. Scalability Considerations
- **Distributed Ingestion:** Process massive instruction logs (>100k rows) using Spark or Ray Data pipelines before formatting.

## 9. How Major Companies Implement It
- **Meta:** Curated a small, high-quality set of instructions for LLaMA chat fine-tunings, prioritizing accuracy and safety over massive data volumes.
- **Hugging Face:** Publishes dataset curation utilities within the TRL (Transformer Reinforcement Learning) stack, automating prompt template mappings.

## 10. Decision Checklist (Data Prep)
- Use **Instruction Fine-Tuning** when:
  - The model needs to adopt a specific style, layout schema (JSON, DSL), or tone constraint.
- Use **Context Retrieval (RAG)** when:
  - The model needs to access frequently updated factual information.

## 11. AI Coding-Agent Guidelines
- Always write dataset filtering scripts that log discarded samples to verify cleanup quality.

## 12. Reusable Checklist
- [ ] PII data stripped using Presidio or regex boundaries
- [ ] Conversations deduplicated via MinHash LSH (Jaccard threshold < 0.8)
- [ ] Conversations formatted to ChatML schema guidelines
- [ ] Conversations with empty returns or compiler errors purged
- [ ] Sequence token packing active in training configs
- [ ] Held-out validation dataset split verified to not leak into training sets\n