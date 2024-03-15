import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import AddStudent from './Pages/AddStudent';
import ViewStudent from './Pages/ViewStudent';
import ViewUsers from './Pages/ViewUsers';
import Sidebar from './Pages/Sidebar';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addstudent" element={<AddStudent />} />
          <Route path="/viewstudent" element={<ViewStudent />} />
          <Route path="/viewusers" element={<ViewUsers />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
