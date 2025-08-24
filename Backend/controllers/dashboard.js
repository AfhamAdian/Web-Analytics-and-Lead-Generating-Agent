// Dashboard Controller - Handles dashboard and analytics display endpoints
// Integrates site management, analytics calculations, and dashboard data

const supabase = require('../supabaseClient');
const crypto = require('crypto');
const config = require('../config');

// ===== HELPER FUNCTIONS =====

function sanitizeUserId(userId) {
  if (userId.startsWith('user_')) {
    return userId.substring(5);
  }
  
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return userId;
  }
  
  console.warn(`Invalid userId format: ${userId}, generating new UUID`);
  return crypto.randomUUID();
}

// ===== USER FUNCTIONS =====

async function getUserByEmail(email) {
  try {
    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return { user: null, error };
    }

    if (user) {
      delete user.password;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return { user: null, error };
  }
}

async function getOwnerIdByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('owners')
      .select('owner_id')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching owner ID:', error);
      return null;
    }

    return data?.owner_id || null;
  } catch (error) {
    console.error('Error in getOwnerIdByEmail:', error);
    return null;
  }
}

// ===== SITE FUNCTIONS =====

async function getSiteByIdAndOwner(siteId, ownerId) {
  try {
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('site_id', siteId)
      .eq('owner_id', ownerId)
      .single();

    if (siteError) {
      console.error('Error fetching site:', siteError);
      return { site: null, error: siteError };
    }

    return { site: siteData, error: null };
  } catch (error) {
    console.error('Error in getSiteByIdAndOwner:', error);
    return { site: null, error };
  }
}

async function getSitesByOwner(ownerId) {
  try {
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')
      .eq('owner_id', ownerId);

    if (sitesError) {
      console.error('Error fetching sites:', sitesError);
      return { sites: null, error: sitesError };
    }

    return { sites: sites || [], error: null };
  } catch (error) {
    console.error('Error in getSitesByOwner:', error);
    return { sites: null, error };
  }
}

async function createSite(siteData) {
  try {
    const { siteName, siteDomain, ownerId } = siteData;

    // Check if domain already exists
    const { data: existingSite } = await supabase
      .from('sites')
      .select('*')
      .eq('domain_name', siteDomain)
      .single();

    if (existingSite) {
      return { site: null, error: { message: 'Site with this domain already exists' } };
    }

    const { data, error } = await supabase
      .from('sites')
      .insert([{
        site_name: siteName,
        domain_name: siteDomain,
        owner_id: ownerId
      }])
      .select();

    if (error) {
      console.error('Error creating site:', error);
      return { site: null, error };
    }

    return { site: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in createSite:', error);
    return { site: null, error };
  }
}

// ===== SESSION FUNCTIONS =====

async function getSessionsBySite(siteId, options = {}) {
  try {
    let query = supabase
      .from('sessions')
      .select('*')
      .eq('site_id', siteId);

    if (options.startDate) {
      query = query.gte('started_at', options.startDate);
    }

    query = query.order('started_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return { sessions: null, error };
    }

    return { sessions: sessions || [], error: null };
  } catch (error) {
    console.error('Error in getSessionsBySite:', error);
    return { sessions: null, error };
  }
}

// ===== EVENT FUNCTIONS =====

async function getEventsBySite(siteId, options = {}) {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .eq('site_id', siteId);

    if (options.eventType) {
      query = query.eq('event_type', options.eventType);
    }

    if (options.startDate) {
      query = query.gte('event_timestamp', options.startDate);
    }
    if (options.endDate) {
      query = query.lte('event_timestamp', options.endDate);
    }

    query = query.order('event_timestamp', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return { events: null, error };
    }

    return { events: events || [], error: null };
  } catch (error) {
    console.error('Error in getEventsBySite:', error);
    return { events: null, error };
  }
}

async function getEventsByVisitor(uid, siteId) {
  try {
    const sanitizedUserId = sanitizeUserId(uid);
    
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('uid', sanitizedUserId)
      .eq('site_id', siteId)
      .order('event_timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching visitor events:', error);
      return { events: null, error };
    }

    return { events: events || [], error: null };
  } catch (error) {
    console.error('Error in getEventsByVisitor:', error);
    return { events: null, error };
  }
}

// ===== VISITOR FUNCTIONS =====

async function getVisitorsBySite(siteId, options = {}) {
  try {
    let query = supabase
      .from('visitors')
      .select(`
        uid,
        first_seen,
        last_seen,
        region,
        country,
        page_views,
        total_sessions,
        lead_status,
        lead_name,
        lead_email,
        lead_phone,
        sessions!inner(
          session_id,
          site_id,
          started_at,
          ended_at,
          duration,
          browser,
          device,
          os
        )
      `)
      .eq('sessions.site_id', siteId);

    if (options.leadStatus) {
      query = query.eq('lead_status', options.leadStatus);
    }

    query = query.order('last_seen', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data: visitors, error } = await query;

    if (error) {
      console.error('Error fetching visitors:', error);
      return { visitors: null, error };
    }

    return { visitors: visitors || [], error: null };
  } catch (error) {
    console.error('Error in getVisitorsBySite:', error);
    return { visitors: null, error };
  }
}

// ===== ANALYTICS UTILITY FUNCTIONS (previously in analyticsUtils) =====

function calculateAnalyticsStats(data) {
  const { sessions = [], events = [], visitors = [], leads = [] } = data;

  // Basic stats
  const totalSessions = sessions.length;
  const uniqueVisitors = [...new Set(sessions.map(s => s.uid))].length;
  const totalPageViews = events.filter(e => e.event_type === 'page_view').length;
  const totalLeads = leads.length;

  // Conversion rate
  const conversionRate = uniqueVisitors > 0 ? (totalLeads / uniqueVisitors * 100).toFixed(2) : '0.00';

  // Average session duration
  const validSessions = sessions.filter(s => s.duration && s.duration > 0);
  const avgSessionDuration = validSessions.length > 0 
    ? Math.round(validSessions.reduce((sum, s) => sum + s.duration, 0) / validSessions.length)
    : 0;

  // Bounce rate (sessions with only 1 page view)
  const bounceRate = totalSessions > 0 
    ? ((totalSessions - totalPageViews + uniqueVisitors) / totalSessions * 100).toFixed(2)
    : '0.00';

  return {
    totalSessions,
    uniqueVisitors,
    totalPageViews,
    totalLeads,
    conversionRate: parseFloat(conversionRate),
    avgSessionDuration,
    bounceRate: parseFloat(bounceRate)
  };
}

function processDailyTrafficData(sessions = [], pageViewEvents = [], days = 30) {
  const now = new Date();
  const dailyData = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const daySessions = sessions.filter(s => {
      const sessionDate = new Date(s.started_at);
      return sessionDate >= dayStart && sessionDate <= dayEnd;
    });

    const dayPageViews = pageViewEvents.filter(e => {
      const eventDate = new Date(e.event_timestamp);
      return eventDate >= dayStart && eventDate <= dayEnd;
    });

    dailyData.push({
      date: dateStr,
      sessions: daySessions.length,
      pageViews: dayPageViews.length,
      visitors: [...new Set(daySessions.map(s => s.uid))].length
    });
  }

  return dailyData;
}

function calculateLeadScore(visitor, visitorEvents = []) {
  let leadScore = 0;
  
  // Base score factors
  leadScore += (visitor.page_views || 0) * 5;
  leadScore += (visitor.total_sessions || 0) * 10;
  
  // Time spent (based on session duration)
  // Handle both cases: visitor.sessions array or individual visitor data
  let totalDuration = 0;
  if (visitor.sessions && Array.isArray(visitor.sessions)) {
    totalDuration = visitor.sessions.reduce((sum, session) => {
      return sum + (session.duration || 0);
    }, 0);
  }
  leadScore += Math.min(totalDuration / 60, 30);
  
  // Event engagement
  const clickEvents = visitorEvents.filter(e => e.event_type === 'click').length;
  const formEvents = visitorEvents.filter(e => e.event_type === 'form_submit').length;
  const scrollEvents = visitorEvents.filter(e => e.event_type === 'scroll').length;
  
  leadScore += clickEvents * 2;
  leadScore += formEvents * 20;
  leadScore += scrollEvents * 1;
  
  // Return visits bonus
  if ((visitor.total_sessions || 0) > 1) {
    leadScore += ((visitor.total_sessions || 0) - 1) * 15;
  }
  
  // Lead status bonus
  if (visitor.lead_status !== 'unknown' && visitor.lead_name) {
    leadScore += 50;
  }
  
  // Recent activity bonus
  if (visitor.last_seen) {
    const daysSinceLastSeen = (new Date() - new Date(visitor.last_seen)) / (1000 * 60 * 60 * 24);
    if (daysSinceLastSeen < 1) {
      leadScore += 20;
    } else if (daysSinceLastSeen < 7) {
      leadScore += 10;
    }
  }

  // Determine lead quality
  let leadQuality = 'Cold';
  if (leadScore >= 100) leadQuality = 'Hot';
  else if (leadScore >= 50) leadQuality = 'Warm';

  return {
    ...visitor,
    leadScore: Math.round(leadScore),
    leadQuality,
    engagementLevel: clickEvents + formEvents + scrollEvents,
    totalDuration: Math.round(totalDuration / 60), // in minutes
    eventCounts: {
      clicks: clickEvents,
      forms: formEvents,
      scrolls: scrollEvents
    }
  };
}

// ===== CONTROLLER FUNCTIONS =====

// Handle dashboard data retrieval
async function handleDashboard(req, res) {
  try {
    const userEmail = req.user.email;
    
    // Get user name
    const { user: userData } = await getUserByEmail(userEmail);
    const userName = userData?.name || null;

    // Get owner ID
    const ownerId = await getOwnerIdByEmail(userEmail);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Get all sites for this owner
    const { sites, error: sitesError } = await getSitesByOwner(ownerId);
    if (sitesError) {
      console.error('Error fetching sites:', sitesError);
      return res.status(500).json({ message: 'Failed to fetch sites', error: sitesError.message });
    }

    const siteIds = sites.map(s => s.site_id);
    const totalSites = sites.length;

    // Get basic analytics across all sites
    let uniqueVisitors = 0;
    let totalLeads = 0;

    if (siteIds.length > 0) {
      // Get all sessions for calculating unique visitors
      const sessionPromises = siteIds.map(siteId => 
        getSessionsBySite(siteId)
      );
      const sessionResults = await Promise.all(sessionPromises);
      
      const allSessions = sessionResults
        .filter(result => result.sessions)
        .flatMap(result => result.sessions);

      uniqueVisitors = [...new Set(allSessions.map(s => s.uid))].length;

      // Get leads across all sites
      const visitorPromises = siteIds.map(siteId => 
        getVisitorsBySite(siteId, { leadStatus: 'captured' })
      );
      const visitorResults = await Promise.all(visitorPromises);
      
      const allLeads = visitorResults
        .filter(result => result.visitors)
        .flatMap(result => result.visitors)
        .filter(visitor => visitor.lead_name);

      totalLeads = allLeads.length;
    }

    // Mock revenue calculation (you can implement real revenue tracking)
    const revenue = totalLeads * 150; // $150 per lead average

    const stats = [
      { title: 'Total Sites', value: totalSites.toString() },
      { title: 'Active Users', value: uniqueVisitors.toString() },
      { title: 'New Leads', value: totalLeads.toString() },
      { title: 'Revenue', value: `$${revenue.toLocaleString()}` }
    ];

    const chartData = [
      { label: 'Sites', percentage: Math.min(totalSites * 20, 100), value: totalSites.toString(), color: 'bg-orange-500' },
      { label: 'Users', percentage: Math.min(uniqueVisitors * 2, 100), value: uniqueVisitors.toString(), color: 'bg-blue-500' },
      { label: 'Leads', percentage: Math.min(totalLeads * 5, 100), value: totalLeads.toString(), color: 'bg-green-500' },
      { label: 'Revenue', percentage: Math.min(revenue / 100, 100), value: `$${(revenue/1000).toFixed(1)}K`, color: 'bg-purple-500' }
    ];

    res.status(200).json({
      message: 'Dashboard data fetched successfully',
      userName,
      sites,
      stats,
      chartData
    });

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle site addition
async function handleAddSite(req, res) {
  try {
    const { siteName, siteDomain } = req.body; 
    
    if (!siteName || !siteDomain) {
      return res.status(400).json({ message: 'Missing required fields: siteName, siteDomain' });
    }

    const ownerId = await getOwnerIdByEmail(req.user.email);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const { site, error } = await createSite({
      siteName,
      siteDomain,
      ownerId
    });

    if (error) {
      console.error('Error adding site:', error);
      return res.status(500).json({ message: 'Failed to add site', error: error.message });
    }

    console.log('Site added successfully:', site);
    
    // Generate tracking script for the new site
    const trackingScript = `<Script
  src="${config.trackingScriptUrl}"
  site-id="${site.site_id}"
  strategy="afterInteractive"
  async
/>`;

    res.status(200).json({
      message: 'Site added successfully',
      site: site,
      trackingScript: trackingScript
    });

  } catch (error) {
    console.error('Add site error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle site analytics retrieval
async function handleSiteAnalytics(req, res) {
  try {
    const { siteId } = req.params;
    const userEmail = req.user.email;

    // Get owner ID
    const ownerId = await getOwnerIdByEmail(userEmail);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Verify site belongs to this owner
    const { site: siteData, error: siteError } = await getSiteByIdAndOwner(siteId, ownerId);
    if (siteError || !siteData) {
      return res.status(404).json({ message: 'Site not found or not authorized' });
    }

    // Get 30 days ago for filtering
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get sessions for this site
    const { sessions: sessionsData } = await getSessionsBySite(siteId, {
      startDate: thirtyDaysAgo.toISOString()
    });

    // Get events for this site
    const { events: eventsData } = await getEventsBySite(siteId, {
      startDate: thirtyDaysAgo.toISOString()
    });

    // Get page view events specifically
    const { events: pageViewEvents } = await getEventsBySite(siteId, {
      eventType: 'page_view',
      startDate: thirtyDaysAgo.toISOString()
    });

    // Get visitors for this site
    const { visitors: visitorsData } = await getVisitorsBySite(siteId, { limit: 10 });

    // Get leads for this site
    const { visitors: leadsData } = await getVisitorsBySite(siteId, { leadStatus: 'captured' });

    // Calculate analytics statistics
    const analytics = calculateAnalyticsStats({
      sessions: sessionsData || [],
      events: eventsData || [],
      visitors: visitorsData || [],
      leads: leadsData?.filter(v => v.lead_name) || []
    });

    // Process daily traffic data
    const dailyTrafficData = processDailyTrafficData(
      sessionsData || [],
      pageViewEvents || [],
      30
    );

    // Calculate device, browser, OS, and country statistics
    const browserStats = (sessionsData || [])
      .filter(s => s.browser)
      .reduce((acc, session) => {
        const browser = session.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {});

    const deviceStats = (sessionsData || [])
      .filter(s => s.device)
      .reduce((acc, session) => {
        const device = session.device || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {});

    const osStats = (sessionsData || [])
      .filter(s => s.os)
      .reduce((acc, session) => {
        const os = session.os || 'Unknown';
        acc[os] = (acc[os] || 0) + 1;
        return acc;
      }, {});

    const countryStats = (visitorsData || [])
      .filter(v => v.country)
      .reduce((acc, visitor) => {
        const country = visitor.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

    res.status(200).json({
      message: 'Site analytics fetched successfully',
      site: siteData,
      analytics,
      dailyTrafficData,
      recentVisitors: visitorsData || [],
      browserStats,
      deviceStats,
      osStats,
      countryStats,
      leads: leadsData?.filter(v => v.lead_name) || []
    });

  } catch (error) {
    console.error('Site analytics fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle site visitors with lead scores
async function handleSiteVisitors(req, res) {
  try {
    const { siteId } = req.params;
    const userEmail = req.user.email;

    // Get owner ID
    const ownerId = await getOwnerIdByEmail(userEmail);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Verify site belongs to this owner
    const { site: siteData, error: siteError } = await getSiteByIdAndOwner(siteId, ownerId);
    if (siteError || !siteData) {
      return res.status(404).json({ message: 'Site not found or not authorized' });
    }

    // Get all visitors for this site
    const { visitors: visitorsData, error: visitorsError } = await getVisitorsBySite(siteId);
    if (visitorsError) {
      console.error('Visitors fetch error:', visitorsError);
      return res.status(500).json({ message: 'Failed to fetch visitors data' });
    }

    // Get events data for lead scoring
    const visitorUids = visitorsData?.map(v => v.uid) || [];
    const eventPromises = visitorUids.map(uid => 
      getEventsByVisitor(uid, siteId)
    );
    const eventResults = await Promise.all(eventPromises);

    // Calculate lead scores for each visitor
    const visitorsWithScores = (visitorsData || []).map((visitor, index) => {
      try {
        const visitorEvents = eventResults[index]?.events || [];
        return calculateLeadScore(visitor, visitorEvents);
      } catch (error) {
        console.error('Error calculating lead score for visitor:', visitor.uid, error);
        // Return visitor with default values on error
        return {
          ...visitor,
          leadScore: 0,
          leadQuality: 'Cold',
          engagementLevel: 0,
          totalDuration: 0,
          eventCounts: {
            clicks: 0,
            forms: 0,
            scrolls: 0
          }
        };
      }
    });

    // Sort by lead score (highest first)
    visitorsWithScores.sort((a, b) => b.leadScore - a.leadScore);

    res.status(200).json({
      message: 'Visitors data fetched successfully',
      site: siteData,
      visitors: visitorsWithScores
    });

  } catch (error) {
    console.error('Site visitors fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  handleDashboard,
  handleAddSite,
  handleSiteAnalytics,
  handleSiteVisitors,
  // Export service functions for use by other controllers
  getUserByEmail,
  getOwnerIdByEmail,
  getSiteByIdAndOwner,
  getSitesByOwner,
  createSite,
  getSessionsBySite,
  getEventsBySite,
  getEventsByVisitor,
  getVisitorsBySite,
  calculateAnalyticsStats,
  processDailyTrafficData,
  calculateLeadScore
};
