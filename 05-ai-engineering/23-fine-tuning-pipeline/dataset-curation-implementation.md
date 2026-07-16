# Dataset Curation Implementation

> [!NOTE]
> For the mathematical theory of datasets and fine-tuning, see [Fine-Tuning Fundamentals](../../00-ai-foundations/fine-tuning-fundamentals-theory.md).

## 1. Definition & Core Concepts
Dataset Curation is the process of collecting, filtering, parsing, formatting, and deduplicating prompt-response pairs to form high-quality training and validation sets for fine-tuning.

## 2. Why It Exists / What Problem It Solves
"Garbage in, garbage out." Fine-tuning on bad formatting, duplicates, or incorrect answers degrades model capability, whereas curated formatting teaches strict compliance.

## 3. What Breaks in Production Without It
- **Model Collapse:** Training on duplicates causes overfitting and repetitive model outputs.
- **Format Deviations:** The model struggles to output valid JSON formats.

## 4. Best Practices
- Parse data into standardized formatting schemas (e.g., ShareGPT or ChatML).
- Use embeddings similarity checks to locate and remove duplicated data.

## 5. Common Mistakes / Anti-Patterns
- Training on synthetic datasets containing spelling or reasoning errors.

## 6. Security Considerations
- Ensure dataset scrubbers remove PII, auth keys, and customer details before upload.

## 7. Performance Considerations
- Smaller, high-quality instruction datasets (1k-5k rows) frequently outperform massive, low-quality datasets.

## 8. Scalability Considerations
- Automate cleanups using Spark or dataflow pipelines for datasets > 100k records.

## 9. How Major Companies Implement It
- **Meta:** Curates thousands of high-quality examples for LLaMA chat fine-tunings, prioritizing accuracy over volume.

## 10. Decision Checklist (Data Prep)
- Use **Dataset Curation** when:
  - You have verified real-world examples of correct model responses.

## 11. AI Coding-Agent Guidelines
- Always write script filters to remove prompts containing empty returns.

## 12. Reusable Checklist
- [ ] PII data removed
- [ ] Deduplication checks run using embeddings
- [ ] Data conforms to ShareGPT/ChatML formatting specifications
