# Cost Monitoring

## 1. Definition & Core Concepts
Cost Monitoring is the financial tracking and analysis of expenditures incurred by calling external AI APIs (e.g., OpenAI, Anthropic, Gemini) or running self-hosted inference servers. It calculates cost per user query, session, tenant, or model deployment.

## 2. Why It Exists / What Problem It Solves
AI products are highly cost-variable compared to traditional database CRUD applications. A single complex agent run can cost several cents, and high-frequency usage can quickly lead to unprofitable margins. Cost monitoring attributes expenses directly to users or features, allowing companies to ensure unit economic viability.

## 3. What Breaks in Production Without It
- **Runaway API Bills:** A billing alert set at the cloud provider tier triggers only after thousands of dollars are spent, leaving companies with massive bills.
- **Unprofitable Pricing Models:** Launching a flat-rate SaaS subscription without knowing the average cost per user interaction, leading to net losses.
- **Inefficient Model Selection:** Continuously routing simple tasks to expensive models (e.g., GPT-4o) when cheaper models (e.g., GPT-4o-mini) would suffice.

## 4. Best Practices
- **Real-Time Cost Attribution:** Associate every API call with metadata (tenant ID, feature ID, user ID) and translate token consumption directly to dollar costs in real-time.
- **Dynamic Pricing Tables:** Maintain up-to-date model pricing dictionaries (e.g., cost per million input/output tokens) in configuration servers to account for provider price changes.
- **Rate Limiting by Cost:** Throttle or block users whose accumulated query costs exceed their subscription tiers or daily spend thresholds.

## 5. Common Mistakes / Anti-Patterns
- **Ignoring Caching Discounts:** Failing to account for cheaper cached tokens (e.g., Anthropic prompt caching), leading to over-inflated cost tracking.
- **Only Tracking API Calls:** Omitting vector search, text extraction, and self-hosted embedding generation costs when calculating the total cost of ownership (TCO).

## 6. Security Considerations
- **Spend Denial of Service (Spend DoS):** Attackers intentionally spam expensive endpoints to exhaust an enterprise's monthly API credit budget, bringing down the application. Set strict daily spend limits per token/API key.

## 7. Performance Considerations
- **Non-blocking Metrics Collection:** Do not perform real-time pricing calculations or write billing logs on critical path execution threads; queue token data to an async processor.

## 8. Scalability Considerations
- **Multi-region/Multi-provider Consolidation:** Aggregate pricing metrics from multiple API gateways (OpenAI, Vertex AI, Bedrock) into a centralized dashboards system.

## 9. How Major Companies Implement It
- **Duolingo:** Monitors translation and lesson generation costs per user daily. They use custom routing rules to redirect queries to cheaper internal models when a user's daily spend crosses a threshold.

## 10. Decision Checklist (Cost Tracking Architecture)
- Use **API Gateway Logging** when:
  - Aggregating costs globally across multiple services and models without modifying application code.
- Use **In-App Telemetry Middleware** when:
  - Performing fine-grained customer billing or implementing dynamic features (like pausing service when a user's balance runs out).

## 11. AI Coding-Agent Guidelines
- Write wrappers around LLM API clients to attach cost calculators that multiply input and output tokens by current provider pricing constants.

## 12. Reusable Checklist
- [ ] Provider pricing lookup table implemented and maintained in config
- [ ] Real-time cost per request calculated and logged alongside trace data
- [ ] Unit costs attributed to tenant, user ID, and product feature
- [ ] Daily/monthly spend thresholds configured with automated notifications
- [ ] Automated loop-detection logic halts spend on runaway agents
- [ ] Cached token discounts factored into pricing calculations
