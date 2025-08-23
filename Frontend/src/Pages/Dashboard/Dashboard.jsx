// import React, { useState, useEffect } from 'react';
// import { 
//   Sidebar, 
//   DashboardHeader, 
//   DashboardOverview, 
//   AnalyticsChart,
//   LoadingScreen
// } from '../../Components/Dashboard';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
// import { Globe, TrendingUp, Users, Eye, MousePointer, Calendar, Clock } from 'lucide-react';

// import api from '../../Services/api';

// export default function WebAppDashboard() {
  
//   const [user, setUser] = useState(null);
//   const [sites, setSites] = useState([]);
//   const [stats, setStats] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [dashboardAnalytics, setDashboardAnalytics] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchUserData() {
//       const startTime = Date.now();
//       const minLoadingTime = 800; // Minimum loading time in milliseconds
      
//       try {
//         setIsLoading(true);
//         setError(null);
//         console.log('Fetching dashboard data...');
//         const res = await api.get('/dashboard');
//         const data = res.data;
//         console.log('Dashboard data:', data);
//         setUser(data.userName);
//         setSites(data.sites);
//         setStats(data.stats);
//         setChartData(data.chartData);
        
//         // Fetch additional analytics data for enhanced dashboard
//         if (data.sites && data.sites.length > 0) {
//           const analyticsPromises = data.sites.map(site => 
//             api.get(`/sites/${site.site_id}`).catch(err => {
//               console.warn(`Failed to fetch analytics for site ${site.site_id}:`, err);
//               return null;
//             })
//           );
          
//           const analyticsResults = await Promise.all(analyticsPromises);
//           const validAnalytics = analyticsResults.filter(result => result !== null);
          
//           // Aggregate analytics data
//           const aggregatedAnalytics = aggregateAnalyticsData(validAnalytics);
//           setDashboardAnalytics(aggregatedAnalytics);
//         }

//         console.log('Dashboard data fetched successfully:', data);
//       } catch (err) {
//         console.error('Failed to fetch dashboard data:', err);
//         setError(err.response?.data?.message || 'Failed to load dashboard data');
//       } finally {
//         // Ensure minimum loading time has passed
//         const elapsedTime = Date.now() - startTime;
//         const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
//         setTimeout(() => {
//           setIsLoading(false);
//         }, remainingTime);
//       }
//     }
//     fetchUserData();
//   }, []);

//   const aggregateAnalyticsData = (analyticsResults) => {
//     if (!analyticsResults || analyticsResults.length === 0) return null;

//     // Combine daily traffic data from all sites
//     const allDailyData = {};
//     let totalBrowserStats = {};
//     let totalDeviceStats = {};
//     let totalCountryStats = {};
//     let totalOsStats = {};

//     analyticsResults.forEach(result => {
//       if (!result || !result.data) return;

//       const { dailyTrafficData, browserStats, deviceStats, countryStats, osStats } = result.data;

//       // Aggregate daily traffic data
//       if (dailyTrafficData) {
//         dailyTrafficData.forEach(day => {
//           if (!allDailyData[day.date]) {
//             allDailyData[day.date] = { date: day.date, visitors: 0, sessions: 0, pageViews: 0 };
//           }
//           allDailyData[day.date].visitors += day.visitors;
//           allDailyData[day.date].sessions += day.sessions;
//           allDailyData[day.date].pageViews += day.pageViews;
//         });
//       }

//       // Aggregate browser stats
//       Object.entries(browserStats || {}).forEach(([browser, count]) => {
//         totalBrowserStats[browser] = (totalBrowserStats[browser] || 0) + count;
//       });

//       // Aggregate device stats
//       Object.entries(deviceStats || {}).forEach(([device, count]) => {
//         totalDeviceStats[device] = (totalDeviceStats[device] || 0) + count;
//       });

//       // Aggregate country stats
//       Object.entries(countryStats || {}).forEach(([country, count]) => {
//         totalCountryStats[country] = (totalCountryStats[country] || 0) + count;
//       });

//       // Aggregate OS stats
//       Object.entries(osStats || {}).forEach(([os, count]) => {
//         totalOsStats[os] = (totalOsStats[os] || 0) + count;
//       });
//     });

//     // Convert daily data object to array and sort by date
//     const dailyTrafficArray = Object.values(allDailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

//     return {
//       dailyTrafficData: dailyTrafficArray,
//       browserStats: totalBrowserStats,
//       deviceStats: totalDeviceStats,
//       countryStats: totalCountryStats,
//       osStats: totalOsStats
//     };
//   };

//   const handleLogout = () => {
//     alert('Logout clicked - would redirect to login page');
//   };

//   const handleRetry = () => {
//     window.location.reload();
//   };

//   // Show loading screen while data is being fetched
//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   // Show error state if there's an error
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
//             </svg>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={handleRetry}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <Sidebar sites={sites} />

//       <div className="flex-1 flex flex-col">
//         <DashboardHeader 
//           user={user}
//           onLogout={handleLogout}
//         />

//         <main className="flex-1 p-6 overflow-y-auto">
//           <div className="max-w-7xl mx-auto space-y-6">
//             {/* Analytics Overview at the top */}
//             <DashboardOverview stats={stats} />
//             <AnalyticsChart chartData={chartData} />
            
//             {/* Enhanced Analytics Section */}
//             {dashboardAnalytics && (
//               <>
//                 {/* Geographic Distribution - Priority Section */}
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6 w-full">
//                   <div className="flex items-center mb-6">
//                     <Globe className="text-blue-600 mr-3" size={24} />
//                     <h2 className="text-xl font-bold text-gray-800">Regional Analytics</h2>
//                     <span className="ml-2 text-sm font-normal text-gray-600">
//                       ({Object.values(dashboardAnalytics.countryStats).reduce((sum, count) => sum + count, 0)} total visitors)
//                     </span>
//                   </div>
                  
//                   {/* Top Countries List */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Countries</h3>
//                     {Object.entries(dashboardAnalytics.countryStats)
//                       .sort(([,a], [,b]) => b - a)
//                       .slice(0, 8)
//                       .map(([country, count], index) => {
//                         const total = Object.values(dashboardAnalytics.countryStats).reduce((sum, c) => sum + c, 0);
//                         const percentage = ((count / total) * 100).toFixed(1);
//                         const isTop = index < 3;
                        
//                         return (
//                           <div key={country} className="relative">
//                             <div className={`flex items-center justify-between p-4 rounded-lg transition-all ${
//                               isTop 
//                                 ? 'bg-white shadow-md border-l-4 border-blue-500' 
//                                 : 'bg-white/70 border border-gray-200'
//                             }`}>
//                               <div className="flex items-center space-x-4 flex-1">
//                                 <div className={`w-3 h-3 rounded-full ${
//                                   index === 0 ? 'bg-blue-500' :
//                                   index === 1 ? 'bg-blue-400' :
//                                   index === 2 ? 'bg-blue-300' : 'bg-gray-300'
//                                 }`}></div>
//                                 <div className="flex-1">
//                                   <span className={`font-semibold ${isTop ? 'text-gray-900' : 'text-gray-700'}`}>
//                                     {country}
//                                   </span>
//                                   {isTop && (
//                                     <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                                       #{index + 1}
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="flex items-center space-x-4 flex-shrink-0">
//                                 <div className="text-right">
//                                   <div className={`font-bold ${isTop ? 'text-lg text-gray-900' : 'text-gray-800'}`}>
//                                     {count}
//                                   </div>
//                                   <div className="text-sm text-gray-500">
//                                     {percentage}%
//                                   </div>
//                                 </div>
//                                 <div className="w-20 bg-gray-200 rounded-full h-2">
//                                   <div
//                                     className={`h-2 rounded-full ${
//                                       index === 0 ? 'bg-blue-500' :
//                                       index === 1 ? 'bg-blue-400' :
//                                       index === 2 ? 'bg-blue-300' : 'bg-gray-400'
//                                     }`}
//                                     style={{ width: `${percentage}%` }}
//                                   ></div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </div>
//                 </div>

//                 {/* Traffic Trends Chart */}
//                 <div className="bg-white rounded-xl shadow-sm p-6">
//                   <div className="flex items-center mb-6">
//                     <TrendingUp className="text-green-600 mr-2" size={24} />
//                     <h2 className="text-xl font-semibold text-gray-800">Traffic Trends - Last 30 Days</h2>
//                   </div>
//                   <div className="h-80">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={dashboardAnalytics.dailyTrafficData}>
//                         <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
//                         <XAxis 
//                           dataKey="date" 
//                           tick={{ fontSize: 12 }}
//                           tickFormatter={(value) => {
//                             const date = new Date(value);
//                             return `${date.getMonth() + 1}/${date.getDate()}`;
//                           }}
//                         />
//                         <YAxis tick={{ fontSize: 12 }} />
//                         <Tooltip 
//                           labelFormatter={(value) => {
//                             const date = new Date(value);
//                             return date.toLocaleDateString();
//                           }}
//                         />
//                         <Legend />
//                         <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={3} name="Visitors" />
//                         <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={3} name="Sessions" />
//                         <Line type="monotone" dataKey="pageViews" stroke="#8B5CF6" strokeWidth={3} name="Page Views" />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Browser and Device Analytics */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Browser Analytics */}
//                   <div className="bg-white rounded-xl shadow-sm p-6">
//                     <div className="flex items-center mb-4">
//                       <Globe className="text-purple-600 mr-2" size={20} />
//                       <h3 className="text-lg font-semibold text-gray-800">Browser Analytics</h3>
//                     </div>
//                     <div className="h-64">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={Object.entries(dashboardAnalytics.browserStats).map(([name, value]) => ({ name, value }))}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" tick={{ fontSize: 11 }} />
//                           <YAxis />
//                           <Tooltip />
//                           <Bar dataKey="value" fill="#8B5CF6" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Device Analytics */}
//                   <div className="bg-white rounded-xl shadow-sm p-6">
//                     <div className="flex items-center mb-4">
//                       <MousePointer className="text-orange-600 mr-2" size={20} />
//                       <h3 className="text-lg font-semibold text-gray-800">Device Types</h3>
//                     </div>
//                     <div className="h-64">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={Object.entries(dashboardAnalytics.deviceStats).map(([name, value]) => ({ name, value }))}
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={60}
//                             outerRadius={100}
//                             dataKey="value"
//                             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                           >
//                             {Object.entries(dashboardAnalytics.deviceStats).map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={['#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#3B82F6'][index % 5]} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }











import React, { useState, useEffect } from 'react';
import { 
  Sidebar, 
  DashboardHeader, 
  DashboardOverview, 
  AnalyticsChart,
  LoadingScreen
} from '../../Components/Dashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Globe, TrendingUp, Users, Eye, MousePointer, Calendar, Clock } from 'lucide-react';

import api from '../../Services/api';

export default function WebAppDashboard() {
  
  const [user, setUser] = useState(null);
  const [sites, setSites] = useState([]);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dashboardAnalytics, setDashboardAnalytics] = useState(null);
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
        const data = res.data;
        console.log('Dashboard data:', data);
        setUser(data.userName);
        setSites(data.sites);
        setStats(data.stats);
        setChartData(data.chartData);
        
        // Fetch additional analytics data for enhanced dashboard
        if (data.sites && data.sites.length > 0) {
          const analyticsPromises = data.sites.map(site => 
            api.get(`/sites/${site.site_id}`).catch(err => {
              console.warn(`Failed to fetch analytics for site ${site.site_id}:`, err);
              return null;
            })
          );
          
          const analyticsResults = await Promise.all(analyticsPromises);
          const validAnalytics = analyticsResults.filter(result => result !== null);
          
          // Aggregate analytics data
          const aggregatedAnalytics = aggregateAnalyticsData(validAnalytics);
          setDashboardAnalytics(aggregatedAnalytics);
        }

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

  const aggregateAnalyticsData = (analyticsResults) => {
    if (!analyticsResults || analyticsResults.length === 0) return null;

    // Combine daily traffic data from all sites
    const allDailyData = {};
    let totalBrowserStats = {};
    let totalDeviceStats = {};
    let totalCountryStats = {};
    let totalOsStats = {};

    analyticsResults.forEach(result => {
      if (!result || !result.data) return;

      const { dailyTrafficData, browserStats, deviceStats, countryStats, osStats } = result.data;

      // Aggregate daily traffic data
      if (dailyTrafficData) {
        dailyTrafficData.forEach(day => {
          if (!allDailyData[day.date]) {
            allDailyData[day.date] = { date: day.date, visitors: 0, sessions: 0, pageViews: 0 };
          }
          allDailyData[day.date].visitors += day.visitors;
          allDailyData[day.date].sessions += day.sessions;
          allDailyData[day.date].pageViews += day.pageViews;
        });
      }

      // Aggregate browser stats
      Object.entries(browserStats || {}).forEach(([browser, count]) => {
        totalBrowserStats[browser] = (totalBrowserStats[browser] || 0) + count;
      });

      // Aggregate device stats
      Object.entries(deviceStats || {}).forEach(([device, count]) => {
        totalDeviceStats[device] = (totalDeviceStats[device] || 0) + count;
      });

      // Aggregate country stats
      Object.entries(countryStats || {}).forEach(([country, count]) => {
        totalCountryStats[country] = (totalCountryStats[country] || 0) + count;
      });

      // Aggregate OS stats
      Object.entries(osStats || {}).forEach(([os, count]) => {
        totalOsStats[os] = (totalOsStats[os] || 0) + count;
      });
    });

    // Convert daily data object to array and sort by date
    const dailyTrafficArray = Object.values(allDailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      dailyTrafficData: dailyTrafficArray,
      browserStats: totalBrowserStats,
      deviceStats: totalDeviceStats,
      countryStats: totalCountryStats,
      osStats: totalOsStats
    };
  };

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

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Analytics Overview at the top */}
            <DashboardOverview stats={stats} />
            <AnalyticsChart chartData={chartData} />
            
            {/* Enhanced Analytics Section */}
            {dashboardAnalytics && (
              <>
                {/* Geographic Distribution - Updated to match login page style */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 w-full">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 mr-4">
                      <Globe className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Regional Analytics</h2>
                      <p className="text-gray-600">
                        {Object.values(dashboardAnalytics.countryStats).reduce((sum, count) => sum + count, 0)} total visitors from around the world
                      </p>
                    </div>
                  </div>
                  
                  {/* Top Countries List */}
                  <div className="space-y-4">
                    {Object.entries(dashboardAnalytics.countryStats)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 8)
                      .map(([country, count], index) => {
                        const total = Object.values(dashboardAnalytics.countryStats).reduce((sum, c) => sum + c, 0);
                        const percentage = ((count / total) * 100).toFixed(1);
                        
                        return (
                          <div key={country} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-gray-900 text-lg">
                                  {country}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 flex-shrink-0">
                              <div className="text-right">
                                <div className="font-bold text-xl text-gray-900">
                                  {count.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {percentage}% of traffic
                                </div>
                              </div>
                              <div className="w-24 bg-gray-200 rounded-full h-3">
                                <div
                                  className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                                  style={{ width: `${Math.max(percentage, 5)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Traffic Trends Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <TrendingUp className="text-green-600 mr-2" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">Traffic Trends - Last 30 Days</h2>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardAnalytics.dailyTrafficData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString();
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={3} name="Visitors" />
                        <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={3} name="Sessions" />
                        <Line type="monotone" dataKey="pageViews" stroke="#8B5CF6" strokeWidth={3} name="Page Views" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Browser and Device Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Browser Analytics */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <Globe className="text-purple-600 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-800">Browser Analytics</h3>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={Object.entries(dashboardAnalytics.browserStats).map(([name, value]) => ({ name, value }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Device Analytics */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <MousePointer className="text-orange-600 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-800">Device Types</h3>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(dashboardAnalytics.deviceStats).map(([name, value]) => ({ name, value }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {Object.entries(dashboardAnalytics.deviceStats).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#3B82F6'][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}