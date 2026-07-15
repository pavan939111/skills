# Auditing AI Systems

## 1. Definition & Core Concepts
Auditing AI Systems is the process of recording, locking, and reviewing a complete history of system inputs, configurations, reasoning steps, tool calls, and final outputs to verify compliance, security, and quality controls.

## 2. Why It Exists / What Problem It Solves
AI systems take actions and make decisions on behalf of users. When an incident occurs (e.g. data breach, unauthorized financial transaction, harmful output generation), organizations must have a complete, tamper-proof record to identify the root cause and prove compliance to external regulators.

## 3. What Breaks in Production Without It
- **Inability to Investigate Incidents:** An agent makes an unauthorized transaction, and developers cannot trace what authorized the call because logs were overwritten or omitted key events.
- **Compliance Failure:** Regulators inspect a credit underwriting tool and find no permanent records of the decision-making rules, resulting in fines.
- **System Tampering:** Attackers gain database access and modify log histories to hide prompt injection attacks.

## 4. Best Practices
- **Immutable Log Storage:** Write audit logs to write-once-read-many (WORM) storage (like AWS S3 Object Lock) to prevent deletion or editing.
- **Log System Configurations:** Capture prompt templates, model version IDs, and vector database schemas alongside user transaction entries.
- **Audit Tool Access:** Record every external API call, database query, and filesystem write initiated by an autonomous agent, linking the action to the parent user session.

## 5. Common Mistakes / Anti-Patterns
- **Logging to standard application files:** Storing audit trails in general log files that are rotated and deleted every 7 days.
- **Omitting configuration references:** Logging user questions and model answers but failing to record which prompt version or system model executed the request.

## 6. Security Considerations
- **Tamper-resistant Hashing:** Calculate cryptographic hashes of audit log segments to verify that historical files have not been modified or replaced.

## 7. Performance Considerations
- **Asynchronous Audit Trails:** Export audit records out-of-band to prevent log serialization steps from increasing user request response times.

## 8. Scalability Considerations
- **Cold Storage Archiving:** Implement automated storage tier policies to compress and archive older audit records to cold storage while retaining fast index queries for recent months.

## 9. How Major Companies Implement It
- **JPMorgan Chase:** Implements immutable compliance logs for all client-facing financial planning models, locking prompt, response, and model version data in audited storage for compliance reviews.

## 10. Decision Checklist (Audit Policy)
- Enforce **Immutable Compliance Auditing** when:
  - Building systems in regulated sectors (healthcare, banking, defense) or those with access to user write permissions.
- Enforce **Standard Event Logging** when:
  - Running low-risk internal search tools or testing environments.

## 11. AI Coding-Agent Guidelines
- Integrate audit logging at the API gateway or agent orchestrator layer to ensure all inputs and downstream tool calls are recorded automatically.

## 12. Reusable Checklist
- [ ] Audit logs written to immutable, write-once storage (WORM)
- [ ] Every log entry links user ID, session ID, model, and prompt version
- [ ] Downstream tool executions and database write actions logged
- [ ] Access controls restrict audit log visibility to compliance officers
- [ ] Data retention periods comply with legal and corporate policies
- [ ] Log verification scripts confirm that historical records are untampered
