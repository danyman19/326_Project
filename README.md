Akhila Garre - garreakhila
Daniel Qi - danyman19
Mai Le - mainle-git

Working agreement:

- "Done" for a PR means at least one member of the group approved it.
- Communication: We have exchanged numbers, so we will communicate through iMessage
- Splitting work: Before each assignment we will divy up the work through IMessage
- Disagreements: We will make sure to work through any disagreements professionally and stay open-minded through our conversations and will communicate our thoughts.

# What is Syllabus-to-Calendar Parser?

Syllabus-to-Calendar Parser is a tool that allows users to copy and paste text from a course syllabus. The application uses string processing or a lightweight API to identify important due dates and display them in a custom, interactive dashboard calendar.

# Design Decision:

### Akhila Garre

#### Decision: Service-layer validation

I decided to place the event validation in the service layer rather than the controller or repository. I contemplated keeping the validation in the controller layer as well as it could validate incoming requests but I felt like it would mix business rules with HTTP request handling and make it more complicated to reuse those rules. Even if I had enforced the validation in the repository, it would also mix the validation logic with file storage responsibilites. By keeping the validation in the service layer, we can enforce consistent rules before events are saved regardless of how the service is called. This way it is also easier to test and maintain the code for the future if we ever decide to change how events are stored or add ways to create events. In the end, we decided to keep the validation checks in the services layer because it helps format everything for the repository and the services layer will check formatting and own the rules. The repository layer is kept just for receiving informaition, not checking for formatting. Now the files are all organized separately where the controller will handle requests and responses, the service validates event rules and the repository will read and write events.json.

#### Design Decision Sprint 3:

For my service-layer tests, I followed the Unit 13 approach of mocking the repository with Jest's jest.unstable_mockModule() so the tests would not depend on a running database. An alternative I considered for this was testing the service against a real MongoDB test database. I think mocking the repository is the better approach for this because its purpose is to very the service's business rules like the event validation, ID assignment, deletion, etc. rather than testing the database operations. Using a real database would introduce additional setup and make the tests slower and make it harder to focus on the service logic. The tradeoff is that the mocked tests cannot confirm that hte repository's MongoDB operations work correctly so those need to be verified separately.

### Mai Le

#### Decision: Using JSON file storage

We chose to store calendar events in events.json instead of MongoDB for now as it's easier to set up, test, and manage without needing a database. Although MongoDB would be better for larger applications with more users, but JSON was enough for our current feature. We can still switch to a database in the future by keeping the storage operations in the repository layer.

#### Design Decision Sprint 3: Using MongoDB

For Sprint 3, I decided to switch from JSON file storage to MongoDB using Mongoose as we can store and manage events individually, and the data stays saved even after restarting the server. I kept the database operations in the repository layer so the service layer can focus on validation. I also added a DTO to convert MongoDB ObjectIds into string IDs for the frontend. The tradeoff is that MongoDB requires more setup, but it makes the application easier to manage and improve in the future.

### Daniel Qi

#### Decision: Click a date to create an event

I decided to, UI wise, have a user create an event by clicking on the date they want the event to be at. The alternative would be for the user instead to fill out a form where they have to manually enter the month and the date along with the title and description. I felt like it would be easier for the user to just click on they day they wanted which would also prevent user related errors when entering the date. Another reason this system works is because right now the calendar only shows the current month. If we were to add the ability to move between months it could be useful for the user to so be able to create an event without having to cycle to that month in the calendar.

### Design Decision Sprint 3: Where the remove button was and how it affected the HTMX

When building the UI I decided to have the remove button within the popup instead of on the event object itself. The alternative would be for the remove button to be directly on the event. One upside to this method is that when setting up the HTMX, you can easily have the hx-target be itself, meaning when an empty send is sent it can easily be destroyed. One reason I chose not to do this method is that when the UI was shrunk to be the width of a phone (375 px), the size of the event was tiny and a remove button would completely block out the clickability of the event. To circumvent the above problem I had to dynamically set the hx-target based on what event was clicked.

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/danyman19/326_Project.git
cd 326_Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

Start MongoDB with:

```bash
dc-up mongo
```

The app uses mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin by default. Use MONGODB_URI to set a different connection

### 4. Build Tailwind CSS

```bash
npm run build:css
```

### 5. Start the server

```bash
npm start
```

### 6. Open app

Go to

```text
http://localhost:3000
```

To access the calendar

```text
http://localhost:3000/events
```

# Calendar Feature - Sprint 2

### Overview

For Sprint 2, our team implemented a calendar that allows users to add, view, and delete events. Users can select a date, view, and delete events. Events are saved in `events.json` and remain available after restarting the server.

### How to use the Calendar

1. Start the server using npm start
2. Open http://localhost:3000/events
3. Click on a date in the calendar to add an event
4. Enter an event title and description
5. Click "Add event" to save the event. The new event event will be on the selected date. lick "Cancel" if you don't want to add the event
6. Click on an existing event to view its title, date, and description
7. Click Delete to remove the event, or Close to return to the calendar without making changes

### Validation and Error Handling

- **Day and month**: must be valid integers, with the month between 1 and 12 and the day within the allowed range. Invalid dates will return `400 Bad Request`.
- **Event title**: must be nonempty text. Missing or invalid titles return `400 Bad Request`.
- **Event description**: Optional, but must be text. Invalid descriptions return `400 Bad Request`.
- **Invalid JSON requests**: Malformed JSON and a request body of null return `400 Bad Request`.
- **Event deletion**: delete a nonexistent event return `404 Not Found`.
- **Unknown routes**: requests to nonexistent routes return `404 Not Found`.
- **Server errors**: Unexpected errors are logged and return `500 Internal Server Error`.
- **Frontend errors**: displays alerts for failed requests, connection errors, or timeouts.

### Sprint 3 - MongoDB, Jest, HTMX, and Tailwind CSS

For Sprint 3, our team focused on improving the application's data storage, testing, user interactions, and appearance.

We made four main changes:

- Replaced JSON file storage with MongoDB using Mongoose.

- Added automated service-layer tests using Jest.

- Implemented HTMX to update calendar content without reloading the entire page.

- Added Tailwind CSS to improve the application's appearance and responsive layout.

#### 1. MongoDB

We created a Mongoose schema for event details (day, month, title, and description). The repository supports:

- `getAll()` - Retrieves all events.
- `findById()` - Finds an event by ID.
- `create()` - Creates an event.
- `updateById()` - Updates an event.
- `removeById()` - Deletes an event.

MongoDB assigns unique ObjectIds to events, and a DTO converts them into string IDs for the frontend.

**Routes using MongoDB:**

- `GET /events` - Retrieves events from MongoDB.
- `POST /events` - Creates and saves an event.
- `DELETE /events/:id` - Deletes an event.

**How to verify:**

- Start MongoDB using dc-up mongo and run npm start.

- Open http://localhost:3000/events.

- Create an event using POST /events.

- Refresh the page or restart the server to verify the event is still saved.

- Delete the event using the calendar, which calls DELETE /events/:id.

#### 2. Jest Testing

We added Jest tests to check event validation, creation, deletion, and retrieval. We use jest.unstable_mockModule() to mock repository functions, allowing the tests to run without MongoDB.

**How to verify:**

Run:

```bash
npm test
```

The tests are located in `__tests__/eventsService.test.js`.

#### 3. HTMX

We added HTMX to update the calendar without reloading the entire page. We also created reusable EJS partials for the calendar and event popups.

**How to verify:**

- Open http://localhost:3000/events.

- Click the Previous or Next month button.

- The calendar should display the selected month without a full-page reload.

- Create or delete an event to see the calendar update.

#### 4. Tailwind CSS

We added Tailwind CSS to improve the calendar's layout, buttons, spacing, and responsive design. The source styles are in src/input.css, and the generated stylesheet is public/style.css.

**How to verify:**

- Run npm run build:css.

- Start the application using npm start.

- Open http://localhost:3000/events.

- Resize the browser or use Chrome Developer Tools to see how the calendar adapts to smaller screens.

### Jest Service-Layer Tests

We added Jest tests for the event service layer in **tests**/eventsService.test.js. The tests make sure that the service correctly handles event creation, input validation and deletion including cases such as invalid dates, missing or empty titles, invalid descriptions, and also attempts to delete events that do not exist. The repository functions are mocked using jest.unstable_mockModule(), so the tests focus on service-layer business logic without requiring a running MongoDB database.

#### Test file to run:

Run 'npm test' from project root. Tests located in **tests**/eventsService.test.js.

### System Diagram

![System Diagram Sprint 3](sys_diagram_sprint3.jpg)
