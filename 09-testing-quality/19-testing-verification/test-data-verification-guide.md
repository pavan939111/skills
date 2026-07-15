# Test Data

## 1. Backend Application Context
Test Data manages the setup database rows, fixtures, and factory objects used to populate tables during test runs.

## 2. Backend-Specific Pitfalls
- **Hardcoding entity IDs across tests:** Creating global database records with static ID values, causing unique constraint conflicts on concurrent test runs.

## 3. Code-Shape Example
`python
# Factory pattern for dynamic test data generation
class UserFactory:
    _id_counter = 0

    @classmethod
    def create_user_dto(cls):
        cls._id_counter += 1
        return {
            "email": f"user_{cls._id_counter}@domain.com",
            "password": "secure-password",
            "display_name": f"Test User {cls._id_counter}"
        }
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Testing Production Grade](../../production_principles/delivery-and-readiness/01-testing-production-grade-verification-guide.md)
