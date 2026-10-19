
import { Ok, Err } from "../result.js";
import { getAll, save } from "../repositories/eventsRepository.js";

//validate the fields before an event is added to the file
const validateEvent = ({ day, month, title, description="" } = {}) => {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    return Err({
      status: 400,
      message: "Day and month must be valid numbers"
    });
  }

  // validation to check the number of days allowed in the respective month
  const daysInMonth = [
    31, 28, 31, 30, 31, 30,
    31, 31, 30, 31, 30, 31
  ];

  if (day < 1 || day > daysInMonth[month - 1]) {
    return Err({
      status: 400,
      message: "The selected day is not valid for that month"
    });
  }

  if (typeof title !== "string" || !title.trim()) {
    return Err({
      status: 400,
      message: "Event title is required"
    });
  }

  if (typeof description !== "string") {
    return Err({
      status: 400,
      message: "Event description must be text"
    });
  }

  return Ok({
    day,
    month,
    title: title.trim(),
    description: description.trim()
  });
};

// GET request
export const listEvents = async () => {
  return await getAll();
};

// POST request saves the event
export const createEvent = async (data) => {
  const result = validateEvent(data);

  if (!result.ok) {
    return result;
  }

  const events = await getAll();
  events.push(result.value);
  await save(events);

  return Ok(result.value);
};

// DELETE- removes first event matching all four field
export const deleteEvent = async (data) => {
  const events = await getAll();

  const index = events.findIndex((event) =>
    event.day === data.day &&
    event.month === data.month &&
    event.title === data.title &&
    event.description === data.description
  );

  if (index === -1) {
    return Err({
      status: 404,
      message: "Event not found"
    });
  }

  events.splice(index, 1);
  await save(events);

  return Ok(null);
};