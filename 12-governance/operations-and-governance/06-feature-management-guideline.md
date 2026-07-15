# Feature Management

## 1. Definition & Core Concepts

Feature management is the software design pattern that uses conditional logical branches (Feature Flags or Toggles) to enable or disable capabilities at runtime without deploying new application code.

Core pieces:
- **Feature Flags (Toggles):** Logical control points in the code (e.g., `if (featureFlags.isEnabled("new-checkout-flow"))`) mapped to external configuration states.
- **Toggle Types:**
  - *Release Toggles:* Shielding uncompleted or risky features during rollouts.
  - *Ops Toggles (Kill Switches):* Instantly disabling non-critical features during system outages or high load.
  - *Experimentation Toggles:* Used for A/B testing user behaviors.
  - *Permission Toggles:* Gating features based on customer tiers or licensing.
- **Context-Aware Evaluation:** Evaluating flags dynamically based on the current request context (e.g., user ID, tenant country, billing plan).
- **Flag Technical Debt:** The accumulated maintenance cost of maintaining dead flag conditions in code after a feature has been fully released.

*(Boundary Note: Managing external SaaS consoles like LaunchDarkly/Split UI, setting up audience segmentation rules, or configuring marketing analytics dashboards is out of scope. This document covers code-level flag wrappers, fallback rules, performance caching, and cleanup patterns.)*

## 2. Why It Exists

Deploying code is a high-risk activity that takes time (building, testing, rolling out). Feature management decouples code deployment from feature release. Developers can merge half-finished code safely behind a disabled flag, test features in production for select test accounts, and roll back failing features instantly by flipping a flag value without running a CI/CD pipeline.

## 3. What Breaks in Production Without It

- **Application Crashes on Flag Outage:** The feature flag service experiences a connection dropout. The application throws unhandled exceptions, crashing user requests because it lacks local fallback default values.
- **Performance Drag from Network Queries:** An application queries an external feature flag database synchronously over the network on every user API call, adding 100ms of latency and hitting rate limits.
- **Dead Code Bloat (Flag Spaghetti):** Accumulating dozens of stale flags in the codebase over years. Developers struggle to read the code or run tests because they must account for hundreds of dead branching permutations.
- **Unintended Gating Mixtures:** Nesting multiple feature flags inside one another (e.g., `if (flagA) { if (flagB) { ... } }`), resulting in undocumented states that are impossible to test and debug during incidents.

## 4. Best Practices

- **Wrap Flag Clients in local Abstractions:** Do not call third-party flag SDKs directly. Wrap them in a local interface (e.g., `FeatureFlagService`). This allows you to swap flag providers (or use local JSON configs in unit tests) without modifying business logic.
- **Always Provide Local Default Fallbacks:** Every flag check must declare a local default value (e.g., `isEnabled("new-feature", false)`) to fall back on if the flag engine is unreachable or fails to boot.
- **Cache Flags in Memory Asynchronously:** Evaluate flags in memory. The flag SDK should cache configs locally and update them asynchronously (via streaming sockets or background polling), ensuring zero latency impact on request threads.
- **Evaluate with User/Request Context:** Always pass context structures (e.g., `{ userId: user.id, tenant: user.tenant, country: req.country }`) into the evaluation engine to support targeted user rollouts and A/B testing.
- **Establish a Flag Deletion Schedule:** Treat feature flags as temporary. Create a ticket to remove flag conditionals and old code branches immediately after a feature has reached 100% rollout stability.
- **Limit Flags to Core Entry Points:** Apply feature flags at the routing, controller, or dependency injection level. Avoid sprinkling flags deep inside domain calculations or helper methods.

## 5. Common Mistakes / Anti-Patterns

- **Synchronous Network API Flag Checks:** Calling REST endpoints in line to check a flag state on every function execution.
- **Deeply Nested Flags:** Writing complex conditional matrix trees using multiple flags, which causes unexpected behavior in production.
- **Using Flags for Internal Configuration:** Using feature flags to manage system parameters (e.g., database URLs, connection timeouts) instead of standard configuration management.
- **Never Cleaning Up Flags:** Treating feature flags as permanent architecture, leading to massive technical debt and obsolete code branches.

## 6. Security Considerations

- **Server-Side Evaluation Enforcement:** Always evaluate feature flags on the server. Never let client applications (browsers/mobile apps) control feature flag evaluations directly, as attackers can bypass checks and access restricted APIs.
- **Scrubbing Gating Contexts:** Ensure user contexts sent to third-party feature flag platforms do not contain unencrypted PII (like email addresses or phone numbers). Use hashed identifiers (e.g. SHA-256 hashes) instead.

## 7. Performance Considerations

- **Minimizing Memory Footprint:** If using local caching, ensure the size of user-specific flag configurations is bounded to avoid memory exhaustion on high-traffic servers.

## 8. Scalability Considerations

- **Outbox Synchronization:** For microservice fleets, ensure flag configurations are synced uniformly across all active nodes to prevent "flickering" states where a client hits Server 1 and sees a feature, then hits Server 2 and sees it disabled.

## 9. How Major Companies Implement It

- **Netflix:** Utilizes an advanced gating framework that evaluates thousands of dynamic variables in real-time, allowing them to test and roll out personalized user interfaces and recommendation structures to millions of concurrent clients.
- **Stripe:** Exposes beta-tester flags at their API gateway. Account metadata containing active flags is compiled statically at the request boundary, allowing routing engines to dynamically serve custom API payload schemas to specific merchants.

## 10. Decision Checklist

- Use **Feature Flags** when: Rolling out risky or complex code, running user A/B tests, gating premium tier features, or creating operational kill switches for non-critical features.
- Skip Feature Flags when: Performing basic internal refactoring with zero change in business behavior, or fixing trivial bugs where immediate deployment is safe.

## 11. AI Coding-Agent Implementation Guidelines

- Always wrap feature flag SDK calls in a custom service wrapper.
- Always provide a boolean/string default fallback parameter for every flag check method call.
- Never write nested feature flag checks (`if (flag1) { if (flag2) { ... } }`).
- Always pass request user/tenant metadata context into the feature flag evaluation engine.
- Never call external network endpoints synchronously within a feature flag check handler.
- Always create a TODO comment containing a reminder or clean-up schedule near any temporary release flag.

## 12. Reusable Checklist

- [ ] All feature flag checks run through a centralized local service abstraction wrapper
- [ ] Every flag check method call defines a safe local default fallback value
- [ ] Flags evaluated in-memory using cached configuration state (no synchronous network hits)
- [ ] User/Tenant context passed dynamically into evaluation requests for targeted rollouts
- [ ] Release flags isolated to entry points (routers, controllers), not deep in helper calculations
- [ ] No nested feature flags present in the logical flow
- [ ] Cleanup plans/tickets scheduled for release flags immediately after 100% rollout
- [ ] Client-side features validated on the server (no trust in client-side gating alone)
