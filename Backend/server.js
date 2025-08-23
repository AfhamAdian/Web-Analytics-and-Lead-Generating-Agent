const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const supabase = require('./supabaseClient'); // Import the Supabase client
const authenticateToken = require('./middlewares/auth'); // Import the authentication middleware
const morgan = require('morgan');

const app = express();
const port = 5000;

app.use(morgan('dev'));
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());




const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { data: existingUser } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('owners')
      .insert([
        {
          name,
          email,
          phone,
          password: hashedPassword
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Failed to create user', error: error.message });
    }

    res.status(201).json({ message: 'User created successfully', user: { name, email, phone } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.owner_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, phone: user.phone }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/pageviews', async (req, res) => {
  try {
    console.log("rppreofrjlds\n")
    console.log(req.body)
    const { siteId, sessionId, uniqueUserId, pageViews, timestamp } = req.body;
    console.log("pageview is here  ")
    console.log('📊 Received page view data:', {
      siteId,
      sessionId,
      uniqueUserId,
      pageViews,
      timestamp: new Date(timestamp).toISOString()
    });

    if (!siteId || !sessionId || !pageViews || !timestamp) {
      return res.status(400).json({ 
        message: 'Missing required fields: siteId, sessionId, pageViews, timestamp' 
      });
    }

    const { data, error } = await supabase
      .from('page_views') // Make sure this table exists in your Supabase
      .insert([
        {
          site_id: siteId,
          session_id: sessionId,
          page_views: pageViews, // JSON object with page paths and counts
          timestamp: new Date(timestamp).toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ Supabase error saving page views:', error);
      return res.status(500).json({ 
        message: 'Failed to save page view data', 
        error: error.message 
      });
    }

    console.log('✅ Page view data saved successfully:', data[0]);

    res.status(201).json({ 
      message: 'Page view data saved successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('❌ Page view tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.post('/api/scroll-depth', async (req, res) => {
  try {
    console.log("📏 Received scroll depth data:", req.body);
    const { siteId, sessionId, uniqueUserId, pageName, currentUrl, scrollDepth, timestamp } = req.body;

    if (!siteId || !sessionId || !uniqueUserId || !pageName || !currentUrl || !scrollDepth || !timestamp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('scroll_depth')
      .insert([
        {
          site_id: siteId,
          session_id: sessionId,
          unique_user_id: uniqueUserId,
          page_name: pageName,
          current_url: currentUrl,
          scroll_depth: scrollDepth,
          timestamp: new Date(timestamp).toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ Supabase error saving scroll depth:', error);
      return res.status(500).json({ message: 'Failed to save scroll depth data', error: error.message });
    }

    console.log('✅ Scroll depth data saved successfully:', data[0]);

    res.status(201).json({
      message: 'Scroll depth data saved successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('❌ Scroll depth tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/sessiontime', async (req, res) => {
  try {
    console.log("printing req.body for sessiontime")
    console.log(req.body)
    const { siteId, sessionId, uniqueUserId, sessionDuration } = req.body;

    console.log("session time is here  ");

    if (!siteId || !sessionId || !uniqueUserId || !sessionDuration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          site_id: siteId,
          session_id: sessionId,
          unique_user_id: uniqueUserId,
          session_duration: sessionDuration
        }
      ])
      .select();

    if (error) {
      console.error('❌ Supabase error saving session:', error);
      return res.status(500).json({ message: 'Failed to save session data', error: error.message });
    }

    console.log('✅ Session data saved successfully:', data[0]);

    res.status(201).json({
      message: 'Session data saved successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('❌ Session tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/click-events', async (req, res) => {
  try {
    const { siteId, sessionId, uniqueUserId, elementType, elementText, elementId, elementClass, url, timestamp } = req.body;

    console.log('🖱️ Received click event data:', {
      siteId,
      sessionId,
      uniqueUserId,
      elementType,
      elementText,
      elementId,
      elementClass,
      url,
      timestamp: new Date(timestamp).toISOString()
    });

    if (!siteId || !sessionId || !uniqueUserId || !elementType || !elementText || !url || !timestamp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('click_events')
      .insert([
        {
          site_id: siteId,
          session_id: sessionId,
          unique_user_id: uniqueUserId,
          element_type: elementType,
          element_text: elementText,
          element_id: elementId,
          element_class: elementClass,
          url: url,
          timestamp: new Date(timestamp).toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ Supabase error saving click event:', error);
      return res.status(500).json({ message: 'Failed to save click event', error: error.message });
    }

    console.log('✅ Click event data saved successfully:', data[0]);

    res.status(201).json({
      message: 'Click event data saved successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('❌ Click event tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/user-system-info', async (req, res) => {
    // const systemData = {
    //     siteId: siteId,
    //     sessionId: sessionId,
    //     uniqueUserId: this.userId,
    //     browser: browser,
    //     operatingSystem: os,
    //     userAgent: userAgent,
    //     screenInfo: screenInfo,
    //     timezone: timezone,
    //     language: language,
    //     location: location,
    //     timestamp: Date.now()
    //   };
    //complete for these systemData\

    try{
       const { siteId, sessionId, uniqueUserId, browser, operatingSystem, userAgent, screenInfo, timezone, language, location } = req.body;
    console.log('🖥️ User system information:', {
      siteId,
      sessionId,
      uniqueUserId,
      browser,
      operatingSystem,
      userAgent,
      screenInfo,
      timezone,
      language,
      location
    });

    if (!siteId || !sessionId || !uniqueUserId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const systemData = {
      siteId: siteId,
      sessionId: sessionId,
      uniqueUserId: uniqueUserId,
      browser: browser,
      operatingSystem: operatingSystem,
      userAgent: userAgent,
      screenInfo: screenInfo,
      timezone: timezone,
      language: language,
      location: location,
      timestamp: Date.now()
    };

    res.status(200).json({
      message: 'User system information fetched successfully',
      data: systemData
    });

  } catch (error) {
    console.error('❌ User system info error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const userMail = req.user.email;
    let { data, error } = await supabase
      .from('owners')
      .select('name')
      .eq('email', userMail);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Failed to fetch owner data', error: error.message });
    }

    const userName = data && data.length > 0 ? data[0].name : null;
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')
      .eq('owner_id',
        (await supabase
          .from('owners')
          .select('owner_id')
          .eq('email', userMail)
          .single()
        ).data?.owner_id
      );

    if (sitesError) {
      console.error('Supabase error:', sitesError);
      return res.status(500).json({ message: 'Failed to fetch sites', error: sitesError.message });
    }

    // Get basic analytics for dashboard
    const totalSites = sites ? sites.length : 0;
    
    // Get total unique visitors across all sites
    const { data: allVisitors } = await supabase
      .from('sessions')
      .select('uid, site_id')
      .in('site_id', sites.map(s => s.site_id));
    
    const uniqueVisitors = allVisitors ? [...new Set(allVisitors.map(v => v.uid))].length : 0;

    // Get total leads across all sites
    const { data: allLeads } = await supabase
      .from('visitors')
      .select(`uid, sessions!inner(site_id)`)
      .in('sessions.site_id', sites.map(s => s.site_id))
      .not('lead_status', 'eq', 'unknown')
      .not('lead_name', 'is', null);

    const totalLeads = allLeads ? allLeads.length : 0;

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

    console.log
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
});


app.post('/api/addSite', authenticateToken, async (req, res) => {
  const { siteName, siteDomain } = req.body; 
  if (!siteName || !siteDomain) {
    return res.status(400).json({ message: 'Missing required fields: siteName, siteDomain' });
  }

  try {
    const owner_id = await getOwnerID(req.user.email);
    const { data, error } = await supabase
      .from('sites')
      .insert([
        {
          site_name: siteName,
          domain_name: siteDomain,
          owner_id: owner_id
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error adding site:', error);
      return res.status(500).json({ message: 'Failed to add site', error: error.message });
    }

    console.log('Site added successfully:', data[0]);
    
    // Generate tracking script for the new site
    const trackingScript = `<Script
  src="http://localhost:8080/track.js"
  site-id="${data[0].site_id}"
  strategy="afterInteractive"
  async
/>`;

    res.status(200).json({
      message: 'Site added successfully',
      site: data[0],
      trackingScript: trackingScript
    });

  } catch (error) {
    console.error('Add site error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.get('/api/fetch-data', async (req, res) => {
  const { data, error } = await supabase
    .from('owners') 
    .select('owner_id')
    .eq('email', email);
  
    if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});


async function getOwnerID(email) {
  const { data, error } = await supabase
    .from('owners')
    .select('owner_id')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching owner ID:', error);
    return null;
  }

  return data.owner_id;
}

// Get site-specific analytics data
app.get('/api/sites/:siteId', authenticateToken, async (req, res) => {
  try {
    const { siteId } = req.params;
    const userEmail = req.user.email;

    // Get owner ID
    const ownerId = await getOwnerID(userEmail);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Verify site belongs to this owner
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('site_id', siteId)
      .eq('owner_id', ownerId)
      .single();

    if (siteError || !siteData) {
      return res.status(404).json({ message: 'Site not found or not authorized' });
    }

    // Get visitors count for this site
    const { data: visitorsData, error: visitorsError } = await supabase
      .from('sessions')
      .select('uid')
      .eq('site_id', siteId);

    const uniqueVisitors = visitorsData ? [...new Set(visitorsData.map(v => v.uid))].length : 0;

    // Get total page views for this site
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .eq('site_id', siteId);

    const totalSessions = sessionsData ? sessionsData.length : 0;

    // Get events count for this site
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('site_id', siteId);

    const totalEvents = eventsData ? eventsData.length : 0;

    // Get recent visitors with location data
    const { data: recentVisitors, error: recentVisitorsError } = await supabase
      .from('visitors')
      .select(`
        uid,
        first_seen,
        last_seen,
        country,
        region,
        page_views,
        total_sessions,
        lead_status,
        lead_name,
        lead_email,
        sessions!inner(site_id)
      `)
      .eq('sessions.site_id', siteId)
      .order('last_seen', { ascending: false })
      .limit(10);

    // Get browser analytics
    const { data: browserData, error: browserError } = await supabase
      .from('sessions')
      .select('browser')
      .eq('site_id', siteId)
      .not('browser', 'is', null);

    const browserStats = browserData?.reduce((acc, session) => {
      const browser = session.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get device analytics
    const { data: deviceData, error: deviceError } = await supabase
      .from('sessions')
      .select('device')
      .eq('site_id', siteId)
      .not('device', 'is', null);

    const deviceStats = deviceData?.reduce((acc, session) => {
      const device = session.device || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get country analytics
    const { data: countryData, error: countryError } = await supabase
      .from('visitors')
      .select(`
        country,
        sessions!inner(site_id)
      `)
      .eq('sessions.site_id', siteId)
      .not('country', 'is', null);

    const countryStats = countryData?.reduce((acc, visitor) => {
      const country = visitor.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get leads for this site
    const { data: leadsData, error: leadsError } = await supabase
      .from('visitors')
      .select(`
        uid,
        lead_name,
        lead_email,
        lead_phone,
        lead_status,
        first_seen,
        sessions!inner(site_id)
      `)
      .eq('sessions.site_id', siteId)
      .not('lead_status', 'eq', 'unknown')
      .not('lead_name', 'is', null)
      .order('first_seen', { ascending: false });

    res.status(200).json({
      message: 'Site analytics fetched successfully',
      site: siteData,
      analytics: {
        uniqueVisitors,
        totalSessions,
        totalEvents,
        leads: leadsData?.length || 0
      },
      recentVisitors: recentVisitors || [],
      browserStats,
      deviceStats,
      countryStats,
      leads: leadsData || []
    });

  } catch (error) {
    console.error('Site analytics fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get visitors with lead scores for a specific site
app.get('/api/sites/:siteId/visitors', authenticateToken, async (req, res) => {
  try {
    const { siteId } = req.params;
    const userEmail = req.user.email;

    // Get owner ID
    const ownerId = await getOwnerID(userEmail);
    if (!ownerId) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Verify site belongs to this owner
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('site_id', siteId)
      .eq('owner_id', ownerId)
      .single();

    if (siteError || !siteData) {
      return res.status(404).json({ message: 'Site not found or not authorized' });
    }

    // Get all visitors for this site with session and event data
    const { data: visitorsData, error: visitorsError } = await supabase
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
      .eq('sessions.site_id', siteId)
      .order('last_seen', { ascending: false });

    if (visitorsError) {
      console.error('Visitors fetch error:', visitorsError);
      return res.status(500).json({ message: 'Failed to fetch visitors data' });
    }

    // Get events data for each visitor to calculate engagement score
    const visitorUids = visitorsData?.map(v => v.uid) || [];
    const { data: eventsData } = await supabase
      .from('events')
      .select('uid, event_type, event_name, event_timestamp')
      .in('uid', visitorUids)
      .eq('site_id', siteId);

    // Calculate lead score for each visitor
    const visitorsWithScores = visitorsData?.map(visitor => {
      const visitorEvents = eventsData?.filter(event => event.uid === visitor.uid) || [];
      
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
    }) || [];

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
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
