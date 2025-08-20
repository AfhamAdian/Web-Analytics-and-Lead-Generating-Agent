import React, { useState } from 'react';
import { LogOut, Plus, BarChart3 } from 'lucide-react';

export default function WebAppDashboard() {
  const [user] = useState('John Smith');
  const [sites] = useState([
    { id: 1, name: 'Site 1', active: true },
    { id: 2, name: 'Site 2', active: false },
    { id: 3, name: 'Site 3', active: false }
  ]);

  const handleLogout = () => {
    alert('Logout clicked - would redirect to login page');
  };

  const handleAddSite = () => {
    alert('Add new site functionality');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">My Sites</h2>
        </div>
        <div className="p-4">
          {sites.map((site) => (
            <div
              key={site.id}
              className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                site.active
                  ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              {site.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="text-gray-700 font-medium">{user}</span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Overview Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sites</h3>
                  <div className="text-3xl font-bold text-gray-900">15</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Active Users</h3>
                  <div className="text-3xl font-bold text-gray-900">120</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">New Leads</h3>
                  <div className="text-3xl font-bold text-gray-900">45</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue</h3>
                  <div className="text-3xl font-bold text-gray-900">$12,450</div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="text-gray-600 mr-2" size={20} />
                <h2 className="text-xl font-semibold text-gray-800">Analytics Overview</h2>
              </div>
              
              {/* Simple bar chart representation */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-20 text-sm text-gray-600">Sites</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-orange-500 h-6 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-700">15</span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-20 text-sm text-gray-600">Users</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-blue-500 h-6 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-700">120</span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-20 text-sm text-gray-600">Leads</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-green-500 h-6 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-700">45</span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-20 text-sm text-gray-600">Revenue</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-purple-500 h-6 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-700">$12.4K</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}