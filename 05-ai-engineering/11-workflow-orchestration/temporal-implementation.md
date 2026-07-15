# Temporal Workflow Orchestration

## 1. Definition & Core Concepts
Temporal is an open-source durable execution platform that enables developers to build highly reliable, stateful, and distributed workflows using code heuristics.

## 2. Why It Exists / What Problem It Solves
AI workflows run over long durations, execute network calls, and call APIs that can fail. Temporal ensures that if a server crash occurs mid-workflow, the workflow automatically resumes from the exact state it left off, avoiding redundant compute.

## 3. What Breaks in Production Without It
- **Memory Loss on Crashes:** A server reboot wipes the memory of an active 10-step agent loop, forcing a restart and wasting API costs.
- **Accidental Repeat Mutations:** Resuming agents rerun write tools twice, creating duplicate transactions.
- **Race conditions:** Concurrent processes updating the same state variables, corrupting logs.

## 4. Best Practices
- **Define Deterministic Workflows:** Ensure workflow code is deterministic (no random values or direct IO in workflows; use Activities for IO).
- **Use Activities for API Calls:** Wrap all LLM and tool calls in Temporal Activities to manage retries and timeouts.
- **Implement Heartbeats:** Configure heartbeats for long-running activities to detect worker crashes.

## 5. Common Mistakes / Anti-Patterns
- **Non-deterministic code in workflows:** Using system dates or random generators directly inside workflow definitions, breaking replay history.
- **Skipping Activity retries:** Allowing transient network drops to crash workflows instead of configuring retries.

## 6. Security Considerations
- **Data Encryption:** Encrypt payloads in transit and at rest when passing data between Temporal servers and workers.

## 7. Performance Considerations
- **Workflow Size Limits:** Keep workflow history sizes under 50,000 events to prevent performance degradation.

## 8. Scalability Considerations
- **Worker pool scaling:** Distribute worker nodes across namespaces.

## 9. How Major Companies Implement It
- **Stripe:** Uses Temporal to manage billing subscriptions and financial transfer workflows.
- **Netflix:** Coordinates media transcoding pipelines using Temporal.

## 10. Decision Checklist (Temporal Setup)
- Use **Temporal** when:
  - Workflows are mission-critical, long-running, and require absolute state durability.
  - Operations involve external APIs that can experience transient failures.
- Avoid **Temporal** when:
  - Target latency is under 50ms (Temporal adds queue overhead).

## 11. AI Coding-Agent Guidelines
- Never place non-deterministic statements (e.g. `Math.random()`) inside workflow definitions; always route these calls to Activity functions.

## 12. Reusable Checklist
- [ ] Workflow code verified to be deterministic (no direct IO)
- [ ] Activities wrap all external API and LLM calls
- [ ] Activity retry policies and timeouts configured
- [ ] Payload data encryption active in transport
- [ ] Heartbeat monitoring active for long-running tasks
- [ ] Replay tests verify workflow execution durability
