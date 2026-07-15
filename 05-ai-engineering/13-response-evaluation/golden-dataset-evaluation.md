# Golden Dataset

## 1. Definition & Core Concepts
A Golden Dataset is a highly curated, static dataset of representative test cases (prompts, reference contexts, target responses) used to measure model quality.

## 2. Why It Exists / What Problem It Solves
It provides a baseline. When prompts, models, or RAG configurations update, running the new system against the golden dataset identifies regressions.

## 3. What Breaks in Production Without It
- **Silent quality drops:** Prompt updates fix a specific bug but degrade overall output quality, going unnoticed until users complain.
- **Security vulnerabilities:** A prompt change accidentally disables jailbreak protection boundaries.
- **API billing spikes:** Prompt changes increase token usage without improving task accuracy.

## 4. Best Practices
- **Curate a Golden Dataset:** Compile 100+ diverse test cases covering success paths, edge cases, and injection attempts.
- **Use LLM-as-a-Judge:** Deploy a separate, highly capable model (e.g. GPT-4o) to grade test completions on specific criteria:
  - *Faithfulness:* Is the answer derived from the context?
  - *Hallucination:* Does the answer contain unsupported facts?
  - *Relevance:* Does it resolve the user query?
- **Enforce CI/CD Gates:** Block prompt pull requests if evaluation scores drop below baseline targets (e.g. <95% accuracy).

## 5. Common Mistakes / Anti-Patterns
- **Manual Spot Checking:** Reading 5 completions to verify a prompt change, leaving edge cases untested.
- **Evaluating on training inputs:** Testing prompts using the same datasets they were optimized on.

## 6. Security Considerations
- **Red Teaming:** Include adversarial inputs in the evaluation dataset to test prompt defenses.

## 7. Performance Considerations
- **Evaluation costs:** Running batch evaluations on 500 test cases can be expensive. Use smaller judge models or run tests asynchronously.

## 8. Scalability Considerations
- **Dataset growth:** Update the golden dataset with real production failures (user thumbs-down cases) over time.

## 9. How Major Companies Implement It
- **Uber:** Runs automated evaluation suites on all customer support prompts before deploying updates.
- **Duolingo:** Tests lesson-generation prompts against translation benchmarks in automated CI runs.

## 10. Decision Checklist (Evaluation Pipelines)
- Use **Automated LLM-as-a-Judge** when:
  - Task output is open-ended text summaries or chat logs.
- Use **Deterministic Assertions (Regex / JSON Schemas)** when:
  - Task output is structured data (e.g., entity extraction).

## 11. AI Coding-Agent Guidelines
- Integrate prompt evaluation runs in CI pipelines to automate regression testing on all prompt template files.

## 12. Reusable Checklist
- [ ] Golden dataset curated (covering success, edge, and adversarial inputs)
- [ ] Evaluation criteria defined (e.g., faithfulness, semantic similarity)
- [ ] Judge model (LLM-as-a-Judge) configured with scoring guidelines
- [ ] CI pipeline gates configured to block deployments on quality drops
- [ ] Evaluation token costs monitored
- [ ] User feedback corrections added to the golden dataset periodically
