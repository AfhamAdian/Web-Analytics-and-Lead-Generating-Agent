import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Eye, MousePointer, UserCheck, Globe, Monitor, Smartphone, Download, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <>
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                        <MousePointer className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Events</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.analytics.totalEvents}</p>
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
                        <p className="text-2xl font-bold text-gray-900">{analytics.analytics.leads}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Browser Statistics */}
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Monitor className="h-5 w-5 mr-2" />
                      Browser Analytics
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.browserStats).map(([browser, count]) => (
                        <div key={browser} className="flex justify-between items-center">
                          <span className="text-gray-700">{browser}</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                      {Object.keys(analytics.browserStats).length === 0 && (
                        <p className="text-gray-500">No browser data available</p>
                      )}
                    </div>
                  </div>

                  {/* Device Statistics */}
                  <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Smartphone className="h-5 w-5 mr-2" />
                      Device Analytics
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.deviceStats).map(([device, count]) => (
                        <div key={device} className="flex justify-between items-center">
                          <span className="text-gray-700">{device}</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                      {Object.keys(analytics.deviceStats).length === 0 && (
                        <p className="text-gray-500">No device data available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Country Analytics */}
                <div className="bg-gray-50 rounded-lg shadow-sm border p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Geographic Analytics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(analytics.countryStats).map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-700">{country}</span>
                        <span className="font-semibold text-gray-900">{count} visitors</span>
                      </div>
                    ))}
                    {Object.keys(analytics.countryStats).length === 0 && (
                      <p className="text-gray-500 col-span-full">No geographic data available</p>
                    )}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDetails;
