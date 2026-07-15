# ADR 0001: Standardized 14-Layer Information Architecture & Naming Standards

*   **Status**: Accepted
*   **Date**: 2026-07-16
*   **Deciders**: Principal Architect, Knowledge Architect

---

## 1. Context & Problem Statement

The Engineering Knowledge Base repository serves as a machine-readable reference map for autonomous AI coding agents. Previously, the structure suffered from:
- **Overlapping responsibilities**: Observability, logging, security, and performance metrics split across Backend and Production Principles.
- **Redundant directories**: Generic folder names (like `devex` and `adrs`) and duplicate files in parallel AI Engineering tracks.
- **Circular dependencies**: Bidirectional relative links between system design briefs and implementation guides.

This IA fragmentation caused parsing inefficiencies and context loops during agent operations.

---

## 2. Decision

We will refactor the repository structure and enforce the following rules:
1.  **14 Engineering Layers**: Group all files under 14 numbered root folders (from `00-product-analysis` to `13-architecture-decision-records`), keeping each folder isolated to a single engineering discipline.
2.  **Semantic Folder Naming**: Enforce suffix patterns (`-strategy`, `-implementation`, `-management`, `-optimization`) on all subfolders to describe target engineering actions instead of generic terms.
3.  **Strict File Suffixes**: Every markdown file must terminate with a suffix identifying its layout template (`*-strategy-implementation.md`, `*-implementation.md`, `*-checklist.md`, `*-guideline.md`).
4.  **Acyclic Dependency graph**: Restrict link directions to upstream flows (lower operational layers link up to higher strategic layers, never vice versa).

---

## 3. Consequences

*   **Acyclic Resolution Path**: AI compilers can traverse files recursively without encountering circular reference loops.
*   **Canonical Single Source of Truth**: Telemetry and authentication structures exist exactly once, with other folders pointing to them instead of replicating configurations.
*   **Context Optimization**: By loading the registry maps, agents can selectively load subfolders as independent "AI Skills," minimizing token usage.
