# Prompt Review Checklist

## 1. Purpose
This checklist acts as a production readiness gate to review prompt architectures, template configurations, safety boundaries, context caching alignments, version tracking, and token optimizations before shipping.

## 2. Checklist

### Prompt Optimization & Structure
- [ ] Prompts audited to strip filler words and optimize token density.
- [ ] XML/Markdown tags delimit instructions, context inputs, few-shot examples, and user queries.
- [ ] Core instructions placed at the beginning or end of prompts to prevent model attention drift.
- [ ] Few-shot examples checked for representation diversity and formatting accuracy.

### Versioning & Management
- [ ] Prompt configurations stored in Git repositories or dedicated registries rather than hardcoded in source.
- [ ] Semantic versioning applied to all prompt templates.
- [ ] Active prompts mapped to historical baseline evaluation tests in registry logs.

### Context Caching & Parameters
- [ ] Prompt layout orders static system text and few-shots first to maximize context caching.
- [ ] Hyperparameters (temperature, top_p, presence_penalty) defined and locked per endpoint route.
- [ ] Output response schemas define strict format targets (JSON/XML).

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [System Prompts](../04-prompt-template-management/system-prompts-guide.md)
- [Prompt Optimization](../16-performance-optimization/prompt-optimization.md)
- Prompt Versioning

## 4. Sign-off Criteria
The prompt review passes when:
1. 100% of checklist points are verified.
2. Code review validates that zero prompt strings are hardcoded in application logic files.
3. Regression testing verifies that the target prompt template triggers provider context caching benefits on recurrent request runs.
