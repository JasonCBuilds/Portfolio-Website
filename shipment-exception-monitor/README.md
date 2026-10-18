# Shipment Exception Monitor

A portfolio-ready shipment exception dashboard that demonstrates practical supply-chain monitoring logic in a browser-based application.

## Business problem

Transportation teams often manage hundreds of shipments across carriers. The challenge is not seeing every shipment—it is identifying the few that require action before a missed delivery becomes a customer escalation.

This project converts shipment events into an exception work queue using simple operational rules.

## Features

- KPI cards for active shipments, open exceptions, on-time delivery rate, and at-risk freight
- Rules for late shipments, stale tracking scans, and shipments due within 24 hours
- Search and status filtering
- Adjustable stale-scan threshold
- Email alert preview for exception shipments
- Add-your-own-shipment scenario testing
- Responsive interface built with HTML, CSS, and vanilla JavaScript
- No build step or external dependencies

## Exception logic

| Condition | Result |
| --- | --- |
| ETA passed and shipment is still in transit | High-priority late exception |
| Last tracking scan exceeds configured threshold | High-priority stale-scan exception |
| ETA is within 24 hours | At-risk warning |
| Delivered at or before ETA | On-time delivery |
| Delivered after ETA | Delivered-late exception |

## Email integration

The browser demo intentionally generates an alert **payload and preview** rather than sending email directly. Production email should be sent from a secure server-side or serverless function so API keys are never exposed in browser JavaScript.

The exception engine produces the information needed by an existing email workflow:

- Shipment ID
- Carrier
- Lane
- ETA
- Last scan time
- Exception type
- Severity
- Recommended operational action

## Run locally

Open `index.html` directly in a browser, or serve the project folder:

```bash
python -m http.server 8000
```

Then open the shipment-exception-monitor path in your browser.

## Portfolio relevance

This project demonstrates:

- Transportation operations knowledge
- Exception-management design
- KPI thinking
- Workflow automation
- Front-end implementation
- Translating business rules into software behavior

A natural production extension would connect this UI to carrier APIs, a TMS, or a shipment-event database and route exceptions into email, Slack, or ticketing workflows.
