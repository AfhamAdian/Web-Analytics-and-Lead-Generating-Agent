(function () {
  try {
    // Get site ID from script tag - this must match the database site_id
    const scriptTag = document.currentScript;
    const siteId = scriptTag?.getAttribute("site-id");
    console.log("aldlafkl")
    console.log("Analytics script loaded for site:", siteId);
    
    // Validate site ID exists
    if (!siteId) {-
      console.error("❌ Analytics Error: Invalid or missing site-id attribute");
      return;
    }
  } catch (error) {
    console.error("Error in tracking script:", error);
  }
})();


//cookie consent and user tracking
const cookieConsent = {
  accepted: false,
  userId: null,
  pageViews: {},
  
  setAccepted: function () {
    this.accepted = true;
    localStorage.setItem("cookieConsent", "accepted");
    
    // Check if unique ID already exists in cookies
    this.userId = this.getCookie("uniqueUserId");
    
    if (!this.userId) {
      // Check if user previously allowed ID generation
      const idGenerationAllowed = localStorage.getItem("idGenerationAllowed");
      
      if (idGenerationAllowed === "true") {
        // Generate ID without asking (user already gave permission)
        this.userId = this.generateUserId();
        this.setCookie("uniqueUserId", this.userId, 365);
        console.log("🆔 New unique user ID generated (permission already granted):", this.userId);
        this.initializePageTracking();
      } else if (idGenerationAllowed !== "false") {
        // Ask for permission to generate ID
        this.askForIdGeneration();
      } else {
        console.log("❌ ID generation not allowed by user");
      }
    } else {
      console.log("🔄 Using existing user ID from cookies:", this.userId);
      this.initializePageTracking();
    }
  },
  
  checkConsent: function () {
    const consent = localStorage.getItem("cookieConsent");
    this.accepted = consent === "accepted";
    
    if (this.accepted) {
      // Get existing user ID from cookie
      this.userId = this.getCookie("uniqueUserId");
      
      if (!this.userId) {
        // Ask permission before generating new unique ID
        this.askForIdGeneration();
      } else {
        console.log("🔄 Returning user with ID:", this.userId);
        this.initializePageTracking();
      }
    }
  },
  
  generateUserId: function () {
    // Generate UUID-like unique ID
    return 'user_' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  setCookie: function (name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
  },
  
  getCookie: function (name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  
  askForIdGeneration: function () {
    // Create permission dialog
    const dialog = document.createElement('div');
    dialog.id = 'id-generation-dialog';
    dialog.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          margin: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; text-align: center;">🆔 Generate Unique ID</h3>
          <p style="margin: 0 0 20px 0; color: #34495e; line-height: 1.6; text-align: center;">
            We need to generate a unique identifier for your browser session. This helps us provide better analytics and personalized experience.
          </p>
          <p style="margin: 0 0 25px 0; color: #7f8c8d; font-size: 14px; text-align: center;">
            <strong>Note:</strong> This ID will be stored in your browser cookies and used for tracking purposes.
          </p>
          <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="allow-id-generation" style="
              background: #27ae60;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
            ">Allow ID Generation</button>
            <button id="deny-id-generation" style="
              background: #e74c3c;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            ">Deny</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add event listeners
    document.getElementById('allow-id-generation').onclick = () => {
      // Generate and save unique ID
      this.userId = this.generateUserId();
      this.setCookie("uniqueUserId", this.userId, 365);
      localStorage.setItem("idGenerationAllowed", "true");
      dialog.remove();
      console.log("✅ Permission granted! Unique ID generated:", this.userId);
      this.initializePageTracking();
    };
    
    document.getElementById('deny-id-generation').onclick = () => {
      localStorage.setItem("idGenerationAllowed", "false");
      dialog.remove();
      console.log("❌ Permission denied for ID generation");
    };
  },
  
  showConsentBanner: function () {
    if (this.accepted) return;
    
    // Create consent banner
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #2c3e50;
        color: white;
        padding: 20px;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: Arial, sans-serif;
      ">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
          <div style="flex: 1; min-width: 300px;">
            <h4 style="margin: 0 0 10px 0; color: #ecf0f1;">🍪 Cookie Consent</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.4;">
              We use cookies to enhance your experience and track analytics. By accepting, you'll get a unique ID that persists across your visits.
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="accept-cookies" style="
              background: #27ae60;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
            ">Accept Cookies</button>
            <button id="decline-cookies" style="
              background: #e74c3c;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            ">Decline</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add event listeners
    document.getElementById('accept-cookies').onclick = () => {
      this.setAccepted();
      banner.remove();
      console.log("✅ Cookies accepted! User ID:", this.userId);
    };
    
    document.getElementById('decline-cookies').onclick = () => {
      banner.remove();
      console.log("❌ Cookies declined");
    };
  },





  
  // Initialize page tracking after user ID is available
  initializePageTracking: function() {
    if (!this.userId) {
      console.warn("⚠️ Cannot initialize page tracking: No user ID available");
      return;
    }

    console.log("🚀 Initializing page tracking for user:", this.userId);

    // Get site ID from script tag
    const scriptTag = document.currentScript || document.querySelector('script[site-id]');
    const siteId = scriptTag?.getAttribute("site-id");

    if (!siteId) {
      console.error("❌ Analytics Error: Invalid or missing site-id attribute");
      return;
    }

    // Generate or get session ID
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = 'session_' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      sessionStorage.setItem("sessionId", sessionId);
    }

    // Track current page view
    this.trackPageView(siteId, sessionId);

    // Listen for navigation changes (hash changes like #features, #solutions, etc.)
    window.addEventListener('hashchange', () => {
      console.log(`🔗 Hash changed to: ${window.location.hash}`);
      this.trackPageView(siteId, sessionId);
      this.sendPageViewData(siteId, sessionId);
    });

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', () => {
      this.trackPageView(siteId, sessionId);
      this.sendPageViewData(siteId, sessionId);
    });

    // Override pushState and replaceState for SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      this.sendPageViewData(siteId, sessionId); // Send data before navigation
      originalPushState.apply(history, args);
      setTimeout(() => this.trackPageView(siteId, sessionId), 0);
    };
    
    history.replaceState = (...args) => {
      this.sendPageViewData(siteId, sessionId); // Send data before navigation
      originalReplaceState.apply(history, args);
      setTimeout(() => this.trackPageView(siteId, sessionId), 0);
    };

    // Send data periodically and on page unload
    window.addEventListener('beforeunload', () => {
      this.sendPageViewData(siteId, sessionId);
    });

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendPageViewData(siteId, sessionId);
      }
    });

    // Send data every 30 seconds
    setInterval(() => {
      this.sendPageViewData(siteId, sessionId);
    }, 30000);
  },

  // Get current page URL including hash
  getCurrentPageUrl: function() {
    const pathname = window.location.pathname || '/';
    const hash = window.location.hash;
    return hash ? `${pathname}${hash}` : pathname;
  },

  // Track page view
  trackPageView: function(siteId, sessionId) {
    const currentPage = this.getCurrentPageUrl();
    
    // Get existing page views from localStorage (persistent across sessions)
    const storageKey = `pageViews_${this.userId}`;
    let pageViews = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // Increment current page view count
    pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
    
    // Save updated page views to localStorage
    localStorage.setItem(storageKey, JSON.stringify(pageViews));
    
    console.log(`📊 Page view tracked: ${currentPage} (${pageViews[currentPage]} times)`);
    console.log("📈 All page views for user:", pageViews);

    // Store current session data
    this.pageViews = pageViews;
  },

  // Send page view data to backend
  sendPageViewData: function(siteId, sessionId) {
    if (!this.userId || Object.keys(this.pageViews).length === 0) {
      return;
    }

    const pageViewData = {
      siteId: siteId,
      sessionId: sessionId,
      uniqueUserId: this.userId, // Include the unique user ID
      pageViews: this.pageViews,
      timestamp: Date.now()
    };
    
    console.log("🚀 Sending page view data to backend:", pageViewData);
    
    fetch("http://localhost:5000/api/pageviews", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageViewData),
      keepalive: true,
    }).catch((err) => {
      console.warn("Page view tracking failed:", err);
    });
  }
};

// Initialize cookie consent
cookieConsent.checkConsent();

// Show banner when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cookieConsent.showConsentBanner();
  });
} else {
  cookieConsent.showConsentBanner();
}









/*
    // Get session start time (first page load in this tab)
    if (!sessionStorage.getItem("sessionStart")) {
      sessionStorage.setItem("sessionStart", Date.now());
    }
    const sessionStart = parseInt(sessionStorage.getItem("sessionStart"), 10);

    // Calculate session duration so far (in seconds)
    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);



    // Generate or get sesion ID
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

      fetch("http://127.0.0.1:8000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
        keepalive: true,
      }).catch((err) => {
        console.warn("Session start tracking failed:", err);
      });

      console.log("New session started:", sessionId);
    }

    // Handle session end on page unload
    const endSession = () => {
      const endData = {
        siteId,
        sessionId,
        sessionDuration,
        action: "end"
      };

      fetch("http://127.0.0.1:8000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(endData),
        keepalive: true,
      }).catch((err) => {
        console.warn("Session end tracking failed:", err);
      });
    };
  } catch (error) {
    console.error("Error in tracking script:", error);
  }
})();*/





