# Request Batching

## 1. Definition & Core Concepts
Request Batching is the technique of grouping multiple individual LLM requests together and executing them as a single, combined API transaction. This includes both application-level batching (combining multiple records in one prompt) and vendor-level batching (submitting bulk jobs for asynchronous execution at lower rates).

## 2. Why It Exists / What Problem It Solves
Making individual, synchronous LLM calls for large datasets (e.g. classification, data extraction, or sentiment analysis of millions of records) is extremely slow and expensive. Batching allows developers to amortize network connection overhead, exploit parallel processing architectures, and take advantage of vendor bulk discounts (often 50% cheaper) for non-interactive jobs.

## 3. What Breaks in Production Without It
- **Inefficient Processing:** Attempting to process thousands of database records by looping over synchronous API calls, resulting in multi-hour execution times and rate limit failures.
- **High API costs:** Paying full price for batch analysis tasks that could have been run overnight at a 50% discount using vendor batch endpoints.
- **GPU Underutilization:** For self-hosted models, sending requests one-by-one underutilizes GPU memory bandwidth, leading to low system throughput.

## 4. Best Practices
- **Use Provider Batch APIs:** For non-real-time jobs, use asynchronous batch endpoints (e.g. OpenAI's Batch API) to submit jobs, poll for completion, and retrieve results at a discounted rate.
- **Implement Application Grouping:** Combine multiple independent data inputs into a single prompt payload with structured separators, asking the model to return a structured list of outputs.
- **Dynamic Batching for GPU Inference:** When hosting open-weights models (e.g., via vLLM), enable continuous dynamic batching to automatically group incoming concurrent requests on the fly.

## 5. Common Mistakes / Anti-Patterns
- **Mixing batch and real-time queues:** Processing user-interactive chat messages on the same API queues as background dataset analyses, causing user chat delays.
- **Bloating the context window:** Combining too many items in an application-level batch, causing the model to skip instructions or drop items.

## 6. Security Considerations
- **Data Cross-contamination:** Ensure that batch templates do not mix records belonging to different tenants in a way that allows the model to output tenant A's details in tenant B's response.

## 7. Performance Considerations
- **Response Latency Tradeoff:** Batching introduces a wait time while gathering requests. Optimize batch sizes and timeouts (e.g., maximum batch of 100 items or 500ms wait) to balance throughput and latency.

## 8. Scalability Considerations
- **State tracking:** Implement persistent database queues to track the status (pending, submitted, completed, failed) of large vendor batch jobs, handling network crashes gracefully.

## 9. How Major Companies Implement It
- **Uber:** Processes millions of customer feedback comments daily. Instead of analyzing them in real-time, they queue comments in Kafka and submit hourly batch jobs to OpenAI, saving hundreds of thousands of dollars annually.

## 10. Decision Checklist (Batch Processing Selection)
- Use **Vendor Async Batch API** when:
  - Jobs are background tasks (e.g., daily database updates, translation tasks) that can tolerate completion delays of up to 24 hours.
- Use **In-Memory Application Batching** when:
  - Latency is critical, but grouping several small user requests (e.g., autocomplete queries) increases throughput.

## 11. AI Coding-Agent Guidelines
- Write background task workers that segment large lists of data into batch JSON files, submit them to the model endpoint, and persist the request IDs for polling.

## 12. Reusable Checklist
- [ ] Non-real-time workloads separated from interactive user chat queues
- [ ] Vendor Batch API wrapper implemented with error handling and result polling
- [ ] Application-level batch prompt templates use clear boundary tags
- [ ] Safe batch sizing limits enforced to prevent context overflow
- [ ] Dynamic batching enabled on self-hosted GPU inference engines (vLLM)
- [ ] Persistent queue tracks states of background batch jobs
