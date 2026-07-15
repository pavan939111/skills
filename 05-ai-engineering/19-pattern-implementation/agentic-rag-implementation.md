# Agentic RAG

## 1. Definition & Core Concepts
Agentic RAG is an advanced design pattern that wraps a Retrieval-Augmented Generation pipeline inside an autonomous agent reasoning loop. The agent decides whether retrieval is needed, constructs search queries, evaluates the quality of retrieved chunks, refines queries if results are insufficient, and iterates until it resolves the user's intent.

## 2. Why It Exists / What Problem It Solves
Standard RAG is a linear, single-step pipeline (query -> retrieve -> generate). If the initial search query is poor or retrieves irrelevant chunks, the model generates an incorrect or incomplete answer. Agentic RAG adds reasoning and evaluation, allowing the system to self-correct and perform multi-step search investigations.

## 3. What Breaks in Production Without It
- **Incomplete Answers on Complex Queries:** Queries requiring info from multiple sources fail because linear RAG only runs a single vector lookup.
- **Hallucinations on Poor Retrieval:** When vector search returns irrelevant documents, a standard RAG pipeline forces the model to generate an answer anyway, leading to hallucinations.

## 4. Best Practices
- **Implement Query Reformulation:** Train agents to translate complex user questions into multiple distinct search keywords or vector queries.
- **Add Retrieval Evaluators:** Run self-reflection steps (e.g. LLM-as-a-judge checking if retrieved chunks contain the answer) before formatting final answers.
- **Enforce Search Loop Limits:** Set hard limits on search iterations (e.g., max 3 retrievals) to prevent infinite agent reasoning loops.

## 5. Common Mistakes / Anti-Patterns
- **Infinite Search Loops:** The agent continually refines queries and searches vector databases because it cannot find an answer, running up massive token bills.
- **Unstructured Agent States:** Omitting tracing logs for intermediate search iterations, leaving developers unable to debug why search failed.

## 6. Security Considerations
- **Indirect Prompt Injection:** Attackers hide instructions in public vector database documents that tell the agent to ignore grounding rules during retrieval. Implement input sanitization on retrieved text chunks.

## 7. Performance Considerations
- **Latency Accumulation:** Multi-step agent reasoning loops take significantly longer than linear pipelines. Stream intermediate steps and use fast models for evaluation nodes.

## 8. Scalability Considerations
- **Concurrency Rate Limits:** Iterative agent loops increase API query densities. Ensure model rate limits can support sudden spikes in concurrent loops.

## 9. How Major Companies Implement It
- **Cohere:** Deploys Agentic RAG models that choose when to search the web, when to query private databases, and how to synthesize multi-source answers dynamically.

## 10. Decision Checklist (RAG Pattern Selection)
- Use **Agentic RAG** when:
  - Answering comparative questions (e.g. "Compare product X in Q1 with product Y in Q2") that require multiple distinct search executions.
- Use **Standard RAG** when:
  - Answering simple, direct queries where a single vector query satisfies the user request.

## 11. AI Coding-Agent Guidelines
- Write orchestrator graphs where routing nodes check the relevance of retrieved documents and route to search-refinement or generation branches.

## 12. Reusable Checklist
- [ ] Reasoning agent dynamically decides when to invoke retrieval tools
- [ ] Query reformulation nodes decompose complex user questions
- [ ] Retrieval quality judge evaluates relevance of fetched document chunks
- [ ] Maximum loop iteration limit configured to prevent infinite runs
- [ ] Retrieved text chunks sanitized of hidden indirect prompt injections
- [ ] Performance logs track intermediate reasoning steps and tool calls
