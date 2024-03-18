const mongoose = require("mongoose");
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

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
// Define the user schema
const userSchema = new mongoose.Schema({
    First: String,
    Last: String,
    Middle: String,
    Email: String,
    Password: String
});
// Create a mongoose model based on the userSchema
const User = mongoose.model('User', userSchema);
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app.post("/addUser", async(req, res) => {
    const userData = req.body;

    try {
        const user = new User(userData);
        await user.save();
        res.json({ success: true, message: "User added successfully!" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/viewUsers", async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/editUser/:email", async(req, res) => {
    const userEmail = req.params.email;
    const updatedUserData = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ Email: userEmail }, updatedUserData, { new: true });

        if (updatedUser) {
            res.json({ success: true, message: "User updated successfully", user: updatedUser });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

const port = 1337;

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});