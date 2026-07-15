# AI Chatbot Template

## 1. Definition & Core Concepts
An AI Chatbot is a general-purpose, conversational template designed to handle multi-turn natural language dialogues, manage session histories, retrieve relevant context, and execute basic tools on behalf of a user.

## 2. Why It Exists / What Problem It Solves
Building a production-ready chatbot requires coordinating session state, token budgets, caching, safety, and streaming. This template provides a standardized architecture to launch chatbots that are fast, cost-efficient, and secure.

## 3. What Breaks in Production Without It
- **Memory Loss:** Chatbots forget user preferences or conversational context mid-session.
- **Runaway Costs:** Unbounded conversation history size leads to exponential token costs.
- **High Latency:** Shipping complete responses at once creates long wait times.

## 4. Best Practices
- **Model Selection:** Use lightweight, fast models (e.g. GPT-4o-mini, Claude 3.5 Haiku) for routine conversation, and route complex reasoning tasks to larger models.
- **Context/Prompt/Knowledge Strategy:** Limit active conversation history to the last 10-15 turns. Summarize older messages and save them in semantic memory. Place the static system prompt at the beginning to enable API provider context caching.
- **Agent/RAG Pattern:** Implement standard RAG to retrieve documentation for user questions, and use a ReAct loop to call simple tools (like user profile lookups).
- **Evaluation:** Grade chatbot interactions using automated judges evaluating tone, formatting compliance, and RAG groundedness.
- **Deployment:** Deploy chat APIs on scalable container platforms with WebSockets or Server-Sent Events (SSE) enabled for streaming.

## 5. Common Mistakes / Anti-Patterns
- **Logging raw context to client:** Sending full internal agent thoughts (Chain of Thought tokens) to the user interface, revealing prompt instructions.
- **Synchronous chat pipelines:** Blocking request event loops during long model calls.

## 6. Security Considerations
- **PII Scrubbing:** Redact customer phone numbers, emails, and tokens from chat inputs before storing logs or sending data to model APIs.

## 7. Performance Considerations
- **Streaming Tokens:** Implement Server-Sent Events (SSE) to render text progressively on client browsers under 200ms.

## 8. Scalability Considerations
- **Session Store Decoupling:** Store active user chat history in fast, distributed memory grids (e.g. Redis) rather than in local application container memories.

## 9. How Major Companies Implement It
- **Slack:** Operates Slack AI chat assistants using isolated workspace context indexing, streaming answers to users with explicit inline document citations.

## 10. Decision Checklist (Architectural Blueprint)
- **Model Selection:** GPT-4o-mini / Claude 3.5 Haiku (Primary) -> GPT-4o / Sonnet (Fallback).
- **Memory Strategy:** Redis session state for active turns -> vector DB database for historical summaries.
- **Retrieval pattern:** Dense vector similarity search with semantic reranker.
- **Delivery mechanism:** Server-Sent Events (SSE) streaming.

## 11. AI Coding-Agent Guidelines
- Write API controllers that fetch chat session profiles from Redis, merge system templates, run model streams, and save updated histories post-generation.

## 12. Reusable Checklist
- [ ] Model selections pinned and routing rules configured
- [ ] Active session history limited to sliding window size (e.g., last 10 turns)
- [ ] Prompt templates structured to leverage provider context caching
- [ ] Server-Sent Events (SSE) configured for streaming response tokens
- [ ] Chat histories stored in distributed memory (Redis) partitioned by session ID
- [ ] PII redaction middleware active on input pipelines
