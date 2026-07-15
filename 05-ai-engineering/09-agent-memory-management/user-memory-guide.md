# User Memory

## 1. Definition & Core Concepts
User Memory is the persistent profile schema that stores user-specific traits, preferences, recurring topics, and past interaction feedback to customize agent behavior across sessions.

## 2. Why It Exists / What Problem It Solves
It enables personalization. Instead of starting from scratch in every session, the agent reads the user memory profile (e.g. knowing that a user prefers JavaScript, has a premium account, or wants concise summaries) to shape its outputs.

## 3. What Breaks in Production Without It
- **Generic User Experiences:** The bot treats long-term returning users like new sign-ups, asking repetitive onboarding questions.
- **Inconsistent Output Quality:** The agent suggests Python answers when the user's codebase is written in Go.
- **Diverging Brand Voices:** Customer support loops fail to respect individual customer preferences.

## 4. Best Practices
- **Implement Profile Extractors:** Use background prompts to extract facts from chat logs, saving them as structured metadata columns.
- **Provide Memory Controls:** Build UI settings screens letting users view, edit, or delete facts stored in their memory profile.
- **Index profiles by user ID:** Restrict memory access using session authentication tokens.

## 5. Common Mistakes / Anti-Patterns
- **Unstructured text files:** Storing user traits as a single, raw text block that is appended to prompts.
- **No privacy safeguards:** Retaining PII (passwords, health details) inside profile memory.

## 6. Security Considerations
- **GDPR Compliance:** Ensure user memory profiles support "forget me" actions, deleting records across all database tables.

## 7. Performance Considerations
- **Lookup Latency:** Store profiles in fast databases (like Redis or DynamoDB) to keep lookups under 10ms.

## 8. Scalability Considerations
- **Profile Size Limits:** Cap profile tags count (e.g., max 50 preferences per user) to control memory footprint.

## 9. How Major Companies Implement It
- **OpenAI:** ChatGPT's memory feature parses chats for facts (e.g. "prefers dark mode"), saving them in a dedicated profile dashboard.
- **Amazon:** Tracks customer preference tags to personalize search recommendations.

## 10. Decision Checklist (Memory Strategy)
- Use **Structured Profile Memory** when:
  - Personalization features require explicit, categorizable tags (e.g., tech stack).
- Avoid **User Profile Memory** when:
  - The application is public-facing and does not require authenticated user logins.

## 11. AI Coding-Agent Guidelines
- Enforce user authentication filters on all profile read and write API endpoints to prevent credential leakage.

## 12. Reusable Checklist
- [ ] User memory profile schema defined and active
- [ ] Background workers extract preferences asynchronously
- [ ] User-facing settings screen allows editing profile memory
- [ ] User authentication guards active on all profile endpoints
- [ ] GDPR-compliant deletion rules implemented
- [ ] Memory profile size limits enforced (max 50 tags per user)
