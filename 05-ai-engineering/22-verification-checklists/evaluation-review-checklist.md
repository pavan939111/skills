# Per-Change Evaluation Review Checklist

## 1. Purpose
This checklist is used to review evaluation outcomes and metrics after modifying a prompt, RAG parameter, agent tool, or model routing rule. It verifies that changes do not introduce regressions.

## 2. Checklist

### Offline Test Audits
- [ ] Evaluation tests execute using the updated prompt/model configuration.
- [ ] Factual accuracy, groundedness, and relevance scores meet baseline criteria.
- [ ] Test cases run on edge cases, empty outputs, and adversarial injection scenarios.

### Evaluator Calibrations
- [ ] LLM-as-a-judge model versions are locked and verified for consistency.
- [ ] Evaluation parameters (temperature=0, max_tokens) configured for evaluator models.
- [ ] Format compliance test cases assert correct JSON/XML schemas.

### Operations & Telemetry
- [ ] Online evaluation logger sampling rate verified (e.g. 5% sampling).
- [ ] Telemetry channels export evaluation scores to metric dashboards.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Faithfulness Evaluation](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering13-response-evaluation/faithfulness-evaluation.md)
- [Evaluation Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering13-response-evaluation/evaluation-checklist.md)
- [Evaluation Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering21-readiness-audit/evaluation-review-checklist.md)

## 4. Sign-off Criteria
The per-change evaluation review passes when:
1. 100% of checklist validation points are verified.
2. Evaluator results confirm that the new configuration meets or exceeds the baseline performance metrics of the previous stable version.
3. Test pipeline verifies that no evaluation logs leak sensitive patient or enterprise details.
