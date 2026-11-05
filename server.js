import express from "express";
import eventsRouter from "./routes/events.js";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// home page route
app.get("/", (req, res) => {
  res.send("Home page for syllabus!");
});

// events route
app.use("/events", eventsRouter);

// handle requests to unknown routes
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

// handle invalid JSON requests
app.use((err, req, res, next) => {
  if (err.status === 400 && err.type === "entity.parse.failed") {
    return res.status(400).send("Invalid JSON");
  }
  console.error(err);
  res.status(500).send("Something went wrong.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
