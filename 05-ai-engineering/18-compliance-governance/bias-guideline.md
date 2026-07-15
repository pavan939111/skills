# Bias Mitigation

## 1. Definition & Core Concepts
Bias Mitigation is the process of identifying, measuring, and reducing systematic, unfair, or discriminatory stereotyping and skewing in AI model inputs, training data, evaluations, and final outputs.

## 2. Why It Exists / What Problem It Solves
LLMs are trained on massive scrapes of the public internet, which contains historical biases, stereotypes, and systemic inequalities. If left unchecked, models will reproduce and amplify these biases (e.g. associating specific professions with particular genders or ethnicities). Bias mitigation applies checks and engineering constraints to ensure fair outputs.

## 3. What Breaks in Production Without It
- **Discriminatory Decisions:** Hiring assistants systematically filter out resumes from certain demographics because of biased historical patterns in training datasets.
- **Brand Reputation damage:** Customer-facing models output offensive stereotypes, generating negative press and public backlash.
- **Regulatory Penalties:** Underwriting engines violate fair-lending laws by offering different loan rates based on demographic factors.

## 4. Best Practices
- **Implement Counterfactual Testing:** Run evaluation tests where demographic variables in prompts (e.g. name, gender indicator) are swapped to verify that outputs remain consistent.
- **Use Balanced Prompt Framing:** Provide system instructions that direct models to analyze scenarios neutrally, avoiding stereotypes.
- **Run Demographic Disparity Metrics:** Calculate statistical parity and equal opportunity metrics on model decisions to audit for disparate impact.

## 5. Common Mistakes / Anti-Patterns
- **Assuming fine-tuning resolves bias:** Believing that instruction-tuning has removed all bias. Base models often retain hidden biases that manifest under specific prompts.
- **Ignoring intersectional bias:** Checking for gender or racial bias in isolation, while missing biased outputs that manifest when demographic factors combine.

## 6. Security Considerations
- **Adversarial bias manipulation:** Attackers use prompt injections to force models to output highly biased or discriminatory content. Implement egress filters to capture toxic outputs.

## 7. Performance Considerations
- **Bias check latency:** Running multi-step bias classifier queries on outputs adds to request durations. Run heavy audits asynchronously, or optimize with lightweight classifier models.

## 8. Scalability Considerations
- **Bias Regression Suites:** Automate counterfactual dataset checks in CI/CD pipelines to ensure prompt updates do not introduce bias regressions.

## 9. How Major Companies Implement It
- **LinkedIn:** Audits AI-assisted recruitment tools using counterfactual evaluation suites, checking that candidate recommendation rates do not skew based on candidate name indicators.

## 10. Decision Checklist (Fairness Benchmarking)
- Enforce **Strict Bias Audits & Parity Checks** when:
  - Designing systems that make critical decisions about individuals (hiring, grading, credit underwriting, criminal justice).
- Enforce **Standard Quality Checks** when:
  - Building general tools like code generation assistants or design mock generators.

## 11. AI Coding-Agent Guidelines
- Write automated test scripts that programmatically swap demographic identifiers in test datasets and assert that outputs remain fair and consistent.

## 12. Reusable Checklist
- [ ] Fairness benchmarks defined for target demographics
- [ ] Counterfactual test cases run to verify output consistency
- [ ] System prompts instruct models to maintain demographic neutrality
- [ ] Egress moderation filters screen and block discriminatory content
- [ ] Decision outcomes audited for statistical parity disparities
- [ ] Fine-tuning dataset composition checked for demographic balance
