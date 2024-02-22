const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello, world! ");
});

app.post("/addstudent", (req, res) => {
    const studentData = req.body;
    let existingData = [];

    try {
        existingData = JSON.parse(fs.readFileSync("students.json"));
    } catch (error) {}

    existingData.push(studentData);

    fs.writeFileSync("students.json", JSON.stringify(existingData, null, 2));

    res.json({ success: true, message: "Student added successfully!" })
});

app.get("/viewstudent", (req, res) => {
  try {
      const studentData = JSON.parse(fs.readFileSync("students.json"));
      res.json(studentData);
  } catch (error) {
      console.error("Error reading student data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/editStudent", (req, res) => {
  const updateStudentData = req.body;
  let existingData = [];

  try {
      existingData = JSON.parse(fs.readFileSync("students.json"));
      const index = existingData.findIndex(student => student.ID == updateStudentData.ID);

      if (index !== -1) {
          existingData[index] = updateStudentData;
          fs.writeFileSync("students.json", JSON.stringify(existingData, null, 2));
          res.json({ success: true, message: "Student updated successfully!" });
      } else {
          res.status(404).json({ error: "Student not found" });
      }
  } catch (error) {
      console.error("Error updating student data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


const port = 1337;

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
