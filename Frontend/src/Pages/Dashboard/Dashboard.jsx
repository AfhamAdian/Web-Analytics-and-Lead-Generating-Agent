import React, { useState, useEffect } from 'react';
import { 
  Sidebar, 
  DashboardHeader, 
  DashboardOverview, 
  AnalyticsChart,
  LoadingScreen
} from '../../Components/Dashboard';

import api from '../../Services/api';

export default function WebAppDashboard() {
  // const [user] = useState('John Smith');
  // const [sites] = useState([
  //   { id: 1, name: 'Site 1', active: true },
  //   { id: 2, name: 'Site 2', active: false },
  //   { id: 3, name: 'Site 3', active: false }
  // ]);

  // const statsDummy = [
  //   { title: 'Total Sites', value: '15' },
  //   { title: 'Active Users', value: '120' },
  //   { title: 'New Leads', value: '45' },
  //   { title: 'Revenue', value: '$12,450' }
  // ];

  // const chartData = [
  //   { label: 'Sites', percentage: 75, value: '15', color: 'bg-orange-500' },
  //   { label: 'Users', percentage: 60, value: '120', color: 'bg-blue-500' },
  //   { label: 'Leads', percentage: 45, value: '45', color: 'bg-green-500' },
  //   { label: 'Revenue', percentage: 80, value: '$12.4K', color: 'bg-purple-500' }
  // ];
  
  const [user, setUser] = useState(null);
  const [sites, setSites] = useState([]);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const startTime = Date.now();
      const minLoadingTime = 800; // Minimum loading time in milliseconds
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching dashboard data...');
        const res = await api.get('/dashboard');
        const data =  res.data;
        console.log('Dashboard data:', data);
        setUser(data.userName);
        setSites(data.sites);
        setStats(data.stats);
        setChartData(data.chartData);

        console.log('Dashboard data fetched successfully:', data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        // Ensure minimum loading time has passed
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    }
    fetchUserData();
  }, []);

  const handleLogout = () => {
    alert('Logout clicked - would redirect to login page');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Show loading screen while data is being fetched
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar sites={sites} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <DashboardOverview stats={stats} />
            <AnalyticsChart chartData={chartData} />
          </div>
        </main>
      </div>
    </div>
  );
}