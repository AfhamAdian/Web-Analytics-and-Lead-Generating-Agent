// /**
//  * Calculate lead score for dashboard analytics (visitor summary)
//  * @param {Object} visitor - Visitor object
//  * @param {Array} visitorEvents - Array of event objects
//  * @returns {Object} Lead score and related metrics
//  */
// function calculateDashboardLeadScore(visitor, visitorEvents = []) {
//   let leadScore = 0;
//   // Base score factors
//   leadScore += (visitor.page_views || 0) * 5;
//   leadScore += (visitor.total_sessions || 0) * 10;

//   // Time spent (based on session duration)
//   let totalDuration = 0;
//   if (visitor.sessions && Array.isArray(visitor.sessions)) {
//     totalDuration = visitor.sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
//   }
//   leadScore += Math.min(totalDuration / 60, 30);

//   // Event engagement
//   const clickEvents = visitorEvents.filter(e => e.event_type === 'click').length;
//   const formEvents = visitorEvents.filter(e => e.event_type === 'form_submit').length;
//   const scrollEvents = visitorEvents.filter(e => e.event_type === 'scroll').length;
//   leadScore += clickEvents * 2;
//   leadScore += formEvents * 20;
//   leadScore += scrollEvents * 1;

//   // Return visits bonus
//   if ((visitor.total_sessions || 0) > 1) {
//     leadScore += ((visitor.total_sessions || 0) - 1) * 15;
//   }

//   // Lead status bonus
//   if (visitor.lead_status !== 'unknown' && visitor.lead_name) {
//     leadScore += 50;
//   }

//   // Recent activity bonus
//   if (visitor.last_seen) {
//     const daysSinceLastSeen = (new Date() - new Date(visitor.last_seen)) / (1000 * 60 * 60 * 24);
//     if (daysSinceLastSeen < 1) leadScore += 20;
//     else if (daysSinceLastSeen < 7) leadScore += 10;
//   }

//   // Determine lead quality
//   let leadQuality = 'Cold';
//   if (leadScore >= 100) leadQuality = 'Hot';
//   else if (leadScore >= 50) leadQuality = 'Warm';
//   return {
//     ...visitor,
//     leadScore: Math.round(leadScore),
//     leadQuality,
//     engagementLevel: clickEvents + formEvents + scrollEvents,
//     totalDuration: Math.round(totalDuration / 60), // in minutes
//     eventCounts: {
//       clicks: clickEvents,
//       forms: formEvents,
//       scrolls: scrollEvents
//     }
//   };
// }


// module.exports = {
//   calculateDashboardLeadScore
// };





const DEFAULT_SCORING_CONFIG = {
  behavioral: {
    pageView: 2,
    session: 5,
    timeOnSite: 1, // per minute, capped at 30 minutes
    timeOnSiteCap: 30,
    click: 1,
    formSubmission: 15,
    scroll: 0.5,
    download: 10,
    videoWatch: 8
  },
  engagement: {
    returnVisitorMultiplier: 10,
    identifiedLeadBonus: 40,
    recentActivityBonus: {
      today: 15,
      thisWeek: 8,
      thisMonth: 3
    }
  },
  thresholds: {
    hot: 80,
    warm: 40,
    cold: 0
  }
};


const LEAD_QUALITY = {
  HOT: 'Hot',
  WARM: 'Warm',
  COLD: 'Cold'
};


function validateVisitor(visitor) {
  if (!visitor || typeof visitor !== 'object') {
    throw new Error('Visitor must be a valid object');
  }
  
  // Ensure numeric fields are properly typed
  const numericFields = ['page_views', 'total_sessions'];
  numericFields.forEach(field => {
    if (visitor[field] !== undefined && typeof visitor[field] !== 'number') {
      visitor[field] = parseInt(visitor[field], 10) || 0;
    }
  });
}


function calculateBehavioralScore(visitor, visitorEvents, config) {
  const scores = {
    pageViews: (visitor.page_views || 0) * config.behavioral.pageView,
    sessions: (visitor.total_sessions || 0) * config.behavioral.session,
    timeOnSite: 0,
    engagement: 0
  };

  // Calculate time on site score
  if (visitor.sessions && Array.isArray(visitor.sessions)) {
    const totalMinutes = visitor.sessions.reduce((sum, session) => {
      return sum + ((session.duration || 0) / 60);
    }, 0);
    
    scores.timeOnSite = Math.min(totalMinutes, config.behavioral.timeOnSiteCap) * config.behavioral.timeOnSite;
  }

  // Calculate engagement score from events
  const eventCounts = {
    clicks: 0,
    forms: 0,
    scrolls: 0,
    downloads: 0,
    videoWatches: 0
  };

  visitorEvents.forEach(event => {
    switch (event.event_type) {
      case 'click':
        eventCounts.clicks++;
        scores.engagement += config.behavioral.click;
        break;
      case 'form_submit':
        eventCounts.forms++;
        scores.engagement += config.behavioral.formSubmission;
        break;
      case 'scroll':
        eventCounts.scrolls++;
        scores.engagement += config.behavioral.scroll;
        break;
      case 'download':
        eventCounts.downloads++;
        scores.engagement += config.behavioral.download;
        break;
      case 'video_watch':
        eventCounts.videoWatches++;
        scores.engagement += config.behavioral.videoWatch;
        break;
    }
  });

  return {
    scores,
    eventCounts,
    total: Object.values(scores).reduce((sum, score) => sum + score, 0)
  };
}


function calculateEngagementBonuses(visitor, config) {
  const bonuses = {
    returnVisitor: 0,
    identifiedLead: 0,
    recentActivity: 0
  };

  // Return visitor bonus
  const sessionCount = visitor.total_sessions || 0;
  if (sessionCount > 1) {
    bonuses.returnVisitor = (sessionCount - 1) * config.engagement.returnVisitorMultiplier;
  }

  // Identified lead bonus
  if (visitor.lead_status && visitor.lead_status !== 'unknown' && visitor.lead_name) {
    bonuses.identifiedLead = config.engagement.identifiedLeadBonus;
  }

  // Recent activity bonus
  if (visitor.last_seen) {
    const daysSinceLastSeen = (Date.now() - new Date(visitor.last_seen).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastSeen < 1) {
      bonuses.recentActivity = config.engagement.recentActivityBonus.today;
    } else if (daysSinceLastSeen < 7) {
      bonuses.recentActivity = config.engagement.recentActivityBonus.thisWeek;
    } else if (daysSinceLastSeen < 30) {
      bonuses.recentActivity = config.engagement.recentActivityBonus.thisMonth;
    }
  }

  return {
    bonuses,
    total: Object.values(bonuses).reduce((sum, bonus) => sum + bonus, 0)
  };
}


function determineLeadQuality(leadScore, config) {
  if (leadScore >= config.thresholds.hot) {
    return LEAD_QUALITY.HOT;
  } else if (leadScore >= config.thresholds.warm) {
    return LEAD_QUALITY.WARM;
  }
  return LEAD_QUALITY.COLD;
}


function calculateDashboardLeadScore(visitor, visitorEvents = [], customConfig = {}) {
  try {
    // Validate inputs
    validateVisitor(visitor);
    
    if (!Array.isArray(visitorEvents)) {
      throw new Error('visitorEvents must be an array');
    }

    // Merge custom config with defaults
    const config = {
      ...DEFAULT_SCORING_CONFIG,
      ...customConfig,
      behavioral: { ...DEFAULT_SCORING_CONFIG.behavioral, ...customConfig.behavioral },
      engagement: { ...DEFAULT_SCORING_CONFIG.engagement, ...customConfig.engagement },
      thresholds: { ...DEFAULT_SCORING_CONFIG.thresholds, ...customConfig.thresholds }
    };

    const behavioralResult = calculateBehavioralScore(visitor, visitorEvents, config);
    const engagementResult = calculateEngagementBonuses(visitor, config);
    
    // Calculate total lead score
    const totalScore = behavioralResult.total + engagementResult.total;
    const leadScore = Math.max(0, Math.round(totalScore));
    
    // Determine lead quality
    const leadQuality = determineLeadQuality(leadScore, config);
    
    // Calculate total engagement level
    const engagementLevel = Object.values(behavioralResult.eventCounts)
      .reduce((sum, count) => sum + count, 0);
    
    // Calculate total session duration in minutes
    const totalDuration = visitor.sessions && Array.isArray(visitor.sessions)
      ? Math.round(visitor.sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60)
      : 0;

    return {
      ...visitor,
      leadScore,
      leadQuality,
      engagementLevel,
      totalDuration,
      eventCounts: behavioralResult.eventCounts,
      scoreBreakdown: {
        behavioral: behavioralResult.scores,
        engagement: engagementResult.bonuses,
        total: {
          behavioral: behavioralResult.total,
          engagement: engagementResult.total,
          combined: leadScore
        }
      },
      metadata: {
        scoringVersion: '2.0',
        calculatedAt: new Date().toISOString(),
        configUsed: config.thresholds
      }
    };
    
  } catch (error) {
    console.error('Lead scoring calculation failed:', error.message);
    
    // Return visitor with error state
    return {
      ...visitor,
      leadScore: 0,
      leadQuality: LEAD_QUALITY.COLD,
      engagementLevel: 0,
      totalDuration: 0,
      eventCounts: { clicks: 0, forms: 0, scrolls: 0, downloads: 0, videoWatches: 0 },
      error: error.message,
      metadata: {
        scoringVersion: '2.0',
        calculatedAt: new Date().toISOString(),
        hasError: true
      }
    };
  }
}



module.exports = {
  calculateDashboardLeadScore,
  DEFAULT_SCORING_CONFIG,
  LEAD_QUALITY
};