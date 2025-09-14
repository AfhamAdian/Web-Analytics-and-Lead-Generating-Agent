// Analytics Controller - Handles analytics tracking endpoints
// Integrates visitor, session, and event //

const supabase = require('../supabaseClient');
const crypto = require('crypto');

// ===== HELPER FUNCTIONS (previously in utils/) =====

/**
 * Extract or generate proper UUID from user ID
 */
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

/**
 * Extract or generate proper UUID for session IDs
 */
function sanitizeSessionId(sessionId) {
  if (sessionId.startsWith('session_')) {
    return sessionId.substring(8);
  }
  
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    return sessionId;
  }
  
  console.warn(`Invalid sessionId format: ${sessionId}, generating new UUID`);
  return crypto.randomUUID();
}

/**
 * Parse timezone information to extract location data
 */
function parseTimezoneLocation(timezone) {
  if (!timezone) return { country: null, region: null };

  const timezoneParts = timezone.split('/');
  if (timezoneParts.length < 2) return { country: null, region: null };

  const continent = timezoneParts[0];
  const city = timezoneParts[timezoneParts.length - 1];
  
  const continentMapping = {
    'Asia': 'Asia',
    'Europe': 'Europe', 
    'America': 'America',
    'Africa': 'Africa',
    'Australia': 'Australia',
    'Pacific': 'Pacific',
    'Atlantic': 'Atlantic',
    'Indian': 'Indian Ocean',
    'Antarctica': 'Antarctica'
  };

  return {
    country: continentMapping[continent] || continent,
    region: city.replace(/_/g, ' ')
  };
}

// ===== VISITOR FUNCTIONS (previously in visitorService) =====

async function getOrCreateVisitor(uniqueUserId, timestamp, metadata = {}) {
  try {
    const sanitizedUserId = sanitizeUserId(uniqueUserId);
    
    let { data: visitor, error: visitorError } = await supabase
      .from('visitors')
      .select('*')
      .eq('uid', sanitizedUserId)
      .single();

    if (visitorError && visitorError.code !== 'PGRST116') {
      console.error('Error checking visitor:', visitorError);
      return { visitor: null, error: visitorError };
    }

    if (!visitor) {
      const { data: newVisitor, error: createVisitorError } = await supabase
        .from('visitors')
        .insert([{
          uid: sanitizedUserId,
          first_seen: new Date(timestamp).toISOString(),
          last_seen: new Date(timestamp).toISOString(),
          page_views: metadata.pageViews || 1,
          total_sessions: 1,
          region: metadata.region || null,
          country: metadata.country || null
        }])
        .select()
        .single();

      if (createVisitorError) {
        console.error('Error creating visitor:', createVisitorError);
        return { visitor: null, error: createVisitorError };
      }
      return { visitor: newVisitor, error: null, isNew: true };
    } else {
      const updates = {
        last_seen: new Date(timestamp).toISOString(),
        region: metadata.region || visitor.region,
        country: metadata.country || visitor.country
      };
      
      if (metadata.pageViews) {
        updates.page_views = metadata.pageViews;
      }

      const { data: updatedVisitor, error: updateVisitorError } = await supabase
        .from('visitors')
        .update(updates)
        .eq('uid', sanitizedUserId)
        .select()
        .single();

      if (updateVisitorError) {
        console.error('Error updating visitor:', updateVisitorError);
        return { visitor: null, error: updateVisitorError };
      }
      return { visitor: updatedVisitor, error: null, isNew: false };
    }
  } catch (error) {
    console.error('Error in getOrCreateVisitor:', error);
    return { visitor: null, error };
  }
}

async function updateVisitorLead(userId, leadData) {
  try {
    const sanitizedUserId = sanitizeUserId(userId);
    
    const { data: updatedVisitor, error: updateError } = await supabase
      .from('visitors')
      .update({
        lead_status: leadData.status || 'captured',
        lead_name: leadData.name || null,
        lead_email: leadData.email || null,
        lead_phone: leadData.phone || null,
        updated_at: new Date().toISOString()
      })
      .eq('uid', sanitizedUserId)
      .select();

    if (updateError) {
      console.error('Error updating visitor with lead details:', updateError);
      return { visitor: null, error: updateError };
    }

    return { visitor: updatedVisitor?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in updateVisitorLead:', error);
    return { visitor: null, error };
  }
}

// ===== SESSION FUNCTIONS (previously in sessionService) =====

async function getOrCreateSession(sessionId, uniqueUserId, siteId, timestamp, metadata = {}) {
  try {
    const sanitizedSessionId = sanitizeSessionId(sessionId);
    const sanitizedUserId = sanitizeUserId(uniqueUserId);
    
    let { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', sanitizedSessionId)
      .single();

    if (sessionError && sessionError.code !== 'PGRST116') {
      console.error('Error checking session:', sessionError);
      return { session: null, error: sessionError };
    }

    if (!session) {
      const { data: newSession, error: createSessionError } = await supabase
        .from('sessions')
        .insert([{
          session_id: sanitizedSessionId,
          uid: sanitizedUserId,
          site_id: siteId,
          started_at: new Date(timestamp).toISOString(),
          browser: metadata.browser || null,
          os: metadata.os || null,
          device: metadata.device || null,
          landing_page: metadata.landingPage || null,
          cookie_consent_accepted: metadata.cookieConsent || false
        }])
        .select()
        .single();

      if (createSessionError) {
        console.error('Error creating session:', createSessionError);
        return { session: null, error: createSessionError };
      }
      
      // Update visitor's total_sessions count
      await incrementVisitorSessionCount(sanitizedUserId);

      return { session: newSession, error: null, isNew: true };
    }

    return { session, error: null, isNew: false };
  } catch (error) {
    console.error('Error in getOrCreateSession:', error);
    return { session: null, error };
  }
}

async function incrementVisitorSessionCount(userId) {
  try {
    const { error } = await supabase
      .from('visitors')
      .update({ 
        total_sessions: supabase.raw('total_sessions + 1'),
        updated_at: new Date().toISOString()
      })
      .eq('uid', userId);

    if (error) {
      console.error('Error incrementing visitor session count:', error);
    }
  } catch (error) {
    console.error('Error in incrementVisitorSessionCount:', error);
  }
}

async function updateSessionDuration(sessionId, duration) {
  try {
    const sanitizedSessionId = sanitizeSessionId(sessionId);
    
    const { data, error } = await supabase
      .from('sessions')
      .update({
        duration: Math.round(duration),
        ended_at: new Date().toISOString()
      })
      .eq('session_id', sanitizedSessionId)
      .select();

    if (error) {
      console.error('Error updating session duration:', error);
      return { session: null, error };
    }

    return { session: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in updateSessionDuration:', error);
    return { session: null, error };
  }
}

async function updateSessionSystemInfo(sessionId, systemInfo) {
  try {
    const sanitizedSessionId = sanitizeSessionId(sessionId);
    
    const { data: sessionUpdateResult, error: sessionUpdateError } = await supabase
      .from('sessions')
      .update({
        browser: systemInfo.browser || null,
        os: systemInfo.os || null,
        device: systemInfo.device || 'desktop',
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sanitizedSessionId)
      .select();

    if (sessionUpdateError) {
      console.error('Error updating session with system info:', sessionUpdateError);
      return { session: null, error: sessionUpdateError };
    }

    return { session: sessionUpdateResult?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in updateSessionSystemInfo:', error);
    return { session: null, error };
  }
}

// ===== EVENT FUNCTIONS (previously in eventService) =====

async function createEvent(eventData) {
  try {
    const {
      uid,
      sessionId,
      siteId,
      eventType,
      eventName,
      elementId = null,
      elementClass = null,
      properties = {},
      timestamp
    } = eventData;

    const sanitizedUserId = sanitizeUserId(uid);
    const sanitizedSessionId = sanitizeSessionId(sessionId);

    const { data, error } = await supabase
      .from('events')
      .insert([{
        uid: sanitizedUserId,
        session_id: sanitizedSessionId,
        site_id: siteId,
        event_type: eventType,
        event_name: eventName,
        element_id: elementId,
        element_class: elementClass,
        properties: properties,
        event_timestamp: new Date(timestamp).toISOString()
      }])
      .select();

    if (error) {
      console.error('Error creating event:', error);
      return { event: null, error };
    }

    return { event: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in createEvent:', error);
    return { event: null, error };
  }
}

async function createPageViewEvent(pageViewData) {
  return createEvent({
    uid: pageViewData.uid,
    sessionId: pageViewData.sessionId,
    siteId: pageViewData.siteId,
    eventType: 'page_view',
    eventName: 'page_view',
    properties: {
      current_url: pageViewData.currentUrl,
      page_views: pageViewData.pageViews,
      landing_page: pageViewData.landingPage
    },
    timestamp: pageViewData.timestamp
  });
}

async function createClickEvent(clickData) {
  return createEvent({
    uid: clickData.uid,
    sessionId: clickData.sessionId,
    siteId: clickData.siteId,
    eventType: 'click',
    eventName: 'element_click',
    elementId: clickData.elementId,
    elementClass: clickData.elementClass,
    properties: {
      element_type: clickData.elementType,
      element_text: clickData.elementText,
      url: clickData.url
    },
    timestamp: clickData.timestamp
  });
}

async function createScrollEvent(scrollData) {
  return createEvent({
    uid: scrollData.uid,
    sessionId: scrollData.sessionId,
    siteId: scrollData.siteId,
    eventType: 'scroll',
    eventName: 'scroll_depth',
    properties: {
      page_name: scrollData.pageName,
      current_url: scrollData.currentUrl,
      scroll_depth: scrollData.scrollDepth
    },
    timestamp: scrollData.timestamp
  });
}

async function createSystemInfoEvent(systemData) {
  return createEvent({
    uid: systemData.uid,
    sessionId: systemData.sessionId,
    siteId: systemData.siteId,
    eventType: 'system_info',
    eventName: 'user_system_information_collected',
    properties: {
      browser: systemData.browser,
      operating_system: systemData.operatingSystem,
      user_agent: systemData.userAgent,
      screen_info: systemData.screenInfo,
      timezone: systemData.timezone,
      language: systemData.language,
      location: systemData.location
    },
    timestamp: systemData.timestamp || new Date().toISOString()
  });
}

// ===== CONTROLLER FUNCTIONS =====

// Handle session creation for rrweb recording integration
async function handleSessionCreation(req, res) {
  try {
    console.log('🎬 Creating session for rrweb recording:', req.body);

    const { siteId, sessionId, uniqueUserId, url, userAgent, timestamp } = req.body;

    if (!siteId || !sessionId || !uniqueUserId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: siteId, sessionId, uniqueUserId'
      });
    }

    // Create or get visitor first
    const { visitor, error: visitorError } = await getOrCreateVisitor(
      uniqueUserId,
      timestamp || Date.now(),
      {
        userAgent: userAgent || req.headers['user-agent'],
        url: url || req.headers.referer
      }
    );

    if (visitorError) {
      console.error('Error creating/getting visitor:', visitorError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create visitor',
        error: visitorError.message
      });
    }

    // Create session
    const { session, error: sessionError, isNew } = await getOrCreateSession(
      sessionId,
      uniqueUserId,
      siteId,
      timestamp || Date.now(),
      {
        userAgent: userAgent || req.headers['user-agent'],
        landingPage: url || req.headers.referer
      }
    );

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create session',
        error: sessionError.message
      });
    }

    console.log(`✅ Session ${isNew ? 'created' : 'retrieved'} successfully:`, session.session_id);

    res.json({
      success: true,
      message: `Session ${isNew ? 'created' : 'retrieved'} successfully`,
      data: {
        sessionId: session.session_id,
        visitorId: visitor.uid,
        isNewSession: isNew,
        isNewVisitor: visitorError ? false : true
      }
    });

  } catch (error) {
    console.error('Error in handleSessionCreation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

// Handle session recording data from rrweb
async function handleSessionRecording(req, res) {
  try {
    console.log('🎬 Received session recording data from:', req.headers['user-agent'] || 'Unknown');
    console.log('📡 Request method:', req.method);
    console.log('📋 Content-Type:', req.headers['content-type']);
    console.log('📏 Content-Length:', req.headers['content-length'] || 'Unknown');
    
    // Log payload size for monitoring
    const payloadSize = JSON.stringify(req.body).length;
    console.log(`📦 Payload size: ${(payloadSize / 1024 / 1024).toFixed(2)} MB`);
    
    let sessionData = req.body;
    
    // Handle case where data might be sent as raw body (from sendBeacon)
    if (typeof sessionData === 'string') {
      sessionData = JSON.parse(sessionData);
    }
    
    console.log('=====================================');
    console.log('🎬 SESSION RECORDING DATA:');
    console.log(`⏱️ Duration: ${sessionData.duration}ms (${Math.round(sessionData.duration / 1000)}s)`);
    console.log('=====================================');
    
    res.json({
      success: true,
      message: 'Session recording received and printed successfully',
      sessionId: sessionData.sessionId,
      eventCount: sessionData.eventCount
    });

  } catch (error) {
    console.error('❌ Error handling session recording:', error);
    console.error('Request body:', req.body);
    res.status(500).json({
      success: false,
      message: 'Failed to process session recording',
      error: error.message
    });
  }
}

// Handle user system information collection
async function handleUserSystemInfo(req, res) {
  try {
    const { 
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
    } = req.body;

    console.log('🖥️ User system information:', {
      siteId, sessionId, uniqueUserId, browser, operatingSystem
    });

    if (!siteId || !sessionId || !uniqueUserId) {
      return res.status(400).json({ 
        message: 'Missing required fields: siteId, sessionId, uniqueUserId' 
      });
    }

    // Create or get session first, then update with system information
    const { session, error: sessionError, isNew } = await getOrCreateSession(
      sessionId,
      uniqueUserId,
      siteId,
      Date.now(),
      {
        userAgent: userAgent || null,
        landingPage: req.headers.referer || null
      }
    );

    if (sessionError) {
      console.error('❌ Error creating/getting session:', sessionError);
      return res.status(500).json({ 
        message: 'Failed to create session',
        error: sessionError.message 
      });  
    }

    console.log(`✅ Session ${isNew ? 'created' : 'found'} for system info:`, sessionId);

    // Update session with system information
    const { session: updatedSession, error: updateError } = await updateSessionSystemInfo(
      sessionId,
      {
        browser: browser || null,
        os: operatingSystem || null,
        device: screenInfo?.device || 'desktop'
      }
    );

    if (updateError) {
      console.warn('⚠️ Warning: Could not update session with system info:', updateError.message);
      // Don't fail the request, continue with visitor updates
    }

    // Parse location from timezone and update visitor
    const locationData = parseTimezoneLocation(timezone);
    const visitorUpdates = {};

    if (locationData.country) visitorUpdates.country = locationData.country;
    if (locationData.region) visitorUpdates.region = locationData.region;
    
    // Override with explicit location data if provided
    if (location?.country) visitorUpdates.country = location.country;
    if (location?.region) visitorUpdates.region = location.region;

    // Update visitor with location information
    const { visitor: updatedVisitor } = await getOrCreateVisitor(
      uniqueUserId, 
      new Date().toISOString(), 
      visitorUpdates
    );

    // Create system info event
    const { event: systemInfoEvent } = await createSystemInfoEvent({
      uid: uniqueUserId,
      sessionId: sessionId,
      siteId: siteId,
      browser: browser,
      operatingSystem: operatingSystem,
      userAgent: userAgent,
      screenInfo: screenInfo,
      timezone: timezone,
      language: language,
      location: location
    });

    console.log('✅ User system information saved successfully');

    res.status(200).json({
      message: 'User system information saved successfully',
      session: updatedSession,
      visitor: updatedVisitor,
      eventId: systemInfoEvent?.event_id
    });

  } catch (error) {
    console.error('User system info error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle page view tracking
async function handlePageViews(req, res) {
  try {
    const { 
      siteId, 
      sessionId, 
      uniqueUserId, 
      pageViews, 
      timestamp,
      browser,
      os,
      device,
      landingPage,
      currentUrl,
      region,
      country,
      cookieConsent
    } = req.body;

    console.log('📊 Received page view data:', {
      siteId, sessionId, uniqueUserId, pageViews, timestamp: new Date(timestamp).toISOString()
    });

    if (!siteId || !sessionId || !uniqueUserId || !pageViews || !timestamp) {
      return res.status(400).json({ 
        message: 'Missing required fields: siteId, sessionId, uniqueUserId, pageViews, timestamp' 
      });
    }

    // Get or create visitor
    const { visitor, error: visitorError } = await getOrCreateVisitor(
      uniqueUserId, 
      timestamp, 
      {
        pageViews: typeof pageViews === 'object' ? Object.values(pageViews).reduce((a, b) => a + b, 0) : pageViews,
        region,
        country
      }
    );

    if (visitorError) {
      return res.status(500).json({ message: 'Failed to handle visitor data' });
    }

    // Get or create session
    const { session, error: sessionError, isNew: isNewSession } = await getOrCreateSession(
      sessionId, 
      uniqueUserId, 
      siteId, 
      timestamp, 
      {
        browser,
        os,
        device,
        landingPage: landingPage || currentUrl,
        cookieConsent
      }
    );

    if (sessionError) {
      return res.status(500).json({ message: 'Failed to create session data' });
    }

    // Create page view event
    const { event: pageViewEvent } = await createPageViewEvent({
      uid: uniqueUserId,
      sessionId: sessionId,
      siteId: siteId,
      currentUrl: currentUrl,
      pageViews: pageViews,
      landingPage: landingPage,
      timestamp: timestamp
    });

    console.log('✅ Page view data saved successfully');

    res.status(200).json({ 
      message: 'Page view data saved successfully',
      visitor: { uid: visitor.uid, pageViews: visitor.page_views },
      session: { 
        sessionId: session.session_id, 
        startedAt: session.started_at,
        isNewSession: isNewSession
      }
    });

  } catch (error) {
    console.error('Page view tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle scroll depth tracking
async function handleScrollDepth(req, res) {
  try {
    console.log("📏 Received scroll depth data:", req.body);
    const { siteId, sessionId, uniqueUserId, pageName, currentUrl, scrollDepth, timestamp } = req.body;

    if (!siteId || !sessionId || !uniqueUserId || !pageName || !currentUrl || !scrollDepth || !timestamp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create scroll depth event
    const { event, error } = await createScrollEvent({
      uid: uniqueUserId,
      sessionId: sessionId,
      siteId: siteId,
      pageName: pageName,
      currentUrl: currentUrl,
      scrollDepth: scrollDepth,
      timestamp: timestamp
    });

    if (error) {
      console.error('Error saving scroll depth:', error);
      return res.status(500).json({ message: 'Failed to save scroll depth data', error: error.message });
    }

    console.log('✅ Scroll depth data saved successfully');

    res.status(201).json({
      message: 'Scroll depth data saved successfully',
      eventId: event?.event_id
    });

  } catch (error) {
    console.error('Scroll depth tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle session time tracking
async function handleSessionTime(req, res) {
  try {
    console.log("⏱️ Received session time data:", req.body);
    const { siteId, sessionId, uniqueUserId, sessionDuration } = req.body;

    if (!siteId || !sessionId || !uniqueUserId || sessionDuration === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Update session with duration
    const { session, error } = await updateSessionDuration(sessionId, sessionDuration);

    if (error) {
      console.error('Error updating session:', error);
      return res.status(500).json({ message: 'Failed to update session data', error: error.message });
    }

    // Update visitor's last seen time
    await getOrCreateVisitor(uniqueUserId, new Date().toISOString());

    console.log('✅ Session data saved successfully');

    res.status(200).json({
      message: 'Session data saved successfully',
      session: session
    });

  } catch (error) {
    console.error('Session tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle click event tracking
async function handleClickEvents(req, res) {
  try {
    const { siteId, sessionId, uniqueUserId, elementType, elementText, elementId, elementClass, url, timestamp } = req.body;

    console.log('🖱️ Received click event data:', {
      siteId, sessionId, uniqueUserId, elementType, elementText, elementId, elementClass, url,
      timestamp: new Date(timestamp).toISOString()
    });

    if (!siteId || !sessionId || !uniqueUserId || !elementType || !elementText || !url || !timestamp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create click event
    const { event, error } = await createClickEvent({
      uid: uniqueUserId,
      sessionId: sessionId,
      siteId: siteId,
      elementType: elementType,
      elementText: elementText,
      elementId: elementId,
      elementClass: elementClass,
      url: url,
      timestamp: timestamp
    });

    if (error) {
      console.error('Error saving click event:', error);
      return res.status(500).json({ message: 'Failed to save click event', error: error.message });
    }

    // Update visitor's last seen time
    await getOrCreateVisitor(uniqueUserId, timestamp);

    console.log('Click event data saved successfully');

    res.status(200).json({
      message: 'Click event data saved successfully',
      eventId: event?.event_id
    });

  } catch (error) {
    console.error('Click event tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  handleSessionCreation,
  handleSessionRecording,
  handleUserSystemInfo,
  handlePageViews,
  handleScrollDepth,
  handleSessionTime,
  handleClickEvents,
  // Export service functions for use by other controllers
  getOrCreateVisitor,
  updateVisitorLead,
  getOrCreateSession,
  updateSessionDuration,
  createEvent,
  createPageViewEvent,
  createClickEvent,
  createScrollEvent,
  createSystemInfoEvent
};
