# Strangler Fig Strategy

### 1. The Question Decided
"How does the system migrate from a legacy monolithic application to a microservices architecture without introducing high-risk big-bang releases?"

### 2. Options Compared
| Dimension | Big-Bang Migration | Strangler Fig (Incremental replace) |
|---|---|---|
| **Downtime Risk** | Extremely High | Low |
| **Development Cost** | High | Medium |
| **Time-to-Value** | Slow (Months/years of dev) | Fast (Single route replacement) |
| **Complexity** | Low | High (Routing proxy required) |

### 3. Decision Rule
- **Standardize on Strangler Fig for legacy migrations:**
  - *If* replacing a legacy monolith, *then* intercept ingress traffic with a routing gateway.
  - Incrementally extract domain modules into independent services, routing traffic to new endpoints while legacy services remain running.

### 4. Red Flags to Revisit
- Data inconsistencies occur because both legacy and new databases write to shared tables without synchronization checks.
- The project becomes a "half-strangled" monolith, leaving developers to maintain two overlapping code platforms indefinitely.

### 5. Where to Go Next
- For service boundaries identification and dependency mapping, see [Service Decomposition Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/04-component-design/service-decomposition-strategy-implementation.md).
