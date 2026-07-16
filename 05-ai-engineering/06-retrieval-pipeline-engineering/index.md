# 06 — RAG Engineering

**Overlap note (read before writing):** this folder shares file names with `../../04-database-design/10-ai-and-modern-databases/`, which is already fully written. That folder covers the **data-layer angle** (how to store/index vectors, which vector DB, embedding storage schema). This folder covers the **retrieval-pipeline angle** (chunking strategy for answer quality, retrieval tuning for relevance, grounding, citation). Every file below whose name matches a file in `database-design/10-.../` must open with a one-line pointer to that file rather than re-explaining storage mechanics. Standard 12-section template otherwise (see `../README.md`).

## Topics

| # | Topic | File | Status | Data-layer counterpart |
|---|-------|------|--------|-------------------------|
| 01 | Chunking | `chunking-implementation.md` | done | `database-design/10-ai-and-modern-databases/chunking-strategy.md` |
| 02 | Embedding Strategy | `embedding-strategy.md` | done | `database-design/10-ai-and-modern-databases/embedding-storage-strategy.md` |
| 03 | Vector Database Selection | `vector-database-selection-implementation.md` | done | `database-design/01-database-selection/vector-database-decision-matrix.md` |
| 04 | Hybrid Search | `hybrid-search-implementation.md` | done | `database-design/10-ai-and-modern-databases/hybrid-search-strategy-implementation.md` |
| 05 | Metadata Filtering | `metadata-filtering-implementation.md` | done | `database-design/10-ai-and-modern-databases/metadata-filtering-implementation.md` |
| 06 | Reranking | `reranking-implementation.md` | done | `database-design/10-ai-and-modern-databases/reranking-strategy.md` |
| 07 | Retrieval Optimization | `retrieval-optimization.md` | done | — (unique to this folder) |
| 08 | Citation | `citation-implementation.md` | done | — (unique to this folder) |
| 09 | Grounding | `grounding-implementation.md` | done | — (unique to this folder) |
| 10 | RAG Checklist | `rag-checklist.md` | done | `database-design/12-production-checklists/` (data-layer readiness) |
