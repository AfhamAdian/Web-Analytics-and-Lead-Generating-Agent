/**
 * ID Sanitization Utilities
 * Helper functions for cleaning and validating UUIDs
 */

const crypto = require('crypto');

/**
 * Extract or generate proper UUID from user ID
 * @param {string} userId - The user ID to sanitize
 * @returns {string} - Clean UUID
 */
function sanitizeUserId(userId) {
  // If it starts with "user_", extract the UUID part
  if (userId.startsWith('user_')) {
    return userId.substring(5);
  }
  
  // If it's already a valid UUID format, return as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return userId;
  }
  
  // Otherwise, generate a new UUID (this shouldn't happen in normal flow)
  console.warn(`Invalid userId format: ${userId}, generating new UUID`);
  return crypto.randomUUID();
}

/**
 * Extract or generate proper UUID for session IDs
 * @param {string} sessionId - The session ID to sanitize
 * @returns {string} - Clean UUID
 */
function sanitizeSessionId(sessionId) {
  // If it starts with "session_", extract the UUID part
  if (sessionId.startsWith('session_')) {
    return sessionId.substring(8);
  }
  
  // If it's already a valid UUID format, return as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    return sessionId;
  }
  
  // Otherwise, generate a new UUID (this shouldn't happen in normal flow)
  console.warn(`Invalid sessionId format: ${sessionId}, generating new UUID`);
  return crypto.randomUUID();
}

/**
 * Parse timezone information to extract location data
 * @param {string} timezone - Timezone string (e.g., "Asia/Dhaka")
 * @returns {object} - Parsed location data
 */
function parseTimezoneLocation(timezone) {
  if (!timezone) return { country: null, region: null };

  const timezoneParts = timezone.split('/');
  if (timezoneParts.length < 2) return { country: null, region: null };

  const continent = timezoneParts[0]; // e.g., "Asia"
  const city = timezoneParts[timezoneParts.length - 1]; // e.g., "Dhaka"
  
  // Map continents to more user-friendly country/region names
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
    region: city.replace(/_/g, ' ') // Replace underscores with spaces
  };
}

module.exports = {
  sanitizeUserId,
  sanitizeSessionId,
  parseTimezoneLocation
};
