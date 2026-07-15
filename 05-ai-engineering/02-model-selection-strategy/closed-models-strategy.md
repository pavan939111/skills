# Closed Models

## 1. Definition & Core Concepts
Closed models are proprietary AI models accessed entirely via commercial API endpoints (e.g. OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro). The model weights, training data, and hosting infrastructure are managed by the provider.

## 2. Why It Exists / What Problem It Solves
Closed models provide developers with immediate access to state-of-the-art reasoning capabilities without the need to invest millions in GPU hardware, cluster management, or model training pipelines.

## 3. What Breaks in Production Without It
- **Underpowered reasoning:** Trying to solve complex multi-step reasoning or software coding tasks with small, self-hosted models, leading to high failure rates.
- **Project delays:** Teams spending months trying to deploy and tune open-source weights on Kubernetes instead of delivering features.
- **Resource limits:** Self-hosted infrastructure runs out of VRAM under sudden traffic spikes.

## 4. Best Practices
- **Optimize token consumption:** Truncate unused chat history to prevent rising API costs.
- **Implement request retry jitter:** Always handle API rate limits and network drops with exponential backoff.
- **Enforce API keys rotation:** Store API keys in secure vaults, rotated automatically.

## 5. Common Mistakes / Anti-Patterns
- **Hardcoded API keys:** Committing raw key variables inside source files.
- **Premium models for simple logic:** Routing simple text classifications to premium, high-cost endpoints.

## 6. Security Considerations
- **Data residency risks:** Verify that the commercial provider has policies prohibiting the use of API payloads for model training.

## 7. Performance Considerations
- **TTFT Latency:** Call closest regional endpoints and enable token streaming to improve perceived user latency.

## 8. Scalability Considerations
- **TPM/RPM limits:** Request quota increases from providers before production scale-ups.

## 9. How Major Companies Implement It
- **Duolingo:** Uses GPT-4o via API endpoints to power conversational language roleplay features.
- **Cursor:** Integrates multiple closed APIs (Claude, GPT) to provide contextual codebase completions.

## 10. Decision Checklist (Closed Model Selection)
- Use **Closed Models** when:
  - Task requires state-of-the-art reasoning (e.g., code generation, deep synthesis).
  - Rapid time-to-market is critical.
  - The team lacks GPU infrastructure expertise.
- Avoid **Closed Models** when:
  - Storing highly regulated data that cannot leave local environments.
  - Zero-latency local inference is required.

## 11. AI Coding-Agent Guidelines
- Always implement streaming mode (`stream: true`) for all conversational UI integrations to prevent user interface freezes.

## 12. Reusable Checklist
- [ ] Provider data privacy agreements checked (confirming no API payload training)
- [ ] API keys stored in cloud vaults (rotated automatically)
- [ ] Client SDKs configured with timeouts and backoffs
- [ ] Streaming enabled for user-facing responses
- [ ] Request token limits and fallback models defined
- [ ] Monitoring dashboard set up for token billing alerts
