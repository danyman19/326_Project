import express from "express";
import eventsRouter from "./routes/events.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home page route
app.get("/", (req, res) => {
  res.send("Home page for syllabus!");
});

// calendar page route
app.get("/calendar", (req, res) => {
  res.send("Course calendar will appear here");
});

// events route
app.use("/events", eventsRouter);

// handle requests to unknown routes
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

// handle unexpected errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});