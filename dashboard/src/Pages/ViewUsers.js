import React, { useState, useEffect } from "react";
import './ViewUsers.css';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Fetch users data from API
    axios.get(`http://localhost:1337/viewUsers`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  function handleAddUser() {
    // Add user logic here, e.g., making an API call to add user to the database
    console.log("Adding user:", newUser);
    // Reset newUser state after adding user
    setNewUser({
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      password: ''
    });
    // Close the modal
    setAddUserModalOpen(false);
  }

  return (
    <>
      <div className="view-container">
      <h1>View Users</h1>

        <Button variant="contained" onClick={() => setAddUserModalOpen(true)}>Add User</Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Middle Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Password</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.middleName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.password}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal open={addUserModalOpen} onClose={() => setAddUserModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" fontWeight="bold" align="left">Add User</Typography>
          <div style={{ marginBottom: '16px' }}/>
          <TextField variant="outlined" label="First Name" name="firstName" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} required />
          <div style={{ marginBottom: '16px' }}/>
          <TextField variant="outlined" label="Last Name" name="lastName" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} required />
          <div style={{ marginBottom: '16px' }}/>
          <TextField variant="outlined" label="Middle Name" name="middleName" value={newUser.middleName} onChange={(e) => setNewUser({ ...newUser, middleName: e.target.value })} />
          <div style={{ marginBottom: '16px' }}/>
          <TextField variant="outlined" label="Email" name="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <div style={{ marginBottom: '16px' }}/>
          <TextField variant="outlined" label="Password" name="password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <div style={{ marginBottom: '16px' }}/>
          <Box sx={{ display: 'inline-flex', gap: '8px' }}>
            <Button variant="contained" onClick={handleAddUser}>Add</Button>
            <Button variant="contained" onClick={() => setAddUserModalOpen(false)}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default ViewUsers;
