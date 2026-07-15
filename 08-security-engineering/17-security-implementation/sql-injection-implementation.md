# SQL Injection

## 1. Backend Application Context
SQL Injection occurs when user inputs are concatenated directly into SQL queries, letting attackers execute unauthorized database statements.

## 2. Backend-Specific Pitfalls
- **Concatenating sort fields:** Using string template concatenation for SQL ORDER BY fields because ORM bindings do not support dynamic column structures.

## 3. Code-Shape Example
`python
# Secure parameterized queries
def find_user_by_email(email: str):
    # Safe parameter binding
    return db.execute("SELECT * FROM users WHERE email = :email", {"email": email})
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Security](../../production_principles/foundations/04-security.md)
