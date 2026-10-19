import * as eventsService from "../services/eventsService.js";

// GET request
export const list = async (req, res) => {
  const events = await eventsService.listEvents();
  res.status(200).render("calendar", { events });
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

  res.status(201).json(result.value);
};

// DELETE- removes an event based on the four fields
export const destroy = async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const result = await eventsService.deleteEvent(id);

  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message,
    });
    return;
  }

  res.status(204).send();
};
