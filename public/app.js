const calendar = document.querySelector(".calendar");
const eventPopup = document.getElementById("event-popup");
const popupHeader = document.getElementById("popup-header");
const popupText = document.getElementById("popup-text");
let selectedEvent = null;
let selectedDay = null;

const eventDay = document.getElementById("event-day");
const eventMonth = document.getElementById("event-month");

const form = document.querySelector("#entry-form");
const submitPopup = document.getElementById("submit-popup");
const submitCancel = document.getElementById("submit-cancel");
const deleteButton = document.getElementById("popup-delete-button");

submitCancel.addEventListener("click", async (event) => {
  submitPopup.hidden = true;
});

document.addEventListener("click", async (event) => {
  const target = event.target;
  const calendarArea = target.closest(".calendar");

  if (!calendarArea) return;

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

    deleteButton.setAttribute("hx-delete", "/events/" + data.event_id);
    deleteButton.setAttribute("hx-target", "#" + selectedEvent.id);

    htmx.process(deleteButton);
  } else if (dayClicked) {
    selectedDay = dayClicked;

    eventDay.value = Number.parseInt(selectedDay.dataset.day);
    eventMonth.value = Number.parseInt(selectedDay.dataset.month) + 1;

    const targetId = `event-list-${eventMonth.value}-${eventDay.value}`;

    form.setAttribute("hx-target", `#${targetId}`);

    const pos = dayClicked.getBoundingClientRect();
    submitPopup.style.top = pos.top + "px";
    submitPopup.style.left = pos.left + "px";
    submitPopup.hidden = false;
  }
});

document.body.addEventListener("htmx:afterRequest", (event) => {
  if (event.detail.successful) {
    if (event.detail.elt.id == "entry-form") {
      form.reset();
      submitPopup.hidden = true;
    }
    if (event.detail.elt.id == "popup-delete-button") {
      popup.hidden = true;
    }
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
  }
});
