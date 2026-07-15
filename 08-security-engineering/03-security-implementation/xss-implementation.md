# XSS (Cross-Site Scripting)

## 1. Backend Application Context
XSS vulnerabilities occur when backend services store or return unsanitized HTML/JS inputs, executing scripts in client browsers.

## 2. Backend-Specific Pitfalls
- **Trusting database inputs:** Assuming that database data is safe, failing to escape outputs when rendering templates.

## 3. Code-Shape Example
`python
# HTML input sanitization using Bleach
import bleach

def save_comment(user_input: str):
    # Strip dangerous HTML tags before storing in database
    clean_html = bleach.clean(user_input, tags=["p", "b", "i"])
    db.save_comment(clean_html)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Security](../../production_principles/foundations/04-security.md)
