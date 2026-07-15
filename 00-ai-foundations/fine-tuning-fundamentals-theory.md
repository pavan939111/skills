# Fine-Tuning Fundamentals

## 1. Definition & Core Concepts
Fine-tuning is the process of taking a pre-trained base model and training its weights on a smaller, task-specific dataset. It adapts the model's tone, syntax, formatting, and behavioral styles to target specifications.

## 2. Why It Matters for Building AI Products
Fine-tuning allows developers to customize open-source models, reduce inference latency, protect proprietary data boundaries, and format responses reliably (e.g. JSON extraction).

## 3. How It Actually Works
- **Full Fine-Tuning:** Updates all model weight matrices. Requires massive compute resources.
- **Parameter-Efficient Fine-Tuning (PEFT):** Updates only a small set of weights to save compute:
  - *LoRA (Low-Rank Adaptation):* Freezes base model weights and injects small, trainable rank-decomposition matrices.
  - *QLoRA:* Quantizes the base model to 4-bit resolution before running LoRA adapters training.
- **Supervised Fine-Tuning (SFT):** Evaluates models on prompt-response pairs, using cross-entropy loss to update weights.

## 4. Common Misconceptions
- **Fine-tuning injects knowledge:** Fine-tuning adapts formatting, style, and behavior. It is poor at memorizing dynamic facts (use RAG for factual knowledge).
- **Fine-tuning requires millions of records:** High-quality formatting adjustments require only 1,000 to 10,000 clean prompt-response pairs.

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **Catastrophic Forgetting:** Over-tuning a model on specific datasets degrades its general reasoning capabilities.
- **Data Prep Bottleneck:** Preparing high-quality SFT datasets requires rigorous cleaning and validation workflows.

## 6. Key Terminology Glossary
- **Pre-trained Base Model:** Model trained on massive web-scale corpora (e.g., Llama-3-Base).
- **LoRA (Low-Rank Adaptation):** Method updating a tiny fraction of adapter weights.
- **Quantization:** Reducing weight resolution (e.g. 16-bit to 4-bit) to run models on smaller GPUs.

## 7. Further Reading / Primary Sources
- *LoRA: Low-Rank Adaptation of Large Language Models* (Hu et al., 2021)
- *QLoRA: Efficient Finetuning of Quantized LLMs* (Dettmers et al., 2023)

## 8. AI Coding-Agent Guidelines
- **Use RAG for Facts:** Never attempt to fine-tune a model to memorize dynamic databases (use vector databases instead).
- **Evaluate General Ability:** Always test fine-tuned models against general benchmarks to check for catastrophic forgetting.
