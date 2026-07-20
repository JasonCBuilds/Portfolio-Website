# Last-Mile Delivery Cost Calculator

A lightweight, mobile-friendly web calculator for estimating route economics. It helps logistics, delivery, and operations teams understand the cost to serve a route, compare that cost with a target selling price, and evaluate profitability at both the route and stop level.

## Business problem

Last-mile delivery is often the most operationally complex and expensive part of fulfillment. Route distance, stop density, driver time, vehicle efficiency, fuel prices, and fixed expenses all affect whether a route is profitable. When these inputs live in separate spreadsheets or are estimated informally, teams can underprice work or overlook inefficient routes.

This calculator brings the core variables into one transparent model that is quick to use in pricing discussions, route reviews, and scenario planning.

## Features

- Inputs for route distance, stops, time, fuel, vehicle efficiency, labor, fixed costs, and target margin
- Estimated fuel cost, labor cost, and total operating cost
- Cost-per-stop visibility for route benchmarking
- Suggested total route price and price per stop
- Estimated profit at the chosen target margin
- Input validation and a one-click reset
- Responsive card-based layout for desktop and mobile
- No frameworks or build step—just HTML, CSS, and JavaScript

## Formulas

| Result | Formula |
| --- | --- |
| Fuel cost | `(route miles ÷ vehicle MPG) × fuel price per gallon` |
| Labor cost | `(route minutes ÷ 60) × hourly labor cost` |
| Total operating cost | `fuel cost + labor cost + additional fixed costs` |
| Cost per stop | `total operating cost ÷ delivery stops` |
| Suggested route price | `total operating cost ÷ (1 − target margin decimal)` |
| Suggested price per stop | `suggested route price ÷ delivery stops` |
| Estimated profit | `suggested route price − total operating cost` |

The target is treated as a **profit margin**, meaning profit as a percentage of the final selling price. This differs from a markup, which applies a percentage directly to cost.

## Strategic operations relevance

The tool supports common last-mile decisions such as:

- Evaluating whether a proposed route can meet profitability targets
- Comparing routes with different stop densities or drive times
- Understanding how fuel or wage changes affect pricing
- Creating a consistent cost baseline for delivery bids
- Identifying the operational levers—miles, minutes, stops, or fixed costs—with the greatest effect on cost per stop

It is a directional planning tool rather than a replacement for a full transportation-management or accounting system. Insurance, depreciation, failed deliveries, overhead, taxes, and other costs can be included in the additional fixed operating cost input when relevant.

## Run locally

Open `index.html` in any modern browser. No installation or build command is required.

For a local web server, run one of these commands in the project folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Push these files to a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch and the root folder, then save.

GitHub Pages will publish the static app without additional configuration.
