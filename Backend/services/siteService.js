// Site Service - Handles all site-related database operations

const supabase = require('../config/database');

// Get site by ID and owner
async function getSiteByIdAndOwner(siteId, ownerId) {
  try {
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('site_id', siteId)
      .eq('owner_id', ownerId)
      .single();

    if (siteError) {
      console.error('Error fetching site:', siteError);
      return { site: null, error: siteError };
    }

    return { site: siteData, error: null };
  } catch (error) {
    console.error('Error in getSiteByIdAndOwner:', error);
    return { site: null, error };
  }
}

// Get all sites for an owner
async function getSitesByOwner(ownerId) {
  try {
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')
      .eq('owner_id', ownerId);

    if (sitesError) {
      console.error('Error fetching sites:', sitesError);
      return { sites: null, error: sitesError };
    }

    return { sites: sites || [], error: null };
  } catch (error) {
    console.error('Error in getSitesByOwner:', error);
    return { sites: null, error };
  }
}

// Create a new site
async function createSite(siteData) {
  try {
    const { siteName, siteDomain, ownerId } = siteData;
    
    const { data, error } = await supabase
      .from('sites')
      .insert([{
        site_name: siteName,
        domain_name: siteDomain,
        owner_id: ownerId
      }])
      .select();

    if (error) {
      console.error('Error creating site:', error);
      return { site: null, error };
    }

    return { site: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in createSite:', error);
    return { site: null, error };
  }
}

// Update site information
async function updateSite(siteId, updateData) {
  try {
    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('site_id', siteId)
      .select();

    if (error) {
      console.error('Error updating site:', error);
      return { site: null, error };
    }

    return { site: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in updateSite:', error);
    return { site: null, error };
  }
}

// Delete a site
async function deleteSite(siteId, ownerId) {
  try {
    const { data, error } = await supabase
      .from('sites')
      .delete()
      .eq('site_id', siteId)
      .eq('owner_id', ownerId)
      .select();

    if (error) {
      console.error('Error deleting site:', error);
      return { success: false, error };
    }

    return { success: true, deletedSite: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in deleteSite:', error);
    return { success: false, error };
  }
}

module.exports = {
  getSiteByIdAndOwner,
  getSitesByOwner,
  createSite,
  updateSite,
  deleteSite
};
