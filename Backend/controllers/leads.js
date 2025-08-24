// Leads Controller - Handles lead capture and form submission endpoints
// Integrates lead management functionality

const supabase = require('../supabaseClient');
const crypto = require('crypto');

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

// ===== VISITOR FUNCTIONS =====

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

// ===== EVENT FUNCTIONS =====

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

// ===== CONTROLLER FUNCTIONS =====

// Handle user detail information capture (Fabricx specific)
async function handleUserDetailInformation(req, res) {
  try {
    console.log("👤 Received user detail information:", req.body);

    const { 
      siteId, 
      sessionId, 
      uniqueUserId, 
      buttonClicked, 
      fullName, 
      businessEmail, 
      company, 
      mobile, 
      timestamp 
    } = req.body;

    // Validate required fields
    if (!uniqueUserId || !fullName || !businessEmail) {
      return res.status(400).json({ 
        message: 'Missing required fields: uniqueUserId, fullName, and businessEmail are required' 
      });
    }

    console.log(`🔍 Updating visitor details for UID: ${uniqueUserId}`);

    // Update visitor with lead information
    const { visitor: updatedVisitor, error: updateError } = await updateVisitorLead(
      uniqueUserId,
      {
        status: 'captured',
        name: fullName,
        email: businessEmail,
        phone: mobile || null
      }
    );

    if (updateError) {
      console.error('❌ Error updating visitor with lead details:', updateError);
      return res.status(500).json({ 
        message: 'Failed to update visitor details', 
        error: updateError.message 
      });
    }

    if (!updatedVisitor) {
      console.warn(`⚠️ No visitor found with UID: ${uniqueUserId}`);
      return res.status(404).json({ 
        message: 'Visitor not found', 
        uid: uniqueUserId 
      });
    }

    // Log the button click event if session ID is provided
    if (sessionId && buttonClicked) {
      const { event: leadEvent } = await createLeadCaptureEvent({
        uid: uniqueUserId,
        sessionId: sessionId,
        siteId: siteId,
        buttonClicked: buttonClicked,
        company: company || null,
        timestamp: timestamp
      });

      if (leadEvent) {
        console.log('✅ Lead capture event logged successfully');
      }
    }

    console.log('✅ Visitor details updated successfully:', {
      uid: uniqueUserId,
      name: fullName,
      email: businessEmail,
      status: 'captured'
    });

    res.status(200).json({ 
      message: 'User details updated successfully',
      visitor: updatedVisitor,
      leadCaptured: true
    });

  } catch(error) {
    console.error('❌ Error processing user detail information:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
}

// Handle general form submissions
async function handleFormSubmit(req, res) {
  try {
    const { 
      siteId, 
      sessionId, 
      uniqueUserId, 
      formData, 
      formName, 
      timestamp,
      url 
    } = req.body;

    console.log('📝 Received form submission data:', {
      siteId, sessionId, uniqueUserId, formName, formData,
      timestamp: new Date(timestamp).toISOString()
    });

    if (!siteId || !sessionId || !uniqueUserId || !formData || !timestamp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Extract lead information from form data
    const leadName = formData.name || formData.fullName || 
                     (formData.firstName ? formData.firstName + ' ' + (formData.lastName || '') : null);
    const leadEmail = formData.email || null;
    const leadPhone = formData.phone || formData.phoneNumber || null;

    // Update visitor with lead information if provided
    let leadCaptured = false;
    if (leadName || leadEmail || leadPhone) {
      const { visitor: updatedVisitor } = await updateVisitorLead(
        uniqueUserId,
        {
          status: 'lead',
          name: leadName,
          email: leadEmail,
          phone: leadPhone
        }
      );

      if (updatedVisitor) {
        leadCaptured = true;
      }
    }

    // Create form submission event
    const { event, error } = await createFormSubmissionEvent({
      uid: uniqueUserId,
      sessionId: sessionId,
      siteId: siteId,
      formData: formData,
      formName: formName,
      url: url,
      leadCaptured: leadCaptured,
      timestamp: timestamp
    });

    if (error) {
      console.error('❌ Error saving form submission:', error);
      return res.status(500).json({ message: 'Failed to save form submission', error: error.message });
    }

    console.log('✅ Form submission data saved successfully');

    res.status(200).json({
      message: 'Form submission data saved successfully',
      eventId: event?.event_id,
      leadCaptured: leadCaptured
    });

  } catch (error) {
    console.error('❌ Form submission tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle visitor identification/qualification
async function handleIdentifyVisitor(req, res) {
  try {
    const { 
      siteId,
      sessionId,
      uniqueUserId,
      leadData,
      timestamp
    } = req.body;

    console.log('🔍 Received visitor identification data:', {
      siteId, sessionId, uniqueUserId, leadData,
      timestamp: new Date(timestamp).toISOString()
    });

    if (!siteId || !sessionId || !uniqueUserId || !leadData || !timestamp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Update visitor with lead information
    const { visitor: updatedVisitor, error: visitorUpdateError } = await updateVisitorLead(
      uniqueUserId,
      {
        status: leadData.status || 'identified',
        name: leadData.name || null,
        email: leadData.email || null,
        phone: leadData.phone || null
      }
    );

    if (visitorUpdateError) {
      console.error('Error updating visitor with lead data:', visitorUpdateError);
      return res.status(500).json({ message: 'Failed to update visitor lead data' });
    }

    // Create identification event
    const { event: identifyEvent } = await createEvent({
      uid: uniqueUserId,
      sessionId: sessionId,
      siteId: siteId,
      eventType: 'identify',
      eventName: 'visitor_identified',
      properties: {
        lead_data: leadData,
        previous_status: 'unknown'
      },
      timestamp: timestamp
    });

    console.log('✅ Visitor identification data saved successfully');

    res.status(200).json({
      message: 'Visitor identification data saved successfully',
      visitor: updatedVisitor,
      eventId: identifyEvent?.event_id
    });

  } catch (error) {
    console.error('❌ Visitor identification tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  handleUserDetailInformation,
  handleFormSubmit,
  handleIdentifyVisitor,
  // Export service functions for use by other controllers
  updateVisitorLead,
  createEvent,
  createLeadCaptureEvent,
  createFormSubmissionEvent
};
