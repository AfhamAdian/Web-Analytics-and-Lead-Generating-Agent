// Dashboard Controller - Handles dashboard and analytics display endpoints

const userService = require('../services/userService');
const siteService = require('../services/siteService');
const sessionService = require('../services/sessionService');
const eventService = require('../services/eventService');
const visitorService = require('../services/visitorService');
const { calculateAnalyticsStats, processDailyTrafficData, calculateLeadScore } = require('../utils/analyticsUtils');
const config = require('../config/app');

// Handle dashboard data retrieval
async function handleDashboard(req, res) {
  try {
    const userEmail = req.user.email;
    
    // Get user name
    const { user: userData } = await userService.getUserByEmail(userEmail);
    const userName = userData?.name || null;

    // Get owner ID
    const ownerId = await userService.getOwnerIdByEmail(userEmail);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Get all sites for this owner
    const { sites, error: sitesError } = await siteService.getSitesByOwner(ownerId);
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
        sessionService.getSessionsBySite(siteId)
      );
      const sessionResults = await Promise.all(sessionPromises);
      
      const allSessions = sessionResults
        .filter(result => result.sessions)
        .flatMap(result => result.sessions);

      uniqueVisitors = [...new Set(allSessions.map(s => s.uid))].length;

      // Get leads across all sites
      const visitorPromises = siteIds.map(siteId => 
        visitorService.getVisitorsBySite(siteId, { leadStatus: 'captured' })
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

/**
 * Handle site addition
 */
async function handleAddSite(req, res) {
  try {
    const { siteName, siteDomain } = req.body; 
    
    if (!siteName || !siteDomain) {
      return res.status(400).json({ message: 'Missing required fields: siteName, siteDomain' });
    }

    const ownerId = await userService.getOwnerIdByEmail(req.user.email);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const { site, error } = await siteService.createSite({
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

/**
 * Handle site analytics retrieval
 */
async function handleSiteAnalytics(req, res) {
  try {
    const { siteId } = req.params;
    const userEmail = req.user.email;

    // Get owner ID
    const ownerId = await userService.getOwnerIdByEmail(userEmail);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Verify site belongs to this owner
    const { site: siteData, error: siteError } = await siteService.getSiteByIdAndOwner(siteId, ownerId);
    if (siteError || !siteData) {
      return res.status(404).json({ message: 'Site not found or not authorized' });
    }

    // Get 30 days ago for filtering
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get sessions for this site
    const { sessions: sessionsData } = await sessionService.getSessionsBySite(siteId, {
      startDate: thirtyDaysAgo.toISOString()
    });

    // Get events for this site
    const { events: eventsData } = await eventService.getEventsBySite(siteId, {
      startDate: thirtyDaysAgo.toISOString()
    });

    // Get page view events specifically
    const { events: pageViewEvents } = await eventService.getEventsBySite(siteId, {
      eventType: 'page_view',
      startDate: thirtyDaysAgo.toISOString()
    });

    // Get visitors for this site
    const { visitors: visitorsData } = await visitorService.getVisitorsBySite(siteId, { limit: 10 });

    // Get leads for this site
    const { visitors: leadsData } = await visitorService.getVisitorsBySite(siteId, { leadStatus: 'captured' });

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

/**
 * Handle site visitors with lead scores
 */
async function handleSiteVisitors(req, res) {
  try {
    const { siteId } = req.params;
    const userEmail = req.user.email;

    // Get owner ID
    const ownerId = await userService.getOwnerIdByEmail(userEmail);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Verify site belongs to this owner
    const { site: siteData, error: siteError } = await siteService.getSiteByIdAndOwner(siteId, ownerId);
    if (siteError || !siteData) {
      return res.status(404).json({ message: 'Site not found or not authorized' });
    }

    // Get all visitors for this site
    const { visitors: visitorsData, error: visitorsError } = await visitorService.getVisitorsBySite(siteId);
    if (visitorsError) {
      console.error('Visitors fetch error:', visitorsError);
      return res.status(500).json({ message: 'Failed to fetch visitors data' });
    }

    // Get events data for lead scoring
    const visitorUids = visitorsData?.map(v => v.uid) || [];
    const eventPromises = visitorUids.map(uid => 
      eventService.getEventsByVisitor(uid, siteId)
    );
    const eventResults = await Promise.all(eventPromises);

    // Calculate lead scores for each visitor
    const visitorsWithScores = (visitorsData || []).map((visitor, index) => {
      const visitorEvents = eventResults[index]?.events || [];
      return calculateLeadScore(visitor, visitorEvents);
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
  handleSiteVisitors
};
