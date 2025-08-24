// Event Service - Handles all event-related database operations

const supabase = require('../config/database');
const { sanitizeUserId, sanitizeSessionId } = require('../utils/idUtils');
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
      elementText = null,
      properties = {},
      timestamp
    } = eventData;

    // Sanitize IDs
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
        element_text: elementText,
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

// Create a page view event
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

// Create a click event
async function createClickEvent(clickData) {
  return createEvent({
    uid: clickData.uid,
    sessionId: clickData.sessionId,
    siteId: clickData.siteId,
    eventType: 'click',
    eventName: 'element_click',
    elementId: clickData.elementId,
    elementClass: clickData.elementClass,
    elementText: clickData.elementText,
    properties: {
      element_type: clickData.elementType,
      url: clickData.url
    },
    timestamp: clickData.timestamp
  });
}

// Create a scroll depth event
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

// Create a form submission event
async function createFormSubmissionEvent(formData) {
  return createEvent({
    uid: formData.uid,
    sessionId: formData.sessionId,
    siteId: formData.siteId,
    eventType: 'form_submit',
    eventName: formData.formName || 'form_submission',
    properties: {
      form_data: formData.formData,
      form_name: formData.formName,
      url: formData.url,
      lead_captured: formData.leadCaptured || false
    },
    timestamp: formData.timestamp
  });
}

// Create a lead capture event
async function createLeadCaptureEvent(leadData) {
  return createEvent({
    uid: leadData.uid,
    sessionId: leadData.sessionId,
    siteId: leadData.siteId,
    eventType: 'lead_capture',
    eventName: 'form_submission',
    properties: {
      button_clicked: leadData.buttonClicked,
      company: leadData.company || null,
      form_type: 'lead_capture',
      timestamp: leadData.timestamp
    },
    timestamp: leadData.timestamp || new Date().toISOString()
  });
}

// Create a system info event
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

// Get events for a specific site
async function getEventsBySite(siteId, options = {}) {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .eq('site_id', siteId);

    // Apply event type filter if provided
    if (options.eventType) {
      query = query.eq('event_type', options.eventType);
    }

    // Apply date range filter if provided
    if (options.startDate) {
      query = query.gte('event_timestamp', options.startDate);
    }
    if (options.endDate) {
      query = query.lte('event_timestamp', options.endDate);
    }

    // Apply ordering
    query = query.order('event_timestamp', { ascending: false });

    // Apply limit if provided
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

// Get events for a specific visitor
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

module.exports = {
  createEvent,
  createPageViewEvent,
  createClickEvent,
  createScrollEvent,
  createFormSubmissionEvent,
  createLeadCaptureEvent,
  createSystemInfoEvent,
  getEventsBySite,
  getEventsByVisitor
};
