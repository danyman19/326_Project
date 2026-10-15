import express from "express";

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

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});