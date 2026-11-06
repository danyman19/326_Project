import { jest } from '@jest/globals';

//mock events repository
jest.unstable_mockModule('../repositories/eventsRepository.js', () => ({
  getAll: jest.fn(),
  create: jest.fn(),
  removeById: jest.fn(),
}));

//import the service after registering mock
const { createEvent, deleteEvent, listEvents } =
  await import('../services/eventsService.js');

const { getAll, create, removeById } =
  await import('../repositories/eventsRepository.js');

//reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();

  getAll.mockResolvedValue([]);

  create.mockImplementation(async (data) => ({
    _id: 'mongo-event-id',
    ...data,
  }));

  removeById.mockResolvedValue(null);
});

//event validation tests:
test('createEvent rejects a missing title', async () => {
  const result = await createEvent({
    day: 5,
    month: 11,
    title: '',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe('Event title is required');
});

test('createEvent rejects an invalid day or month', async () => {
  const result = await createEvent({
    day: 1.5,
    month: 11,
    title: 'Meeting',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe('Day and month must be valid numbers');
});

test('createEvent rejects a month outside the valid range', async () => {
  const result = await createEvent({
    day: 5,
    month: 13,
    title: 'Meeting',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test('createEvent rejects a month below 1', async () => {
  const result = await createEvent({
    day: 5,
    month: 0,
    title: 'Meeting',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe('Day and month must be valid numbers');
});

test('createEvent rejects a day that does not exist in the month', async () => {
  const result = await createEvent({
    day: 31,
    month: 4,
    title: 'Meeting',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe(
    'The selected day is not valid for that month'
  );
});

test('createEvent rejects a day below 1', async () => {
  const result = await createEvent({
    day: 0,
    month: 5,
    title: 'Meeting',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test('createEvent rejects a non-string description', async () => {
  const result = await createEvent({
    day: 5,
    month: 11,
    title: 'Meeting',
    description: 123,
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe('Event description must be text');
});

// make sure invalid events not created
test('createEvent does not create an event with invalid information', async () => {
  const result = await createEvent({
    day: 5,
    month: 11,
    title: '',
  });

  expect(result.ok).toBe(false);
  expect(create).not.toHaveBeenCalled();
});

//successful event creation tests
test('createEvent creates an event with valid information', async () => {
  const result = await createEvent({
    day: 5,
    month: 11,
    title: 'Team Meeting',
    description: 'Discuss Sprint 3',
  });

  expect(result.ok).toBe(true);
  expect(result.value).toEqual({
    event_id: 'mongo-event-id',
    day: 5,
    month: 11,
    title: 'Team Meeting',
    description: 'Discuss Sprint 3',
  });

  expect(create).toHaveBeenCalledTimes(1);
  expect(create).toHaveBeenCalledWith({
    day: 5,
    month: 11,
    title: 'Team Meeting',
    description: 'Discuss Sprint 3',
  });
});

test('createEvent allows an optional description', async () => {
  const result = await createEvent({
    day: 5,
    month: 11,
    title: 'Team Meeting',
  });

  expect(result.ok).toBe(true);
  expect(result.value.description).toBe('');
});

test('createEvent trims whitespace from title and description', async () => {
  const result = await createEvent({
    day: 5,
    month: 11,
    title: '  Team Meeting  ',
    description: '  Discuss Sprint 3  ',
  });

  expect(result.ok).toBe(true);
  expect(result.value.title).toBe('Team Meeting');
  expect(result.value.description).toBe('Discuss Sprint 3');
});

test('createEvent rejects a missing day', async () => {
  const result = await createEvent({
    month: 11,
    title: 'Team Meeting',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test('createEvent rejects a missing month', async () => {
  const result = await createEvent({
    day: 5,
    title: 'Team Meeting',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test('createEvent rejects a title containing only whitespace', async () => {
  const result = await createEvent({
    day: 5,
    month: 11,
    title: '    ',
  });

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe('Event title is required');
});

//delete tests
test('deleteEvent returns an error when the event does not exist', async () => {
  removeById.mockResolvedValue(null);

  const result = await deleteEvent('missing-id');

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(404);
  expect(result.error.message).toBe('Event not found');
  expect(removeById).toHaveBeenCalledWith('missing-id');
});

test('deleteEvent calls removeById once when the event does not exist', async () => {
  removeById.mockResolvedValue(null);

  const result = await deleteEvent('missing-id');

  expect(result.ok).toBe(false);
  expect(removeById).toHaveBeenCalledTimes(1);
});

test('deleteEvent removes an existing event', async () => {
  removeById.mockResolvedValue({
    _id: 'existing-event-id',
    day: 5,
    month: 11,
    title: 'Team Meeting',
    description: 'Discuss Sprint 3',
  });

  const result = await deleteEvent('existing-event-id');

  expect(result.ok).toBe(true);
  expect(result.value).toBe(null);
  expect(removeById).toHaveBeenCalledWith('existing-event-id');
});

//list tests
test('listEvents returns calendar information and only events for the selected month', async () => {
  const events = [
    {
      _id: 'event-id-1',
      day: 5,
      month: 11,
      title: 'First Event',
      description: '',
    },
    {
      _id: 'event-id-2',
      day: 6,
      month: 11,
      title: 'Second Event',
      description: 'Another meeting',
    },
    {
      _id: 'event-id-3',
      day: 10,
      month: 12,
      title: 'December Event',
      description: 'A different month',
    },
  ];

  getAll.mockResolvedValue(events);

  const result = await listEvents(10, 2026);

  expect(result.ok).toBe(true);
  expect(result.value).toEqual({
    events: [
      {
        event_id: 'event-id-1',
        day: 5,
        month: 11,
        title: 'First Event',
        description: '',
      },
      {
        event_id: 'event-id-2',
        day: 6,
        month: 11,
        title: 'Second Event',
        description: 'Another meeting',
      },
    ],
    month: 10,
    year: 2026,
    firstDay: 0,
    numDays: 30,
  });

  expect(getAll).toHaveBeenCalledTimes(1);
});

test('listEvents rejects a month below 0', async () => {
  const result = await listEvents(-1, 2026);

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe('Invalid month');
  expect(getAll).not.toHaveBeenCalled();
});

test('listEvents rejects a month above 11', async () => {
  const result = await listEvents(12, 2026);

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe('Invalid month');
  expect(getAll).not.toHaveBeenCalled();
});

test('listEvents rejects a non-integer month', async () => {
  const result = await listEvents(5.5, 2026);

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(result.error.message).toBe('Invalid month');
  expect(getAll).not.toHaveBeenCalled();
});