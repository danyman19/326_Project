import { jest } from '@jest/globals';

//mock events repository
jest.unstable_mockModule('../repositories/eventsRepository.js', () => ({
  getAll: jest.fn(),
  save: jest.fn(),
}));

//import the service after registering mock
const { createEvent, deleteEvent, listEvents } =
  await import('../services/eventsService.js');

const { getAll, save } =
  await import('../repositories/eventsRepository.js');

//reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  getAll.mockResolvedValue([]);
  save.mockResolvedValue(undefined);
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
    day: 5,
    month: 11,
    title: 'Team Meeting',
    description: 'Discuss Sprint 3',
    event_id: 1,
  });

  expect(save).toHaveBeenCalledTimes(1);
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

test('createEvent assigns the next available event ID', async () => {
  getAll.mockResolvedValue([
    { event_id: 1, title: 'First Event' },
    { event_id: 4, title: 'Second Event' },
  ]);

  const result = await createEvent({
    day: 5,
    month: 11,
    title: 'Third Event',
  });

  expect(result.ok).toBe(true);
  expect(result.value.event_id).toBe(5);
});

//delete tests
test('deleteEvent returns an error when the event does not exist', async () => {
  const result = await deleteEvent(99);

  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(404);
  expect(result.error.message).toBe('Event not found');
});

test('deleteEvent removes an existing event', async () => {
  getAll.mockResolvedValue([
    { event_id: 1, title: 'First Event' },
    { event_id: 2, title: 'Second Event' },
  ]);

  const result = await deleteEvent(1);

  expect(result.ok).toBe(true);
  expect(save).toHaveBeenCalledTimes(1);
  expect(save).toHaveBeenCalledWith([
    { event_id: 2, title: 'Second Event' },
  ]);
});

//list test
test('listEvents returns all events from the repository', async () => {
  const events = [
    { event_id: 1, title: 'First Event' },
    { event_id: 2, title: 'Second Event' },
  ];

  getAll.mockResolvedValue(events);

  const result = await listEvents();

  expect(result).toEqual(events);
  expect(getAll).toHaveBeenCalledTimes(1);
});