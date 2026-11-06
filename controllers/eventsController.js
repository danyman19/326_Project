import * as eventsService from "../services/eventsService.js";

// GET request
export const list = async (req, res) => {
  let currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  if (req.query.month != undefined) {
    month = Number(req.query.month);
  }

  const result = await eventsService.listEvents(month, year);
  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message,
    });
    return;
  }

  if (req.get("HX-Request")) {
    return res.render("partials/calendar-container", result.value);
  }

  res.status(200).render("calendar", result.value);
};

// POST- creates an event
export const create = async (req, res) => {
  const result = await eventsService.createEvent(req.body);

  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message,
    });
    return;
  }

  if (req.get("HX-Request")) {
    return res.status(201).render("partials/event", {
      event: result.value,
    });
  }

  res.status(201).json(result.value);
};

// DELETE- removes an event by MongoDB ID
export const destroy = async (req, res) => {
  const id = req.params.id;
  const result = await eventsService.deleteEvent(id);

  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message,
    });
    return;
  }

  res.status(200).send();
};
