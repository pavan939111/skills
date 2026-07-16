# Retry Strategy

### 1. The Question Decided
"How does the system handle temporary network glitches or brief service outages, and what retry intervals and backoff algorithms prevent target system flooding?"

### 2. Options Compared
| Dimension | Immediate Retries | Fixed Interval Retries | Exponential Backoff with Jitter |
|---|---|---|---|
| **API Load Impact** | Extremely High (Thunders herd) | High | Low (Spreads request loads) |
| **Recovery Speed** | Fast (If glitch is tiny) | Medium | Medium-Slow |
| **Complexity** | Low | Low | Medium |
| **Standardization** | Low | Low | Best Match |

### 3. Decision Rule
- **Choose Exponential Backoff with Jitter if:** Retrying network HTTP requests or database connection connections, to prevent client queries from hammering failing servers simultaneously (thundering herd).
- **Avoid Retries if:** Operations are non-idempotent (e.g. charging cards), unless unique transaction idempotency keys are verified.

### 4. Red Flags to Revisit
- A failing downstream API collapses completely when it recovers because thousands of queued retry processes hit it instantly (no jitter).
- System threads hang because API routers retry slow queries repeatedly without checking timeout thresholds.

### 5. Where to Go Next
- For configuring retry middleware, exponential intervals calculations, and jitter rules in code, see Resilience Patterns & Implementations.
- For background task retries, see Background Processing Strategy.
