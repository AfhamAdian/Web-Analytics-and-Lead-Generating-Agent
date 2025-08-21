import React from 'react';
import { LogOut, Plus } from 'lucide-react';
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
    <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleAddSite}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={16} />
          <span>Add Site</span>
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <div 
          onClick={handleProfileClick}
          className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            {user.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <span 
          onClick={handleProfileClick}
          className="text-gray-700 font-medium cursor-pointer hover:text-gray-900 transition-colors"
        >
          {user}
        </span>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
