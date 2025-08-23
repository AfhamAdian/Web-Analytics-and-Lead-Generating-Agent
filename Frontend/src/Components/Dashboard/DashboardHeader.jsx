import React from 'react';
import { LogOut, Plus, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleAddSite = () => {
    navigate('/add-site');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left Side - Branding & Add Site */}
        <div className="flex items-center space-x-6">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          
          {/* Add Site Button */}
          <button
            onClick={handleAddSite}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
          >
            <Plus size={16} />
            <span>Add Site</span>
          </button>
        </div>

        {/* Right Side - User Profile & Logout */}
        <div className="flex items-center space-x-4">
          {/* User Profile Section */}
          <div 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-all duration-200 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200">
                {user ? (
                  <span className="text-sm font-semibold text-blue-700">
                    {user.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                ) : (
                  <User size={18} className="text-gray-500" />
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200">
                {user || 'Guest'}
              </span>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 group"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;