# User Intent Analysis

## 1. Definition & Core Concepts
User Intent Analysis is the classification of incoming user queries to determine the user's goal (e.g., informational, transactional, navigation, system override) and select the appropriate processing path or tool.

## 2. Why It Exists / What Problem It Solves
Chat interfaces allow users to submit open-ended queries. Intent analysis ensures queries are classified first (e.g., routing support questions to a RAG pipeline, and routing billing requests to Stripe APIs), avoiding running unnecessary resources on general chats.

## 3. What Breaks in Production Without It
- **API Loop Crashes:** Users submit questions about password resets, but the system feeds it to an SQL query generator, causing syntax errors.
- **High Token Waste:** Every user greeting ("Hello!") runs through a heavy RAG index retrieval loop, wasting search capacity.
- **Jailbreak Exposures:** Attackers submit system bypass instructions, which are passed directly to downstream tools without classification checks.

## 4. Best Practices
- **Intent Routing Gate:** Implement a lightweight classification step (e.g. small model or regex classifier) at the system ingress.
- **Intent Fallback Routing:** Define a default general assistant routing path for unclassified inputs.
- **Structured Routing Schemas:** Force intent classifiers to return structured outputs (like enums).

## 5. Common Mistakes / Anti-Patterns
- **Single Prompt Architecture:** Sending all user inputs to a single prompt that attempts to classify, retrieve, and format simultaneously.
- **Ignoring system override inputs:** Passing input strings directly to database tools without checking for exit keywords.

## 6. Security Considerations
- **Prompt Injection Defense:** Intent classification is the primary gate to catch prompt injection attacks (e.g. "ignore previous instructions") before they reach sensitive backend layers.

## 7. Performance Considerations
- **Router Latency:** Use lightweight models (e.g., 8B parameters) or semantic key matches for intent classification to keep response times under 200ms.

## 8. Scalability Considerations
- **Routing bottlenecks:** Cache routing mappings for common queries to bypass classifier runs completely.

## 9. How Major Companies Implement It
- **Intercom:** Screens customer chats with a fast intent classifier; simple help questions are resolved via document lookup, while account changes are routed to customer agents.
- **Salesforce:** Classifies user text inputs to select specific CRM API tools before initiating multi-step workflows.

## 10. Decision Checklist (Intent Routing)
- Use **Lightweight Classifier (Regex / Small Model)** when:
  - Intents are structured and limited (e.g. 5 system commands).
  - Fast response time (<100ms) is required.
- Use **Semantic Vector Matching** when:
  - Query variants are diverse but map to static help articles.

## 11. AI Coding-Agent Guidelines
- Always implement an intent classifier middleware at the beginning of chat controllers before triggering database or external API integrations.

## 12. Reusable Checklist
- [ ] Ingress intent router gate configured
- [ ] Intent classes structured as a strict enum (e.g., RAG, API_Billing, General)
- [ ] Input size capped to prevent buffer injection attacks
- [ ] Safety/jailbreak screening rules active in classifier prompts
- [ ] General chat fallback path defined
- [ ] Classifier latency monitored separate from generation times
