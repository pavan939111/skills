# Event Bus Strategy

### 1. The Question Decided
"Should the system deploy a dedicated Event Bus pattern, and how does this validate schemas across microservice boundaries?"

### 2. Options Compared
| Dimension | Central Event Bus (EventBridge) | Direct Queue Connections (Broker) | In-Process Event Bus (EventEmitter) |
|---|---|---|---|
| **Cost** | Medium | Medium | Extremely Low |
| **Routing** | High (Registry-based matching) | Medium (Exchange based) | Low |
| **Consistency**| High (Registry validates schemas) | Low (Payload parsing risk) | High |
| **Complexity** | High | Medium | Low |

### 3. Decision Rule
- **Choose Central Event Bus if:** Designing large-scale microservice architectures where multiple teams build isolated services, and schemas must be validated at a central registry.
- **Choose In-Process Event Bus if:** Building modular monoliths where events are dispatched inside the same application memory thread.

### 4. Red Flags to Revisit
- Code updates crash downstream services because a team deployed breaking changes to event schemas without updating the registry.
- The event bus latency spikes under peak load, delaying secondary async workflow execution.

### 5. Where to Go Next
- For configuring event handlers, serialization, and broker client connections, see [Message Broker Architecture & Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/02-background-jobs-messaging.md).
