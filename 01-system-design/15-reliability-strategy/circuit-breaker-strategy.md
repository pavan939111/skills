# Circuit Breaker Strategy

### 1. The Question Decided
"Should the network boundaries deploy Circuit Breakers to wrap external integrations, and what failure thresholds isolate connections?"

### 2. Options Compared
| State | Closed (Normal) | Open (Isolating) | Half-Open (Testing) |
|---|---|---|---|
| **Traffic Flow** | Allowed (All requests pass) | Blocked (Fail fast instantly) | Limited (Test requests pass) |
| **Downstream Load**| Normal | Zero (Allows recovery time) | Low |
| **Response Latency**| Dependent on target | Extremely Low (<1ms fallback) | Dependent on target |

### 3. Decision Rule
- **Choose Circuit Breakers if:** Integrating with third-party APIs or remote microservices that can experience outages or latency drops, to prevent blocking server threads.
- **Avoid Circuit Breakers if:** Operations are local and in-process, where network timeouts do not occur.

### 4. Red Flags to Revisit
- A minor latency slowdown in a payment gateway locks up the entire web server node because the system lacks circuit breakers, exhausting the application thread pool.
- The circuit breaker fails to close (reset) after the downstream service recovers because the test window is configured too short.

### 5. Where to Go Next
- For implementing circuit breaker state engines (Resilience4j/Hystrix) and configuring failure thresholds, see Resilience Patterns & Implementations.
