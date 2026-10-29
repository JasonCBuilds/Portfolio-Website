const times = ["10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM"];
let selectedTime = times[0];
let joinedQueue = false;
let queuePosition = 4;

const bookTab = document.querySelector("#book-tab");
const queueTab = document.querySelector("#queue-tab");
const bookView = document.querySelector("#book-view");
const queueView = document.querySelector("#queue-view");
const timeGrid = document.querySelector("#time-grid");
const bookingResult = document.querySelector("#booking-result");
const queueResult = document.querySelector("#queue-result");
const queueAction = document.querySelector("#queue-action");
const queueCount = document.querySelector("#queue-count");

const dateInput = document.querySelector("#date");
dateInput.min = new Date().toLocaleDateString("en-CA");

function switchMode(mode) {
  const booking = mode === "book";
  bookView.hidden = !booking;
  queueView.hidden = booking;
  bookTab.classList.toggle("active", booking);
  queueTab.classList.toggle("active", !booking);
}

bookTab.addEventListener("click", () => switchMode("book"));
queueTab.addEventListener("click", () => switchMode("queue"));

function renderTimes() {
  timeGrid.innerHTML = "";
  times.forEach(time => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "time-button" + (time === selectedTime ? " active" : "");
    button.textContent = time;
    button.addEventListener("click", () => {
      selectedTime = time;
      bookingResult.hidden = true;
      renderTimes();
    });
    timeGrid.appendChild(button);
  });
}

document.querySelector("#preview-booking").addEventListener("click", () => {
  const provider = document.querySelector("#provider").value;
  const service = document.querySelector("#service").value;
  const date = dateInput.value;

  if (!date) {
    bookingResult.hidden = false;
    bookingResult.textContent = "Choose a date before previewing the booking.";
    return;
  }

  bookingResult.hidden = false;
  bookingResult.innerHTML =
    "<strong>Demo booking preview</strong><br>" +
    service + " with " + provider + "<br>" +
    date + " at " + selectedTime +
    "<br><small>No reservation was saved.</small>";
});

queueAction.addEventListener("click", () => {
  const provider = document.querySelector("#queue-provider").value;

  if (!joinedQueue) {
    joinedQueue = true;
    queueCount.textContent = queuePosition + " waiting";
    queueAction.textContent = "Leave demo queue";
    queueResult.hidden = false;
    queueResult.innerHTML =
      "<strong>Demo queue joined</strong><br>" +
      "Position: " + queuePosition + "<br>" +
      "Provider preference: " + provider +
      "<br><small>No customer data was saved.</small>";
  } else {
    joinedQueue = false;
    queueCount.textContent = "3 waiting";
    queueAction.textContent = "Join demo queue";
    queueResult.hidden = false;
    queueResult.textContent = "You left the simulated queue.";
  }
});

renderTimes();
