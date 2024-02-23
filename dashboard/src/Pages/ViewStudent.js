import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button, Modal, Box, Typography, TextField } from "@mui/material";
import '../Pages/ViewStudent.css';

function ViewStudent() {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editedStudentData, setEditedStudentData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get(`http://localhost:1337/viewstudents`) // Corrected URL to viewstudents
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
        setErrorMessage("Error fetching student data");
      });
  };

  const handleEditStudent = (student) => {
    setEditedStudentData({ ...student });
    setOpenModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudentData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    axios.put(`http://localhost:1337/editstudent`, editedStudentData) // Corrected URL to editstudent
      .then(response => {
        console.log("Student data updated successfully!");
        fetchStudents(); // Refresh students data after successful update
        handleCloseModal();
      })
      .catch(error => {
        console.error("Error updating student data:", error);
        setErrorMessage("Error updating student data");
      });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="view-container">
      <h1 style={{ textAlign: "center" }}>View Students</h1>
      {errorMessage && <p>Error: {errorMessage}</p>}
      <TableContainer component={Paper} style={{ textAlign: "right", width: "100%" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID Number</TableCell>
              <TableCell align="center">First Name</TableCell>
              <TableCell align="center">Last Name</TableCell>
              <TableCell align="center">Middle Name</TableCell>
              <TableCell align="center">Course</TableCell>
              <TableCell align="center">Year</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                <TableCell align="center">{student.idnumber}</TableCell>
                <TableCell align="center">{student.firstname}</TableCell>
                <TableCell align="center">{student.lastname}</TableCell>
                <TableCell align="center">{student.middlename}</TableCell>
                <TableCell align="center">{student.course}</TableCell>
                <TableCell align="center">{student.year}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" onClick={() => handleEditStudent(student)}>EDIT</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          minWidth: '30%',
          maxWidth: '80%'
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Student Details
          </Typography>
          {editedStudentData && (
            <>
              <TextField
                label="ID Number"
                fullWidth
                margin="normal"
                name="idnumber"
                value={editedStudentData && editedStudentData.idnumber}
                disabled
              />
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                name="firstname"
                value={editedStudentData && editedStudentData.firstname}
                onChange={handleInputChange}
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                name="lastname"
                value={editedStudentData && editedStudentData.lastname}
                onChange={handleInputChange}
              />
              <TextField
                label="Middle Name"
                fullWidth
                margin="normal"
                name="middlename"
                value={editedStudentData && editedStudentData.middlename}
                onChange={handleInputChange}
              />
              <TextField
                label="Course"
                fullWidth
                margin="normal"
                name="course"
                value={editedStudentData && editedStudentData.course}
                onChange={handleInputChange}
              />
              <TextField
                label="Year"
                fullWidth
                margin="normal"
                name="year"
                value={editedStudentData && editedStudentData.year}
                onChange={handleInputChange}
              />
            </>
          )}
          <Button variant="contained" onClick={handleSaveChanges}>Save Changes</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ViewStudent;
