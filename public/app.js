const calendar = document.querySelector(".calendar");
const eventPopup = document.getElementById("event-popup");
const popupHeader = document.getElementById("popup-header");
const popupText = document.getElementById("popup-text");
let selectedEvent = null;
let selectedDay = null;
let eventParent = null;

const eventDay = document.getElementById("event-day");
const eventMonth = document.getElementById("event-month");

const form = document.querySelector("#entry-form");
const submitPopup = document.getElementById("submit-popup");
const submitCancel = document.getElementById("submit-cancel");
const deleteButton = document.getElementById("popup-delete-button");

submitCancel.addEventListener("click", async (event) => {
  submitPopup.hidden = true;
  selectedDay.focus();
});

function eventClick() {
  const data = JSON.parse(selectedEvent.dataset.event);
  popupHeader.textContent = data.title + " " + data.month + "/" + data.day;
  popupText.textContent = data.description;

  eventParent = selectedEvent.closest(".day");

  // const pos = eventClicked.getBoundingClientRect();
  // eventPopup.style.top = pos.top + "px";
  // eventPopup.style.left = pos.left + "px";

  eventPopup.hidden = false;
  eventPopup.setAttribute("tabindex", "-1");
  eventPopup.focus();

  deleteButton.setAttribute("hx-delete", "/events/" + data.event_id);
  deleteButton.setAttribute("hx-target", "#" + selectedEvent.id);

  htmx.process(deleteButton);
}

function dayClick() {
  eventDay.value = Number.parseInt(selectedDay.dataset.day);
  eventMonth.value = Number.parseInt(selectedDay.dataset.month) + 1;

  const targetId = `event-list-${eventMonth.value}-${eventDay.value}`;

  form.setAttribute("hx-target", `#${targetId}`);

  submitPopup.hidden = false;
  submitPopup.querySelector("#event-title").focus();
}

document.addEventListener("keydown", (event) => {
  if (event.altKey && event.shiftKey && event.code === "KeyN") {
    event.preventDefault();
    if (!submitPopup.hidden) {
      submitPopup.querySelector("#event-title").focus();
    } else if (!eventPopup.hidden) {
      eventPopup.setAttribute("tabindex", "-1");
      eventPopup.focus();
    } else {
      document.querySelector(".auth-nav").setAttribute("tabindex", "-1");
      document.querySelector(".auth-nav").focus();
    }
    document.querySelector("#entry-title").focus();
  }

  if (event.key != "Enter" && event.key != " ") return;

  const target = event.target;
  const calendarArea = target.closest(".calendar");

  if (!calendarArea) return;

  const eventClicked = event.target.closest(".event");
  const dayClicked = event.target.closest(".day");

  if (eventClicked) {
    selectedEvent = eventClicked;

    eventClick();
  } else if (dayClicked) {
    selectedDay = dayClicked;
    dayClick();
  }
});

document.addEventListener("click", async (event) => {
  const target = event.target;
  const calendarArea = target.closest(".calendar");

  if (!calendarArea) return;

  const eventClicked = event.target.closest(".event");
  const dayClicked = event.target.closest(".day");

  if (eventClicked) {
    selectedEvent = eventClicked;
    eventClick();
  } else if (dayClicked) {
    selectedDay = dayClicked;
    dayClick();
  }
});

//FOCUS DETAILS
document.body.addEventListener("htmx:afterSwap", (event) => {
  const target = event.target;

  if (target.id.startsWith("event-list-")) {
    target.lastElementChild.focus();
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

      eventParent.focus();
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
    selectedEvent.focus();
  }
});
