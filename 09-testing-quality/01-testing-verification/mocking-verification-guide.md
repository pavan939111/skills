# Mocking

## 1. Backend Application Context
Mocking replaces real classes or remote API gateways with test-controlled stubs, allowing logic checks without external connections.

## 2. Backend-Specific Pitfalls
- **Mocking internal details:** Mocking private class methods instead of public interface methods, causing tests to break during refactoring.

## 3. Code-Shape Example
`python
# Mocking external HTTP client calls
def test_fetch_weather_success(monkeypatch):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"temp": 22}
    
    # Patch request library call
    monkeypatch.setattr(requests, "get", lambda url, **kwargs: mock_response)
    
    weather = weather_client.get_temp("Berlin")
    assert weather == 22
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Testing Production Grade](../../production_principles/delivery-and-readiness/01-testing-production-grade-verification-guide.md)
