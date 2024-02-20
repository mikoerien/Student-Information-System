const express = require('express');
const app = express();
const fs = require("fs");

app.get("/viewstudent", (req, res) => {
  try {
    const studentData = JSON.parse(fs.readFileSync("students.json"));
    
    res.json(studentData);
  } catch (error) {
    console.error("Error reading student data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = 1337;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
