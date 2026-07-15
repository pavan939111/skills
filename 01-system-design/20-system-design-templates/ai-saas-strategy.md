# AI SaaS System Design Template

## 1. Target Product Shape
Generative AI assistant or agent platform managing user subscription billing, prompt history, vector semantic search, and LLM API integrations.

## 2. Requirements Analysis
- **Functional:** Process billing plans, log prompt chat history, perform vector semantic search, stream LLM completions.
- **Non-Functional:** Low LLM stream response latency (using Server-Sent Events), token usage logging, semantic cache lookups.

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Active Users: 50,000 daily queries.
  - Average Prompt Size: 1,000 tokens input, 500 tokens output.
- **Sizing Math:**
  - *Vector Dimensions:* 1536 (OpenAI text-embedding-3).
  - *Embedding storage:* 50,000 vectors/day $\times 6.1\text{ KB/vector} \approx 305\text{ MB/day}$ vector database growth.

## 4. Selected Architecture & Components
- **Architecture Style:** Stateless API layer with async streaming and vector adapters.
- **Core Components:**
  - Semantic Cache Gateway (queries Redis to bypass LLM calls).
  - Completion Streamer (coordinates SSE HTTP connections to browser).
  - Billing Manager (tracks customer token usage).

## 5. Technology Selection Strategy
- **Primary Database:** PostgreSQL with pgvector (stores prompts and vector embeddings).
- **Cache:** Redis (stores prompt completions for exact matches, session logs).
- **Streaming Protocol:** Server-Sent Events (SSE) (handles unidirectional text streaming).

## 6. Critical Trade-offs
- **Lightweight vs. Heavy LLM Models:** Uses lightweight models (gpt-4o-mini) for routing queries and semantic cache matches, offloading heavy reasoning to premium models to save API budget.
- **Vector database partition:** pgvector runs on the primary RDS instance to allow metadata joins, accepting database CPU overhead.

## 7. Reusable Design Checklist
```markdown
- [ ] LLM text completions streamed to client browsers using Server-Sent Events.
- [ ] Semantic query caches configured in Redis to reduce API costs.
- [ ] Token usage logging written to asynchronous outbox tables to prevent blocking queries.
```
