# LoRA and QLoRA Implementation

> [!NOTE]
> For the mathematical theory of low-rank adaptation, see [Fine-Tuning Fundamentals](../../00-ai-foundations/fine-tuning-fundamentals-theory.md).

## 1. Definition & Core Concepts
LoRA (Low-Rank Adaptation) and QLoRA (Quantized Low-Rank Adaptation) are parameter-efficient fine-tuning (PEFT) methods. They freeze base model parameters and inject small trainable rank-decomposition adapter matrices into attention and linear layers, reducing VRAM memory footprints.

Core parameters:
- **Rank ($r$):** The dimension of the low-rank adapter matrices (typical values: `8`, `16`, `32`, `64`).
- **Scaling Factor ($lpha$):** The scaling constant applied to adapter weights, commonly set to `2 * r`.
- **Target Modules:** The specific weight matrices (e.g. `q_proj`, `v_proj`, `k_proj`, `o_proj`, `gate_proj`) targeted for adapter injections.

## 2. Why It Exists / What Problem It Solves
Full parameter fine-tuning of modern LLMs (e.g. 70B parameters) requires expensive multi-node GPU clusters. LoRA cuts trainable parameters by >99%, and QLoRA quantizes the base model to 4-bit (NF4) while maintaining accuracy, allowing training on single consumer GPUs.

## 3. What Breaks in Production Without It
- **VRAM Out-of-Memory (OOM):** Training runs crash during backward propagation passes due to gradient cache overheads.
- **Slow Development Cycles:** Provisioning and aligning multi-GPU nodes takes days, slowing iteration loops.

## 4. Best Practices
- **Configure Standard Ranks:** Set `r = 16` and `alpha = 32` by default. Raise to `r = 64` only for complex tasks like writing custom programming languages.
- **Target All Linear Modules:** Target all linear layers (`q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`) to maximize model adaptability.
- **Use NF4 Quantization:** Always initialize the base model in 4-bit NormalFloat (NF4) with double quantization active to optimize memory usage:
  ```python
  from transformers import BitsAndBytesConfig
  bnb_config = BitsAndBytesConfig(
      load_in_4bit=True,
      bnb_4bit_quant_type="nf4",
      bnb_4bit_use_double_quant=True
  )
  ```

## 5. Common Mistakes / Anti-Patterns
- **Using default learning rates:** Applying standard full-training learning rates (e.g., 5e-5), which overfits adapters instantly. Use `2e-4` or `1e-4` instead.
- **Tuning only Query/Value projections:** Restricting adapters to `q_proj` and `v_proj` only, reducing the adapter's capacity.

## 6. Security Considerations
- **Adapter Hijacking Safeguards:** Restrict write permissions on saved adapter weights (`adapter_model.bin`) to prevent unauthorized weight overrides.

## 7. Performance Considerations
- **Save Training Time with Unsloth:** Integrate Unsloth library wrappers to speed up LoRA training by 2x to 5x on compatible NVIDIA GPUs.
- **Use FlashAttention-2:** Enforce FlashAttention-2 compilation to accelerate attention computations and reduce VRAM usage.

## 8. Scalability Considerations
- **Hot-Swappable Adapters:** Run multiple tenant-specific LoRA adapters on a single running base model instance at runtime, eliminating the need to host separate base model servers.

## 9. How Major Companies Implement It
- **Hugging Face:** Standardizes LoRA/QLoRA in its PEFT library, serving as the standard workflow for custom model tuning.
- **Anyscale:** Deploys dynamic adapter routing layers to serve thousands of distinct client adapters on shared base LLM servers.

## 10. Decision Checklist (Tuning Options)
- Use **QLoRA (4-bit Base + Adapters)** when:
  - Operating on restricted hardware (e.g., single GPU with 24GB VRAM like RTX 3090/4090).
- Use **LoRA (16-bit Base + Adapters)** when:
  - Training speed is the primary metric and multi-GPU nodes (A100/H100) are available.

## 11. AI Coding-Agent Guidelines
- Programmatically verify that target modules config matching the specific base model architecture (e.g. Mistral vs LLaMA modules).

## 12. Reusable Checklist
- [ ] Base model loaded in 4-bit NF4 with double quantization active
- [ ] Target modules config includes all attention and MLP linear layers
- [ ] PEFT configuration initialized with Rank (r=16) and Alpha (alpha=32)
- [ ] Optimizer configured to 8-bit AdamW (`paged_adamw_8bit`)
- [ ] FlashAttention-2 active in base model loader configs
- [ ] Adapter outputs saved and registered in model directory\n