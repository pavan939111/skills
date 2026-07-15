# AI SaaS Template

## 1. Definition & Core Concepts
An AI SaaS is an enterprise software-as-a-service template designed to offer multi-tenant AI capabilities, managing user subscription tiers, API key access controls, rate limiting, token usage tracking, and cost management.

## 2. Why It Exists / What Problem It Solves
Building a subscription-based AI product requires managing unit economics. Since API tokens cost money, a SaaS architecture must track token consumption per client, enforce rate limits to prevent system abuse, and secure multi-tenant data boundaries.

## 3. What Breaks in Production Without It
- **Financial Losses:** A free-tier user runs millions of tokens, generating a massive bill for the company.
- **Cross-tenant Data Leaks:** A vector search query returns embedding chunks belonging to another customer company.
- **Service Outages:** A single high-volume user exhausts the system's provider API rate limits, bringing down the service for all customers (noisy neighbor problem).

## 4. Best Practices
- **Model Selection:** Use cheap models (e.g. GPT-4o-mini, Claude 3.5 Haiku) for basic features, and restrict expensive models (e.g. GPT-4o, Claude 3.5 Sonnet) to premium paid tiers.
- **Context/Prompt/Knowledge Strategy:** Inject tenant-specific guidelines and parameters dynamically during prompt assembly. Store tenant-specific vectors in isolated database namespaces.
- **Agent/RAG Pattern:** Use the Router Agent pattern combined with Semantic Caching. The router directs queries to the appropriate tier model, checking cache targets first.
- **Evaluation:** Grade system usage patterns, tracing query response latencies and costs per tenant.
- **Deployment:** Deploy behind an API Gateway (e.g. Kong, Apigee) that manages API keys, enforces rate limits, and routes queries.

## 5. Common Mistakes / Anti-Patterns
- **Flat-rate subscriptions without limits:** Charging a single flat price for unlimited LLM queries, exposing the company to net losses from high-frequency users.
- **Sharing Vector Indices across tenants:** Storing all customer embeddings in a single vector table without filtering queries using strict tenant ID checks.

## 6. Security Considerations
- **Metadata Isolation:** Restrict vector searches using hard metadata filters (e.g., `WHERE tenant_id = 'company_a'`) to prevent cross-tenant leakages.

## 7. Performance Considerations
- **Fast Rate Limiting:** Enforce API token rate limits using fast in-memory key-value stores (e.g. Redis sliding window rate limiters) to keep gateway latencies under 10ms.

## 8. Scalability Considerations
- **Distributed Token Accounting:** Stream token usage records asynchronously to billing processors (e.g., Stripe, Lago) rather than writing them synchronously during requests.

## 9. How Major Companies Implement It
- **Copy.ai:** Operates multi-tenant copywriting SaaS, integrating billing management, seat allocations, custom models, and strict team space boundary controls.

## 10. Decision Checklist (AI SaaS Architecture)
- **Model Selection:** Premium tier (Sonnet / GPT-4o) -> Free tier (Haiku / GPT-4o-mini).
- **Rate Limiting:** Redis-backed token bucket rate limiter at API Gateway.
- **Database Partitioning:** PostgreSQL pgvector with Row-Level Security (RLS) enabled.
- **Billing integration:** Stripe usage-based billing sync.

## 11. AI Coding-Agent Guidelines
- Write middleware that validates API keys, checks subscription usage budgets, routes requests to tier-pinned models, and logs token costs per tenant.

## 12. Reusable Checklist
- [ ] Multi-tenant vector database searches use metadata tenant filters (RLS)
- [ ] Redis rate limiters enforce requests-per-minute limits per API key
- [ ] API costs and token counts tracked and logged per customer organization
- [ ] Model access restrictions configured based on customer tier licenses
- [ ] Usage data synced asynchronously with billing platforms (Stripe)
- [ ] API keys managed and stored securely in hash-encrypted databases
