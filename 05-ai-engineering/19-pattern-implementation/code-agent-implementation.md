# Coding Agents

## 1. Definition & Core Concepts
A Coding Agent is a specialized autonomous agent designed to write, edit, debug, test, and maintain software code. It operates by interacting with local workspaces, running commands in terminal sandboxes, analyzing compiler outputs, and editing files.

## 2. Why It Exists / What Problem It Solves
Traditional autocomplete coding helpers can only suggest snippets. Coding agents can analyze complete project structures, plan complex refactorings, run compiler checks, interpret test logs, and fix errors independently, significantly accelerating development workflows.

## 3. What Breaks in Production Without It
- **Broken Code Submissions:** AI tools submit code containing syntax or import errors because they cannot compile or test their changes before shipping.
- **Accidental Workspace Destruction:** Agents run commands directly on host environments without sandboxing, risking system file deletions or service crashes.

## 4. Best Practices
- **Sandbox execution environments:** Always execute agent commands (compiling, testing, running code) inside isolated container sandboxes (e.g. Docker, gVisor) to prevent malicious or accidental host system damage.
- **Implement a Write-Test-Correct Loop:** Write code changes -> run unit tests -> capture failure stdout -> feed back to agent to self-correct.
- **Use Line-Oriented Diff Tools:** Provide agents with line-by-line replace tools rather than asking them to overwrite complete files, minimizing token costs.

## 5. Common Mistakes / Anti-Patterns
- **Executing raw shell commands without timeouts:** Allowing agents to run processes that hang indefinitely (e.g., local development servers), locking GPU and container resources.
- **Skipping syntax validation:** Writing files directly without running quick AST parsers to check for syntax errors before execution.

## 6. Security Considerations
- **Workspace Isolation:** Restrict the agent's filesystem tools using strict directory chroot guards to prevent it from reading system files (e.g., `/etc/passwd` or AWS credentials).

## 7. Performance Considerations
- **Workspace indexing speed:** Large codebases can take a long time to search. Build fast file index databases (e.g. using Ripgrep or ctags) to let agents locate files quickly.

## 8. Scalability Considerations
- **Sandboxed Pod Pools:** Maintain pre-warmed pools of isolated Docker containers to allow immediate start times for concurrent coding agent tasks.

## 9. How Major Companies Implement It
- **Cognition Labs (Devin) / Sweep AI:** Deploy isolated container networks that spin up on user requests, running linting, formatting, and unit tests to validate proposed pull requests.

## 10. Decision Checklist (Agent Execution Mode)
- Use **Sandboxed CLI Execution** when:
  - Allowing the agent to write code, compile files, install packages, and execute test suites.
- Use **Read-Only Code Analysis** when:
  - Building code review dashboards, vulnerability scanners, or code search assistants that do not need execution tools.

## 11. AI Coding-Agent Guidelines
- Write workspace search tools (like ripgrep wrappers) and file editing functions that accept precise line ranges to keep context windows small.

## 12. Reusable Checklist
- [ ] Code execution sandboxed in secure Docker or VM container
- [ ] Directory chroot rules restrict agent access to target workspace
- [ ] Shell execution utilities configured with strict timeouts (e.g. max 30s)
- [ ] Line-oriented file edit tool (diff or replace range) implemented
- [ ] Automated AST parser checks syntax before file writes
- [ ] Run test scripts automatically and feed back failures to agent
