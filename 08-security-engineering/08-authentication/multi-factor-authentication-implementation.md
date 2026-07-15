# MFA Implementation

## 1. Definition & Core Concepts
Multi-Factor Authentication (MFA) is a security verification mechanism that requires users to present two or more independent factors to log in: something they know (password) and something they have (authenticator app, SMS token, security key).

## 2. Why It Exists / What Problem It Solves
Passwords are frequently stolen through phishing or credential leaks. MFA secures accounts; even if an attacker steals a user's password, they cannot log in without the second-factor verification token.

## 3. What Breaks in Production Without It
- **Account Takeovers:** Attackers use leaked credential lists to log into customer accounts, steal data, or perform fraudulent actions.
- **Compliance Failures:** Systems handling financial or health data fail basic security audits, violating regulations.

## 4. Best Practices
- **Prefer TOTP (Time-based One-time Password):** Standardize on authenticator apps (Google Authenticator, Duo) using RFC 6238 TOTP algorithms over insecure SMS codes.
- **Provide Backup Recovery Codes:** Generate cryptographically secure recovery codes for users to store safely in case they lose their authenticator devices.
- **Implement Rate Limiting:** Enforce strict limits on verification attempts (e.g. lockout after 5 failures) to block brute-force attacks.

## 5. Common Mistakes / Anti-Patterns
- **Using SMS as the sole MFA factor:** SMS is vulnerable to SIM-swapping attacks. Offer TOTP as the default option.
- **Exposing secret keys in plaintext:** Storing TOTP registration secrets in databases without encryption.

## 6. Security Considerations
- **TOTP Registration Verification:** Do not activate MFA for an account until the user successfully inputs a code generated from the initial QR setup screen, verifying configuration success.

## 7. Performance Considerations
- **Fast Verification Checks:** Cryptographic TOTP matching is fast. Optimize by checking only the active and adjacent window increments (e.g. +/- 30 seconds).

## 8. Scalability Considerations
- **Consistent MFA State Flows:** Manage multi-step login states (password verified -> waiting for MFA) using stateless, signed temporary JWT tokens.

## 9. How Major Companies Implement It
- **GitHub / Google:** Mandate MFA for developer and employee accounts, supporting WebAuthn keys and TOTP apps to secure access.

## 10. Decision Checklist (MFA Factors)
- Use **TOTP Authenticator Apps / FIDO2 Keys** when:
  - Designing high-security developer consoles, financial tools, and customer portals.
- Use **SMS verification codes** when:
  - Working on general consumer products where simplicity is preferred, accepting SMS vulnerabilities.

## 11. AI Coding-Agent Guidelines
- Write authentication flows that manage MFA setup validations and generate hashed backup codes.

## 12. Reusable Checklist
- [ ] TOTP authenticator verification (RFC 6238) supported
- [ ] Cryptographic recovery codes generated and hashed in database
- [ ] Rate limits restrict MFA submission attempts to prevent brute force
- [ ] MFA verified using a test code input before final registration
- [ ] Login state tracked via signed temporary tokens during MFA waits
- [ ] TOTP secret keys encrypted at rest in database tables
