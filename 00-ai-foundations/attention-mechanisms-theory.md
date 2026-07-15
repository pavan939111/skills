# Attention Mechanisms

## 1. Definition & Core Concepts
Attention is a neural network mechanism that dynamically calculates weights for input vectors, allowing models to focus on specific parts of a sequence when processing or generating tokens. Scaled Dot-Product Attention is the core engine of the Transformer.

## 2. Why It Matters for Building AI Products
Attention allows models to connect relationships between distant words in a prompt (e.g. resolving pronouns across paragraphs). It dictates the latency profiles of LLM prefill and generation stages.

## 3. How It Actually Works
- **Query, Key, and Value Vectors:** Each token embedding is projected into three vectors:
  - *Query (Q):* What the token is looking for.
  - *Key (K):* What features the token offers.
  - *Value (V):* The actual information content.
- **Scaled Dot-Product Formula:**
  $$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
- **Softmax Normalization:** Converts raw dot-product scores to probability distributions (summing to 1).
- **Value Aggregation:** Weights the Value vectors by attention probabilities.

## 4. Common Misconceptions
- **Attention matches words exactly:** It operates on dense vector coordinate alignments, matching concepts rather than character patterns.
- **Multi-head attention uses duplicate weights:** Each attention head uses independent, learned projection weights to capture different relationships (e.g., one head tracking grammar, another tracking pronouns).

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **Quadratic Scaling:** Computing attention requires evaluating all token pairs, scaling compute and memory quadratically ($O(N^2)$).
- **Need for KV Caching:** Recomputing attention on every step of token generation is slow, requiring KV caching to maintain low latency.

## 6. Key Terminology Glossary
- **Scaled Dot-Product Attention:** Basic attention algorithm scaling scores by vector dimension square roots.
- **FlashAttention:** Memory-efficient GPU kernel implementation that optimizes SRAM transfers to bypass quadratic memory bottlenecks.
- **Multi-Query Attention (MQA):** Version sharing single Key/Value heads across all Query heads to reduce KV cache size.

## 7. Further Reading / Primary Sources
- *Attention Is All You Need* (Vaswani et al., 2017)
- *FlashAttention* (Dao et al., 2022)

## 8. AI Coding-Agent Guidelines
- **FlashAttention Activation:** Ensure GPU runtimes (e.g. vLLM, TGI) enable FlashAttention kernels to reduce generation times.
- **Model Selection:** Choose models utilizing Grouped-Query Attention (GQA) or Multi-Query Attention (MQA) for long-context generation tasks.
