/**
 * Sessions Routes
 * Routes for session recording and replay functionality
 */

const express = require('express');
const router = express.Router();
const { getSessionRecordings, getSessionRecording } = require('../controllers/sessions');
const authMiddleware = require('../middlewares/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/sessions/site/:siteId
 * @desc Get all session recordings for a specific site
 * @access Private
 */
router.get('/site/:siteId', getSessionRecordings);

/**
 * @route GET /api/sessions/:sessionId
 * @desc Get a specific session recording by session ID
 * @access Private
 */
router.get('/:sessionId', getSessionRecording);

/**
 * @route GET /api/sessions/site/:siteId/stats
 * @desc Get session statistics for a site
 * @access Private
 */
router.get('/site/:siteId/stats', async (req, res) => {
  try {
    const { siteId } = req.params;
    console.log(`📊 Fetching session stats for site: ${siteId}`);

    const supabase = require('../supabaseClient');

    // Get basic session statistics
    const { data: sessionStats, error: statsError } = await supabase
      .from('sessions')
      .select(`
        session_id,
        duration,
        started_at,
        visitors!inner (
          lead_status
        )
      `)
      .eq('site_id', siteId);

    if (statsError) {
      console.error('❌ Error fetching session stats:', statsError);
      return res.status(500).json({ 
        error: 'Failed to fetch session statistics',
        details: statsError.message 
      });
    }

    // Calculate statistics
    const totalSessions = sessionStats.length;
    const leadSessions = sessionStats.filter(s => s.visitors.lead_status !== 'unknown').length;
    const averageDuration = totalSessions > 0 
      ? Math.round(sessionStats.reduce((sum, s) => sum + (s.duration || 0), 0) / totalSessions)
      : 0;

    // Get sessions from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSessions = sessionStats.filter(s => 
      new Date(s.started_at) >= sevenDaysAgo
    ).length;

    res.json({
      success: true,
      stats: {
        totalSessions,
        leadSessions,
        averageDuration,
        recentSessions,
        conversionRate: totalSessions > 0 ? ((leadSessions / totalSessions) * 100).toFixed(1) : 0
      }
    });

  } catch (error) {
    console.error('❌ Error in session stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
