# Evaluation Driven Iteration Implementation

> [!NOTE]
> For general response evaluations, see [Response Evaluation](../../05-ai-engineering/13-response-evaluation/index.md).

## 1. Definition & Core Concepts
Evaluation Driven Iteration is the engineering workflow where fine-tuned model versions are evaluated against automated test sets and target domain benchmarks. These metrics drive training adjustments, parameter tweaks, and dataset updates.

Core concepts:
- **Domain Test Suites:** Custom test sets containing prompt inputs paired with expected output formats or correct answers.
- **LLM-as-a-Judge:** Using a highly capable model (e.g. GPT-4, Claude 3.5 Sonnet) to grade model responses against defined criteria.
- **Model Registries:** Storing, versioning, and tracking iteration parameters (loss curves, scores) inside central tools (W&B, MLflow).

## 2. Why It Exists
Looking at training loss curves alone does not tell you how a model will perform in the real world. A model can show low loss but fail to reason or preserve formatting constraints in production due to overfitting.

## 3. What Breaks in Production Without It
- **Catastrophic Forgetting:** The model gains style matching but loses core reasoning or factual capabilities.
- **Formatting Regressions:** A new adapter version introduces syntax bugs, breaking JSON schema parsers.
- **Hallucination Spikes:** Adapters overfit to training examples, emitting hallucinations when encountering novel user inputs.

## 4. Best Practices
- **Use a Held-Out Test Set:** Evaluate accuracy on test data that was completely isolated from the training pipeline.
- **Implement Structured LLM Judging:** Grade completions using structured rubrics, prompting judges to output scores (1-5) along with explanations.
- **Track Iterations in W&B:** Log model loss curves, learning rates, and eval test scores inside Weights & Biases (W&B) for every training run.

## 5. Common Mistakes / Anti-Patterns
- **Evaluating on Training Examples:** Testing model accuracy using prompts that were present in the training dataset, leading to false positives.
- **Ignoring Style Bias in Judges:** Relying on LLM judges without correcting for their preference for longer, verbose responses.

## 6. Security Considerations
- **Isolate Validation Records:** Restrict access to validation test datasets to prevent developers from accidentally including them in training pipelines.

## 7. Performance Considerations
- **Asynchronous Eval Queues:** Offload evaluation runs to background worker queues, preventing training node runs from blocking.

## 8. Scalability Considerations
- **Automate Pipeline Triggers:** Connect evaluation scripts directly to the model registry CI/CD pipeline, automatically running benchmarks on new adapter builds.

## 9. How Major Companies Implement It
- **Anthropic:** Runs extensive safety and capability benchmarks on all custom model weights before deployment.
- **Hugging Face:** Hosts evaluation leaderboards that automate benchmark runs across standard tasks.

## 10. Decision Checklist (Version Release)
- Release **Fine-Tuned Adapter** when:
  - Domain test score exceeds the baseline base model by the target threshold (e.g., >15% accuracy improvement).
  - Standard benchmarks show no regression in general reasoning (MMLU) or formatting compliance.

## 11. AI Coding-Agent Guidelines
- Programmatically capture model evaluation outputs and format results as comparative markdown tables.

## 12. Reusable Checklist
- [ ] Held-out validation test dataset isolated from training pipeline
- [ ] LLM-as-a-judge rubrics and grading templates defined
- [ ] Evaluation iteration logged to model registry (W&B/MLflow)
- [ ] MMLU or comparable reasoning benchmarks included in evaluation runs
- [ ] Test cases verify JSON formatting compliance in model outputs
- [ ] Release thresholds documented and enforced in deployment configurations\n