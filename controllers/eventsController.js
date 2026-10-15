
import * as eventsService from "../services/eventsService.js";

export const list = async (req, res) => {
  const events = await eventsService.listEvents();
  res.status(200).json(events);
};

export const create = async (req, res) => {
  const result = await eventsService.createEvent(req.body);

  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message
    });
    return;
  }

  res.status(201).json(result.value);
};
