# Environment Variables

## 1. Backend Application Context
Environment Variables inject runtime configuration coordinates (like database hosts or API keys) into backend services dynamically, separating code from configuration values.

## 2. Backend-Specific Pitfalls
- **Accessing variables dynamically in hot code loops:** Reading variables directly from system processes (e.g. process.env.DB_HOST) inside search loops. Read once on startup and map values to configuration classes.

## 3. Code-Shape Example
`python
# Configuration class (reads environment once at boot)
class DatabaseSettings:
    def __init__(self):
        self.host = os.getenv("DB_HOST", "localhost")
        self.port = int(os.getenv("DB_PORT", "5432"))
        self.user = os.getenv("DB_USER")
        
        if not self.user:
            raise ValueError("DB_USER env variable is required")

db_settings = DatabaseSettings()
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Configuration Management](configuration-management-strategy.md)
