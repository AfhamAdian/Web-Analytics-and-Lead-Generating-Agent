import React from 'react';
import {  Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Pages/Profile/Profile';
import SiteDetails from './Pages/SiteDetails/SiteDetails';
import AddSite from './Pages/AddSite/AddSite';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  console.log('App rendered, isAuthenticated:', isAuthenticated);
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/site/:siteId" element={isAuthenticated ? <SiteDetails /> : <Navigate to="/login" />} />
      <Route path="/add-site" element={isAuthenticated ? <AddSite /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
