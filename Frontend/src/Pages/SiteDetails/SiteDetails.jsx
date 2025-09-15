import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Eye, MousePointer, UserCheck, Globe, Monitor, Smartphone, Download, Star, TrendingUp, Play, MapPin, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../Services/api';

const SiteDetails = () => {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const [siteData, setSiteData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [visitors, setVisitors] = useState([]);
  const [visitorsLoading, setVisitorsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/sites/${siteId}`);
        setSiteData(response.data.site);
        setAnalytics(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching site data:', err);
        setError('Failed to load site data');
      } finally {
        setLoading(false);
      }
    };

    if (siteId) {
      fetchSiteData();
    }
  }, [siteId]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const fetchVisitors = async () => {
    try {
      setVisitorsLoading(true);
      const response = await api.get(`/sites/${siteId}/visitors`);
      setVisitors(response.data.visitors);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to load visitors data');
    } finally {
      setVisitorsLoading(false);
    }
  };

  // Fetch session recordings from API
  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      console.log('🎬 Fetching session recordings for site:', siteId);
      
      const response = await api.get(`/sessions/site/${siteId}`);
      
      if (response.data.success) {
        setSessions(response.data.sessions);
        console.log('✅ Successfully loaded', response.data.sessions.length, 'session recordings');
      } else {
        throw new Error(response.data.error || 'Failed to fetch sessions');
      }
    } catch (err) {
      console.error('❌ Error fetching sessions:', err);
      setError('Failed to load session recordings');
      // If API fails, set empty array to avoid showing dummy data
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Visitor ID',
      'Lead Score',
      'Name',
      'Email',
      'Phone',
      'Lead Status',
      'Page Views',
      'Total Sessions',
      'Time Spent (min)',
      'Clicks',
      'Form Submissions',
      'Scroll Events',
      'Country',
      'Region',
      'Browser',
      'Device',
      'OS',
      'First Seen',
      'Last Seen'
    ];

    const csvData = visitors.map(visitor => [
      visitor.uid,
      visitor.leadScore,
      visitor.lead_name || 'N/A',
      visitor.lead_email || 'N/A',
      visitor.lead_phone || 'N/A',
      visitor.lead_status,
      visitor.page_views,
      visitor.total_sessions,
      visitor.totalDuration,
      visitor.eventCounts.clicks,
      visitor.eventCounts.forms,
      visitor.eventCounts.scrolls,
      visitor.country || 'Unknown',
      visitor.region || 'Unknown',
      visitor.sessions[0]?.browser || 'Unknown',
      visitor.sessions[0]?.device || 'Unknown',
      visitor.sessions[0]?.os || 'Unknown',
      new Date(visitor.first_seen).toLocaleString(),
      new Date(visitor.last_seen).toLocaleString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${siteData.site_name}_visitors_lead_scores.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLeadScoreColor = (score) => {
    if (score >= 100) return 'text-red-600 bg-red-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    if (score >= 20) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getLeadScoreLabel = (score) => {
    if (score >= 100) return 'Hot';
    if (score >= 70) return 'Warm';
    if (score >= 40) return 'Medium';
    if (score >= 20) return 'Cold';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading site data...</p>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Site Not Found</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <p className="text-red-600">{error || 'Site not found'}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{siteData.site_name}</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        {/* Site Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Site Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <p className="text-gray-900 text-lg">{siteData.site_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Domain</label>
              <p className="text-gray-900 text-lg">{siteData.domain_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="text-gray-900">{new Date(siteData.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Site ID</label>
              <p className="text-gray-900 font-mono text-sm">{siteData.site_id}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab('visitors');
                  if (visitors.length === 0) {
                    fetchVisitors();
                  }
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'visitors'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Star className="h-4 w-4 inline mr-1" />
                Visitors by Lead Score
              </button>
              <button
                onClick={() => {
                  setActiveTab('sessions');
                  if (sessions.length === 0) {
                    fetchSessions();
                  }
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Play className="h-4 w-4 inline mr-1" />
                Session Replay
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <>
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.analytics.uniqueVisitors}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Eye className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.analytics.totalSessions}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Eye className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Page Views</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.dailyTrafficData?.reduce((sum, day) => sum + day.pageViews, 0) || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <UserCheck className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Leads Generated</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.analytics.totalLeads}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <Users className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.analytics.dailyActiveUsers || 0}</p>
                        <p className="text-xs text-gray-500">Last 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Monthly Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.analytics.monthlyActiveUsers || 0}</p>
                        <p className="text-xs text-gray-500">Last 30 days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traffic Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Page Views Chart */}
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      Page Views - Last 30 Days
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analytics.dailyTrafficData || []}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
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
                            formatter={(value, name) => [value, 'Page Views']}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="pageViews" 
                            stroke="#8B5CF6" 
                            strokeWidth={3}
                            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                            name="Page Views"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 bg-white rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Total Page Views</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {analytics.dailyTrafficData?.reduce((sum, day) => sum + day.pageViews, 0) || 0}
                      </p>
                      <p className="text-xs text-gray-500">Last 30 days</p>
                    </div>
                  </div>

                  {/* Sessions & Visitors Chart */}
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Sessions & Visitors - Last 30 Days
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analytics.dailyTrafficData || []}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
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
                            formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="visitors" 
                            stroke="#3B82F6" 
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                            name="Visitors"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sessions" 
                            stroke="#10B981" 
                            strokeWidth={3}
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                            name="Sessions"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Visitors</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900 mt-1">
                          {analytics.dailyTrafficData?.reduce((sum, day) => sum + day.visitors, 0) || 0}
                        </p>
                        <p className="text-xs text-gray-500">Total this month</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Sessions</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900 mt-1">
                          {analytics.dailyTrafficData?.reduce((sum, day) => sum + day.sessions, 0) || 0}
                        </p>
                        <p className="text-xs text-gray-500">Total this month</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Geographic Analytics - Priority Display */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Globe className="h-6 w-6 mr-3 text-blue-600" />
                    Geographic Distribution
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({Object.values(analytics.countryStats).reduce((sum, count) => sum + count, 0)} total visitors)
                    </span>
                  </h3>
                  
                  {Object.keys(analytics.countryStats).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(analytics.countryStats)
                        .sort(([,a], [,b]) => b - a)
                        .map(([country, count], index) => {
                          const totalVisitors = Object.values(analytics.countryStats).reduce((sum, c) => sum + c, 0);
                          const percentage = ((count / totalVisitors) * 100).toFixed(1);
                          const isTop = index < 3;
                          
                          return (
                            <div key={country} className="relative">
                              <div className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                                isTop 
                                  ? 'bg-white shadow-md border-l-4 border-blue-500' 
                                  : 'bg-white/70 border border-gray-200'
                              }`}>
                                <div className="flex items-center space-x-4">
                                  <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-blue-500' :
                                    index === 1 ? 'bg-blue-400' :
                                    index === 2 ? 'bg-blue-300' : 'bg-gray-300'
                                  }`}></div>
                                  <div>
                                    <span className={`font-semibold ${isTop ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {country}
                                    </span>
                                    {isTop && (
                                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        #{index + 1}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <div className={`font-bold ${isTop ? 'text-lg text-gray-900' : 'text-gray-800'}`}>
                                      {count}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {percentage}%
                                    </div>
                                  </div>
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        index === 0 ? 'bg-blue-500' :
                                        index === 1 ? 'bg-blue-400' :
                                        index === 2 ? 'bg-blue-300' : 'bg-gray-400'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">No geographic data available yet</p>
                      <p className="text-sm text-gray-400 mt-1">Data will appear as visitors access your site</p>
                    </div>
                  )}
                </div>

                {/* Region Analytics */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg shadow-sm border border-green-200 p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <MapPin className="h-6 w-6 mr-3 text-green-600" />
                    Region Distribution
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({Object.values(analytics.regionStats || {}).reduce((sum, count) => sum + count, 0)} total visitors)
                    </span>
                  </h3>
                  
                  {Object.keys(analytics.regionStats || {}).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(analytics.regionStats || {})
                        .sort(([,a], [,b]) => b - a)
                        .map(([region, count], index) => {
                          const totalVisitors = Object.values(analytics.regionStats || {}).reduce((sum, c) => sum + c, 0);
                          const percentage = totalVisitors > 0 ? ((count / totalVisitors) * 100).toFixed(1) : '0.0';
                          const isTop = index < 3;
                          
                          return (
                            <div key={region} className="relative">
                              <div className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                                isTop 
                                  ? 'bg-white shadow-md border-l-4 border-green-500' 
                                  : 'bg-white/70 border border-gray-200'
                              }`}>
                                <div className="flex items-center space-x-4">
                                  <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-green-500' :
                                    index === 1 ? 'bg-green-400' :
                                    index === 2 ? 'bg-green-300' : 'bg-gray-300'
                                  }`}></div>
                                  <div>
                                    <span className={`font-semibold ${isTop ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {region}
                                    </span>
                                    {isTop && (
                                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        #{index + 1}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <div className={`font-bold ${isTop ? 'text-lg text-gray-900' : 'text-gray-800'}`}>
                                      {count}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {percentage}%
                                    </div>
                                  </div>
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        index === 0 ? 'bg-green-500' :
                                        index === 1 ? 'bg-green-400' :
                                        index === 2 ? 'bg-green-300' : 'bg-gray-400'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">No region data available yet</p>
                      <p className="text-sm text-gray-400 mt-1">Data will appear as visitors access your site</p>
                    </div>
                  )}
                </div>

                {/* Cookie Consent Analytics */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Shield className="h-6 w-6 mr-3 text-yellow-600" />
                    Cookie Consent Analytics
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      Privacy compliance overview
                    </span>
                  </h3>
                  
                  {/* Cookie Consent Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Accepted</h4>
                        <CheckCircle className="text-green-600" size={24} />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {(analytics.cookieConsent?.accepted || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(() => {
                          const total = (analytics.cookieConsent?.accepted || 0) + 
                                       (analytics.cookieConsent?.rejected || 0);
                          return total > 0 ? ((analytics.cookieConsent?.accepted || 0) / total * 100).toFixed(1) : '0.0';
                        })()}% of visitors
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 border border-red-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Rejected</h4>
                        <XCircle className="text-red-600" size={24} />
                      </div>
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        {(analytics.cookieConsent?.rejected || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(() => {
                          const total = (analytics.cookieConsent?.accepted || 0) + 
                                       (analytics.cookieConsent?.rejected || 0);
                          return total > 0 ? ((analytics.cookieConsent?.rejected || 0) / total * 100).toFixed(1) : '0.0';
                        })()}% of visitors
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Operating System Statistics */}
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Monitor className="h-5 w-5 mr-2" />
                      Operating Systems
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.osStats || {})
                        .sort(([,a], [,b]) => b - a)
                        .map(([os, count]) => {
                          const totalOS = Object.values(analytics.osStats || {}).reduce((sum, c) => sum + c, 0);
                          const percentage = totalOS > 0 ? ((count / totalOS) * 100).toFixed(1) : 0;
                          
                          return (
                            <div key={os} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
                              <span className="text-gray-700 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                {os}
                              </span>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{count}</span>
                                <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      {Object.keys(analytics.osStats || {}).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No OS data available</p>
                      )}
                    </div>
                  </div>

                  {/* Browser Statistics */}
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Browsers
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.browserStats)
                        .sort(([,a], [,b]) => b - a)
                        .map(([browser, count]) => {
                          const totalBrowsers = Object.values(analytics.browserStats).reduce((sum, c) => sum + c, 0);
                          const percentage = totalBrowsers > 0 ? ((count / totalBrowsers) * 100).toFixed(1) : 0;
                          
                          return (
                            <div key={browser} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
                              <span className="text-gray-700 flex items-center">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                {browser}
                              </span>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{count}</span>
                                <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      {Object.keys(analytics.browserStats).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No browser data available</p>
                      )}
                    </div>
                  </div>

                  {/* Device Statistics */}
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Smartphone className="h-5 w-5 mr-2" />
                      Devices
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.deviceStats)
                        .sort(([,a], [,b]) => b - a)
                        .map(([device, count]) => {
                          const totalDevices = Object.values(analytics.deviceStats).reduce((sum, c) => sum + c, 0);
                          const percentage = totalDevices > 0 ? ((count / totalDevices) * 100).toFixed(1) : 0;
                          
                          return (
                            <div key={device} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
                              <span className="text-gray-700 flex items-center">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                {device}
                              </span>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{count}</span>
                                <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      {Object.keys(analytics.deviceStats).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No device data available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Visitors */}
                <div className="bg-gray-50 rounded-lg shadow-sm border p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Visitors</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visitor ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Seen
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lead Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.recentVisitors.map((visitor) => (
                          <tr key={visitor.uid}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {visitor.uid.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {visitor.country && visitor.region ? `${visitor.region}, ${visitor.country}` : 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {visitor.page_views}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(visitor.last_seen).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                visitor.lead_status === 'unknown' 
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {visitor.lead_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {analytics.recentVisitors.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                              No recent visitors
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Leads Section */}
                {analytics.leads.length > 0 && (
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Leads</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              First Seen
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analytics.leads.map((lead) => (
                            <tr key={lead.uid}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {lead.lead_name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {lead.lead_email || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {lead.lead_phone || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {lead.lead_status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(lead.first_seen).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'visitors' && (
              <>
                {/* Visitors by Lead Score Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Visitors by Lead Score</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Visitors ranked by engagement and conversion potential
                    </p>
                  </div>
                  <button
                    onClick={exportToCSV}
                    disabled={visitors.length === 0}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Lead Score Legend */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Lead Score Legend</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-red-600 bg-red-100">
                        Hot (100+)
                      </span>
                      <span className="text-sm text-gray-600">High engagement, likely to convert</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-orange-600 bg-orange-100">
                        Warm (70-99)
                      </span>
                      <span className="text-sm text-gray-600">Good engagement, follow up recommended</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-yellow-600 bg-yellow-100">
                        Medium (40-69)
                      </span>
                      <span className="text-sm text-gray-600">Moderate interest, nurture needed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-blue-600 bg-blue-100">
                        Cold (20-39)
                      </span>
                      <span className="text-sm text-gray-600">Basic interaction, long-term nurture</span>
                    </div>
                  </div>
                </div>

                {/* Visitors Table */}
                {visitorsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading visitors data...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lead Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Visitor Info
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Engagement
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tech Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Activity
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {visitors.map((visitor) => (
                            <tr key={visitor.uid} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${getLeadScoreColor(visitor.leadScore)}`}>
                                    {getLeadScoreLabel(visitor.leadScore)}
                                  </span>
                                  <span className="text-lg font-bold text-gray-900 mt-1">{visitor.leadScore}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="text-sm font-mono text-gray-900">{visitor.uid.substring(0, 8)}...</span>
                                  <span className="text-sm text-gray-500">
                                    {visitor.country && visitor.region ? `${visitor.region}, ${visitor.country}` : 'Unknown location'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    {visitor.lead_name || 'Anonymous'}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {visitor.lead_email || 'No email'}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {visitor.lead_phone || 'No phone'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">
                                  <div className="text-gray-900">{visitor.page_views} page views</div>
                                  <div className="text-gray-500">{visitor.total_sessions} sessions</div>
                                  <div className="text-gray-500">{visitor.totalDuration} min total</div>
                                  <div className="text-gray-500">
                                    {visitor.eventCounts.clicks}c, {visitor.eventCounts.forms}f, {visitor.eventCounts.scrolls}s
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">
                                  <div className="text-gray-900">{visitor.sessions[0]?.browser || 'Unknown'}</div>
                                  <div className="text-gray-500">{visitor.sessions[0]?.device || 'Unknown'}</div>
                                  <div className="text-gray-500">{visitor.sessions[0]?.os || 'Unknown'}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">
                                  <div className="text-gray-900">First: {new Date(visitor.first_seen).toLocaleDateString()}</div>
                                  <div className="text-gray-500">Last: {new Date(visitor.last_seen).toLocaleDateString()}</div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                                    visitor.lead_status === 'unknown' 
                                      ? 'bg-gray-100 text-gray-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {visitor.lead_status}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {visitors.length === 0 && !visitorsLoading && (
                            <tr>
                              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                No visitors data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'sessions' && (
              <>
                {/* Session Replay Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Session Replay</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Watch user interactions and behavior recordings for detailed analysis
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Play className="h-4 w-4" />
                    <span>{sessions.length} recorded sessions</span>
                  </div>
                </div>

                {/* Session Replay Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Total Sessions</p>
                        <p className="text-xl font-bold text-gray-900">{sessions.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <UserCheck className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Lead Sessions</p>
                        <p className="text-xl font-bold text-gray-900">
                          {sessions.filter(s => s.visitorInfo.isLead).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Avg Duration</p>
                        <p className="text-xl font-bold text-gray-900">
                          {sessions.length > 0 
                            ? Math.round(sessions.reduce((sum, s) => sum + s.engagement.duration, 0) / sessions.length / 60)
                            : 0}m
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <MousePointer className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Avg Clicks</p>
                        <p className="text-xl font-bold text-gray-900">
                          {sessions.length > 0 
                            ? Math.round(sessions.reduce((sum, s) => sum + s.engagement.clicks, 0) / sessions.length)
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sessions Table */}
                {sessionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading session recordings...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Session ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Visitor Info
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Engagement
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Session Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lead Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sessions.map((session) => (
                            <tr key={session.sessionId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="text-sm font-mono text-gray-900">
                                    {session.sessionId.substring(8, 20)}...
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(session.sessionDetails.startTime).toLocaleDateString()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900">
                                      {session.visitorInfo.name}
                                    </span>
                                    {session.visitorInfo.isLead && (
                                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Lead
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {session.visitorInfo.email || 'Anonymous'}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {session.visitorInfo.location}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">
                                  <div className="flex items-center space-x-4 text-gray-900">
                                    <span title="Page Views">
                                      <Eye className="h-4 w-4 inline mr-1" />
                                      {session.engagement.pageViews}
                                    </span>
                                    <span title="Duration">
                                      ⏱️ {Math.round(session.engagement.duration / 60)}m
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-4 text-gray-500 mt-1">
                                    <span title="Clicks">
                                      <MousePointer className="h-3 w-3 inline mr-1" />
                                      {session.engagement.clicks}
                                    </span>
                                    <span title="Form Submissions">
                                      📝 {session.engagement.formSubmissions}
                                    </span>
                                    <span title="Scroll Events">
                                      📜 {session.engagement.scrollEvents}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">
                                  <div className="text-gray-900 font-medium">
                                    {session.sessionDetails.browser}
                                  </div>
                                  <div className="text-gray-500">
                                    {session.sessionDetails.device} • {session.sessionDetails.os}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {session.sessionDetails.entryPage} → {session.sessionDetails.exitPage}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {new Date(session.sessionDetails.startTime).toLocaleTimeString()} - {new Date(session.sessionDetails.endTime).toLocaleTimeString()}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col items-center">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                                    session.leadScore >= 100 ? 'text-red-600 bg-red-100' :
                                    session.leadScore >= 70 ? 'text-orange-600 bg-orange-100' :
                                    session.leadScore >= 40 ? 'text-yellow-600 bg-yellow-100' :
                                    session.leadScore >= 20 ? 'text-blue-600 bg-blue-100' :
                                    'text-gray-600 bg-gray-100'
                                  }`}>
                                    {session.leadScore >= 100 ? 'Hot' :
                                     session.leadScore >= 70 ? 'Warm' :
                                     session.leadScore >= 40 ? 'Medium' :
                                     session.leadScore >= 20 ? 'Cold' : 'Unknown'}
                                  </span>
                                  <span className="text-lg font-bold text-gray-900 mt-1">
                                    {session.leadScore}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => navigate(`/sites/${siteId}/recording/${session.recordingId}`)}
                                  className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                >
                                  <Play className="h-4 w-4" />
                                  <span>Replay</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                          {sessions.length === 0 && !sessionsLoading && (
                            <tr>
                              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                <div className="flex flex-col items-center py-8">
                                  <Play className="h-12 w-12 text-gray-300 mb-3" />
                                  <p>No session recordings available</p>
                                  <p className="text-sm text-gray-400 mt-1">Sessions will appear here once users interact with your site</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDetails;
