# API Pagination

## 1. Definition & Core Concepts
API Pagination is the practice of dividing a large query dataset into smaller, manageable chunks (pages) and returning them progressively to client interfaces.

## 2. Why It Exists / What Problem It Solves
Querying and returning millions of database records in a single API call is extremely slow, consumes massive server memory, blocks database connection pools, and can cause crashes. Pagination limits individual query sizes to ensure fast, stable responses.

## 3. What Breaks in Production Without It
- **Out of Memory Outages:** A client calls an un-paginated /orders endpoint, forcing the server to load 500,000 database rows into memory and causing the node container to crash.
- **Database Locks:** Long-running database queries block write transactions, slowing down the application.

## 4. Best Practices
- **Provide Default and Max Limits:** Set sensible defaults (e.g. 20 items per page) and restrict maximum request limits (e.g. max 100 items) to prevent abuse.
- **Implement Keyset (Cursor) Pagination:** For high-throughput, frequently updated lists (like feeds), use keyset pagination (using WHERE id > last_seen_id LIMIT 20) to keep query speeds consistent and avoid duplicate items on page transitions.
- **Use Offset Pagination for Static Lists:** Use standard offset pagination (LIMIT 20 OFFSET 40) for static, small datasets where jump-to-page navigation is required.

## 5. Common Mistakes / Anti-Patterns
- **Using Offset Pagination for massive tables:** Running high offset queries (e.g. OFFSET 1000000) on large tables, causing SQL engines to scan millions of rows and slowing down search performance.
- **Neglecting order keys:** Paginating queries without specifying an explicit ORDER BY key, resulting in random record assortments across pages.

## 6. Security Considerations
- **Denial of Service Prevention:** Enforce max limits on limit parameters to prevent users from requesting millions of rows.

## 7. Performance Considerations
- **Index Alignment:** Ensure columns used for pagination (like created_at or id) have database indexes configured.

## 8. Scalability Considerations
- **Standardized Metadata schemas:** Return metadata headers (such as 
ext_cursor, has_more, or 	otal_count) consistently across paginated routes.

## 9. How Major Companies Implement It
- **Stripe / Slack:** Utilize cursor-based pagination exclusively, returning has_more flags and starting_after cursor strings in response JSONs.

## 10. Decision Checklist (Pagination Patterns)
- Use **Cursor-based Pagination** when:
  - Working on high-volume, real-time datasets (chats, feeds, audit logs) where rows are appended frequently and performance must scale.
- Use **Offset-based Pagination** when:
  - Working on small, static tables (configurations, directories) where users require jumping to specific page numbers.

## 11. AI Coding-Agent Guidelines
- Write SQL queries that parse limit/cursor arguments and apply index-aligned filters to optimize pagination checks.

## 12. Reusable Checklist
- [ ] Default and maximum pagination limits defined on all list endpoints
- [ ] Cursor-based pagination implemented for high-frequency or large tables
- [ ] Database indexes active on columns used for sorting and paginating
- [ ] Response payloads include metadata (has_more, next_cursor, or total)
- [ ] Queries specify sorting keys (ORDER BY) to prevent record scrambles
- [ ] Offset limits locked to prevent deep-scan resource exhaustion
