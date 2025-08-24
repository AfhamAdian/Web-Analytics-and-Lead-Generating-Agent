// Session Service - Handles all session-related database operations

const supabase = require('../config/database');
const { sanitizeUserId, sanitizeSessionId } = require('../utils/idUtils');

// Get or create a session record
async function getOrCreateSession(sessionId, uniqueUserId, siteId, timestamp, metadata = {}) {
  try {
    // Sanitize both the session ID and user ID to proper UUID format
    const sanitizedSessionId = sanitizeSessionId(sessionId);
    const sanitizedUserId = sanitizeUserId(uniqueUserId);
    
    // Check if session exists
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
      // Create new session with metadata
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

// Update session with duration and end time
async function updateSessionDuration(sessionId, duration) {
  try {
    const sanitizedSessionId = sanitizeSessionId(sessionId);
    
    const { data, error } = await supabase
      .from('sessions')
      .update({
        duration: Math.round(duration), // duration in seconds
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

// Update session with system information
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
      .select()
      .single();

    if (sessionUpdateError) {
      console.error('Error updating session with system info:', sessionUpdateError);
      return { session: null, error: sessionUpdateError };
    }

    return { session: sessionUpdateResult, error: null };
  } catch (error) {
    console.error('Error in updateSessionSystemInfo:', error);
    return { session: null, error };
  }
}

// Get sessions for a specific site
async function getSessionsBySite(siteId, options = {}) {
  try {
    let query = supabase
      .from('sessions')
      .select('*')
      .eq('site_id', siteId);

    // Apply date range filter if provided
    if (options.startDate) {
      query = query.gte('started_at', options.startDate);
    }
    if (options.endDate) {
      query = query.lte('started_at', options.endDate);
    }

    // Apply ordering
    query = query.order('started_at', { ascending: false });

    // Apply limit if provided
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

// Helper function to increment visitor session count
async function incrementVisitorSessionCount(userId) {
  try {
    const { data: currentVisitor, error: fetchError } = await supabase
      .from('visitors')
      .select('total_sessions')
      .eq('uid', userId)
      .single();
    
    if (!fetchError && currentVisitor) {
      const { error: sessionCountError } = await supabase
        .from('visitors')
        .update({ total_sessions: currentVisitor.total_sessions + 1 })
        .eq('uid', userId);

      if (sessionCountError) {
        console.error('Error updating visitor session count:', sessionCountError);
      }
    }
  } catch (error) {
    console.error('Error in incrementVisitorSessionCount:', error);
  }
}

module.exports = {
  getOrCreateSession,
  updateSessionDuration,
  updateSessionSystemInfo,
  getSessionsBySite
};
