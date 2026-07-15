# Custom Exceptions

## 1. Backend Application Context
Custom Exceptions allow the backend codebase to define domain-specific error conditions (e.g. InsufficientFundsException, InventoryLockException) that inherit from base exceptions, enabling services to communicate precise reasons for failures.

## 2. Backend-Specific Pitfalls
- **Using generic exceptions:** Throwing generic errors (aise Exception("failed")) instead of subclassed exceptions, forcing controllers to parse string messages to decide HTTP status codes.

## 3. Code-Shape Example
`python
# Domain-specific custom exceptions
class DomainException(Exception):
    """Base domain exception"""
    pass

class InsufficientFundsException(DomainException):
    def __init__(self, account_id: str, balance: int, required: int):
        super().__init__(f"Account {account_id} has balance {balance}; requires {required}")
        self.account_id = account_id
        self.balance = balance
        self.required = required
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Error Handling & Exception Strategy](../../production_principles/reliability-coding-practices/01-error-handling-exception-strategy-implementation.md)
