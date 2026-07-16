# LoRA and QLoRA Implementation

> [!NOTE]
> For the mathematical theory of low-rank adaptation, see [Low Rank Adaptations](../../00-ai-foundations/fine-tuning-fundamentals-theory.md).

## 1. Definition & Core Concepts
LoRA (Low-Rank Adaptation) and QLoRA (Quantized Low-Rank Adaptation) are parameter-efficient fine-tuning (PEFT) methods that freeze the base model parameters and inject small trainable rank-decomposition adapters, lowering GPU VRAM footprint.

## 2. Why It Exists / What Problem It Solves
Full parameter fine-tuning requires massive cluster resources. LoRA reduces memory requirements by 90%, and QLoRA quantizes the base model to 4-bit, allowing tuning on single consumer GPUs.

## 3. What Breaks in Production Without It
- **Out of Memory (OOM):** Base training runs crash GPUs during gradient accumulation steps.
- **Prohibitive Budgets:** Full tuning scales infrastructure costs beyond viable budgets.

## 4. Best Practices
- Enforce target modules (e.g., target `q_proj`, `v_proj` inside transformer blocks).
- Set standard ranks (e.g., rank `r = 8` or `r = 16`) to balance adapter capacity.

## 5. Common Mistakes / Anti-Patterns
- Setting learning rates too high, causing gradient explosions.

## 6. Security Considerations
- Restrict file permissions on adapter weight saves to prevent parameter manipulations.

## 7. Performance Considerations
- QLoRA saves GPU memory but increases training step latencies due to quantization steps.

## 8. Scalability Considerations
- Keep adapters decoupled so you can load distinct user adapter weights onto one base model.

## 9. How Major Companies Implement It
- **Hugging Face:** Standardizes QLoRA in TRL (Transformer Reinforcement Learning) pipelines to maximize training yields.

## 10. Decision Checklist (Tuning Options)
- Use **QLoRA** when:
  - Memory capacity is limited (e.g. single 24GB VRAM GPU).
- Use **LoRA** when:
  - Training speed is critical and multi-GPU memory is available.

## 11. AI Coding-Agent Guidelines
- Verify Hugging Face PEFT configs use correct target modules parameters.

## 12. Reusable Checklist
- [ ] Base model loaded in 4-bit (for QLoRA)
- [ ] Target modules list correctly defined
- [ ] Learning rate set to standard PEFT rates (e.g., 2e-4)
