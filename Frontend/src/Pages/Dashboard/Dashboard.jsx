



import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Globe, TrendingUp, Users, Eye, MousePointer, Calendar, Clock, MapPin, Shield, CheckCircle, XCircle, BarChart3, Monitor, Smartphone, Tablet } from 'lucide-react';

// Mock components for demo
const Sidebar = ({ sites }) => (
  <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
    <div className="p-6 border-b border-gray-100">
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Analytics Pro
      </h2>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      {sites?.map((site, index) => (
        <div key={index} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="font-medium text-gray-900">{site.name || `Site ${index + 1}`}</div>
          <div className="text-sm text-gray-500">{site.domain || 'example.com'}</div>
        </div>
      ))}
    </nav>
  </div>
);

const DashboardHeader = ({ user, onLogout }) => (
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Welcome, {user}</span>
        <button 
          onClick={onLogout}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);

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

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse mx-auto mb-4"></div>
      <p className="text-gray-600">Loading your analytics...</p>
    </div>
  </div>
);

export default function WebAppDashboard() {
  const [user, setUser] = useState('John Doe');
  const [sites, setSites] = useState([
    { name: 'Main Website', domain: 'example.com' },
    { name: 'Blog', domain: 'blog.example.com' }
  ]);
  const [stats, setStats] = useState({
    totalVisitors: 12453,
    pageViews: 45678,
    sessions: 8901,
    bounceRate: 34
  });
  const [chartData, setChartData] = useState([
    { name: 'Jan', visitors: 4000, pageViews: 2400 },
    { name: 'Feb', visitors: 3000, pageViews: 1398 },
    { name: 'Mar', visitors: 2000, pageViews: 9800 },
    { name: 'Apr', visitors: 2780, pageViews: 3908 },
    { name: 'May', visitors: 1890, pageViews: 4800 },
    { name: 'Jun', visitors: 2390, pageViews: 3800 }
  ]);
  const [dashboardAnalytics, setDashboardAnalytics] = useState({
    dailyTrafficData: [
      { date: '2024-01-01', visitors: 1200, sessions: 800, pageViews: 2400 },
      { date: '2024-01-02', visitors: 1500, sessions: 900, pageViews: 2800 },
      { date: '2024-01-03', visitors: 1100, sessions: 700, pageViews: 2200 }
    ],
    browserStats: { Chrome: 5432, Firefox: 2341, Safari: 1876, Edge: 987 },
    deviceStats: { Desktop: 6543, Mobile: 4321, Tablet: 1098 },
    countryStats: { 'United States': 4500, 'United Kingdom': 2300, 'Germany': 1800, 'Canada': 1200 },
    regionStats: { 'California': 2100, 'New York': 1800, 'Texas': 1200, 'London': 900 },
    cookieConsent: { accepted: 8765, rejected: 2345 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    alert('Logout clicked - would redirect to login page');
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <Sidebar sites={sites} />

        <div className="flex-1">
          <DashboardHeader user={user} onLogout={handleLogout} />

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
                    <div className="text-3xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
                    <div className="text-blue-100">Total Visitors</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Page Views"
                  value={stats.pageViews.toLocaleString()}
                  change="+12.5%"
                  trend="up"
                  icon={Eye}
                  color="from-green-500 to-green-600"
                />
                <MetricCard
                  title="Sessions"
                  value={stats.sessions.toLocaleString()}
                  change="+8.2%"
                  trend="up"
                  icon={Clock}
                  color="from-purple-500 to-purple-600"
                />
                <MetricCard
                  title="Bounce Rate"
                  value={`${stats.bounceRate}%`}
                  change="-2.1%"
                  trend="down"
                  icon={TrendingUp}
                  color="from-orange-500 to-orange-600"
                />
                <MetricCard
                  title="Avg. Session"
                  value="3m 24s"
                  change="+15s"
                  trend="up"
                  icon={Calendar}
                  color="from-blue-500 to-blue-600"
                />
              </div>

              {/* Analytics Chart */}
              <AnalyticsChart chartData={chartData} />

              {/* Geographic Analytics - Redesigned */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
                      <Globe className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Top Countries</h2>
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
                      <h2 className="text-xl font-bold text-gray-900">Top Regions</h2>
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
                          {dashboardAnalytics.cookieConsent.accepted.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {((dashboardAnalytics.cookieConsent.accepted / (dashboardAnalytics.cookieConsent.accepted + dashboardAnalytics.cookieConsent.rejected)) * 100).toFixed(1)}%
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
                          {dashboardAnalytics.cookieConsent.rejected.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {((dashboardAnalytics.cookieConsent.rejected / (dashboardAnalytics.cookieConsent.accepted + dashboardAnalytics.cookieConsent.rejected)) * 100).toFixed(1)}%
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}