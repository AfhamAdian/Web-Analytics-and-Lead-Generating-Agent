



import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Globe, TrendingUp, Users, Eye, MousePointer, Calendar, Clock, MapPin, Shield, CheckCircle, XCircle, BarChart3, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Sidebar, DashboardHeader, LoadingScreen } from '../../Components/Dashboard';

import api from '../../Services/api';



const DashboardOverview = ({ stats }) => {
  const statCards = [
    { title: 'Total Visitors', value: stats?.totalVisitors || 0, icon: Users, color: 'blue' },
    { title: 'Page Views', value: stats?.pageViews || 0, icon: Eye, color: 'green' },
    { title: 'Sessions', value: stats?.sessions || 0, icon: Clock, color: 'purple' },
    { title: 'Bounce Rate', value: `${stats?.bounceRate || 0}%`, icon: TrendingUp, color: 'orange' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
          green: 'from-green-500 to-green-600 shadow-green-500/20',
          purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
          orange: 'from-orange-500 to-orange-600 shadow-orange-500/20'
        };
        
        return (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[stat.color]} shadow-lg`}>
                <Icon className="text-white" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.title}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AnalyticsChart = ({ chartData }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
          <BarChart3 className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-gray-500">Performance metrics over time</p>
        </div>
      </div>
    </div>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={3} name="Visitors" dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
          <Line type="monotone" dataKey="pageViews" stroke="#10B981" strokeWidth={3} name="Page Views" dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

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
    let totalRegionStats = {};
    let totalOsStats = {};
    let totalCookieConsent = { accepted: 0, rejected: 0 };

    analyticsResults.forEach(result => {
      if (!result || !result.data) return;

      const { dailyTrafficData, browserStats, deviceStats, countryStats, regionStats, osStats, cookieConsent } = result.data;

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

      // Aggregate region stats
      Object.entries(regionStats || {}).forEach(([region, count]) => {
        totalRegionStats[region] = (totalRegionStats[region] || 0) + count;
      });

      // Aggregate OS stats
      Object.entries(osStats || {}).forEach(([os, count]) => {
        totalOsStats[os] = (totalOsStats[os] || 0) + count;
      });

      // Aggregate cookie consent data
      if (cookieConsent) {
        totalCookieConsent.accepted = (totalCookieConsent.accepted || 0) + (cookieConsent.accepted || 0);
        totalCookieConsent.rejected = (totalCookieConsent.rejected || 0) + (cookieConsent.rejected || 0);
      }
    });

    // Convert daily data object to array and sort by date
    const dailyTrafficArray = Object.values(allDailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      dailyTrafficData: dailyTrafficArray,
      browserStats: totalBrowserStats,
      deviceStats: totalDeviceStats,
      countryStats: totalCountryStats,
      regionStats: totalRegionStats,
      osStats: totalOsStats,
      cookieConsent: totalCookieConsent
    };
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Modern metric card component
  const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <span className="font-medium">{change}</span>
              <span className="ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  // Modern progress bar component
  const ProgressBar = ({ label, value, total, color }) => {
    const percentage = (value / total) * 100;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{value.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <Sidebar sites={sites} />

        <div className="flex-1">
          <DashboardHeader user={user} />

          <main className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
                    <p className="text-blue-100 text-lg">Track your website performance in real-time</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {stats?.find(s => s.title === 'Active Users')?.value || '0'}
                    </div>
                    <div className="text-blue-100">Total Visitors</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats?.map((stat, index) => {
                  const iconMap = {
                    'Total Sites': Users,
                    'Active Users': Users,
                    'New Leads': Eye,
                    'Total Page Views': Clock
                  };
                  const colorMap = [
                    'from-green-500 to-green-600',
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-orange-600',
                    'from-blue-500 to-blue-600'
                  ];
                  
                  return (
                    <MetricCard
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      change={index === 0 ? "+12.5%" : index === 1 ? "+8.2%" : index === 2 ? "+15.3%" : "+5.1%"}
                      trend="up"
                      icon={iconMap[stat.title] || Users}
                      color={colorMap[index % 4]}
                    />
                  );
                })}
              </div>

              {/* Enhanced Analytics Section */}
              {dashboardAnalytics && (
                <>
                  {/* Geographic Analytics - Redesigned */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
                      <Globe className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Top Regions</h2>
                      <p className="text-gray-500">Visitor distribution by country</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(dashboardAnalytics.countryStats)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([country, count]) => {
                        const total = Object.values(dashboardAnalytics.countryStats).reduce((sum, c) => sum + c, 0);
                        return (
                          <ProgressBar
                            key={country}
                            label={country}
                            value={count}
                            total={total}
                            color="from-blue-500 to-purple-600"
                          />
                        );
                      })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl mr-4">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Top Cities</h2>
                      <p className="text-gray-500">Visitor distribution by region</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(dashboardAnalytics.regionStats)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([region, count]) => {
                        const total = Object.values(dashboardAnalytics.regionStats).reduce((sum, c) => sum + c, 0);
                        return (
                          <ProgressBar
                            key={region}
                            label={region}
                            value={count}
                            total={total}
                            color="from-green-500 to-teal-600"
                          />
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Cookie Consent - Modern Cards */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl mr-4">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Privacy Compliance</h2>
                    <p className="text-gray-500">Cookie consent analytics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckCircle className="text-green-600 mr-3" size={24} />
                        <h3 className="text-lg font-semibold text-gray-900">Accepted</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {dashboardAnalytics.cookieConsent.rejected.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {((dashboardAnalytics.cookieConsent.rejected / (dashboardAnalytics.cookieConsent.accepted + dashboardAnalytics.cookieConsent.rejected)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <XCircle className="text-red-600 mr-3" size={24} />
                        <h3 className="text-lg font-semibold text-gray-900">Rejected</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {dashboardAnalytics.cookieConsent.accepted.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {((dashboardAnalytics.cookieConsent.accepted / (dashboardAnalytics.cookieConsent.accepted + dashboardAnalytics.cookieConsent.rejected)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Trends */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mr-4">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Traffic Trends</h2>
                    <p className="text-gray-500">Daily performance over the last 30 days</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardAnalytics.dailyTrafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#6366F1" strokeWidth={3} name="Visitors" dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }} />
                      <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={3} name="Sessions" dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                      <Line type="monotone" dataKey="pageViews" stroke="#8B5CF6" strokeWidth={3} name="Page Views" dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Browser and Device Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mr-4">
                      <Globe className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Browser Analytics</h2>
                      <p className="text-gray-500">User browser preferences</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(dashboardAnalytics.browserStats).map(([name, value]) => ({ name, value }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Bar dataKey="value" fill="url(#purpleGradient)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#A855F7" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl mr-4">
                      <Monitor className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Device Types</h2>
                      <p className="text-gray-500">User device breakdown</p>
                    </div>
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
                          labelLine={false}
                        >
                          {Object.entries(dashboardAnalytics.deviceStats).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#F59E0B', '#EF4444', '#8B5CF6'][index % 3]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        />
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
    </div>
  );
}