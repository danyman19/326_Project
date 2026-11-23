import { Ok, Err } from "../result.js";
import {
  getAll,
  findById,
  create,
  removeById,
} from "../repositories/eventsRepository.js";
import { toEventDto } from "../dtos/eventDto.js";

const validateMonth = (month) => {
  if (!Number.isInteger(month) || month < 0 || month > 11)
    return Err({ status: 400, message: "Invalid month" });
  return Ok(null);
};

//validate the fields before saving to the database
const validateEvent = ({ day, month, title, description = "" } = {}) => {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    return Err({
      status: 400,
      message: "Day and month must be valid numbers",
    });
  }

  // validation to check the number of days allowed in the respective month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (day < 1 || day > daysInMonth[month - 1]) {
    return Err({
      status: 400,
      message: "The selected day is not valid for that month",
    });
  }

  if (typeof title !== "string" || !title.trim()) {
    return Err({
      status: 400,
      message: "Event title is required",
    });
  }

  if (typeof description !== "string") {
    return Err({
      status: 400,
      message: "Event description must be text",
    });
  }

  return Ok({
    day,
    month,
    title: title.trim(),
    description: description.trim(),
  });
};

// GET request
export const listEvents = async (month, year) => {
  const result = validateMonth(month);
  if (!result.ok) {
    return result;
  }

  const firstDay = new Date(year, month, 1).getDay();
  const numDays = new Date(year, month + 1, 0).getDate();

  const events = await getAll();
  const eventDtos = events
  .map(toEventDto)
  .filter((event) => event.month === month + 1);

  return Ok({ events: eventDtos, month, year, firstDay, numDays });
};

// POST request saves the event
export const createEvent = async (data, user) => {
  data.day = Number(data.day);
  data.month = Number(data.month);
  const result = validateEvent(data);

  if (!result.ok) {
    return result;
  }

  const eventData = {
    ...result.value,
    owner: user.id,
  };

  return Ok(toEventDto(await create(eventData)));
};

// DELETE- removes first event matching all four field
export const deleteEvent = async (id, user) => {
  //find event
  const event = await findById(id);

  //check if event exists
  if (!event) {
    return Err({ status: 404, message: "Event not found" });
  }

  //check if user owns the event or is an admin
  const isOwner = event.owner?.toString() === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    return Err({ status: 403, message: "Forbidden" });
  }

  //delete event if the user is allowed
  await removeById(id);

  return Ok(null);
};