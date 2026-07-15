# Long-Running Tasks

## 1. Definition & Core Concepts
Long-Running Tasks are AI workflow steps (e.g. processing large files, running multi-agent search loops, fine-tuning adapters) whose execution durations exceed standard HTTP timeout limits ($>30\text{s}$).

## 2. Why It Exists / What Problem It Solves
AI processing takes time. Web servers timeout if requests take too long. Long-running task architectures offload execution to background worker threads, returning task IDs so clients can poll or listen for results.

## 3. What Breaks in Production Without It
- **HTTP Gateway Timeouts:** Web gateways throw HTTP 504 errors because the LLM prompt took 40s to process.
- **VRAM Out of Memory crashes:** Sating server threads under concurrent long queries.
- **Resource starvation:** Long queries block execution pools, slowing down other client requests.

## 4. Best Practices
- **Use Asynchronous Worker Queues:** Offload execution to queue services (e.g. Celery / SQS) with dedicated CPU/GPU nodes.
- **Implement Task Status polling:** Save statuses (`pending`, `processing`, `completed`) to databases, returning task IDs immediately.
- **Use WebSockets or SSE:** Stream progress logs back to the user interface dynamically.

## 5. Common Mistakes / Anti-Patterns
- **Synchronous execution blocks:** Running long LLM loops directly inside web controller endpoints.
- **Unlimited timeouts:** Allowing background tasks to run indefinitely without iteration limiters.

## 6. Security Considerations
- **Boundary checks:** Restrict user parameter injections into long-running tasks contexts.

## 7. Performance Considerations
- **Worker pool sizing:** Scale worker counts based on peak concurrent task projections.

## 8. Scalability Considerations
- **Disk space monitors:** Set alerts for temporary file directories.

## 9. How Major Companies Implement It
- **OpenAI:** Uses asynchronous batch APIs to let users run massive query lists at 50% discount.
- **Midjourney:** Processes image generation prompts in background workers queues, notifying users via Discord.

## 10. Decision Checklist (Execution Models)
- Use **Asynchronous Worker Queues** when:
  - Task execution duration exceeds 10-15 seconds.
  - Task is resource-heavy (e.g., video processing, long RAG sweeps).
- Use **Synchronous API Routes** only when:
  - Task completes under 5 seconds (e.g. simple chatbot replies).

## 11. AI Coding-Agent Guidelines
- Decouple task execution logic from API routes, offloading calculations to background jobs.

## 12. Reusable Checklist
- [ ] Asynchronous worker queue configured (Celery/SQS active)
- [ ] Task status table tracking statuses (`pending`, `completed`, `failed`)
- [ ] Endpoint returns task ID immediately on request submit
- [ ] Task timeouts and iteration counts capped in worker code
- [ ] WebSockets/SSE streaming enabled for progress logs
- [ ] Telemetry metrics monitor worker queue size and processing times
