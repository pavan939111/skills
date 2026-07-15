# Citation Strategy for RAG

## 1. Definition & Core Concepts
Citation Strategy is the programmatic mechanism that forces LLMs to reference and display the exact source documents, links, or paragraph offsets used to generate their response.

## 2. Why It Exists / What Problem It Solves
LLMs hallucinate. Without citations, users cannot verify the accuracy of the model's claims. Citations build trust by linking assertions directly to source materials.

## 3. What Breaks in Production Without It
- **Untraceable Hallucinations:** The model references incorrect facts (e.g. wrong API routes) and the user has no way to locate the source document to verify.
- **Support Overhead:** Users submit tickets because they cannot find the policy manuals mentioned by the chatbot.
- **Regulatory Penalties:** Deploying medical or financial advisors that output claims without source references.

## 4. Best Practices
- **Implement Source Index Maps:** Assign unique IDs to retrieved chunks and inject them into prompts (e.g. `[Doc 1]`).
- **Enforce Citation Formats:** Instruct the model to cite sources using distinct brackets (e.g. `[Source 1]`) at the end of relevant sentences.
- **Validate citations programmatically:** Strip references from outputs if they do not match the IDs of the retrieved documents.

## 5. Common Mistakes / Anti-Patterns
- **Assuming the model knows source links:** Expecting the model to output accurate URL links from its weights (frequently resulting in broken links).
- **Loose prompts formatting:** Instructing the model to "add sources" without defining the citation schema.

## 6. Security Considerations
- **Excluding restricted sources:** Ensure the model does not cite files the user is unauthorized to read.

## 7. Performance Considerations
- **Metadata sizes:** Keep citation metadata payload sizes small to optimize response speeds.

## 8. Scalability Considerations
- **Index constraints:** Ensure source URLs are stable and do not change frequently.

## 9. How Major Companies Implement It
- **Microsoft:** Displays clickable hover footnotes in Copilot searches linking to source pages.
- **Perplexity:** Embeds inline citation numbers linking to matching search snippet tables below the text.

## 10. Decision Checklist (Citation UI Design)
- Use **Inline Brackets (e.g. [1])** when:
  - Designing reading interfaces where hover details are helpful.
- Use **Footnote Lists** when:
  - Summarizing technical reports or academic studies.

## 11. AI Coding-Agent Guidelines
- Programmatically map source document IDs to the LLM client request context, checking that output citation IDs match the input set.

## 12. Reusable Checklist
- [ ] Source document segments mapped to unique IDs (e.g., `[Source 1]`)
- [ ] Citation instructions and format rules defined in system prompts
- [ ] Output verification script checks that cited IDs exist in the retrieval set
- [ ] Clickable hover links configured in UI components
- [ ] Citation statistics (number of sources cited) monitored
- [ ] Unauthorized source IDs filtered out before prompt assembly
