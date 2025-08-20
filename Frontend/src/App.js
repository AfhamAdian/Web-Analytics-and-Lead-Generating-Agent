import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
