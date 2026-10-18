// Keep common number formatting in one place so every result looks consistent.
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

const form = document.querySelector("#calculator-form");
const errorMessage = document.querySelector("#form-error");

// Connect calculation names to their matching result elements.
const output = {
  fuelCost: document.querySelector("#fuel-cost"),
  laborCost: document.querySelector("#labor-cost"),
  totalCost: document.querySelector("#total-cost"),
  costPerStop: document.querySelector("#cost-per-stop"),
  routePrice: document.querySelector("#route-price"),
  pricePerStop: document.querySelector("#price-per-stop"),
  profit: document.querySelector("#profit")
};

function calculateRoute() {
  // FormData lets us read each named input without repeating query selectors.
  const data = new FormData(form);
  const values = Object.fromEntries(
    [...data.entries()].map(([name, value]) => [name, Number(value)])
  );

  const allNumbersAreValid = Object.values(values).every(Number.isFinite);
  const positiveRouteValues = values.miles > 0 && values.stops > 0 && values.minutes > 0 && values.mpg > 0;
  const nonNegativeCosts = values.fuelPrice >= 0 && values.laborRate >= 0 && values.fixedCosts >= 0;
  const validMargin = values.margin >= 0 && values.margin < 100;

  if (!allNumbersAreValid || !positiveRouteValues || !nonNegativeCosts || !validMargin) {
    errorMessage.textContent = "Enter valid values. Route details must be above zero, costs cannot be negative, and margin must be below 100%.";
    return;
  }

  errorMessage.textContent = "";

  // Fuel cost = gallons used × price per gallon.
  const fuelCost = (values.miles / values.mpg) * values.fuelPrice;
  // Labor cost converts route minutes to hours before applying the hourly rate.
  const laborCost = (values.minutes / 60) * values.laborRate;
  const totalCost = fuelCost + laborCost + values.fixedCosts;
  const costPerStop = totalCost / values.stops;

  // Margin is profit as a share of the final selling price, so divide cost by (1 - margin).
  const routePrice = totalCost / (1 - values.margin / 100);
  const pricePerStop = routePrice / values.stops;
  const profit = routePrice - totalCost;

  const results = { fuelCost, laborCost, totalCost, costPerStop, routePrice, pricePerStop, profit };
  Object.entries(results).forEach(([name, value]) => {
    output[name].textContent = currency.format(value);
  });

  document.querySelector("#pricing-note").textContent =
    `Pricing includes a ${values.margin}% target profit margin on the final route price. Adjust inputs to compare route scenarios.`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateRoute();
});

form.addEventListener("reset", () => {
  // The browser restores defaults after the reset event, so calculate on the next tick.
  window.setTimeout(calculateRoute, 0);
});

// Show useful sample results as soon as the page opens.
calculateRoute();
