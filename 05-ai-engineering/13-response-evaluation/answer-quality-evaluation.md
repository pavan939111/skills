# Answer Quality Evaluation

## 1. Definition & Core Concepts
Answer Quality is the multi-dimensional evaluation of model outputs based on criteria including semantic relevance, clarity, conciseness, formatting compliance, and completeness.

## 2. Why It Exists / What Problem It Solves
Traditional metrics (like BLEU/ROUGE) only match character positions, failing to measure the semantic quality of text. Quality evaluations use LLMs as judges to grade completions, aligning outputs with design standards.

## 3. What Breaks in Production Without It
- **Unhelpful Chatbots:** Models return technically correct but long, confusing answers, degrading user experience.
- **Malformed Formats:** JSON blocks miss required fields.
- **Inconsistent Tone:** Customer assistants return informal or hostile text when dealing with complaints.

## 4. Best Practices
- **Define scoring guidelines:** Provide clear rubrics (e.g. 1 to 5 scale) for each quality dimension:
  - *Clarity:* Is the text easy to read?
  - *Completeness:* Did it resolve all parts of the query?
  - *Tone:* Does it match corporate style guidelines?
- **Use consensus voting:** Have multiple judge models grade completions, using the average score.
- **Log ratings telemetry:** Track user feedback (thumbs up/down) in database tables.

## 5. Common Mistakes / Anti-Patterns
- **Evaluating on training inputs:** Testing prompts using the same datasets they were optimized on.
- **Ignoring user edits:** Failing to analyze chat logs where users corrected model outputs.

## 6. Security Considerations
- **PII Scrubbing:** Ensure evaluations logs do not leak PII in traces databases.

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
- Integrate quality evaluation runs in CI pipelines to automate testing on all prompt template updates.

## 12. Reusable Checklist
- [ ] Golden dataset curated (covering success and edge cases)
- [ ] Evaluation criteria defined (quality metrics configured)
- [ ] Judge model configured with scoring guidelines
- [ ] CI pipeline gates configured to block deployments on quality drops
- [ ] Evaluation token costs monitored
- [ ] User feedback corrections added to the golden dataset periodically
