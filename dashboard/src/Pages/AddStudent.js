import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import '../Pages/AddStudent.css';

function AddStudent() {
  const [idnumber, setID] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const handleAddStudent = async () => {
    const studentData = {
      idnumber,
      firstname,
      lastname,
      middlename,
      course,
      year,
    };

    try {
      const response = await fetch("http://localhost:1337/addStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      console.log("Server Response:", result);

      if (result.success) {
        setID("");
        setFirstName("");
        setLastName("");
        setMiddleName("");
        setCourse("");
        setYear("");
        alert(result.message);
      } else {
        alert("Failed to add student. Please try again.");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="add-student-container">
      <h1>Add Student</h1>
      <form>
        <TextField label="ID Number" fullWidth margin="normal" value={idnumber} onChange={(e) => setID(e.target.value)} />
        <TextField label="First Name" fullWidth margin="normal" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
        <TextField label="Last Name" fullWidth margin="normal" value={lastname} onChange={(e) => setLastName(e.target.value)} />
        <TextField label="Middle Name" fullWidth margin="normal" value={middlename} onChange={(e) => setMiddleName(e.target.value)} />
        <TextField label="Course" fullWidth margin="normal" value={course} onChange={(e) => setCourse(e.target.value)} />
        <TextField label="Year" fullWidth margin="normal" value={year} onChange={(e) => setYear(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleAddStudent}>
          Add Student
        </Button>
      </form>
    </div>
  );
}

export default AddStudent;

