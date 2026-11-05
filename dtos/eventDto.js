export const toEventDto = (event) => ({
  event_id: event._id.toString(),
  day: event.day,
  month: event.month,
  title: event.title,
  description: event.description,
});
