# Notifications Infrastructure

## 1. Definition & Core Concepts

Notifications infrastructure manages the delivery of transactional and operational messages to users across various channels, including email (e.g., SendGrid, Mailgun), SMS (e.g., Twilio), and mobile/web Push Notifications (e.g., APNS, FCM).

Core pieces:
- **Provider Abstraction Layer:** An interface wrapper that decouples application business logic from specific vendor SDKs.
- **Asynchronous Dispatch:** Enqueuing notification tasks to background queues immediately rather than calling external delivery APIs synchronously.
- **Notification Preference Registry:** A data store tracking user opt-in/opt-out states across channels.
- **Templating Engine:** Separating message copy (HTML/Text) from runtime data payloads using template engines (e.g., Mustache, Handlebars, Jinja).
- **Delivery Status Webhooks:** Interfaces that receive and parse events from providers (e.g., bounces, spam complaints, delivery failures).

*(Boundary Note: Designing HTML email layouts, writing marketing automation drip campaigns, or configuring domain-level DNS records like DKIM/SPF belongs in marketing and systems administration documents. This document covers code-level vendor abstraction, async queues, and compliance filtering.)*

## 2. Why It Exists

Outbound user notifications rely on third-party APIs which suffer from transient failures, network latency, and strict rate limits. Notification infrastructure ensures the core application remains isolated from these vendor failures, manages retry policies, and centralizes compliance rules (unsubscribes, rate-throttling) to avoid legal penalties and maintain brand reputation.

## 3. What Breaks in Production Without It

- **Thread Starvation on Signup:** An API handler sends a welcome email synchronously inside the user-registration controller. If the email provider is slow or offline, registration requests hang and time out, blocking users from signing up.
- **Legal Compliance Penalties:** Sending emails or SMS to users who have opted out or unsubscribed, violating laws like CAN-SPAM, GDPR, and CASL, resulting in massive fines.
- **IP Reputation Blacklisting:** Ignoring email bounce events. Continuing to email non-existent addresses flags your sending IP as a spam generator, causing healthy emails to land in spam folders.
- **Vendor API Rate-Limitation Locks:** Bombarding Twilio with thousands of SMS requests during a notification spike, causing the provider to drop messages with rate-limit errors (e.g., HTTP 429).
- **Template Code Pollution:** Hardcoding long HTML strings inside API controllers, making code changes difficult and preventing non-developers from updating notification copy.

## 4. Best Practices

- **Enforce Asynchronous Queuing:** Always push notification tasks to background queues. The web API controller should return HTTP 200/202 instantly, and a background worker handles the slow network call to SendGrid/Twilio.
- **Validate Preferences Before Delivery:** Query the notification preference table immediately before dispatching any message. If a user has unsubscribed from a channel or category, drop the notification.
- **Abstract Vendor SDKs (Adapter Pattern):** Write notification interfaces (e.g., `EmailProvider`). If you need to switch from SendGrid to Mailgun, update only the adapter implementation, keeping business logic untouched.
- **Handle Delivery Webhooks (Feedback Loops):** Implement a webhook endpoint to receive bounce and complaint events. When a permanent bounce (HTTP 5xx / hard bounce) occurs, mark that email address as inactive in your database to block further attempts.
- **Sanitize and Validate Phone/Email Data:** Validate inputs strictly at the boundary. Format phone numbers using the international E.164 standard (e.g., `+12025550143`) and reject malformed email schemas before queuing.
- **Isolate Transactional vs. Marketing Channels:** Use separate queues, sending IPs, and API keys for critical transactional messages (e.g., password resets) and bulk marketing campaigns to ensure marketing spam filters do not block password resets.

## 5. Common Mistakes / Anti-Patterns

- **Synchronous Delivery in Controllers:** Calling `await mailer.send()` inside request-response pipelines.
- **Hardcoding Vendor SDK Classes:** Sprinkling `new SendgridClient()` or `new TwilioClient()` calls directly inside service layers.
- **Ignoring Opt-Out Links in Emails:** Omitting unsubscribe links in transactional emails that contain promotional/marketing content, violating compliance laws.
- **Infinite Retry Loops on Dead Accounts:** Retrying email deliveries to non-existent addresses in an infinite loop, wasting worker resources and alerting spam filters.

## 6. Security Considerations

- **Header Injection Vulnerabilities:** Sanitize input parameters (e.g. user names, subjects) to prevent attackers from injecting newline characters (`\n`, `\r`) into email headers to BCC third parties or hijack emails.
- **Secure Webhook Verification:** Always validate cryptographic signatures on delivery status webhooks from Twilio/SendGrid to prevent attackers from sending spoofed bounce notifications.

## 7. Performance Considerations

- **Outbound Batching:** When sending notifications to multiple users (e.g., system announcements), use the provider's batch API options rather than running individual API calls in a loop.
- **Rate-Limit Throttling:** Configure workers with token bucket rate-limiters matching your provider's SLA to smooth out notification spikes.

## 8. Scalability Considerations

- **Queue Isolation:** Keep transactional messages in high-priority queues and marketing notifications in low-priority queues to ensure marketing delays do not bottleneck critical alerts.

## 9. How Major Companies Implement It

- **Uber:** Implements a centralized notifications routing engine. It evaluates delivery cost and user context (e.g., Is the app open?) to dynamically route alerts between SMS, Push Notifications, or Email.
- **Stripe:** Automatically retries webhook and billing notifications using exponential backoff, processing delivery events to log merchant interaction histories and handle bounce metrics.

## 10. Decision Checklist

- Use **Async Notification Queues & Adapters** when: Sending transaction receipts, password resets, SMS validation codes, or app push alerts.
- Skip complex setups ONLY when: Writing offline scripting engines or developer tools where stdout/stderr alerts are sufficient.

## 11. AI Coding-Agent Implementation Guidelines

- Never call email or SMS provider SDKs directly inside HTTP route controllers — always dispatch notification tasks to background queues.
- Always validate email addresses and format phone numbers to the E.164 standard before queue ingestion.
- Always check the user's notification preferences in your database immediately before invoking provider sends.
- Always hide vendor SDK integrations behind an interface class (Adapter pattern) to enable mocking and easy swapping.
- Never hardcode HTML email templates inside code files — load templates from files or external template storage services.
- Always include an error boundary that handles provider rate limits (HTTP 429) by rescheduling the task with a backoff delay.

## 12. Reusable Checklist

- [ ] All notifications dispatched asynchronously via background queues
- [ ] Notification preferences checked and respected prior to sending
- [ ] Third-party SDKs hidden behind a mockable Provider interface
- [ ] Input email schemas validated and phone numbers formatted to E.164
- [ ] Bounce/Spam webhooks parsed; dead addresses marked inactive in DB
- [ ] Transactional and marketing mail flows isolated (separate queues/credentials)
- [ ] Webhook signature verification implemented for provider callback endpoints
- [ ] Outbound provider APIs have connect and read timeouts configured
