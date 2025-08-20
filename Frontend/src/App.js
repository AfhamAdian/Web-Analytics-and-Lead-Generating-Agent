import React from 'react';
import {  Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  console.log('App rendered, isAuthenticated:', isAuthenticated);
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
