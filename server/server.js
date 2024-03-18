const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 1337;

// Middleware
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

// Define mongoose schema and model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
});

const Student = mongoose.model('Student', studentSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/addstudent', async (req, res) => {
  const { name, age, grade } = req.body;
  try {
    const newStudent = new Student({ name, age, grade });
    await newStudent.save();
    res.json({ success: true, message: 'Student added successfully!' });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/viewStudents', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/editStudent/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, grade } = req.body;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, { name, age, grade }, { new: true });
    if (updatedStudent) {
      res.json({ success: true, message: 'Student updated successfully!', student: updatedStudent });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteStudent/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (deletedStudent) {
      res.json({ success: true, message: `Student with ID ${id} deleted successfully.` });
    } else {
      res.status(404).json({ error: `Student with ID ${id} not found.` });
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
