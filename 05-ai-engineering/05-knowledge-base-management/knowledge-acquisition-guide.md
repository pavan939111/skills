# Knowledge Acquisition

## 1. Definition & Core Concepts
Knowledge Acquisition is the systematic ingestion, cleaning, and formatting of structured and unstructured information (manuals, FAQs, databases, API specs) to build the baseline context repository for an AI application.

## 2. Why It Exists / What Problem It Solves
AI models require ground-truth data to provide correct, domain-specific answers. Ingesting raw web pages or messy spreadsheets directly creates formatting errors and logical gaps. Knowledge acquisition normalizes diverse inputs into clean text segments.

## 3. What Breaks in Production Without It
- **Garbage In, Garbage Out:** Models generate incorrect answers because source documents contain duplicate pages or out-of-date drafts.
- **Lost Details:** Ingestion pipelines fail to extract text from images or tables, leaving the search database incomplete.
- **Accidental PII Ingestion:** Customer identifiers are ingested into the public search database, exposing private info.

## 4. Best Practices
- **Implement HTML parsing filters:** Use tools (like BeautifulSoup or Readability) to strip navigation bars and scripts from web pages.
- **Normalize characters:** Convert all input text to standard UTF-8 and fix encoding artifacts (e.g. smart quotes).
- **Run automated PII scrubbers:** Scan files for emails, phone numbers, and keys before database ingestion.

## 5. Common Mistakes / Anti-Patterns
- **Direct PDF to Text conversion:** Exporting PDFs directly without reconstructing multi-column flows, leading to jumbled sentences.
- **Ingesting raw logs:** Sating the search database with verbose, unstructured system logs.

## 6. Security Considerations
- **Data Access Rights:** Confirm that the ingested source data does not violate third-party copyright laws or user access permissions.

## 7. Performance Considerations
- **Batch Processing:** Run initial ingestion scripts in parallel worker containers to speed up loading times.

## 8. Scalability Considerations
- **Storage footprints:** Store raw source files in object storage (S3) separate from search databases.

## 9. How Major Companies Implement It
- **Slack:** Standardizes internal workspace page acquisitions by stripping metadata, leaving clean text headers.
- **Notion:** Automates document cleaning on import, creating uniform markdown files for indexing.

## 10. Decision Checklist (Acquisition Methods)
- Use **Deterministic Parsers (e.g., BeautifulSoup)** when:
  - Ingesting structured HTML/XML data with consistent tags.
- Use **Multimodal Vision Encoders** when:
  - Ingesting scanned images or PDFs with complex layouts.

## 11. AI Coding-Agent Guidelines
- Always implement text validation filters at the acquisition stage to check for encoding errors before indexing.

## 12. Reusable Checklist
- [ ] Raw input data parsed (HTML tags, scripts stripped)
- [ ] Text normalized to UTF-8
- [ ] PII screening active on all input paths
- [ ] PDF multi-column layout flows reconstructed correctly
- [ ] Raw source files backed up in S3
- [ ] Ingestion pipelines decouple from search database write routes
