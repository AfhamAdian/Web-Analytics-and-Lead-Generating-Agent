/**
 * Lead Scoring Utilities
 * Functions for calculating visitor lead scores and engagement metrics
 */

/**
 * Calculate lead score for a visitor based on their activity
 * @param {object} visitor - Visitor data with sessions and events
 * @param {array} visitorEvents - Array of events for this visitor
 * @returns {object} - Visitor data with calculated lead score and metrics
 */
function calculateLeadScore(visitor, visitorEvents = []) {
  let leadScore = 0;
  
  // Base score factors
  leadScore += visitor.page_views * 5; // 5 points per page view
  leadScore += visitor.total_sessions * 10; // 10 points per session
  
  // Time spent (based on session duration)
  const totalDuration = visitor.sessions.reduce((sum, session) => {
    return sum + (session.duration || 0);
  }, 0);
  leadScore += Math.min(totalDuration / 60, 30); // Max 30 points for time (1 point per minute, capped at 30)
  
  // Event engagement
  const clickEvents = visitorEvents.filter(e => e.event_type === 'click').length;
  const formEvents = visitorEvents.filter(e => e.event_type === 'form_submit').length;
  const scrollEvents = visitorEvents.filter(e => e.event_type === 'scroll').length;
  
  leadScore += clickEvents * 2; // 2 points per click
  leadScore += formEvents * 20; // 20 points per form submission
  leadScore += scrollEvents * 1; // 1 point per scroll event
  
  // Return visits bonus
  if (visitor.total_sessions > 1) {
    leadScore += (visitor.total_sessions - 1) * 15; // 15 points for each return visit
  }
  
  // Lead status bonus
  if (visitor.lead_status !== 'unknown' && visitor.lead_name) {
    leadScore += 50; // 50 points for becoming a lead
  }
  
  // Recent activity bonus
  const daysSinceLastSeen = (new Date() - new Date(visitor.last_seen)) / (1000 * 60 * 60 * 24);
  if (daysSinceLastSeen < 1) {
    leadScore += 20; // 20 points for activity in last 24 hours
  } else if (daysSinceLastSeen < 7) {
    leadScore += 10; // 10 points for activity in last week
  }
  
  return {
    ...visitor,
    leadScore: Math.round(leadScore),
    totalDuration: Math.round(totalDuration / 60), // in minutes
    eventCounts: {
      clicks: clickEvents,
      forms: formEvents,
      scrolls: scrollEvents
    }
  };
}

/**
 * Process daily traffic data for analytics
 * @param {array} sessions - Array of session data
 * @param {array} pageViews - Array of page view events
 * @param {number} daysBack - Number of days to process (default: 30)
 * @returns {array} - Daily traffic data array
 */
function processDailyTrafficData(sessions = [], pageViews = [], daysBack = 30) {
  const dailyTrafficData = [];
  
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    // Filter sessions for this day
    const dailySessions = sessions.filter(session => {
      const sessionDate = new Date(session.started_at);
      return sessionDate >= startOfDay && sessionDate < endOfDay;
    });

    // Filter page views for this day
    const dailyPageViews = pageViews.filter(event => {
      const eventDate = new Date(event.event_timestamp);
      return eventDate >= startOfDay && eventDate < endOfDay;
    });

    dailyTrafficData.push({
      date: startOfDay.toISOString().split('T')[0], // YYYY-MM-DD format
      visitors: [...new Set(dailySessions.map(s => s.uid))].length,
      sessions: dailySessions.length,
      pageViews: dailyPageViews.length
    });
  }
  
  return dailyTrafficData;
}

/**
 * Calculate analytics statistics for a set of data
 * @param {object} data - Object containing sessions, events, visitors arrays
 * @returns {object} - Calculated statistics
 */
function calculateAnalyticsStats(data) {
  const { sessions = [], events = [], visitors = [], leads = [] } = data;
  
  const uniqueVisitors = [...new Set(sessions.map(s => s.uid))].length;
  const totalSessions = sessions.length;
  const totalEvents = events.length;
  const totalLeads = leads.length;

  // Calculate time-based metrics
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyActiveUsers = [...new Set(
    sessions
      .filter(s => new Date(s.started_at) >= oneDayAgo)
      .map(s => s.uid)
  )].length;

  const monthlyActiveUsers = [...new Set(
    sessions
      .filter(s => new Date(s.started_at) >= thirtyDaysAgo)
      .map(s => s.uid)
  )].length;

  return {
    uniqueVisitors,
    totalSessions,
    totalEvents,
    totalLeads,
    dailyActiveUsers,
    monthlyActiveUsers
  };
}

module.exports = {
  calculateLeadScore,
  processDailyTrafficData,
  calculateAnalyticsStats
};
