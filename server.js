import express from "express";

const app = express();
const PORT = 3000;

// home page route
app.get("/", (req, res) => {
  res.send("Home page for syllabus!");
});

// calendar page route
app.get("/calendar", (req, res) => {
  res.send("Course calendar will appear here");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});