# Choreography vs. Orchestration Strategy

### 1. The Question Decided
"Should asynchronous multi-service workflows be managed via central command coordinators (Orchestration) or distributed event subscriptions (Choreography)?"

### 2. Options Compared
| Dimension | Orchestration (Central Controller) | Choreography (Distributed Events) |
|---|---|---|
| **Coupling** | High (Orchestrator imports routes) | Extremely Low |
| **Visibility** | High (State machine logs) | Low (Tracing required) |
| **Complexity** | High | High |
| **Cycle Risk** | Zero | High (Loop triggers risk) |

### 3. Decision Rule
- **Choose Orchestration if:** Workflows are complex, require strict execution sequences, have state transitions, or require centralized error compensation (e.g. user shopping checkouts).
- **Choose Choreography if:** Workflows are simple, and keeping services decoupled is the priority (e.g., publishing `user.created` event triggers independent analytics updates).

### 4. Red Flags to Revisit
- Workflows trigger infinite event loops because choreographing services publish recursive update events.
- System changes require updating multiple choreographer microservices, violating domain isolation.

### 5. Where to Go Next
- For orchestrator engines, state machine configurations, and service wrappers, see Backend Orchestration Strategy.
- For database saga transaction tables, see Saga Database Design.
