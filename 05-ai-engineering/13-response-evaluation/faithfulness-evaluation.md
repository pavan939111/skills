# Faithfulness Evaluation

## 1. Definition & Core Concepts
Faithfulness is the evaluation metric measuring the degree to which all claims made in the model's response can be directly inferred from the provided context (no hallucinated details).

## 2. Why It Exists / What Problem It Solves
It quantifies factual consistency. In RAG applications, faithfulness metrics flag responses where the model introduced facts not present in the retrieved chunks, identifying hallucination errors.

## 3. What Breaks in Production Without It
- **Stale details leaks:** Models reference obsolete values not present in active source files.
- **Accidental outages:** Code execution agents output variables configurations that were not verified.
- **Toxicity propagation:** Unverified statements appearing in customer chats.

## 4. Best Practices
- **Use LLM-as-a-Judge:** Deploy a separate evaluator model (like GPT-4) to extract claims from the response and check if each claim is supported by the context.
- **Calculate Faithfulness Scores:**
  $$\text{Faithfulness Score} = \frac{\text{Number of Claims Supported by Context}}{\text{Total Claims Made in Response}}$$
- **Filter responses:** Block or regenerate completions if the faithfulness score falls below 1.0.

## 5. Common Mistakes / Anti-Patterns
- **Evaluating on training inputs:** Testing prompts using the same datasets they were optimized on.
- **Relying on cosine similarity alone:** Using embedding similarity to measure faithfulness, missing semantic differences.

## 6. Security Considerations
- **Override protections:** Block user query attempts to bypass validation checks.

## 7. Performance Considerations
- **Evaluation latency:** Running batch evaluations can be expensive. Run tests asynchronously.

## 8. Scalability Considerations
- **Dataset growth:** Update the golden dataset with real production failures.

## 9. How Major Companies Implement It
- **Uber:** Runs automated evaluation suites on all customer support prompts before deploying updates.
- **Google:** Employs dense retrieval evaluations to verify response alignment.

## 10. Decision Checklist (Evaluation Selection)
- Use **Automated LLM-as-a-Judge** when:
  - Task output is open-ended text summaries or chat logs.
- Use **Deterministic Assertions** when:
  - Task output is structured data.

## 11. AI Coding-Agent Guidelines
- Integrate faithfulness checks in CI pipelines to automate testing on all prompt template updates.

## 12. Reusable Checklist
- [ ] Golden dataset curated (covering success and edge cases)
- [ ] Evaluation criteria defined (faithfulness metrics configured)
- [ ] Judge model configured with scoring guidelines
- [ ] CI pipeline gates configured to block deployments on quality drops
- [ ] Evaluation token costs monitored
- [ ] User feedback corrections added to the golden dataset periodically
