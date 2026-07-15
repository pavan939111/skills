# Dead Letter Queue (DLQ) Strategy

### 1. The Question Decided
"How does the system isolate and handle failed messages, and what retry thresholds trigger routing to a Dead Letter Queue (DLQ)?"

### 2. Options Compared
| Dimension | Immediate DLQ Route | Retries with Exponential Backoff | Infinite Loop Retries |
|---|---|---|---|
| **Cost** | Low | Medium | High (Exhausts resources) |
| **Data Loss Risk**| Low (Inspected in DLQ) | Low | Low |
| **System Safety** | High | High | Low (Blocks queue execution) |
| **Complexity** | Low | Medium | Low |

### 3. Decision Rule
- **Standardize on Retries + DLQ flow:**
  - *If* message processing fails due to transient error (e.g. database lock), *then* retry 3 times with exponential backoff.
  - *If* retries are exhausted or error is non-transient (e.g., malformed JSON payload), *then* isolate the message in a dedicated DLQ immediately and trigger alerting.

### 4. Red Flags to Revisit
- A single poisoned-pill message (malformed payload) crashes the consumer service repeatedly, blocking all subsequent messages in the queue (head-of-line blocking).
- Messages pile up in the DLQ unnoticed because there are no automated alerts for DLQ ingestion rates.

### 5. Where to Go Next
- For configuring DLQ routing parameters, redrive policies, and retry counts, see [Message Broker Architecture & Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/02-background-jobs-messaging.md).
