# Architecture Comparison

## 1. What Question This Answers
"How do the candidate architecture styles (Monolith, Modular Monolith, Microservices, Event-Driven) compare across operational cost, implementation latency, complexity, scalability ceilings, and database transactional safety?"

## 2. Why It Matters at the System-Design Stage
Before finalizing technology strategy, the architect must present stakeholders with a comparative analysis of candidate architectures. Each style represents engineering trade-offs: e.g., microservices offer infinite scalability but introduce high latency and complexity; monoliths offer rapid development but have lower scaling ceilings. A structured comparison matrix ensures that choices are balanced against business budgets, timelines, and scaling requirements.

## 3. Methodology / How to Work Through It
1. **Define Comparison Dimensions:** Select key evaluation criteria:
   - *Operational Cost:* Hosting infrastructure and administration overhead.
   - *Implementation Latency:* Time to code, test, and release features.
   - *Complexity:* Network RPC, serialization, and distributed tracing needs.
   - *Scalability Ceiling:* The maximum QPS and data volume limits the style supports.
   - *Transactional Safety:* Ease of maintaining ACID consistency.
2. **Build the Comparison Matrix:** Grade each candidate architecture style across the selected dimensions.
3. **Analyze Trade-offs:** Identify which style best matches active project constraints.

## 4. Inputs Needed
- Project budgets and timelines from [Business Constraints](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/business-constraints-analysis.md).
- Sizing requirements from Capacity Planning.

## 5. Outputs Produced
- Feeds into [Architecture Decision Tree](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/03-architecture-selection/architecture-decision-tree-decision-matrix-strategy-implementation.md) and final design proposals.

## 6. Worked Example (SaaS Startup Comparison Matrix)
- **Monolith:** Low cost, fast delivery, low complexity, low scaling ceiling, high transactional safety.
- **Modular Monolith:** Low-medium cost, fast delivery, low-medium complexity, medium scaling ceiling, high transactional safety. (Selected as the optimal match for the startup's 6-week timeline and $150 budget).
- **Microservices:** High cost, slow delivery, high complexity, high scaling ceiling, low transactional safety.

## 7. Common Mistakes
- **Biased Scoring:** Grading all options positively, failing to identify the real operational costs and network complexities of distributed architectures.
- **Ignoring Constraints in Scores:** Scoring microservices high for a project that has a strict $100/month budget constraint.
- **No Transactional Safety Audits:** Overlooking the complexity of maintaining data consistency when comparing distributed services.

## 8. AI Coding-Agent Guidelines
1. **Build Comparison Matrices:** Always present comparison tables when proposing system designs.
2. **Justify Choice:** Connect the chosen style directly to the active project constraints.
3. **Produce Comparison Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Architectural Trade-off Comparison: [System Name]

### 1. Comparison Matrix
| Dimension | Monolith | Modular Monolith | Microservices | Event-Driven |
|---|---|---|---|---|
| **Operational Cost** | Low | Low-Medium | High | Medium |
| **Implementation Speed** | Very Fast | Fast | Slow | Medium |
| **Network Complexity** | Low | Low | Very High | High |
| **Scale Ceiling** | Low-Medium | Medium-High | Very High | Infinite |
| **Transactional Safety** | High (ACID) | High (ACID) | Low (Saga/Outbox) | Low (Eventual) |

### 2. Analysis & Recommendations
- **Monolith / Modular Monolith:** [e.g. Recommended for the Phase 1 release due to small team size and budget constraints.]
- **Microservices:** [e.g. Deferred. High operational complexity is not justified under current <100 QPS workloads.]
- **Event-Driven:** [e.g., Recommended specifically for secondary billing notification queues, run in-process.]
```
