# Memory Agents

## 1. Definition & Core Concepts
A Memory Agent is a specialized agent designed to manage, store, retrieve, update, and prune long-term user preferences, conversation context, and fact databases across sessions.

## 2. Why It Exists / What Problem It Solves
Standard conversation context windows forget everything when a session restarts. While databases store raw transcripts, they do not synthesize user habits, explicit requests, or facts. Memory agents act as background processors that identify memorable statements, consolidate them into structured profiles, and fetch them when relevant.

## 3. What Breaks in Production Without It
- **Repetitive User Onboarding:** Users must repeat their preferences, formatting styles, and data structures in every new chat session, leading to frustration.
- **Irrelevant Recommendations:** The system suggests items or code patterns that contradict previously stated user requirements.
- **Context Bloat:** Appending raw historical chat transcripts to the prompt, which exhausts token limits and confuses the model.

## 4. Best Practices
- **Implement Read/Write Separation:** Decouple memory writing (analyzing dialogue to extract facts) from the live conversation path, executing writes asynchronously.
- **Categorize Memories:** Group memories into distinct layers: user preferences (e.g. "prefers Python"), episodic facts ("user is building an e-commerce app"), and global knowledge.
- **Implement Semantic Recall:** Query the memory vector database using the user's current query to retrieve only the 3-5 most semantically relevant memories to insert into the prompt.

## 5. Common Mistakes / Anti-Patterns
- **Storing duplicate memories:** Adding variations of the same preference to the database without deduplicating or updating the existing record.
- **Caching raw conversational fluff:** Logging casual exchanges (e.g. "hello", "thanks") instead of meaningful preferences or factual updates.

## 6. Security Considerations
- **PII and Sensitive Data Protections:** User memories can contain highly personal details. Implement strict encryption at rest and provide explicit deletion interfaces for compliance.

## 7. Performance Considerations
- **Asynchronous Memory Extraction:** Run memory extraction prompts in background worker threads (e.g., after a chat session completes) to avoid adding latency to active conversational exchanges.

## 8. Scalability Considerations
- **Hierarchical Memory Summarization:** Summarize older episodic memories into high-level user profile summaries to reduce the size of the database.

## 9. How Major Companies Implement It
- **OpenAI (ChatGPT Memory):** Evaluates user chat messages in the background to detect explicit preference statements (e.g., "I have a dog named Max"), updates a structured memory profile, and alerts the user when new memories are saved.

## 10. Decision Checklist (Memory Lifecycle)
- Save to **Long-Term Memory** when:
  - Statements contain enduring user preferences, operational guidelines, or structural project specifications.
- Keep in **Short-Term Context** when:
  - Information is temporary or specific only to the current conversation turn.

## 11. AI Coding-Agent Guidelines
- Write background task controllers that parse conversation turns, extract key-value facts, and upsert them to a vector memory database.

## 12. Reusable Checklist
- [ ] Memory extraction prompts run asynchronously post-session
- [ ] Stored memories deduplicated and consolidated periodically
- [ ] Memory categories separate user preferences from transient facts
- [ ] Semantic search queries memory vectors to inject relevant context
- [ ] User UI provides settings to view, edit, and delete memories
- [ ] PII data encrypted and access-controlled in memory tables
