# Per-Change Agent Review Checklist

## 1. Purpose
This checklist is used to review additions or updates to agent models, planning nodes, reasoning workflows, available tools, memory configurations, or system controls before deployment.

## 2. Checklist

### Tools & Permissions
- [ ] Tool schemas (parameters and descriptions) match actual function code APIs.
- [ ] Safe parameters validation middleware active on tool arguments.
- [ ] Write-enabled tools require human-in-the-loop (HITL) approval gates.
- [ ] External sandbox environments handle terminal/filesystem tool commands.

### Execution Loop Controls
- [ ] Maximum loop iteration counter (loop breaker) configured to prevent infinite runs.
- [ ] Agent reflection steps contain objective rubrics and stop thresholds.
- [ ] Error feedback channels map exceptions back as observation inputs.

### Memory & State
- [ ] Session memory keys partitioned by verified user token IDs.
- [ ] Memory consolidation scripts run asynchronously out-of-band.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Agent Architecture](../07-autonomous-agent-engineering/agent-architecture-implementation.md)
- [Tool Selection](../07-autonomous-agent-engineering/tool-selection-implementation.md)
- [Agent Monitoring](../15-observability-management/agent-monitoring-strategy.md)
- [Tool-Use Pattern](../19-pattern-implementation/tool-use-pattern.md)

## 4. Sign-off Criteria
The per-change agent review passes when:
1. 100% of checklist validation points are verified.
2. Integration tests verify that agent loops exit cleanly within limits (no infinite loops).
3. Tool execution security audits confirm that agents cannot execute unauthorized commands or read restricted files.
