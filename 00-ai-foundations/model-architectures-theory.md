# Model Architectures

## 1. Definition & Core Concepts
Model Architecture defines the structural configuration of a Transformer network, including layer connectivity, attention topologies, and gating parameters. The three main classes are Encoder-only (e.g. BERT), Decoder-only (e.g., GPT), and Encoder-Decoder (e.g., T5).

## 2. Why It Matters for Building AI Products
Selecting the right model architecture controls task performance. Encoder models excel at classification and extraction. Decoder models excel at generative completion. Mixture of Experts (MoE) architectures optimize hosting budgets by routing queries to sub-networks.

## 3. How It Actually Works
- **Decoder-Only (Auto-regressive):** Masked attention patterns prevent tokens from looking at future tokens. Optimized for generative text completion.
- **Encoder-Only:** Bi-directional attention allows all tokens to see each other. Optimized for text analysis and embeddings extraction.
- **Mixture of Experts (MoE):**
  - Replaces feed-forward layers with multiple independent "Expert" sub-networks.
  - A routing layer forwards input tokens to the top-2 experts, avoiding activating the entire parameter list.

## 4. Common Misconceptions
- **All LLMs use the same structures:** Models vary in attention patterns (GQA vs MQA), layer normalizations (RMSNorm vs LayerNorm), and activation functions (SwiGLU vs GELU).
- **Larger parameter count always means better:** An 8B parameter model trained on 15T tokens often outperforms a 70B parameter model trained on 1T tokens.

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **MoE Memory footprint:** MoE models require storing all expert weights in VRAM, demanding high GPU capacity even though active compute per query is low.
- **Bi-directional limitations:** Decoder models cannot perform fast, native bidirectional classification tasks (e.g., embeddings extraction) as efficiently as dedicated encoders.

## 6. Key Terminology Glossary
- **Decoder-Only:** Generative architecture reading left-to-right (e.g., Llama).
- **Encoder-Decoder:** Sequentially maps inputs to hidden representations, then decodes them (e.g., Whisper, T5).
- **Mixture of Experts (MoE):** Dynamic gating architecture activating subset expert sub-networks.

## 7. Further Reading / Primary Sources
- *Attention Is All You Need* (Vaswani et al., 2017)
- *Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer* (Shazeer et al., 2017)

## 8. AI Coding-Agent Guidelines
- **Deploy MoE for Speed:** Propose MoE models (e.g. Mixtral) to achieve high-quality output while keeping inference times low.
- **Use Encoders for Embeddings:** Never extract text embeddings using decoder models; deploy dedicated encoder networks (e.g., BERT-variants) instead.
