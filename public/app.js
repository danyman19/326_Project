const calendar = document.querySelector(".calendar");
const eventPopup = document.getElementById("event-popup");
const popupHeader = document.getElementById("popup-header");
const popupText = document.getElementById("popup-text");
let selectedEvent = null;
let selectedDay = null;

const form = document.querySelector("#entry-form");
const submitPopup = document.getElementById("submit-popup");
const submitCancel = document.getElementById("submit-cancel");

// Every request gives up after five seconds instead of waiting forever.
const timedFetch = (url, options = {}) =>
  fetch(url, { ...options, signal: AbortSignal.timeout(5000) });

// Send a request and return the JSON the server answered with. Anything
// that goes wrong (no answer within five seconds, no connection, an error
// status, a body that is not JSON) throws one Error whose message can go
// straight to the person using the page.
const fetchJSON = async (url, options) => {
  let response;
  try {
    response = await timedFetch(url, options);
  } catch (error) {
    throw new Error(
      error.name === "TimeoutError"
        ? "The server did not answer within five seconds."
        : "Could not reach the server.",
    );
  }

  let body = {};
  try {
    body = await response.json();
  } catch {
    // An empty body, or an error page in HTML: the status still says enough.
  }

  if (!response.ok) {
    throw new Error(body.error || `The server answered ${response.status}.`);
  }
  return body;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log("detected");

  const data = new FormData(form);
  const entry = Object.fromEntries(data);
  const button = form.querySelector("button");

  entry.day = Number.parseInt(selectedDay.dataset.day);
  entry.month = Number.parseInt(selectedDay.dataset.month) + 1;

  button.disabled = true;
  try {
    const save = await fetchJSON("/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    const event = document.createElement("div");
    event.className = "event";
    event.textContent = entry.title;
    event.dataset.event = JSON.stringify(save);

    selectedDay.appendChild(event);

    form.reset();
    submitPopup.hidden = true;
  } catch (error) {
    alert(`Your entry was not saved. ${error.message}`);
  }
  button.disabled = false;
});

submitCancel.addEventListener("click", async (event) => {
  submitPopup.hidden = true;
});

calendar.addEventListener("click", async (event) => {
  const eventClicked = event.target.closest(".event");
  const dayClicked = event.target.closest(".day");

  if (eventClicked) {
    selectedEvent = eventClicked;

    const data = JSON.parse(selectedEvent.dataset.event);
    popupHeader.textContent = data.title + " " + data.month + "/" + data.day;
    popupText.textContent = data.description;

    const pos = eventClicked.getBoundingClientRect();
    eventPopup.style.top = pos.top + "px";
    eventPopup.style.left = pos.left + "px";

    eventPopup.hidden = false;
  } else if (dayClicked) {
    selectedDay = dayClicked;

    const pos = dayClicked.getBoundingClientRect();
    submitPopup.style.top = pos.top + "px";
    submitPopup.style.left = pos.left + "px";
    submitPopup.hidden = false;
  }
});

const popup = document.getElementById("event-popup");

popup.addEventListener("click", async (event) => {
  const button = event.target;

  if (button.matches("#popup-edit-button")) {
    const eventName = prompt("Event name: ");

    if (eventName === null || eventName.trim() === "") return;
    selectedEvent.textContent = eventName;
    popupHeader.textContent = eventName;
    return;
  }
  if (button.matches("#popup-close-button")) {
    popup.hidden = true;
    return;
  }

  if (button.matches("#popup-delete-button")) {
    const close_button = document.getElementById("popup-close-button");

    button.disabled = true;
    close_button.disabled = true;

    const id = JSON.parse(selectedEvent.dataset.event).event_id;
    try {
      await fetchJSON(`/events/${id}`, { method: "DELETE" });

      selectedEvent.remove();
      popup.hidden = true;
    } catch (error) {
      alert(`That entry was not deleted. ${error.message}`);
    }

    button.disabled = false;
    close_button.disabled = false;
  }
});
