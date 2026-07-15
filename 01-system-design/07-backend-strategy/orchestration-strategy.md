# Orchestration Strategy

### 1. The Question Decided
"Should multi-step business workflows be coordinated via central Orchestrators or decoupled Choreography, and how is workflow state tracked?"

### 2. Options Compared
| Dimension | Central Orchestration (State Engine) | Event Choreography (Pub/Sub) |
|---|---|---|
| **Cost (Hosting)** | Medium (Workflow manager node) | Low (Uses standard broker) |
| **Complexity** | High (Central state tracking code) | High (Event spaghetti debugging) |
| **Coupling** | High (Orchestrator imports routes) | Low (Services respond to events) |
| **Visibility** | High (Clear single-path map) | Low (Hard to trace overall flow) |
| **Consistency** | High (Orchestrator drives rollbacks) | Low (Eventually consistent) |

### 3. Decision Rule
- **Choose Orchestration if:** Workflows are highly complex, have strict sequential steps, and require reliable rollback steps (compensations) on failures.
- **Choose Choreography if:** Workflows are simple, and keeping services decoupled is the primary priority.

### 4. Red Flags to Revisit
- Debugging transaction failures requires tracing logs across 5 different services because there is no central tracking log.
- Changing a step in the workflow requires redeploying the orchestrator plus 3 downstream services due to strict payload couplings.

### 5. Where to Go Next
- For implementation details of orchestrator logic, state validation, and transactional workflows, see [Business Logic Orchestration](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development06-business-services/orchestration-strategy-implementation.md).
- For distributed workflow designs, see [Workflow Design Patterns](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/05-data-flow-design/workflow-design-strategy-implementation.md).
