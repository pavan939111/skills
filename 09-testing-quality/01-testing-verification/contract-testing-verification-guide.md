# Contract Testing

## 1. Backend Application Context
Contract Testing validates interface compatibility between providers (APIs) and consumers (frontends/microservices) to prevent integration breakages.

## 2. Backend-Specific Pitfalls
- **Manual OpenAPI contract audits:** Failing to automate contract testing, letting API changes break frontend systems.

## 3. Code-Shape Example
`javascript
// Pact Consumer contract test mock
const provider = new Pact({ consumer: 'Frontend', provider: 'OrderService' });

await provider.addInteraction({
  state: 'order exists',
  uponReceiving: 'request for order',
  withRequest: { method: 'GET', path: '/orders/1' },
  willRespondWith: { status: 200, body: { id: 1, total: 150 } }
});
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Testing Production Grade](../../production_principles/delivery-and-readiness/01-testing-production-grade-verification-guide.md)
