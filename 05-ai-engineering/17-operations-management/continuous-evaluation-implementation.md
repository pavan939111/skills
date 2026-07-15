# Continuous Evaluation

## 1. Definition & Core Concepts
Continuous Evaluation (often called production monitoring or online evaluation) is the systematic process of continuously measuring the quality, accuracy, safety, and performance of AI system outputs on live production data.

## 2. Why It Exists / What Problem It Solves
AI models are exposed to a changing stream of real-world user queries (data drift). Offline benchmarks and pre-release datasets cannot anticipate all inputs. Continuous evaluation acts as a real-time sanity check, using automated judge models or user feedback signals to identify when output quality declines or safety blocks fail.

## 3. What Breaks in Production Without It
- **Silent Model Drift:** The model's real-world helpfulness degrades over time because user behaviors or backend document schemas shift, without triggering traditional system error logs.
- **Unreported Safety Bypasses:** Malicious jailbreaks or toxic outputs slip past initial guardrails and go unnoticed because there is no retrospective quality audit.
- **Lost Optimization Opportunities:** Developers lack a source of real-world failure cases to guide prompt improvements and dataset curation.

## 4. Best Practices
- **Use LLM-as-a-Judge:** Route a sampled percentage (e.g., 5-10%) of production prompt-response pairs to a high-quality evaluator model (e.g., GPT-4o) to grade grounding, toxicities, or format compliance.
- **Capture Explicit Feedback:** Log user interactions like thumbs up/down, copy-paste actions, or text revisions as evaluation targets.
- **Analyze Implicit Signals:** Monitor metrics like session duration, chat continuation rates, or follow-up corrections to flag potential user frustration.

## 5. Common Mistakes / Anti-Patterns
- **Evaluating 100% of traffic on expensive judges:** Generating massive API bills by running heavy evaluator models on every single production request. Use sampling strategies.
- **Relying solely on user feedback:** Assuming users will regularly provide ratings. Thumbs up/down rates are typically under 2%, which is not representative of overall performance.

## 6. Security Considerations
- **Auditing evaluator models:** Restrict access to evaluation datasets because they contain real production queries, including potential customer PII.

## 7. Performance Considerations
- **Asynchronous Evaluation:** Run online evaluations in background jobs (e.g., via Celery workers or AWS Lambda triggers) to avoid adding latency to user request flows.

## 8. Scalability Considerations
- **Time-Series Metric Aggregation:** Export evaluation scores (e.g. groundedness score, toxicity rate) to time-series databases to track daily and weekly trends.

## 9. How Major Companies Implement It
- **Airbnb:** Monitors translation and booking assistant quality by feeding live conversational samples to specialized evaluation servers, flagging runs with low grounding scores for human review.

## 10. Decision Checklist (Evaluation Methodology)
- Use **Automated LLM-as-a-Judge** when:
  - You need structured, semantic grading (e.g. evaluating faithfulness or relevance) at scale without human intervention.
- Use **Human Audit Review (HITL)** when:
  - Spot-checking flagged high-risk queries, retraining models, or calibrating automated judge models.

## 11. AI Coding-Agent Guidelines
- Write background evaluation scripts that fetch production transaction samples, run evaluation metrics, and write results to observability databases.

## 12. Reusable Checklist
- [ ] Online evaluation pipeline runs asynchronously in the background
- [ ] Representative traffic sampling configured (e.g., 5% of successful requests)
- [ ] LLM-as-a-judge models configured to grade grounding, relevance, and safety
- [ ] Explicit user feedback loops (likes, flags, edits) captured and logged
- [ ] Evaluator logs sanitized of customer PII
- [ ] Evaluation score dashboards integrated with engineering alerting systems
