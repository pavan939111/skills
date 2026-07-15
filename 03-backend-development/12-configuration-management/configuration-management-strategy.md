# Configuration Management

## 1. Definition & Core Concepts

Configuration management is how an application's behavior-controlling values — connection strings, API keys, feature toggles, timeouts, URLs, credentials — are supplied to it separately from its code, and varied safely across environments (local, dev, staging, production) without changing or redeploying the codebase.

Core pieces:
- **Environment variables** — the standard runtime mechanism for injecting config (12-Factor App principle III: "Store config in the environment").
- **Config objects/classes** — typed, validated structures the app reads config into at startup, instead of scattering `process.env.X` / `os.environ["X"]` calls through the codebase.
- **Secret management** — a subset of config that must never be stored in plaintext, source control, or logs (passwords, API keys, private keys, tokens).
- **Feature flags** — config that toggles behavior at runtime without a deploy.
- **Environment-specific configuration** — the same codebase behaving correctly in dev/staging/prod via config alone, never via `if (env === 'prod')` branches in business logic.

## 2. Why It Exists

Code should be identical across environments; only config should differ. This lets the exact build artifact tested in staging run in production, giving real confidence that "what we tested is what we shipped." It also means one codebase can serve many deployments (multi-tenant, multi-region, on-prem) without forking.

## 3. What Breaks in Production Without It

- Hardcoded passwords/API keys committed to git — permanent exposure even after removal (git history), frequently harvested by bots within minutes of a public push.
- Hardcoded production URLs/credentials — someone testing locally accidentally writes to production data.
- Secrets leaked via logs, error messages, or client-side bundles.
- No way to rotate a compromised credential without a code change and redeploy.
- Config drift: staging and production silently diverge because config lives in scattered, undocumented places.
- A single shared `.env` used by the whole team — no per-developer isolation, and it inevitably gets committed once.

## 4. Best Practices

- Never commit secrets. Use `.env` files only for local dev, and always gitignore them; commit a `.env.example` with variable names (no values).
- Load config once at startup into a validated, typed config object; fail fast (crash on boot) if required variables are missing or malformed — don't discover a missing `DATABASE_URL` on the first request.
- Use a real secrets manager in production: AWS Secrets Manager / Parameter Store, GCP Secret Manager, Azure Key Vault, HashiCorp Vault, or the platform's built-in secret store (Kubernetes Secrets + external secrets operator, Doppler, Infisical).
- Separate config by environment explicitly (`config/dev.ts`, `config/prod.ts`, or env-prefixed variables), never by conditionals sprinkled through business logic.
- Version and audit secret access; rotate credentials on a schedule and immediately on suspected compromise.
- Distinguish config (safe to log, e.g. `LOG_LEVEL`) from secrets (never log, mask in any diagnostic output).
- Use feature flags for risky changes so they can be toggled off without a deploy/rollback.
- Validate config shape with a schema (Zod, Pydantic, Joi, envalid) rather than trusting raw strings.

## 5. Common Mistakes / Anti-Patterns

- Reading `process.env` directly all over the codebase instead of one central config module.
- Committing real `.env` files "just for now."
- Using the same database/API credentials across all environments.
- Storing secrets in CI/CD YAML files in plaintext instead of the CI provider's encrypted secrets store.
- Baking secrets into Docker images (visible in image layers even if removed in a later layer).
- No startup validation — app boots "successfully" with a missing/blank secret and fails confusingly later.

## 6. Security Considerations

- Treat every secret as compromised the moment it touches a public repo, log, or error tracker — rotate, don't just delete.
- Principle of least privilege: scope API keys/DB users to only what the service needs (read-only replica user for reporting, not the admin credential).
- Encrypt secrets at rest in the secrets manager and in transit to the runtime.
- Mask/redact secret values in logs, error messages, and monitoring dashboards.
- Use short-lived, auto-rotated credentials (e.g., IAM roles / workload identity) over long-lived static keys wherever the platform supports it.

## 7. Performance Considerations

- Load and validate config once at startup, not per-request — repeated secrets-manager calls per request add latency and can hit rate limits.
- Cache secrets in memory with a bounded refresh interval if they must be re-fetched (rotation support) rather than fetching on every use.

## 8. Scalability Considerations

- Config must be identical for every instance of a horizontally scaled service — inject via environment/secret manager, never via a local file unique to one machine.
- For multi-region deployments, region-specific config (endpoints, data residency settings) should be parameterized, not hardcoded per branch/deploy.

## 9. How Major Companies Implement It

- **12-Factor App** (originated at Heroku, adopted industry-wide) codifies config-in-environment as a core principle for portable, cloud-native services.
- **Netflix** and other large-scale platforms use dynamic configuration services (e.g., Netflix's Archaius) so config/feature flags can change at runtime across thousands of instances without redeploying.
- **Google/AWS/Azure** all provide managed secret stores (Secret Manager, Secrets Manager, Key Vault) with IAM-scoped access, automatic rotation, and audit logging as the standard pattern for production credentials.
- Most fintech/regulated companies mandate secrets manager + audit trail as a compliance requirement (SOC 2, PCI-DSS), not just a convenience.

## 10. Decision Checklist

Use a full secrets manager when: the app runs in a cloud environment, has multiple services/environments, needs audit trails, or is subject to compliance requirements.
Environment variables + `.env` (local only) are sufficient when: purely local development, no shared/production secrets involved.
Add feature flags when: a change is risky, needs gradual rollout, or needs a kill switch independent of deploys.

## 11. AI Coding-Agent Implementation Guidelines

- Always read configuration through a single typed/validated config module (e.g., `config.ts`, `settings.py`) — never call `process.env` / `os.environ` directly outside that module.
- Always validate required config at application startup and fail fast with a clear error naming the missing variable.
- Never hardcode credentials, API keys, URLs, or secrets in source files — always source them from environment variables or a secrets manager.
- Always generate a `.env.example` alongside any `.env` usage, listing variable names with placeholder/no values.
- Always add `.env` (and any local secret files) to `.gitignore` by default when scaffolding a project.
- Never log full config objects or secret values; mask them in any debug/log output.
- When generating deployment config (Docker, Kubernetes, CI/CD), reference secrets via the platform's secret mechanism (K8s Secrets, GitHub Actions secrets, etc.) — never inline plaintext values.
- Default to environment-based config separation (dev/staging/prod) via variables, not `if (NODE_ENV === 'production')` branches embedded in business logic.

## 12. Reusable Checklist

- [ ] No secrets in source control (checked via `git log` scan / pre-commit secret scanner)
- [ ] `.env` gitignored; `.env.example` present and current
- [ ] Config loaded and validated once at startup; app fails fast on missing/invalid config
- [ ] All config access goes through one central config module
- [ ] Production secrets live in a managed secrets store, not flat files
- [ ] Secrets scoped to least privilege; rotated on a schedule and on compromise
- [ ] Secrets masked in logs, error reports, and monitoring
- [ ] CI/CD secrets stored in the platform's encrypted secret store, not in pipeline YAML
- [ ] Feature flags available for risky/rollout-sensitive changes
