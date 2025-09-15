import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  MousePointer, 
  Eye, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2,
  Settings,
  Download,
  Share2,
  Star,
  MapPin,
  Monitor,
  Globe,
  Calendar
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SessionReplay = () => {
  const navigate = useNavigate();
  const { siteId, sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('replay');

  // Dummy session data - In real implementation, this would be fetched based on sessionId
  const dummySessionDetails = {
    sessionId: 'session_abc123def456',
    visitorId: 'visitor_789xyz012',
    visitorInfo: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      location: 'New York, US',
      isLead: true,
      leadScore: 95,
      device: 'Desktop',
      browser: 'Chrome 128.0.0.0',
      os: 'Windows 11',
      screenResolution: '1920x1080',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    },
    sessionDetails: {
      startTime: '2025-09-16T10:30:00Z',
      endTime: '2025-09-16T10:44:05Z',
      duration: 845, // seconds
      entryPage: '/home',
      exitPage: '/contact',
      totalPageViews: 12,
      uniquePageViews: 8,
      bounceRate: false,
      conversionEvents: ['form_submit', 'email_signup', 'demo_request']
    },
    engagement: {
      clicks: 23,
      scrollEvents: 45,
      formSubmissions: 2,
      timeOnPage: {
        '/home': 120,
        '/products': 180,
        '/about': 90,
        '/pricing': 240,
        '/contact': 215
      }
    },
    events: [
      { timestamp: 0, type: 'page_load', page: '/home', data: { loadTime: 1.2 } },
      { timestamp: 5000, type: 'scroll', data: { scrollDepth: 25 } },
      { timestamp: 12000, type: 'click', element: 'nav-products', data: { x: 245, y: 89 } },
      { timestamp: 12500, type: 'page_load', page: '/products', data: { loadTime: 0.8 } },
      { timestamp: 25000, type: 'scroll', data: { scrollDepth: 50 } },
      { timestamp: 35000, type: 'click', element: 'product-card-1', data: { x: 340, y: 250 } },
      { timestamp: 45000, type: 'form_focus', element: 'contact-form-name', data: {} },
      { timestamp: 48000, type: 'form_input', element: 'contact-form-name', data: { value: 'John Smith' } },
      { timestamp: 52000, type: 'form_focus', element: 'contact-form-email', data: {} },
      { timestamp: 55000, type: 'form_input', element: 'contact-form-email', data: { value: 'john.smith@example.com' } },
      { timestamp: 60000, type: 'form_submit', element: 'contact-form', data: { success: true } }
    ],
    pageJourney: [
      { page: '/home', timestamp: 0, duration: 120000, events: 8 },
      { page: '/products', timestamp: 120000, duration: 180000, events: 12 },
      { page: '/about', timestamp: 300000, duration: 90000, events: 4 },
      { page: '/pricing', timestamp: 390000, duration: 240000, events: 15 },
      { page: '/contact', timestamp: 630000, duration: 215000, events: 6 }
    ]
  };

  useEffect(() => {
    // Simulate loading session data
    const loadSessionData = async () => {
      setLoading(true);
      // In real implementation, fetch session data from API using sessionId
      // const response = await api.get(`/sessions/${sessionId}`);
      // setSessionData(response.data);
      
      // For now, use dummy data
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSessionData(dummySessionDetails);
      setLoading(false);
    };

    loadSessionData();
  }, [sessionId]);

  const handleBack = () => {
    navigate(`/sites/${siteId}`);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session replay...</p>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Site Details</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Session Not Found</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <p className="text-red-600">Session replay not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Site Details</span>
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div>
              <h1 className="text-xl font-bold text-white">Session Replay</h1>
              <p className="text-sm text-gray-400">
                {sessionData.visitorInfo.name} • {sessionData.visitorInfo.location}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Playback Controls */}
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-4 py-2">
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                className="text-gray-300 hover:text-white"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={togglePlayback}
                className="text-white bg-orange-600 hover:bg-orange-700 rounded-full p-2"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={() => setCurrentTime(Math.min(sessionData.sessionDetails.duration, currentTime + 10))}
                className="text-gray-300 hover:text-white"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Speed Control */}
            <div className="flex items-center space-x-2">
              {[0.5, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 py-1 rounded text-sm ${
                    playbackSpeed === speed
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className="text-gray-300 hover:text-white p-2">
                <Download size={18} />
              </button>
              <button className="text-gray-300 hover:text-white p-2">
                <Share2 size={18} />
              </button>
              <button className="text-gray-300 hover:text-white p-2">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
            <div className="flex-1 bg-gray-600 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / sessionData.sessionDetails.duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-400">{formatTime(sessionData.sessionDetails.duration)}</span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Replay Area */}
        <div className="flex-1 bg-gray-800 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl" style={{ width: '1200px', height: '675px' }}>
            {/* Browser Frame */}
            <div className="bg-gray-200 rounded-t-lg px-4 py-2 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                {sessionData.pageJourney[Math.floor(currentTime / 60)]?.page || sessionData.sessionDetails.entryPage}
              </div>
            </div>
            
            {/* Simulated Website Content */}
            <div className="h-full bg-white rounded-b-lg p-8 overflow-hidden relative">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Website Replay Simulation</h2>
                <p className="text-gray-600 mb-8">
                  This is a simulated view of the user's session on your website
                </p>
                
                {/* Current Page Indicator */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-800">
                    Current Page: {sessionData.pageJourney[Math.floor(currentTime / 60)]?.page || sessionData.sessionDetails.entryPage}
                  </h3>
                  <p className="text-blue-600 text-sm mt-1">
                    Time spent: {formatDuration(sessionData.pageJourney[Math.floor(currentTime / 60)]?.duration || 0)}
                  </p>
                </div>

                {/* Mouse Cursor Simulation */}
                <div 
                  className="absolute w-4 h-4 bg-red-500 rounded-full pointer-events-none transition-all duration-200"
                  style={{
                    left: `${300 + Math.sin(currentTime / 10) * 100}px`,
                    top: `${200 + Math.cos(currentTime / 15) * 50}px`
                  }}
                ></div>

                {/* Event Indicators */}
                <div className="space-y-2">
                  {sessionData.events
                    .filter(event => event.timestamp <= currentTime * 1000 && event.timestamp > (currentTime - 5) * 1000)
                    .map((event, index) => (
                      <div key={index} className="bg-green-100 border border-green-300 rounded p-2 text-green-800 text-sm">
                        <strong>{event.type.replace('_', ' ').toUpperCase()}</strong>
                        {event.element && ` on ${event.element}`}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Session Details */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-4">
              {['replay', 'details', 'events'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    activeTab === tab
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'replay' && (
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Visitor Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{sessionData.visitorInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white text-xs">{sessionData.visitorInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white">{sessionData.visitorInfo.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Lead Score:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        sessionData.visitorInfo.leadScore >= 100 ? 'bg-red-100 text-red-800' :
                        sessionData.visitorInfo.leadScore >= 70 ? 'bg-orange-100 text-orange-800' :
                        sessionData.visitorInfo.leadScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {sessionData.visitorInfo.leadScore}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Session Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{formatTime(sessionData.sessionDetails.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Page Views:</span>
                      <span className="text-white">{sessionData.sessionDetails.totalPageViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Clicks:</span>
                      <span className="text-white">{sessionData.engagement.clicks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Forms:</span>
                      <span className="text-white">{sessionData.engagement.formSubmissions}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Monitor className="h-4 w-4 mr-2" />
                    Technical Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Browser:</span>
                      <p className="text-white">{sessionData.visitorInfo.browser}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">OS:</span>
                      <p className="text-white">{sessionData.visitorInfo.os}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Device:</span>
                      <p className="text-white">{sessionData.visitorInfo.device}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Resolution:</span>
                      <p className="text-white">{sessionData.visitorInfo.screenResolution}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Session Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Started:</span>
                      <p className="text-white">{new Date(sessionData.sessionDetails.startTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Ended:</span>
                      <p className="text-white">{new Date(sessionData.sessionDetails.endTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Entry Page:</span>
                      <p className="text-white">{sessionData.sessionDetails.entryPage}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Exit Page:</span>
                      <p className="text-white">{sessionData.sessionDetails.exitPage}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-2">
                <h3 className="text-white font-semibold mb-3">Session Events</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sessionData.events.map((event, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded text-sm ${
                        event.timestamp <= currentTime * 1000 
                          ? 'bg-gray-600 border border-orange-500' 
                          : 'bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white font-medium">
                          {event.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {formatTime(Math.floor(event.timestamp / 1000))}
                        </span>
                      </div>
                      {event.element && (
                        <p className="text-gray-300 text-xs">Element: {event.element}</p>
                      )}
                      {event.page && (
                        <p className="text-gray-300 text-xs">Page: {event.page}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionReplay;
