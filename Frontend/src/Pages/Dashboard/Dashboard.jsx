import React, { useState, useEffect } from 'react';
import { 
  Sidebar, 
  DashboardHeader, 
  DashboardOverview, 
  AnalyticsChart 
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

  useEffect(() => {
    async function fetchUserData() {
      try {
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
      }
    }
    fetchUserData();
  }, []);

  const handleLogout = () => {
    alert('Logout clicked - would redirect to login page');
  };

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