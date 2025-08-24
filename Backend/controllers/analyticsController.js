// Analytics Controller - Handles analytics tracking endpoints

const visitorService = require('../services/visitorService');
const sessionService = require('../services/sessionService');
const eventService = require('../services/eventService');
const { parseTimezoneLocation } = require('../utils/idUtils');

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

    // Update session with system information
    const { session: updatedSession, error: sessionError } = await sessionService.updateSessionSystemInfo(
      sessionId,
      {
        browser: browser || null,
        os: operatingSystem || null,
        device: screenInfo?.device || 'desktop'
      }
    );

    if (sessionError && sessionError.code !== 'PGRST116') {
      console.error('❌ Error updating session:', sessionError);
      return res.status(500).json({ 
        message: 'Failed to update session with system information',
        error: sessionError.message 
      });
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
    const { visitor: updatedVisitor } = await visitorService.getOrCreateVisitor(
      uniqueUserId, 
      new Date().toISOString(), 
      visitorUpdates
    );

    // Create system info event
    const { event: systemInfoEvent } = await eventService.createSystemInfoEvent({
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
    const { visitor, error: visitorError } = await visitorService.getOrCreateVisitor(
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
    const { session, error: sessionError, isNew: isNewSession } = await sessionService.getOrCreateSession(
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
    const { event: pageViewEvent } = await eventService.createPageViewEvent({
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
    const { event, error } = await eventService.createScrollEvent({
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
    const { session, error } = await sessionService.updateSessionDuration(sessionId, sessionDuration);

    if (error) {
      console.error('Error updating session:', error);
      return res.status(500).json({ message: 'Failed to update session data', error: error.message });
    }

    // Update visitor's last seen time
    await visitorService.getOrCreateVisitor(uniqueUserId, new Date().toISOString());

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
    const { event, error } = await eventService.createClickEvent({
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
    await visitorService.getOrCreateVisitor(uniqueUserId, timestamp);

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
  handleUserSystemInfo,
  handlePageViews,
  handleScrollDepth,
  handleSessionTime,
  handleClickEvents
};
