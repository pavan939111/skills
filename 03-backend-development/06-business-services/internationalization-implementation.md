# Internationalization Implementation

## 1. Definition & Core Concepts
Internationalization (often abbreviated as i18n) is the engineering practice of structuring an application's codebase to support multiple languages, regional formats (date/time, currency), and localized constraints dynamically without altering source code logic.

Key concepts:
- **Locale:** The identifier representing the user's language and region (e.g. `en-US` or `de-DE`).
- **Translation Resource Bundles:** Structured files (JSON, YAML, Gettext PO) that map lookup keys to language-specific string templates.
- **Interpolation:** Dynamically injecting variables (e.g., names or numbers) into localized strings at runtime.

## 2. Why It Exists / What Problem It Solves
It ensures that applications can scale globally. Hardcoding text strings or currency formatting patterns inside backend routes lock the software to a single language or region, requiring massive manual code refactoring to enter new international markets.

## 3. What Breaks in Production Without It
- **Layout Overflow:** Translating short English labels to longer languages (e.g., German) breaks UI boundaries if the backend returns static, rigid text.
- **Financial Compliance Audits:** Formatting currencies or dates incorrectly (such as confusing MDY and DMY layouts) leads to accounting errors and reporting failures.
- **User Experience Degradation:** Users see untranslated error messages or hardcoded templates, reducing retention rates in target markets.

## 4. Best Practices
- **Accept-Language Header Detection:** Resolve client locales dynamically from HTTP `Accept-Language` headers, falling back to database profiles or configuration defaults.
- **Use ICU Message Formatting:** Standardize on the ICU MessageFormat syntax to support pluralization rules and gender agreements correctly.
- **Enforce UTC Storage:** Store all dates and times in UTC, leaving localized offset conversions to rendering boundaries.

## 5. Common Mistakes / Anti-Patterns
- **Hardcoding Language Strings:** Leaving plaintext text literals inside backend controller error responses.
- **String Concatenation for Translation:** Building localized sentences by concatenating translated sub-phrases, which breaks grammar structure in other languages.
- **No Fallback Locales:** Crashing application threads when a translation lookup key is missing for a requested language.

## 6. Security Considerations
- **Injection Attacks via Interpolation:** Ensure variables injected into translation bundles are sanitized to prevent XSS or SQL injections, especially if rendering templates.
- **Locale Path Sanitization:** If translation files are loaded dynamically from file storage based on input locale strings, validate the input to prevent path traversal attacks (`../../locale.json`).

## 7. Performance Considerations
- **Resource Bundle Caching:** Load and cache translation files in memory at startup. Avoid reading JSON files from disk during active API requests.
- **Minimize Payload Size:** Only return translation payloads required for the active user context, avoiding downloading whole language grids.

## 8. Scalability Considerations
- **External Translation Registry:** Store and coordinate translations using centralized services (e.g. Phrase, Crowdin) to decouple translation updates from core backend deployment pipelines.

## 9. How Major Companies Implement It
- **Airbnb:** Employs localized platforms that dynamically serve translation keys to both frontend and backend microservices, allowing content creators to update copy instantly.
- **Netflix:** Enforces strict localization tooling, supporting thousands of language variants and managing complex subtitle alignment databases.

## 10. Decision Checklist (I18n Architecture)
- Use **Backend i18n Resolution** when:
  - Returning localized error messages, transactional email templates, PDF invoices, or SMS notifications.
- Use **Frontend i18n Resolution** when:
  - Translating static UI elements, page headers, navigation bars, and buttons.

## 11. AI Coding-Agent Guidelines
- Write service classes that accept a translation gateway dependency, executing string lookups using locale codes retrieved from request contexts.

## 12. Reusable Checklist
- [ ] Locales parsed dynamically from HTTP headers, profiles, or default settings
- [ ] Localized translations stored in structured JSON/YAML bundles, decoupled from code
- [ ] Fallback translation system configured to default language on missing keys
- [ ] ICU MessageFormat rules applied for complex pluralizations and genders
- [ ] Date, currency, and number formatting uses runtime locale engines (e.g., Intl in JS)
- [ ] Unit tests verify translation lookup handles special character inputs safely\n