# JasonCBuilds Operations Toolkit

A growing portfolio of practical supply-chain and logistics tools built to demonstrate how operational knowledge can be translated into software, automation, and decision support.

## Projects

### 1. Last-Mile Delivery Cost Calculator

A route economics tool for estimating:

- Fuel cost
- Labor cost
- Fixed operating cost
- Cost per stop
- Suggested route pricing
- Estimated profit at a target margin

**Business value:** helps operators price routes consistently and understand the cost drivers behind last-mile delivery.

The calculator is the repository root application.

### 2. Shipment Exception Monitor

Located in `/shipment-exception-monitor`.

An interactive shipment-health dashboard that:

- Flags late shipments
- Detects stale carrier scans
- Surfaces shipments due within 24 hours
- Calculates exception KPIs
- Lets users search and filter freight
- Generates structured email-alert previews
- Allows scenario testing with user-added shipments

**Business value:** helps transportation teams focus attention on shipments that require intervention before they become customer escalations.

See: [Shipment Exception Monitor README](shipment-exception-monitor/README.md)

## Why this portfolio exists

These projects combine hands-on supply-chain thinking with lightweight software development. The goal is not to recreate a full TMS or ERP. It is to demonstrate how clear business rules, usable interfaces, and automation can solve focused operational problems.

Areas represented in the toolkit include:

- Transportation management
- Last-mile operations
- Shipment exception management
- Cost modeling
- KPI design
- Workflow automation
- Operational decision support

## Technology

The current projects intentionally use simple browser technologies:

- HTML
- CSS
- Vanilla JavaScript

That keeps each tool easy to inspect, run, and deploy without a build system.

## Roadmap

Potential additions include:

- Carrier performance scorecard
- Inventory reorder planner
- Freight quote comparison tool
- Purchase-order exception monitor
- Secure server-side email integration
- External carrier/TMS API integrations
