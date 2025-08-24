// Visitor Service - Handles all visitor-related database operations

const supabase = require('../config/database');
const { sanitizeUserId } = require('../utils/idUtils');

// Get or create a visitor record
async function getOrCreateVisitor(uniqueUserId, timestamp, metadata = {}) {
  try {
    // Sanitize the user ID to proper UUID format
    const sanitizedUserId = sanitizeUserId(uniqueUserId);
    
    // Check if visitor exists
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
      // Create new visitor with metadata
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
      // Update existing visitor
      const updates = {
        last_seen: new Date(timestamp).toISOString(),
        region: metadata.region || visitor.region,
        country: metadata.country || visitor.country
      };
      
      // Only update page_views if provided
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

// Update visitor with lead information
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

// Get visitors for a specific site with optional filters
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

    // Apply filters if provided
    if (options.leadStatus) {
      query = query.eq('lead_status', options.leadStatus);
    }

    // Apply ordering
    query = query.order('last_seen', { ascending: false });

    // Apply limit if provided
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

module.exports = {
  getOrCreateVisitor,
  updateVisitorLead,
  getVisitorsBySite
};
