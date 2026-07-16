# Per-Change Prompt Review Checklist

## 1. Purpose
This checklist is used to review individual prompt template changes before they are committed to code or registries. It ensures that edits do not degrade accuracy, bypass safety settings, break parsers, or violate context caching rules.

## 2. Checklist

### Change Assessment
- [ ] The change is minor copy edits OR major instruction edits. Major changes require running evaluation tests.
- [ ] Variables inserted into prompt brackets are validated to exist in the application code context.
- [ ] Output format guidelines (e.g. JSON schema instructions) match downstream parsing code versions.

### Optimization & Formatting
- [ ] Prompt copy is checked for redundant words to save token cost.
- [ ] XML/Markdown tag delimiters wrap dynamic sections cleanly.
- [ ] Safety constraints (no jailbreaks, brand tone guidelines) are retained and tested.
- [ ] Static portions of the prompt are positioned first to enable context caching.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [System Prompts](../04-prompt-template-management/system-prompts-guide.md)
- Prompt Versioning
- [Prompt Review Checklist](prompt-review-checklist.md)

## 4. Sign-off Criteria
The per-change prompt review passes when:
1. 100% of checklist points are verified.
2. Local tests confirm that the new prompt generates valid schema outputs without syntax or parsing exceptions.
3. Unit tests verify that output semantic evaluations match or exceed baseline quality thresholds.
