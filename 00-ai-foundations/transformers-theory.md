# Transformers

## 1. Definition & Core Concepts
The Transformer is a deep learning architecture introduced by Vaswani et al. in 2017 ("Attention Is All You Need"). It replaced recurrent (RNN) and convolutional (CNN) neural networks as the standard for sequence processing. Its defining characteristic is the reliance on self-attention mechanisms to process all tokens in a sequence concurrently, bypassing sequential processing bottlenecks.

## 2. Why It Matters for Building AI Products
All modern Large Language Models (LLMs) (GPT-4, Claude 3, Llama 3, Gemini) are built on the Transformer architecture. Understanding the architecture explains how models capture context, why context windows are finite, and why memory consumption scales quadratically with sequence length.

## 3. How It Actually Works
- **Token Embeddings:** Text input is converted to numeric vectors representing token meaning.
- **Positional Encoding:** Since Transformers process tokens in parallel, they lack built-in sequence order. Positional sine/cosine vectors are added to token embeddings to preserve relative positions.
- **Self-Attention Layers:** Computes weight scores between all token vectors in a sequence, determining how much focus each token should assign to every other token.
- **Feed-Forward Networks (FFN):** Applies non-linear transformations to each token's represented vector.
- **Layer Normalization & Residual Connections:** Stabilizes training across deep layers.

## 4. Common Misconceptions
- **Transformers process text word-by-word:** They process entire sequences concurrently during training and during prompt input processing (prefill). Word-by-word generation only occurs during auto-regressive decoding (generation).
- **Transformers understand logic like humans:** They are statistical probability engines predicting the next most likely token vector.

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **Context Window Limits:** Self-attention requires computing interaction matrices between all tokens, scaling memory and compute quadratically ($O(N^2)$).
- **GPU RAM (VRAM) Saturation:** Storing Key-Value (KV) cache vectors for long generation sequences consumes massive VRAM, limiting batch sizes.

## 6. Key Terminology Glossary
- **Self-Attention:** Mechanism weighting importance of other sequence tokens relative to the active token.
- **KV Cache:** Storage of previously calculated Key and Value vectors to prevent redundant calculations during step-by-step token generation.
- **Multi-Head Attention:** Splitting vectors into multiple sub-spaces to calculate attention patterns concurrently.

## 7. Further Reading / Primary Sources
- *Attention Is All You Need* (Vaswani et al., 2017)
- *The Illustrated Transformer* (Jay Alammar)

## 8. AI Coding-Agent Implementation Guidelines
- **KV Cache Optimization:** When configuring hosting environments (e.g. vLLM), allocate sufficient VRAM for KV caches to prevent context out-of-memory errors.
- **Batch Sizing:** Optimize batch sizes against target context length scales to prevent GPU memory saturation.
