# AI Coding Assistant Template

## 1. Definition & Core Concepts
An AI Coding Assistant is a template designed to parse filesystems, search code structures, suggest edits, compile changes, run tests, and debug compilation errors within a sandboxed developer workspace.

## 2. Why It Exists / What Problem It Solves
Traditional autocompletion extensions are limited to single-file suggestions. A production-grade coding assistant must reason about multi-file dependencies, validate syntax before writing files, run local compilers, and self-correct based on test logs without compromising the host system.

## 3. What Breaks in Production Without It
- **Syntax and Import Errors:** Assistant proposes edits that break compilation because it has no compiler feedback.
- **Security Breaches:** Allowing code generation models to execute command shells directly on production servers, exposing host credentials.
- **Context Window Flooding:** Appending complete files to the prompt instead of precise range diffs, causing context overflow.

## 4. Best Practices
- **Model Selection:** Use high-reasoning, code-optimized models (e.g. Claude 3.5 Sonnet, GPT-4o) as primary generators, and faster models for file search indexing.
- **Context/Prompt/Knowledge Strategy:** Retrieve file structures using Ripgrep wrappers. Format workspace layouts as directory trees. Provide instructions as system rules.
- **Agent/RAG Pattern:** Use the Planner-Executor pattern. The Planner maps out edits; the Executor writes diff files and runs test commands.
- **Evaluation:** Run AST syntax checks on all edited files. Run automated unit test suites to verify functional correctness.
- **Deployment:** Deploy the assistant execution runtime inside secure, isolated sandboxes (e.g., Docker containers with strict resource limits).

## 5. Common Mistakes / Anti-Patterns
- **Overwriting full files:** Asking the model to return a full 1000-line file to change 3 lines, consuming tokens and increasing latency. Use line ranges and diff replacements.
- **Ignoring lockfiles:** Modifying files without respecting lockfiles (e.g., `package-lock.json`), causing package mismatches.

## 6. Security Considerations
- **CLI Command Sandboxing:** Block destructive shell commands (e.g., `rm -rf /`, `curl` calls targeting metadata endpoints) using sandboxes and command token filters.

## 7. Performance Considerations
- **Codebase Indexing:** Maintain a local vector database index of code embeddings (e.g. using tree-sitter tags) to locate target code blocks under 100ms.

## 8. Scalability Considerations
- **Sandboxed Pod Pools:** Keep pre-warmed pools of secure Docker containers to start agent executions immediately upon request.

## 9. How Major Companies Implement It
- **GitHub Copilot Workspace:** Creates isolated container environments for each task workspace, executing compiler tests and showing file diff comparisons before code commits.

## 10. Decision Checklist (Coding Assistant Architecture)
- **Model Selection:** Claude 3.5 Sonnet / GPT-4o (Primary).
- **Execution Sandbox:** Containerized Docker environment with strict chroot.
- **Edit Strategy:** Line-oriented search-and-replace or diff patch tools.
- **Verification:** Automatic AST parser verification and unit test execution.

## 11. AI Coding-Agent Guidelines
- Write workspace search tools that compress file listings to outline maps, and write file-editing functions that accept precise line ranges to keep contexts small.

## 12. Reusable Checklist
- [ ] Code generator model pinned to a high-reasoning code specialist
- [ ] Execution runtime isolated within container sandboxes (Docker)
- [ ] Shell tool commands checked against forbidden tokens
- [ ] Line-oriented file diff editing tool implemented
- [ ] AST parser validates syntax changes before writing to disk
- [ ] Test suites execute automatically with error output sent to model
