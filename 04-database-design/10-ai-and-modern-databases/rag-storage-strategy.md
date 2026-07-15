# RAG Storage (Chat History & Context Schemas)

## 1. Definition & Core Concepts

Retrieval-Augmented Generation (RAG) Storage is the database schema design and auditing practice of storing chat sessions, user message histories, generated LLM answers, token costs, and the exact document chunk references (citations) used as context during queries.

Core RAG storage concepts:
- **Session Table:** Stores metadata for a chat session (user ID, session title, creation date, status).
- **Message Table:** Stores individual conversational turns (role: user/assistant/system, text content, token metrics).
- **Context Citations (Message Context):** A junction table linking a specific assistant message to the exact `document_chunk` records retrieved during the vector search stage, enabling source validation and lineage.
- **Token Auditing:** Storing the exact number of prompt and completion tokens consumed per message to track AI costs.
- **Feedback Loop Storage:** Recording user feedback metrics (`rating: positive/negative`, comments) attached to assistant messages to support model fine-tuning and evaluation.

*(Boundary Note: Code-level LLM API integrations, system prompt templates construction, and frontend chat UI components belong in `backend-development/`. This document covers database-level chat schemas, citation junction tables, token audits, and historical partitioning.)*

## 2. Why It Exists / What Problem It Solves

RAG applications are not stateless. To provide a coherent experience, the application must read prior chat context (history). To audit costs, track security, and provide source citations (e.g., "This answer was generated from Page 12 of the HR Manual"), the database must store the relationships between queries, retrieved source chunks, and generated answers. RAG storage maps these relationships in structured schemas.

## 3. What Breaks in Production Without It

- **Broken Source Citations (Data Drift):** Storing static source text snapshots inside the message logs instead of foreign key references. When the source document is updated, the message logs still display the old text, or references become broken, preventing users from validating answers.
- **Session Bloat (RAM Crashes):** Storing chat history as a single, growing JSON array inside a user profile row. As users chat, the row size swells, saturating database cache memory and slowing down unrelated profile queries.
- **Undetected LLM Token Cost Spikes:** Failing to audit token usage in database tables. A coding loop or attacker triggers runaway API calls, generating thousands of dollars in LLM API bills before the issue is detected.
- **Unsecured Chat History (Tenant Leaks):** Failing to restrict chat session tables using Row-Level Security, allowing users to view the AI chat histories of other customers.

## 4. Best Practices

- **Use a Normalized Relational Schema:** Separate sessions, messages, and contexts into distinct tables to maintain database integrity:
  - `rag_session`: (id [PK], user_id [FK], created_at, tenant_id)
  - `rag_message`: (id [PK], session_id [FK], role [enum], content [text], prompt_tokens [int], completion_tokens [int], created_at)
  - `rag_message_context`: (message_id [FK], chunk_id [FK], similarity_score [float])
- **Map Context via Junction Tables:** Link assistant responses directly to source chunks using `rag_message_context`. This enables displaying source citations in the UI and tracing data lineage.
- **Index Session Keys for Fast Reads:** Create composite indexes on `(session_id, created_at)` in the message table to ensure retrieving chat history for active sessions takes <1ms.
- **Enforce Row-Level Security on Sessions:** Apply RLS on `rag_session` and `rag_message` tables using `tenant_id` or `user_id` context to prevent cross-user data leakage.
- **Audit Token Usage per Message:** Store `prompt_tokens` and `completion_tokens` on every message row, enabling real-time cost tracking and usage rate-limiting.
- **Partition Historical Chat Logs:** If chat volume is high, partition the `rag_message` table by time (e.g., monthly) to allow archiving and dropping old chat history tables easily.

## 5. Common Mistakes / Anti-Patterns

- **JSON Arrays in User Rows:** Storing chat history inline inside user profile rows.
- **Storing Raw Context Texts in Logs:** Storing raw text copies of retrieved chunks in logs instead of referencing chunk IDs.
- **No Token Auditing Columns:** Ignoring token tracking, leaving LLM costs un-audited.
- **Bypassing RLS on Chat Tables:** Failing to isolate user chat logs database-side.

## 6. Security Considerations

- **Auditable Conversational Integrity:** Chat histories can contain sensitive PII or corporate secrets shared by users. Apply database encryption at rest on RAG tables, and configure automated data-retention schedules to purge old chat sessions after a set window.

## 7. Performance Considerations

- **History Load Limits:** When loading chat history to pass to the LLM context window, query the database with a strict limit (e.g., `LIMIT 10` messages) to prevent loading massive text histories into application memory.

## 8. Scalability Considerations

- **Cold Chat Storage Archiving:** As chat logs grow, run background jobs to archive sessions older than 90 days to cold storage tablespaces or S3, keeping active OLTP tables lean.

## 9. How Major Companies Implement It

- **Enterprise AI SaaS Platforms:** Deploy highly normalized relational schemas to track every user query, token cost, model version, and citation link, enabling usage-based billing and security audits.
- **Stripe:** Records AI assistant chat histories and token counts in structured tables, utilizing RLS to ensure customer support chats remain isolated.

## 10. Decision Checklist (RAG Schema Selection)

Enforce RAG database structures:

- Use **Normalized Relational Schemas (Session/Message/Context tables)** when:
  - Auditing, source citations, token tracking, and data integrity are required.
  - Designing production-grade enterprise RAG systems.
- Use **NoSQL Document Stores (DynamoDB/MongoDB)** when:
  - Chat history is treated as a simple, unstructured log list with no relation to other tables.
  - Scale requirements demand simple key-value lookups on session IDs.
- Never use **Inline JSON Arrays** inside:
  - Parent user profile tables.

## 11. AI Coding-Agent Implementation Guidelines

- Never store chat histories inline as JSON arrays inside user tables.
- Always generate structured relational schemas (Session, Message, Context) for RAG applications.
- Always include `prompt_tokens` and `completion_tokens` columns in message table templates.
- Never query chat histories without defining a strict `LIMIT` constraint (e.g. limit to last 10 messages).
- Always enforce Row-Level Security (RLS) on chat session and message tables.

## 12. Reusable Checklist

- [ ] Normalized database schema implemented (Session, Message, Context tables separated)
- [ ] Context junction table links messages to target source `document_chunk` IDs
- [ ] Index configured on `(session_id, created_at)` in the message table
- [ ] Row-Level Security (RLS) active on chat session and message tables
- [ ] Prompt and completion token audit columns present in the message schema
- [ ] Database log queries limit history retrieval to a set number of messages (e.g., last 10)
- [ ] Feedback metrics (`rating`, `comments`) tables configured to link to messages
- [ ] Chat retention policy defined (old logs archived or dropped automatically)
