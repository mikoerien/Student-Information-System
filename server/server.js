const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define mongoose schema and models here if needed

// Define routes

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

app.get("/viewStudents", (req, res) => {
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

app.delete('/deleteStudent/:id', async(req, res) => {
    const id = req.params.id;
    try {
        // Read the students.json file
        const studentsData = fs.readFileSync('students.json', 'utf-8');
        // Parse the JSON data
        const students = JSON.parse(studentsData);
        // Find the index of the student with the given ID in the students array
        const index = students.findIndex(student => student.ID === id);
        if (index !== -1) {
            // Remove the student from the students array
            students.splice(index, 1);
            // Update the students.json file with the updated students array
            fs.writeFileSync('students.json', JSON.stringify(students, null, 2));
            res.send(`Student with ID ${id} deleted successfully.`);
        } else {
            res.status(404).send(`Student with ID ${id} not found.`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting student.');
    }
});

const port = 1337;

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
