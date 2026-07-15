# Inference

## 1. Definition & Core Concepts
Inference is the phase where a trained AI model processes prompts and generates tokens. Unlike training (which calculates gradients and updates weights), inference runs the model in forward pass mode to predict the next token.

## 2. Why It Matters for Building AI Products
Inference directly controls the runtime latency, infrastructure cost, throughput capacities, and pricing models of AI applications.

## 3. How It Actually Works
- **Prefill Phase:** The model processes all tokens in the user's prompt in parallel, computing attention states and building the initial Key-Value (KV) cache. (Fast CPU/GPU parallel execution).
- **Decoding Phase:** The model generates tokens auto-regressively, one by one. Each generated token is appended to the KV cache and fed back as input for the next step. (Slow, memory-bandwidth bound).
- **Sampling Parameters:** Controls next token selection:
  - *Temperature:* flattens or sharpens token probabilities (higher temperature increases randomness).
  - *Top-P (Nucleus):* limits choices to the smallest set of tokens whose cumulative probability exceeds P.
  - *Top-K:* limits choices to the K highest-probability tokens.

## 4. Common Misconceptions
- **Inference speed is CPU bound:** LLM decoding phase is bound by memory bandwidth (speed of moving model weights from GPU memory to processors), not computing limits.
- **Batch size 1 is most efficient:** Batching multiple requests allows sharing model weight loads, maximizing GPU utilization.

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **Time-to-First-Token (TTFT):** Prefill processing causes a startup delay on long prompts.
- **Inter-Token Latency:** Generative decoding is limited by physical hardware bandwidth (typically 20-100 tokens/second per model).

## 6. Key Terminology Glossary
- **Auto-regressive:** Generates sequences step-by-step, using previous outputs as inputs.
- **Time-to-First-Token (TTFT):** Duration between request submission and receiving the first generated token.
- **Speculative Decoding:** Running a smaller draft model to generate tokens, then using the target model to validate batches in parallel to save time.

## 7. Further Reading / Primary Sources
- *Continuous Batching in LLM Inference* (Yu et al., 2023)
- *Speculative Decoding* (Leviathan et al., 2022)

## 8. AI Coding-Agent Guidelines
- **Continuous Batching:** Deploy inference engines (vLLM, Hugging Face TGI) supporting continuous batching and PagedAttention to maximize request throughput.
- **Parameter Sizing:** Set temperature to 0 for factual tasks (e.g. RAG, code parsing) to ensure output repeatability.
