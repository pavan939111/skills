# YAGNI (You Aren't Gonna Need It) in Backend Development

> [!NOTE]
> [That file covers the general YAGNI principle; this file covers backend-specific application.](../../02-engineering-principles/02-core-engineering-principles/04-yagni.md)

## 1. Backend Application Context
YAGNI directs developers to implement only the requirements of the current feature sprint, avoiding writing speculative code, placeholders, or unused abstraction layers:
- **Write-Only Active Endpoints:** Create only the HTTP routes required for active user flows (do not create speculative "future use" routes).
- **Pruned Database Schemas:** Add columns to tables only when features need to store that data (no placeholder columns).
- **Lean Tool Configurations:** Integrate external systems (like queues or cache grids) only when load metrics dictate their use, not by default.

## 2. Backend-Specific Pitfalls
- **Building generic plugin interfaces prematurely:** Writing complex abstract routing classes for third-party APIs (e.g., mailers) when the application only uses a single provider.
- **Premature sharding:** Sharding database tables before traffic scales past a single server capacity.

## 3. Code-Shape Example
`python
# Avoid: Writing complex retry loops and fallback queues in standard service boots 
# before traffic or load requires it.
# Keep code lean:
class EmailService:
    def send_welcome(self, email: str):
        # Direct, simple call to Mailgun API. No complex, speculative queue integrations.
        mailgun.send(to=email, subject="Welcome!")
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [YAGNI Principle](../../production_principles/02-core-engineering-principles/04-yagni-principles.md)
