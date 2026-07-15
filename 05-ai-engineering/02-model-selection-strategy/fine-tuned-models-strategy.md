# Fine-Tuned Models

## 1. Definition & Core Concepts
Fine-tuned models are pre-trained base models whose weights have been updated on specialized datasets to optimize performance for a target style, domain vocabulary, or formatting schema.

## 2. Why It Exists / What Problem It Solves
Base models are generalists. Fine-tuning shapes a model to follow strict instructions, adopt corporate brand voices, use domain terminology (e.g. medical jargon), or output clean JSON schemas without prompt overhead.

## 3. What Breaks in Production Without It
- **Malformed JSON outputs:** Standard models fail to follow output schemas under high concurrency, breaking downstream databases.
- **High prompt token waste:** Sending large system instructions or dozen-shot examples in every API call, inflating token bills.
- **Tone drift:** Customer support chats returning inappropriate responses due to unaligned base models.

## 4. Best Practices
- **Use LoRA/QLoRA adapters:** Update a small subset of weights to save GPU compute costs during training.
- **Curate clean datasets:** Prioritize data quality over size; 1,000 clean examples outperform 10,000 noisy entries.
- **Enforce regression testing:** Validate fine-tuned weights against general benchmarks to check for catastrophic forgetting.

## 5. Common Mistakes / Anti-Patterns
- **Fine-tuning for knowledge retrieval:** Trying to train a model to memorize daily price tables instead of deploying RAG.
- **Ignoring base model updates:** Fine-tuning an outdated base model, missing out on improvements in newer releases.

## 6. Security Considerations
- **Data Poisoning:** Ensure SFT datasets are audited; malicious prompts hidden in training data can compromise model outputs.

## 7. Performance Considerations
- **Cold start delays:** If using dynamic LoRA adapters, configure inference servers to hot-swap adapter weights in VRAM without reboots.

## 8. Scalability Considerations
- **Storage footprints:** Plan disk capacity to store multiple adapter versions.

## 9. How Major Companies Implement It
- **Bloomberg:** Fine-tunes custom models on financial filings datasets to optimize sentiment analysis classification.
- **Warp:** Fine-tunes open-source models on shell command datasets to power terminal suggestions.

## 10. Decision Checklist (Fine-Tuning Triggers)
- Fine-tune a model when:
  - You need to enforce strict output formatting (e.g., JSON schemas) reliably.
  - You need to reduce prompt sizes by eliminating few-shot examples.
  - The task requires a highly specific style or brand voice.
- Avoid fine-tuning when:
  - The feature requires accessing dynamic, changing database records (use RAG instead).

## 11. AI Coding-Agent Guidelines
- Never start a fine-tuning run until you have validated that prompt engineering and RAG cannot solve the problem.

## 12. Reusable Checklist
- [ ] Training dataset verified to be free of duplicate or noisy entries
- [ ] Base model chosen (e.g. Llama-3-8B-Base)
- [ ] LoRA/QLoRA configuration parameters set
- [ ] Training loss convergence monitored
- [ ] Regression evaluation run against baseline benchmarks
- [ ] Dynamic adapter hot-swapping configured on the inference server
