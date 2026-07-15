# Evaluation Review Checklist

## 1. Purpose
This checklist acts as a production readiness gate to review offline evaluation results, golden dataset coverages, LLM-as-a-judge calibrations, online continuous evaluation metrics, and system safety benchmarks before release.

## 2. Checklist

### Baseline Performance & Datasets
- [ ] Groundedness, faithfulness, and relevance scores meet product target baselines (e.g. Groundedness > 0.95).
- [ ] Golden datasets cover success paths, edge cases, toxic queries, and adversarial prompts.
- [ ] Evaluation datasets verified to contain no training data contamination.

### Judge Calibration & Metrics
- [ ] Automated LLM-as-a-judge prompt templates verified for consistency.
- [ ] Cohen's Kappa checks verify high agreement between automated judges and human evaluations (target > 0.7).
- [ ] Cost and latency of online evaluation judges tracked and throttled.

### Online Continuous Eval Setup
- [ ] Online traffic sampling configured (e.g. 5% target sample rate).
- [ ] Explicit user feedback loops (likes, flags, edits) linked to logging channels.
- [ ] Metrics exported to time-series databases with defined dashboard notifications.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Groundedness Evaluation](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering13-response-evaluation/groundedness-evaluation.md)
- [Golden Dataset](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering13-response-evaluation/golden-dataset-evaluation.md)
- [Continuous Evaluation](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering17-operations-management/continuous-evaluation-implementation.md)
- [Evaluator Agents](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering19-pattern-implementation/evaluator-agent-implementation.md)

## 4. Sign-off Criteria
The evaluation review passes when:
1. 100% of checklist points are verified.
2. Offline evaluation runs verify that the candidate prompt/model release does not decrease groundedness or relevance metrics below historical baselines.
3. Online evaluation sampling workers are verified to parse traffic and write telemetry without blocking client queues.
