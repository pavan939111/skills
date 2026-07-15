# Success Metrics

## 1. Definition & Core Concepts
Success Metrics (KPIs - Key Performance Indicators) are measurable, quantitative indicators used to evaluate a product's performance and determine if it has successfully met its business and user objectives post-launch.

Core concepts:
- **Business Metrics:** Financial and growth indicators (Monthly Recurring Revenue - MRR, Customer Acquisition Cost - CAC, User Conversion Rate).
- **Product Engagement Metrics:** User interaction indicators (Daily Active Users - DAU, Session Length, Feature Adoption Rate).
- **Operational Metrics:** Performance and cost indicators (server infrastructure costs, support ticket counts, background job durations).
- **Baselines & Targets:** Current starting metrics (baselines) vs target goals.

## 2. Why It Exists / What Problem It Solves
Engineering teams often assume their job ends when code is deployed. Without success metrics, it is impossible to evaluate if the software actually brought value to the business or solved customer pain points. Success metrics align engineering efforts with business outcomes, providing concrete data to drive future feature prioritization and system optimizations.

## 3. What Goes Wrong on a Project Without It
- **Invisible Failure:** A feature is launched, but nobody uses it. Because engagement is not monitored, the team continues to spend resources maintaining the unused code.
- **Unnoticed Performance Drops:** A new checkout step is added that increases payment page loading time by 1 second. Checkout conversions drop by 20%, but because conversion metrics are not tracked, the loss goes unnoticed for months.
- **Unoptimized Infrastructure Costs:** Server hosting costs double, but because cost-per-user metrics are not audited, the team has no target to plan optimization runs.
- **Misaligned Priorities:** Engineering prioritizes micro-optimizations that do not impact business metrics, ignoring major user drop-off points.

## 4. Best Practices
- **Define Metrics Prior to Launch:** Establish success metrics and logging points *during* functional requirements design, not after deployment.
- **Focus on Actionable Metrics, Not Vanity Metrics:** Track metrics that influence decisions (e.g. Conversion Rates, Retention), not vanity metrics that look good on paper but do not drive action (e.g. total page views, registered accounts count).
- **Log Metrics Database-Side:** Ensure the database schema includes auditing columns (like creation times, statuses, payment states) that allow business metrics to be queried natively via SQL.
- **Configure Telemetry Instrumentation:** Implement lightweight telemetry logging in backend handlers to record key operational metrics.
- **Compare Against Baseline States:** Document current performance metrics before deploying upgrades to verify progress.

## 5. Common Mistakes / Anti-Patterns
- **Vanity Metrics Focus:** Tracking total registrations instead of active user retention.
- **Too Many Metrics:** Attempting to monitor 50 different metrics, generating dashboard noise and alert fatigue.
- **No Database Audit Fields:** Failing to include columns like `created_at` or `status` in tables, making it impossible to query business performance via SQL.
- **Ignoring Operational Costs:** Tracking user growth but ignoring cloud billing trends, leading to unprofitable platforms.

## 6. How It Constrains/Informs Downstream Decisions
- **System Design:** High feature adoption targets require simple, frictionless onboarding interfaces (avoiding heavy initial data collections).
- **Backend Architecture:** A requirement to track conversions requires analytics logging pipelines and event brokers.
- **Database Design:** The need to generate real-time business dashboards requires database-level audit columns, timestamps, and pre-computed read models.

## 7. What "Good" Looks Like
A high-quality success metrics document defines 3 to 5 clear KPIs, categorizes them into business, product, and operational tiers, sets explicit numeric targets, and details the database columns and query paths required to track them.

## 8. How Major Companies/Teams Do It
- **Stripe:** Tracks merchant onboarding times, optimization conversion rates, and transaction success rates, running database queries daily to identify merchant drop-off points.
- **Netflix:** Monitors streaming playback starts (Play Delay) and buffer rates, using telemetry data to guide CDN and database caching strategies.

## 9. Decision Checklist
Go **Deep** (comprehensive success metrics definition) when:
- Deploying customer-facing products with commercial conversion goals.
- Optimizing existing systems to improve speed, cost, or retention.
- Features are funded based on explicit business ROI commitments.

Keep it **Lightweight** when:
- Building internal developer tools with fixed, captive user groups.
- Creating experimental prototypes.

## 10. AI Coding-Agent Implementation Guidelines
When a user requests a new feature:
1. **Define KPIs:** Ask: "What are the 3 primary metrics that will prove this feature was a success?"
2. **Design DB Audit Paths:** Ensure the database schema contains the audit columns (`created_at`, `status`) required to query these KPIs.
3. **Establish Operational Budgets:** Ask: "What are the infrastructure cost limits per user?"
4. **Produce Success Metrics Artifact:** Generate a metrics tracking page using the template below.

## 11. Reusable Checklist
- [ ] Primary success metrics (KPIs) identified and quantified
- [ ] Vanity metrics excluded; focus on actionable conversion and retention indicators
- [ ] Database schema includes audit columns (`created_at`, `status`) to support SQL queries
- [ ] Operational metrics (infrastructure costs, ticket counts) documented
- [ ] Baseline metrics recorded for comparison post-launch
- [ ] Metrics collection points built into code pipelines
- [ ] Dashboards defined to visualize KPIs regularly
- [ ] Feedback loops configured to guide future roadmap updates

## 12. Output Template
```markdown
# Success Metrics: [Project Name]

### 1. Business KPIs
- **Monthly Active Users (MAU) Growth:** Target 15% month-over-month growth.
  - *Tracking Query:* `SELECT COUNT(DISTINCT user_id) FROM session WHERE created_at >= NOW() - INTERVAL '30 days';`
- **Checkout Conversion Rate:** Target >3% of shopping cart sessions completing purchase.
  - *Tracking Query:* `SELECT (COUNT(DISTINCT paid_orders.id)::float / COUNT(DISTINCT carts.id)) * 100 FROM carts LEFT JOIN paid_orders ON ...`

### 2. Product Engagement KPIs
- **User Retention (Day 7):** Target >30% of users logging back in 7 days post-registration.
- **Feature Adoption Rate:** Target >50% of active users generating at least one invoice in month 1.

### 3. Operational KPIs
- **Average Checkout Latency:** P95 checkout API response time must remain under 300ms.
- **Support Ticket Rate:** Less than 1 support ticket generated per 1,000 paid transactions.
- **Infrastructure Cost Efficiency:** Monthly database and server hosting costs under $0.05 per active user.
```
