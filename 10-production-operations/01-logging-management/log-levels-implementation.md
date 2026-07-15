# Log Levels

## 1. Backend Application Context
Log Levels categorize log entries by severity (DEBUG, INFO, WARN, ERROR, FATAL) to control log outputs across development, staging, and production environments.

## 2. Backend-Specific Pitfalls
- **Spamming INFO/WARN logs in loops:** Outputting debug loops at the INFO level, bloating log ingestion sizes and cloud bills.

## 3. Code-Shape Example
`python
# Correct log level choices
def process_refund(refund_id):
    logger.debug(f"Initiating refund calculations for {refund_id}") # DEBUG: fine-grained detail
    if not is_refund_eligible(refund_id):
        logger.warning(f"User ineligible for refund: {refund_id}") # WARN: unexpected but handled
        return False
    try:
        execute_payment_refund(refund_id)
        logger.info(f"Refund successfully executed: {refund_id}") # INFO: normal process state
    except PaymentGatewayException as e:
        logger.error(f"Refund payment failed: {refund_id} | {str(e)}") # ERROR: execution failure
        raise e
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Logging](../../production_principles/foundations/02-logging-management-guide.md)
