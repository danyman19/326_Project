import express from "express";
import eventsRouter from "./routes/events.js";
import morgan from "morgan";
import mongoose from "mongoose";
import 'dotenv/config';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import authRouter from './routes/auth.js';
import { attachUser } from './middleware/attachUser.js';

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUrl = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;

if (!mongoUrl || !sessionSecret) {
  throw new Error("MONGODB_URI and SESSION_SECRET are required");
}

await mongoose.connect(mongoUrl);

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(attachUser);
app.use(authRouter);

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
