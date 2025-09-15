const supabase = require('../supabaseClient');

/**
 * Get all session recordings for a specific site
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSessionRecordings = async (req, res) => {
  try {
    const { siteId } = req.params;
    console.log(`🎬 Fetching session recordings for site: ${siteId}`);

    // Query to get session recordings with comprehensive data
    const { data, error } = await supabase
      .from('session_recordings')
      .select(`
        id,
        session_id,
        events,
        metadata,
        file_size,
        created_at,
        sessions!inner (
          session_id,
          uid,
          site_id,
          started_at,
          ended_at,
          cookie_consent_accepted,
          browser,
          duration,
          os,
          device,
          landing_page,
          visitors!inner (
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
            lead_phone
          )
        )
      `)
      .eq('sessions.site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching session recordings:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch session recordings',
        details: error.message 
      });
    }

    // Calculate engagement metrics for each session
    const sessionsWithMetrics = await Promise.all(
      data.map(async (recording) => {
        const sessionId = recording.sessions.session_id;
        
        // Get events count for this session
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('event_type, event_name, properties')
          .eq('session_id', sessionId);

        if (eventsError) {
          console.error('❌ Error fetching events for session:', sessionId, eventsError);
        }

        // Calculate engagement metrics from events
        const events = eventsData || [];
        const clickEvents = events.filter(e => e.event_type === 'click').length;
        const scrollEvents = events.filter(e => e.event_type === 'scroll').length;
        const formSubmissions = events.filter(e => e.event_type === 'form_submit').length;
        const pageViews = events.filter(e => e.event_type === 'page_view').length;

        // Calculate lead score based on engagement
        const leadScore = calculateLeadScore({
          pageViews: recording.sessions.visitors.page_views,
          duration: recording.sessions.duration || 0,
          clicks: clickEvents,
          scrollEvents,
          formSubmissions,
          hasLead: recording.sessions.visitors.lead_status !== 'unknown'
        });

        return {
          sessionId: recording.session_id,
          recordingId: recording.id,
          visitorId: recording.sessions.uid,
          visitorInfo: {
            name: recording.sessions.visitors.lead_name || 'Anonymous User',
            email: recording.sessions.visitors.lead_email,
            location: recording.sessions.visitors.region && recording.sessions.visitors.country 
              ? `${recording.sessions.visitors.region}, ${recording.sessions.visitors.country}`
              : 'Unknown',
            isLead: recording.sessions.visitors.lead_status !== 'unknown'
          },
          engagement: {
            pageViews: recording.sessions.visitors.page_views,
            duration: recording.sessions.duration || 0,
            clicks: clickEvents,
            scrollEvents,
            formSubmissions
          },
          sessionDetails: {
            startTime: recording.sessions.started_at,
            endTime: recording.sessions.ended_at,
            browser: recording.sessions.browser || 'Unknown',
            device: recording.sessions.device || 'Unknown',
            os: recording.sessions.os || 'Unknown',
            entryPage: recording.sessions.landing_page || '/',
            // We'll need to calculate exit page from events or store it separately
            exitPage: recording.sessions.landing_page || '/',
            eventsCount: events.length
          },
          leadScore,
          recordingMetadata: recording.metadata,
          fileSize: recording.file_size,
          createdAt: recording.created_at
        };
      })
    );

    console.log(`✅ Found ${sessionsWithMetrics.length} session recordings`);
    
    res.json({
      success: true,
      sessions: sessionsWithMetrics,
      count: sessionsWithMetrics.length
    });

  } catch (error) {
    console.error('❌ Error in getSessionRecordings:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * Get a specific session recording by session ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSessionRecording = async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log(`🎬 Fetching session recording: ${sessionId}`);

    // Get session recording with all related data
    const { data: recordingData, error: recordingError } = await supabase
      .from('session_recordings')
      .select(`
        id,
        session_id,
        events,
        metadata,
        file_size,
        created_at,
        sessions!inner (
          session_id,
          uid,
          site_id,
          started_at,
          ended_at,
          cookie_consent_accepted,
          browser,
          duration,
          os,
          device,
          landing_page,
          visitors!inner (
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
            lead_phone
          )
        )
      `)
      .eq('session_id', sessionId)
      .single();

    if (recordingError) {
      console.error('❌ Error fetching session recording:', recordingError);
      return res.status(404).json({ 
        error: 'Session recording not found',
        details: recordingError.message 
      });
    }

    // Get all events for this session
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('session_id', sessionId)
      .order('event_timestamp', { ascending: true });

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError);
    }

    const events = eventsData || [];

    // Process events to create a timeline
    const processedEvents = events.map(event => ({
      timestamp: new Date(event.event_timestamp).getTime() - new Date(recordingData.sessions.started_at).getTime(),
      type: event.event_type,
      name: event.event_name,
      element: event.element_id,
      elementClass: event.element_class,
      data: event.properties || {},
      page: event.properties?.page || recordingData.sessions.landing_page
    }));

    // Calculate engagement metrics
    const clickEvents = events.filter(e => e.event_type === 'click').length;
    const scrollEvents = events.filter(e => e.event_type === 'scroll').length;
    const formSubmissions = events.filter(e => e.event_type === 'form_submit').length;
    const pageViewEvents = events.filter(e => e.event_type === 'page_view');

    // Build page journey from page view events
    const pageJourney = pageViewEvents.map((event, index) => ({
      page: event.properties?.page || recordingData.sessions.landing_page,
      timestamp: new Date(event.event_timestamp).getTime() - new Date(recordingData.sessions.started_at).getTime(),
      duration: index < pageViewEvents.length - 1 
        ? new Date(pageViewEvents[index + 1].event_timestamp).getTime() - new Date(event.event_timestamp).getTime()
        : (recordingData.sessions.duration * 1000) - (new Date(event.event_timestamp).getTime() - new Date(recordingData.sessions.started_at).getTime()),
      events: events.filter(e => 
        new Date(e.event_timestamp).getTime() >= new Date(event.event_timestamp).getTime() &&
        (index < pageViewEvents.length - 1 
          ? new Date(e.event_timestamp).getTime() < new Date(pageViewEvents[index + 1].event_timestamp).getTime()
          : true)
      ).length
    }));

    // Calculate lead score
    const leadScore = calculateLeadScore({
      pageViews: recordingData.sessions.visitors.page_views,
      duration: recordingData.sessions.duration || 0,
      clicks: clickEvents,
      scrollEvents,
      formSubmissions,
      hasLead: recordingData.sessions.visitors.lead_status !== 'unknown'
    });

    const sessionData = {
      sessionId: recordingData.session_id,
      recordingId: recordingData.id,
      visitorId: recordingData.sessions.uid,
      visitorInfo: {
        name: recordingData.sessions.visitors.lead_name || 'Anonymous User',
        email: recordingData.sessions.visitors.lead_email,
        location: recordingData.sessions.visitors.region && recordingData.sessions.visitors.country 
          ? `${recordingData.sessions.visitors.region}, ${recordingData.sessions.visitors.country}`
          : 'Unknown',
        isLead: recordingData.sessions.visitors.lead_status !== 'unknown',
        leadScore,
        device: recordingData.sessions.device || 'Unknown',
        browser: recordingData.sessions.browser || 'Unknown',
        os: recordingData.sessions.os || 'Unknown',
        screenResolution: recordingData.metadata?.viewport ? 
          `${recordingData.metadata.viewport.width}x${recordingData.metadata.viewport.height}` : 'Unknown',
        userAgent: recordingData.metadata?.userAgent || 'Unknown'
      },
      sessionDetails: {
        startTime: recordingData.sessions.started_at,
        endTime: recordingData.sessions.ended_at,
        duration: recordingData.sessions.duration || 0,
        entryPage: recordingData.sessions.landing_page || '/',
        exitPage: pageJourney.length > 0 ? pageJourney[pageJourney.length - 1].page : recordingData.sessions.landing_page || '/',
        totalPageViews: pageViewEvents.length,
        uniquePageViews: [...new Set(pageViewEvents.map(e => e.properties?.page))].length,
        bounceRate: pageViewEvents.length === 1,
        conversionEvents: events.filter(e => ['form_submit', 'signup', 'purchase'].includes(e.event_type)).map(e => e.event_type)
      },
      engagement: {
        clicks: clickEvents,
        scrollEvents,
        formSubmissions,
        timeOnPage: pageJourney.reduce((acc, page) => {
          acc[page.page] = Math.round(page.duration / 1000);
          return acc;
        }, {})
      },
      events: processedEvents,
      pageJourney,
      recordingEvents: recordingData.events, // rrweb events for actual replay
      recordingMetadata: recordingData.metadata
    };

    console.log(`✅ Retrieved session recording: ${sessionId}`);
    
    res.json({
      success: true,
      session: sessionData
    });

  } catch (error) {
    console.error('❌ Error in getSessionRecording:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * Calculate lead score based on user engagement
 * @param {Object} metrics - Engagement metrics
 * @returns {number} Lead score
 */
const calculateLeadScore = (metrics) => {
  let score = 0;
  
  // Base score for page views (max 30 points)
  score += Math.min(metrics.pageViews * 3, 30);
  
  // Duration score (max 25 points) - 1 point per minute
  score += Math.min(Math.floor(metrics.duration / 60), 25);
  
  // Click engagement (max 20 points)
  score += Math.min(metrics.clicks * 2, 20);
  
  // Scroll engagement (max 15 points)
  score += Math.min(metrics.scrollEvents, 15);
  
  // Form submissions (high value - max 25 points)
  score += metrics.formSubmissions * 25;
  
  // Bonus for being a known lead
  if (metrics.hasLead) {
    score += 20;
  }
  
  return Math.round(score);
};

module.exports = {
  getSessionRecordings,
  getSessionRecording,
  calculateLeadScore
};
