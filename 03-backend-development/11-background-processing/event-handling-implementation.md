# Event Handling

## 1. Backend Application Context
Event Handling is the code pattern that processes events published by the application or external messaging brokers, mapping payloads to event handler classes.

## 2. Backend-Specific Pitfalls
- **Tightly coupling handler exceptions:** Letting an event handler crash raise errors back to the event publisher, blocking event loops.

## 3. Code-Shape Example
`python
# Event routing mapper class
class OrderEventRouter:
    def __init__(self):
        self.handlers = {
            "order.placed": process_order_placed,
            "order.cancelled": process_order_cancelled
        }

    def route_event(self, event):
        handler = self.handlers.get(event.type)
        if handler:
            try:
                handler(event.payload)
            except Exception as e:
                logger.error(f"Event handler crash for {event.type}: {str(e)}")
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- Background Jobs and Messaging
