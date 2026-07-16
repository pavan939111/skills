# Trade-off Decision Matrix

## 1. What Question This Answers
"What is the consolidated, quantitative framework (Decision Matrix) used to weight and score competing architectural choices against active project constraints?"

## 2. Why It Matters at the System-Design Stage
When selecting technology or architecture, engineers often rely on subjective opinions or brand preferences. This leads to misaligned technology choices. A quantitative Decision Matrix provides a transparent, scoring-based framework. By assigning explicit weights to project constraints (e.g. prioritizing cost over scalability for a startup MVP), the matrix calculates a numeric score for each candidate architecture, guiding the team to the objective match.

## 3. Methodology / How to Work Through It
1. **Identify the Architecture Candidates:** List the technologies or patterns being compared.
2. **Define Evaluation Criteria:** Select parameters based on project constraints:
   - e.g., Cost, Latency, Complexity, Scalability, Uptime.
3. **Assign Criteria Weights:** Distribute weights (e.g. out of 10) to reflect active project priorities:
   - e.g. Startup MVP: Cost Weight = 9, Scale Weight = 3.
4. **Score Each Candidate:** Grade candidates from 1 to 5 on each criterion.
5. **Calculate Weighted Scores:**
   $$\text{Weighted Score} = \sum (\text{Grade} \times \text{Weight})$$
6. **Select the Highest Score:** Propose the candidate with the highest aggregate score.

## 4. Inputs Needed
- Project budgets and milestones from Business Constraints.
- Performance budgets.

## 5. Outputs Produced
- Feeds into final technology proposals and design registers.

## 6. Worked Example (Database Selection for Startups)
- **Criteria & Weights:** Cost (Weight: 10), Latency (Weight: 8), Scale Ceiling (Weight: 4).
- **Candidates Evaluation:**
  - *PostgreSQL (Managed):* Cost Grade: 4 (Low cost), Latency Grade: 4 (Fast), Scale Grade: 3 (Moderate).
    - *Score:* $(4 \times 10) + (4 \times 8) + (3 \times 4) = 84$. (Selected).
  - *CockroachDB (Distributed):* Cost Grade: 2 (Expensive), Latency Grade: 3 (Multi-hop), Scale Grade: 5 (Infinite).
    - *Score:* $(2 \times 10) + (3 \times 8) + (5 \times 4) = 64$.

## 7. Common Mistakes
- **Adjusting Weights post-hoc:** Manipulating weights after scoring to force the matrix to select a preferred technology.
- **Ignoring Constraints:** Sizing weights without checking project budgets or timelines.
- **Unquantified Scoring:** Assigning grades based on assumptions rather than documented capacity pings or reference data.

## 8. AI Coding-Agent Guidelines
1. **Audit Project Priorities:** Identify the business weight parameters before evaluating candidates.
2. **Present Scoring Matrices:** Include quantitative tables in all major technology selections.
3. **Produce Decision Matrix Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Quantitative Decision Matrix: [Decision Topic]

### 1. Weighted Decision Matrix
| Evaluation Criteria | Weight (1-10) | Candidate A (e.g. Postgres) | Candidate B (e.g. Cassandra) |
|---|---|---|---|
| **Cost Sizing** | [e.g. 10] | Grade: [e.g. 4] (Score: [40]) | Grade: [e.g. 2] (Score: [20]) |
| **Latency Budget** | [e.g. 8] | Grade: [e.g. 4] (Score: [32]) | Grade: [e.g. 5] (Score: [40]) |
| **Operational Ease** | [e.g. 7] | Grade: [e.g. 5] (Score: [35]) | Grade: [e.g. 2] (Score: [14]) |
| **TOTAL SCORE** | | **[107]** | **[74]** |

### 2. Selection Recommendation
- **Winner:** **Candidate A**
- **Justification:** Optimizes for low cost and operational ease, which are the primary business constraints.
```
