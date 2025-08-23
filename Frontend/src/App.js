import React from 'react';
import {  Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Pages/Profile/Profile';
import SiteDetails from './Pages/SiteDetails/SiteDetails';
import AddSite from './Pages/AddSite/AddSite';
import NotFound from './Pages/NotFound/NotFound';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  
  return (
    <div className="app">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/site/:siteId" element={isAuthenticated ? <SiteDetails /> : <Navigate to="/login" />} />
        <Route path="/add-site" element={isAuthenticated ? <AddSite /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
