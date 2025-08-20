(function () {
  try {
    // Get site ID from script tag - this must match the database site_id
    const scriptTag = document.currentScript;
    const siteId = scriptTag?.getAttribute("site-id");
    console.log("aldlafkl")
    console.log("Analytics script loaded for site:", siteId);
    
    // Validate site ID exists
    if (!siteId) {
      console.error("❌ Analytics Error: Invalid or missing site-id attribute");
      return;
    }

    // Get session start time (first page load in this tab)
    if (!sessionStorage.getItem("sessionStart")) {
      sessionStorage.setItem("sessionStart", Date.now());
    }
    const sessionStart = parseInt(sessionStorage.getItem("sessionStart"), 10);

    // Calculate session duration so far (in seconds)
    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);

    // Browser detection
    const userAgent = navigator.userAgent;
    const browser = getBrowserName(userAgent);
    const os = getOSName(userAgent);

    // Generate or get session ID
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      // Generate new session ID (UUID-like format)
      sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      sessionStorage.setItem("sessionId", sessionId);

      // Start new session
      const sessionData = {
        siteId,
        sessionId,
        browser,
        os,
        userAgent,
        action: "start"
      };

      console.log("Starting new session:", sessionData);

      fetch("http://localhost:5000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
        keepalive: true,
      }).catch((err) => {
        console.warn("Session start tracking failed:", err);
      });
    }

    // Track page view
    const pageData = {
      siteId,
      sessionId,
      url: window.location.href,
      title: document.title,
      timestamp: Date.now()
    };

    console.log("Tracking page view:", pageData);

    fetch("http://localhost:5000/api/pageviews", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
      keepalive: true,
    }).catch((err) => {
      console.warn("Page view tracking failed:", err);
    });

    // Enhanced User Interaction Tracking
    
    // Track all button clicks
    document.addEventListener('click', (event) => {
      const element = event.target;
      
      // Track button clicks
      if (element.tagName === 'BUTTON' || element.type === 'button' || element.type === 'submit') {
        const buttonData = {
          siteId,
          sessionId,
          event: 'button_click',
          buttonText: element.textContent || element.value || 'Unknown',
          buttonId: element.id || null,
          buttonClass: element.className || null,
          url: window.location.href,
          timestamp: Date.now()
        };
        
        console.log("Button clicked:", buttonData);
        
        fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buttonData),
          keepalive: true,
        }).catch((err) => {
          console.warn("Button click tracking failed:", err);
        });
      }
      
      // Track link clicks
      if (element.tagName === 'A') {
        const linkData = {
          siteId,
          sessionId,
          event: 'link_click',
          linkText: element.textContent || 'Unknown',
          linkUrl: element.href || null,
          linkId: element.id || null,
          url: window.location.href,
          timestamp: Date.now()
        };
        
        console.log("Link clicked:", linkData);
        
        fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(linkData),
          keepalive: true,
        }).catch((err) => {
          console.warn("Link click tracking failed:", err);
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      const formData = {
        siteId,
        sessionId,
        event: 'form_submit',
        formId: form.id || null,
        formClass: form.className || null,
        url: window.location.href,
        timestamp: Date.now()
      };
      
      console.log("Form submitted:", formData);
      
      fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        keepalive: true,
      }).catch((err) => {
        console.warn("Form submit tracking failed:", err);
      });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) { // Track every 25%
        maxScrollDepth = scrollPercent;
        
        const scrollData = {
          siteId,
          sessionId,
          event: 'scroll_depth',
          scrollPercent: scrollPercent,
          url: window.location.href,
          timestamp: Date.now()
        };
        
        console.log("Scroll depth:", scrollData);
        
        fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scrollData),
          keepalive: true,
        }).catch((err) => {
          console.warn("Scroll tracking failed:", err);
        });
      }
    });

    // Track time spent on page
    let pageStartTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
      
      if (timeSpent > 5) { // Only track if user spent more than 5 seconds
        const timeData = {
          siteId,
          sessionId,
          event: 'time_on_page',
          timeSpent: timeSpent,
          url: window.location.href,
          timestamp: Date.now()
        };
        
        fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(timeData),
          keepalive: true,
        }).catch((err) => {
          console.warn("Time tracking failed:", err);
        });
      }
    });

    // Handle session end on page unload
    const endSession = () => {
      const endData = {
        siteId,
        sessionId,
        sessionDuration: Math.floor((Date.now() - sessionStart) / 1000),
        action: "end"
      };

      fetch("http://localhost:5000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(endData),
        keepalive: true,
      }).catch((err) => {
        console.warn("Session end tracking failed:", err);
      });
    };

    // Add event listeners for session end
    window.addEventListener('beforeunload', endSession);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        endSession();
      }
    });

    // Helper functions for browser/OS detection
    function getBrowserName(userAgent) {
      if (userAgent.includes("Chrome")) return "Chrome";
      if (userAgent.includes("Firefox")) return "Firefox";
      if (userAgent.includes("Safari")) return "Safari";
      if (userAgent.includes("Edge")) return "Edge";
      return "Unknown";
    }

    function getOSName(userAgent) {
      if (userAgent.includes("Windows")) return "Windows";
      if (userAgent.includes("Mac")) return "macOS";
      if (userAgent.includes("Linux")) return "Linux";
      if (userAgent.includes("Android")) return "Android";
      if (userAgent.includes("iOS")) return "iOS";
      return "Unknown";
    }

  } catch (error) {
    console.error("Error in tracking script:", error);
  }
})();








