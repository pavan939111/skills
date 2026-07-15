# Async Programming

## 1. Backend Application Context
Asynchronous Programming utilizes non-blocking execution models (event loops, coroutines, async/await, goroutines) to process thousands of concurrent I/O operations (like database queries and API calls) without blocking main execution threads.

## 2. Backend-Specific Pitfalls
- **Starving the event loop:** Running heavy synchronous processing (e.g. image calculations, large loops) inside async functions, blocking all other requests.

## 3. Code-Shape Example
`javascript
// Asynchronous HTTP request execution in Node/Express
app.get('/dashboard', async (req, res, next) => {
  try {
    # Non-blocking concurrent fetches using Promise.all
    const [profile, orders] = await Promise.all([
      profileService.getProfile(req.user.id),
      orderService.getRecentOrders(req.user.id)
    ]);
    res.json({ profile, orders });
  } catch (err) {
    next(err);
  }
});
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [Performance Engineering](../../production_principles/performance-and-scale/01-performance-engineering.md)
