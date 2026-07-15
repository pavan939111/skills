# Automation Opportunity

## 1. Definition & Core Concepts
Automation Opportunity is the evaluation framework used to identify which workflow steps can be delegated to autonomous AI agents, which require human-in-the-loop review, and which must remain fully automated via code heuristics.

## 2. Why It Exists / What Problem It Solves
AI models make mistakes. Trying to automate high-risk tasks (e.g. executing bank transfers, sending emails to customers) autonomously without human-in-the-loop validation creates business risk. This framework matches tasks to their correct automation tier based on cost, complexity, and error impact.

## 3. What Breaks in Production Without It
- **Critical Data Losses:** Agents delete cloud infrastructure resources during unverified cleanup runs.
- **Accidental Transactions:** AI agents confirm incorrect billing adjustments or trigger double payouts to vendors.
- **Brand Reputation damage:** Automated customer reply pipelines send inappropriate or hallucinated text to clients.

## 4. Best Practices
- **Implement Automation Tiers:**
  - *Tier 1: Fully Autonomous:* Low risk (e.g., generating internal search summaries).
  - *Tier 2: Human-in-the-loop:* Medium risk (e.g., drafting customer responses for human review before sending).
  - *Tier 3: Guardrailed Heuristics:* High risk (e.g. executing transfers via strict code rules).
- **Define clear threshold logs for human escalations.**

## 5. Common Mistakes / Anti-Patterns
- **Autonomous DB mutations:** Allowing AI agents to execute SQL `UPDATE` or `DELETE` statements directly on databases without transaction reviews.
- **Assuming 100% agent success:** Designing loops without timeout escapes or human alert triggers.

## 6. Security Considerations
- **Privilege Limits:** AI agents must execute tasks with restricted API permissions (least privilege).

## 7. Performance Considerations
- **Workflow Latency:** Agent runs requiring human validation must decouple from synchronous API requests (using queues).

## 8. Scalability Considerations
- **Escalation Queues:** Sizing database capacities to handle backlogs of tasks waiting for human review.

## 9. How Major Companies Implement It
- **Stripe:** Restricts automated agent code execution to secure, ephemeral sandboxes; all account balances ledger updates require database-level ACID code.
- **Zendesk:** Uses AI to draft responses, presenting them to support staff for verification before delivery.

## 10. Decision Checklist (Automation Tiers)
- Use **Tier 1 (Fully Autonomous)** when:
  - Error impact is negligible (e.g. search indexing).
  - Task is read-only (no state mutations).
- Use **Tier 2 (Human-in-the-Loop)** when:
  - Task performs mutations (e.g. database updates, emailing users).
- Use **Tier 3 (No AI - Heuristic Only)** when:
  - Task is a financial transaction or security credentials configuration.

## 11. AI Coding-Agent Guidelines
- Never design an agent workflow that can modify database records or call external APIs without implementing a human-in-the-loop approval step.

## 12. Reusable Checklist
- [ ] Task risk categorized (Low / Medium / High)
- [ ] Read-only vs state mutations paths separated
- [ ] Human approval step integrated into all database update routes
- [ ] API keys used by agents configured with least-privilege permissions
- [ ] Alert limits set for agent task failures
- [ ] Sandbox environments configured for dynamic code runs
