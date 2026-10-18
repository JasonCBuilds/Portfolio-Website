const HOUR = 60 * 60 * 1000;
const now = () => new Date();

function dateFromHours(offset) {
  return new Date(Date.now() + offset * HOUR);
}

function buildDemoShipments() {
  return [
    { id: "FZ-1042", carrier: "UPS Freight", origin: "Newark, NJ", destination: "Boston, MA", eta: dateFromHours(18), lastScan: dateFromHours(-3), status: "in_transit", deliveredAt: null },
    { id: "FZ-1043", carrier: "FedEx Freight", origin: "Elizabeth, NJ", destination: "Philadelphia, PA", eta: dateFromHours(-9), lastScan: dateFromHours(-28), status: "in_transit", deliveredAt: null },
    { id: "FZ-1044", carrier: "XPO", origin: "Secaucus, NJ", destination: "Hartford, CT", eta: dateFromHours(8), lastScan: dateFromHours(-41), status: "in_transit", deliveredAt: null },
    { id: "FZ-1045", carrier: "Old Dominion", origin: "Kearny, NJ", destination: "Baltimore, MD", eta: dateFromHours(36), lastScan: dateFromHours(-4), status: "in_transit", deliveredAt: null },
    { id: "FZ-1046", carrier: "J.B. Hunt", origin: "Newark, NJ", destination: "Albany, NY", eta: dateFromHours(-10), lastScan: dateFromHours(-12), status: "delivered", deliveredAt: dateFromHours(-12) },
    { id: "FZ-1047", carrier: "Estes", origin: "Paterson, NJ", destination: "Queens, NY", eta: dateFromHours(20), lastScan: dateFromHours(-14), status: "in_transit", deliveredAt: null }
  ];
}

let shipments = buildDemoShipments();

const body = document.querySelector("#shipment-body");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search");
const statusFilter = document.querySelector("#status-filter");
const staleHours = document.querySelector("#stale-hours");
const alertPreview = document.querySelector("#alert-preview");
const form = document.querySelector("#shipment-form");
const formMessage = document.querySelector("#form-message");

const formatDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

function hoursBetween(later, earlier) {
  return (later.getTime() - earlier.getTime()) / HOUR;
}

function evaluateShipment(shipment) {
  if (shipment.status === "delivered") {
    const onTime = shipment.deliveredAt && shipment.deliveredAt <= shipment.eta;
    return {
      level: "good",
      label: onTime ? "Delivered on time" : "Delivered late",
      exception: !onTime,
      reason: onTime ? "Completed before ETA" : "Delivery occurred after ETA"
    };
  }

  const current = now();
  const hoursPastEta = hoursBetween(current, shipment.eta);
  const scanAge = hoursBetween(current, shipment.lastScan);
  const hoursToEta = hoursBetween(shipment.eta, current);
  const staleThreshold = Number(staleHours.value);

  if (hoursPastEta > 0) {
    return {
      level: "high",
      label: "Late",
      exception: true,
      reason: "ETA passed " + Math.ceil(hoursPastEta) + " hours ago"
    };
  }

  if (scanAge >= staleThreshold) {
    return {
      level: "high",
      label: "Stale scan",
      exception: true,
      reason: "No tracking event for " + Math.floor(scanAge) + " hours"
    };
  }

  if (hoursToEta <= 24) {
    return {
      level: "medium",
      label: "At risk",
      exception: false,
      reason: "Due in " + Math.max(0, Math.ceil(hoursToEta)) + " hours"
    };
  }

  return {
    level: "good",
    label: "On track",
    exception: false,
    reason: "No active exception"
  };
}

function updateMetrics() {
  const active = shipments.filter(s => s.status === "in_transit");
  const evaluations = shipments.map(s => ({ shipment: s, health: evaluateShipment(s) }));
  const exceptions = evaluations.filter(x => x.health.exception && x.shipment.status !== "delivered");
  const atRisk = evaluations.filter(x => x.health.label === "At risk");
  const delivered = shipments.filter(s => s.status === "delivered");
  const onTimeDelivered = delivered.filter(s => s.deliveredAt && s.deliveredAt <= s.eta);
  const rate = delivered.length ? Math.round((onTimeDelivered.length / delivered.length) * 100) : 0;

  document.querySelector("#metric-active").textContent = active.length;
  document.querySelector("#metric-exceptions").textContent = exceptions.length;
  document.querySelector("#metric-risk").textContent = atRisk.length;
  document.querySelector("#metric-ontime").textContent = rate + "%";
}

function matchesFilters(shipment) {
  const query = searchInput.value.trim().toLowerCase();
  const health = evaluateShipment(shipment);
  const haystack = [shipment.id, shipment.carrier, shipment.origin, shipment.destination].join(" ").toLowerCase();
  const matchesSearch = !query || haystack.includes(query);

  let matchesStatus = true;
  if (statusFilter.value === "exception") matchesStatus = health.exception && shipment.status !== "delivered";
  if (statusFilter.value === "in_transit") matchesStatus = shipment.status === "in_transit";
  if (statusFilter.value === "delivered") matchesStatus = shipment.status === "delivered";

  return matchesSearch && matchesStatus;
}

function render() {
  updateMetrics();
  body.innerHTML = "";

  const visible = shipments.filter(matchesFilters);
  emptyState.hidden = visible.length !== 0;

  visible.forEach(shipment => {
    const health = evaluateShipment(shipment);
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td><strong>" + shipment.id + "</strong><span class='subtle'>" + (shipment.status === "delivered" ? "Delivered" : "In transit") + "</span></td>" +
      "<td class='lane'>" + shipment.origin + "<span class='subtle'>→ " + shipment.destination + "</span></td>" +
      "<td>" + shipment.carrier + "</td>" +
      "<td>" + formatDate.format(shipment.eta) + "</td>" +
      "<td>" + formatDate.format(shipment.lastScan) + "</td>" +
      "<td><span class='health " + health.level + "'>" + health.label + "</span><span class='subtle'>" + health.reason + "</span></td>" +
      "<td><button class='row-button' type='button' data-id='" + shipment.id + "'" + (health.exception ? "" : " disabled") + ">Preview alert</button></td>";
    body.appendChild(tr);
  });

  body.querySelectorAll(".row-button:not(:disabled)").forEach(button => {
    button.addEventListener("click", () => previewAlert(button.dataset.id));
  });
}

function previewAlert(id) {
  const shipment = shipments.find(s => s.id === id);
  if (!shipment) return;
  const health = evaluateShipment(shipment);

  const subject = "[Shipment Exception] " + shipment.id + " — " + health.label;
  const message =
    "Shipment " + shipment.id + " requires review.\n" +
    "Carrier: " + shipment.carrier + "\n" +
    "Lane: " + shipment.origin + " → " + shipment.destination + "\n" +
    "ETA: " + formatDate.format(shipment.eta) + "\n" +
    "Last scan: " + formatDate.format(shipment.lastScan) + "\n" +
    "Exception: " + health.reason + "\n\n" +
    "Recommended action: confirm carrier status, update the customer, and record the resolution.";

  alertPreview.innerHTML =
    "<dl>" +
    "<div><dt>Subject</dt><dd class='alert-subject'>" + subject + "</dd></div>" +
    "<div><dt>Body</dt><dd>" + message + "</dd></div>" +
    "<div><dt>Integration payload</dt><dd>{ shipmentId: \"" + shipment.id + "\", severity: \"" + health.level + "\", exception: \"" + health.label + "\" }</dd></div>" +
    "</dl>";
}

function addShipment(event) {
  event.preventDefault();
  const data = new FormData(form);
  const id = String(data.get("id")).trim();

  if (shipments.some(s => s.id.toLowerCase() === id.toLowerCase())) {
    formMessage.textContent = "That shipment ID already exists.";
    return;
  }

  const eta = new Date(String(data.get("eta")));
  const hours = Number(data.get("lastScanHours"));

  if (!id || Number.isNaN(eta.getTime()) || !Number.isFinite(hours) || hours < 0) {
    formMessage.textContent = "Enter valid shipment details.";
    return;
  }

  shipments.unshift({
    id,
    carrier: String(data.get("carrier")).trim(),
    origin: String(data.get("origin")).trim(),
    destination: String(data.get("destination")).trim(),
    eta,
    lastScan: dateFromHours(-hours),
    status: "in_transit",
    deliveredAt: null
  });

  form.reset();
  formMessage.textContent = id + " added to the monitor.";
  render();
}

searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);
staleHours.addEventListener("change", render);
form.addEventListener("submit", addShipment);

document.querySelector("#reset-data").addEventListener("click", () => {
  shipments = buildDemoShipments();
  alertPreview.innerHTML = "<p class='placeholder'>Choose “Preview alert” on an exception shipment.</p>";
  formMessage.textContent = "";
  render();
});

render();
