# Evaluation Driven Iteration Implementation

> [!NOTE]
> For general response evaluations, see [Response Evaluation](../../05-ai-engineering/13-response-evaluation/index.md).

## 1. Definition & Core Concepts
Evaluation Driven Iteration is the practice of running model weights through automated test suites (e.g. MMLU, custom domain test sets) after training loops to guide fine-tuning changes.

## 2. Why It Exists
Evaluating training metrics (loss curves) is insufficient to verify model behavior. Domain test evaluation suites provide the only verification that capabilities haven't degraded.

## 3. What Breaks in Production Without It
- **Catastrophic Forgetting:** The model gains performance in style adjustments but loses core reasoning capabilities.
- **Regressions:** A new adapter version introduces formatting syntax errors.

## 4. Best Practices
- Run evaluations on a held-out test set that the model never encountered during training.
- Use LLM-as-a-judge patterns to evaluate conversational outputs.

## 5. Common Mistakes / Anti-Patterns
- Evaluating accuracy on training dataset targets, leading to false positives.

## 6. Security Considerations
- Keep validation test sets in separate repositories to prevent leakages into training sets.

## 7. Performance Considerations
- Run evaluation jobs on secondary cost-effective worker GPUs to offload primary clusters.

## 8. Scalability Considerations
- Automate evaluation suite triggers directly inside CI/CD model delivery pipelines.

## 9. How Major Companies Implement It
- **OpenAI:** Requires all fine-tuned custom models to pass standard benchmark metrics before client exposures.

## 10. Decision Checklist (Version Release)
- Release **Fine-Tuned Adapter** when:
  - Benchmark performance outperforms the base model on key tasks without reasoning degradations.

## 11. AI Coding-Agent Guidelines
- Write test loops to log model evaluations directly into registry servers (W&B/MLflow).

## 12. Reusable Checklist
- [ ] Held-out validation test dataset configured
- [ ] LLM-as-a-judge evaluation prompts defined and locked
- [ ] Model registry hooks active to capture performance logs
