# Agent Engineering Checklist

## 1. Definition & Core Concepts
The Agent Engineering Checklist is the validation tool used to confirm that agent architectures, planning cycles, reasoning loops, self-correction rules, tool validations, and state checkpointing are properly configured before release.

## 2. Why It Exists / What Problem It Solves
It ensures that autonomous systems are deployed with cost limits, safety boundaries, error handlers, and state management.

## 3. What Breaks in Production Without It
- **Runaway API Bills:** Staging loops get stuck in infinite execution steps.
- **Accidental State Deletions:** Un-sandboxed tools modify production database directories.
- **System Memory Crashes:** In-memory states fail during server reboots.

## 4. Best Practices
- **Run the checklist during architectural reviews:** Verify loop limits.
- **Verify data integrity checkouts:** Ensure checkpoints are active.
- **Validate permissions limits:** Check sandbox permissions.

## 5. Common Mistakes / Anti-Patterns
- **Relying on in-memory history:** Skipping state persistency.
- **Skipping tools validation:** Sending malformed parameters to APIs.

## 6. Security Considerations
- **Sandboxed Execution:** Verify sandbox constraints are active on all command tools.

## 7. Performance Considerations
- **Parallel processing validations:** Ensure independent sub-tasks run in parallel.

## 8. Scalability Considerations
- **Compute Sizing:** Distribute task loads across worker pools.

## 9. How Major Companies Implement It
- **Microsoft:** Requires Copilot development teams to complete safety checklists before launch.
- **Google:** Enforces security-readiness gates on all automated workflow scripts.

## 10. Decision Checklist (Pipeline Validation)
- Use **Agent Validation Checklist** when:
  - Deploying new agent loops, function schemas, or planning configurations.

## 11. AI Coding-Agent Guidelines
- Review the agent engineering checklist to confirm formatting and exception parameters are verified.

## 12. Reusable Checklist
- [ ] Maximum loop iteration limit configured (default: max 10 steps)
- [ ] Safe, ephemeral sandbox environment configured for tool execution
- [ ] Step checkpoints persisted in out-of-process databases (Postgres/Redis)
- [ ] Detailed stack traces captured and returned to self-correction prompts
- [ ] Task dependency graphs mapped correctly (DAG validations)
- [ ] Tool parameters validated against JSON schemas in code
- [ ] Loop durations and token consumption logged to telemetry
- [ ] Row locks prevent concurrent run collisions
