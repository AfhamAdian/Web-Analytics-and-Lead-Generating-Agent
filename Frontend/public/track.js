const BACKEND_URL = "http://localhost:5000/api";

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

    // Initialize session start time if not already set
    if (!sessionStorage.getItem("sessionStart")) {
      sessionStorage.setItem("sessionStart", Date.now());
      console.log("🕐 Session started at:", new Date().toISOString());
    }

    // Track current page view
    this.trackPageView(siteId, sessionId);

    // Send user system information immediately when entering website
    this.sendUserSystemInfo(siteId, sessionId);

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
      this.sendPageViewData(siteId, sessionId, true); // Pass true to indicate closing
      this.sendSessionTimeData(siteId, sessionId); // Send session time data
    });

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendPageViewData(siteId, sessionId);
        // Removed session time data - only send on page close/reload
      }
    });

    // Send data every 30 seconds and check for session timeout
    setInterval(() => {
      // Check if current session is still valid (not exceeded 30 minutes)
      const currentSessionId = sessionStorage.getItem("sessionId");
      const sessionStart = parseInt(sessionStorage.getItem("sessionStart"), 10);
      
      if (sessionStart && currentSessionId) {
        const sessionDurationMinutes = Math.floor((Date.now() - sessionStart) / (1000 * 60));
        
        if (sessionDurationMinutes >= 30) {
          console.log("⏰ Session timeout detected in interval, starting new session");
          this.startNewSession(siteId);
        } else {
          this.sendPageViewData(siteId, currentSessionId);
        }
      }
    }, 30000);

    // Add click event tracking
    this.setupClickEventTracking(siteId, sessionId);
    
    // Add scroll depth tracking
    this.setupScrollDepthTracking(siteId, sessionId);
  },

  // Setup click event tracking for buttons, images, and other elements
  setupClickEventTracking: function(siteId, sessionId) {
    let specialButtonClicks = {}; // Track clicks for each specific button by name
    
    document.addEventListener('click', (event) => {
      const element = event.target;
      
      // Check if clicked element is a special button (Subscribe, Get a demo, Be an Early Bird)
      const buttonText = element.textContent || element.value || '';
      const isSpecialButton = buttonText.toLowerCase().includes('subscribe') || 
                             buttonText.toLowerCase().includes('get a demo') || 
                             buttonText.toLowerCase().includes('be an early bird') ||
                             buttonText.toLowerCase().includes('demo') ||
                             buttonText.toLowerCase().includes('early bird');
      
      // Track button clicks
      if (element.tagName === 'BUTTON' || element.type === 'button' || element.type === 'submit') {
        this.sendClickEvent({
          siteId,
          sessionId,
          uniqueUserId: this.userId,
          elementType: 'button',
          elementText: buttonText || 'Unknown Button',
          elementId: element.id || null,
          elementClass: element.className || null,
          url: window.location.href,
          timestamp: Date.now()
        });

        // Handle special button clicks - track each button separately
        if (isSpecialButton) {
          const normalizedButtonText = buttonText.toLowerCase().trim();
          
          // Only track these specific buttons
          const targetButtons = ['subscribe', 'get a demo', 'be an early bird'];
          const isTargetButton = targetButtons.some(target => 
            normalizedButtonText.includes(target)
          );
          
          if (isTargetButton) {
            // Check if button is inside a form (indicating it's the second click from within form)
            const isInsideForm = element.closest('form') !== null;
            
            if (isInsideForm) {
              // Button is inside a form - this is the second click, capture form data
              console.log(`📋 Form submission detected for: "${buttonText}" - capturing form data`);
              this.captureAndSendFormData(siteId, sessionId, buttonText);
            } else {
              // Button is not in form - this is first click, form should show up on frontend
              console.log(`🎯 First click on special button: "${buttonText}" - form should appear on frontend`);
              
              // Initialize counter for this specific button if not exists (for logging purposes)
              if (!specialButtonClicks[normalizedButtonText]) {
                specialButtonClicks[normalizedButtonText] = 0;
              }
              specialButtonClicks[normalizedButtonText]++;
              
              console.log(`📊 Special button "${buttonText}" clicked ${specialButtonClicks[normalizedButtonText]} times`);
            }
          }
        }
      }
      
      // Track image clicks
      else if (element.tagName === 'IMG') {
        this.sendClickEvent({
          siteId,
          sessionId,
          uniqueUserId: this.userId,
          elementType: 'image',
          elementText: element.alt || element.src || 'Image',
          elementId: element.id || null,
          elementClass: element.className || null,
          imageSrc: element.src,
          url: window.location.href,
          timestamp: Date.now()
        });
      }
      
      // Track link clicks
      else if (element.tagName === 'A') {
        this.sendClickEvent({
          siteId,
          sessionId,
          uniqueUserId: this.userId,
          elementType: 'link',
          elementText: element.textContent || 'Link',
          elementId: element.id || null,
          elementClass: element.className || null,
          linkUrl: element.href || null,
          url: window.location.href,
          timestamp: Date.now()
        });
      }
      
      // Track div/span clicks (for custom interactive elements)
      else if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
        // Only track if element has click handlers or is marked as interactive
        if (element.onclick || element.style.cursor === 'pointer' || element.getAttribute('role') === 'button') {
          this.sendClickEvent({
            siteId,
            sessionId,
            uniqueUserId: this.userId,
            elementType: element.tagName.toLowerCase(),
            elementText: element.textContent || element.innerText || 'Interactive Element',
            elementId: element.id || null,
            elementClass: element.className || null,
            url: window.location.href,
            timestamp: Date.now()
          });
        }
      }
    });
  },

  // Send click event data to backend
  sendClickEvent: function(clickData) {
    console.log("🖱️ Click event tracked:", clickData);

    fetch(`${BACKEND_URL}/click-events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clickData),
      keepalive: true,
    }).catch((err) => {
      console.warn("Click event tracking failed:", err);
    });
  },

  // Setup scroll depth tracking
  setupScrollDepthTracking: function(siteId, sessionId) {
    let trackedDepths = new Set(); // Track which depths have been sent to avoid duplicates
    
    window.addEventListener('scroll', function() {
      var scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      console.log('Scroll Depth: ' + scrollDepth + '%');
      
      // Define thresholds to track
      const thresholds = [25, 50, 75, 90, 100];
      
      // Check if we've reached any new threshold
      for (const threshold of thresholds) {
        if (scrollDepth >= threshold && !trackedDepths.has(threshold)) {
          trackedDepths.add(threshold);
          
          // Send scroll depth data to backend
          this.sendScrollDepthEvent({
            siteId: siteId,
            sessionId: sessionId,
            uniqueUserId: this.userId,
            pageName: document.title || 'Untitled Page',
            currentUrl: window.location.href,
            scrollDepth: threshold,
            timestamp: Date.now()
          });
          
          break; // Only send one threshold per scroll event
        }
      }
    }.bind(this));
  },

  // Send scroll depth event data to backend
  sendScrollDepthEvent: function(scrollData) {
    console.log("📏 Scroll depth tracked:", scrollData);

    fetch(`${BACKEND_URL}/scroll-depth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scrollData),
      keepalive: true,
    }).catch((err) => {
      console.warn("Scroll depth tracking failed:", err);
    });
  },

  // Send user system information immediately when entering website
  sendUserSystemInfo: function(siteId, sessionId) {
    // Get browser information
    const userAgent = navigator.userAgent;
    const browser = this.getBrowserInfo(userAgent);
    const os = this.getOSInfo(userAgent);
    
    // Get screen information
    const screenInfo = {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth
    };

    // Get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get language
    const language = navigator.language || navigator.userLanguage;

    // Get location (if available)
    this.getUserLocation().then(location => {
      const systemData = {
        siteId: siteId,
        sessionId: sessionId,
        uniqueUserId: this.userId,
        browser: browser,
        operatingSystem: os,
        userAgent: userAgent,
        screenInfo: screenInfo,
        timezone: timezone,
        language: language,
        location: location,
        timestamp: Date.now()
      };

      console.log("💻 User system info tracked:", systemData);

      fetch(`${BACKEND_URL}/user-system-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(systemData),
        keepalive: true,
      }).catch((err) => {
        console.warn("User system info tracking failed:", err);
      });
    }).catch(() => {
      // Send without location if geolocation fails
      const systemData = {
        siteId: siteId,
        sessionId: sessionId,
        uniqueUserId: this.userId,
        browser: browser,
        operatingSystem: os,
        userAgent: userAgent,
        screenInfo: screenInfo,
        timezone: timezone,
        language: language,
        location: null,
        timestamp: Date.now()
      };

      console.log("💻 User system info tracked (no location):", systemData);

      fetch(`${BACKEND_URL}/user-system-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(systemData),
        keepalive: true,
      }).catch((err) => {
        console.warn("User system info tracking failed:", err);
      });
    });
  },

  // Get browser information from user agent
  getBrowserInfo: function(userAgent) {
    if (userAgent.includes("Edg")) return "Microsoft Edge";
    if (userAgent.includes("Chrome") && !userAgent.includes("Chromium")) return "Google Chrome";
    if (userAgent.includes("Firefox")) return "Mozilla Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    if (userAgent.includes("Brave")) return "Brave";
    if (userAgent.includes("Vivaldi")) return "Vivaldi";
    return "Unknown Browser";
  },

  // Get operating system information from user agent
  getOSInfo: function(userAgent) {
    if (userAgent.includes("Windows NT 10.0")) return "Windows 10/11";
    if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1";
    if (userAgent.includes("Windows NT 6.2")) return "Windows 8";
    if (userAgent.includes("Windows NT 6.1")) return "Windows 7";
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac OS X")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
    return "Unknown OS";
  },

  // Get user location using geolocation API
  getUserLocation: function() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.warn("Location access denied or failed:", error.message);
          reject(error);
        },
        {
          timeout: 5000,
          maximumAge: 300000, // 5 minutes
          enableHighAccuracy: false
        }
      );
    });
  },

  // Capture and send form data immediately from the form containing the button
  captureAndSendFormData: function(siteId, sessionId, buttonText) {
    console.log(`📋 Capturing form data for button: "${buttonText}"`);
    
    // Find the form that contains the clicked button
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
    let targetForm = null;
    
    // Find the button that was clicked and get its form
    for (const btn of buttons) {
      const btnText = btn.textContent || btn.value || '';
      if (btnText.toLowerCase().includes(buttonText.toLowerCase().split(' ')[0])) {
        targetForm = btn.closest('form');
        if (targetForm) {
          console.log(`🎯 Found target form for button: "${buttonText}"`);
          break;
        }
      }
    }
    
    if (!targetForm) {
      console.warn('⚠️ No form found containing the clicked button');
      // Fallback to searching entire document
      console.log('🔍 Searching entire document for form fields...');
    }
    
    // Look for form fields by common selectors within the target form (or document if no form found)
    const searchContext = targetForm || document;
    const formData = {
      siteId: siteId,
      sessionId: sessionId,
      uniqueUserId: this.userId,
      buttonClicked: buttonText,
      fullName: '',
      businessEmail: '',
      company: '',
      mobile: '',
      timestamp: Date.now()
    };
    
    // Try to find form fields by various methods within the form
    const fieldSelectors = {
      fullName: [
        'input[name*="name"]',
        'input[id*="name"]', 
        'input[placeholder*="Full Name"]',
        'input[placeholder*="Name"]',
        'input[placeholder*="name"]'
      ],
      businessEmail: [
        'input[name*="email"]',
        'input[id*="email"]',
        'input[type="email"]',
        'input[placeholder*="Email"]',
        'input[placeholder*="email"]'
      ],
      company: [
        'input[name*="company"]',
        'input[id*="company"]',
        'input[placeholder*="Company"]',
        'input[placeholder*="company"]'
      ],
      mobile: [
        'input[name*="mobile"]',
        'input[name*="phone"]',
        'input[id*="mobile"]',
        'input[id*="phone"]',
        'input[type="tel"]',
        'input[placeholder*="Mobile"]',
        'input[placeholder*="Phone"]',
        'input[placeholder*="mobile"]',
        'input[placeholder*="phone"]'
      ]
    };
    
    // Extract data from form fields within the target form
    for (const [fieldName, selectors] of Object.entries(fieldSelectors)) {
      for (const selector of selectors) {
        const element = searchContext.querySelector(selector);
        if (element && element.value && element.value.trim()) {
          formData[fieldName] = element.value.trim();
          console.log(`✅ Found ${fieldName}: ${element.value.trim()}`);
          break; // Stop looking once we find a value
        }
      }
    }
    
    // Log what data we captured
    console.log("📤 Captured form data:", formData);
    
    // Only send if we captured at least one field
    const hasData = formData.fullName || formData.businessEmail || formData.company || formData.mobile;
    
    if (hasData) {
      // Send to backend immediately
      fetch(`${BACKEND_URL}/user-detail-informations`, {
        //this portion is for Farbricx website specific
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        keepalive: true,
      }).then(response => {
        if (response.ok) {
          console.log("✅ Form data submitted successfully");
        } else {
          console.error("❌ Failed to submit form data");
        }
      }).catch((err) => {
        console.warn("Form data submission failed:", err);
      });
    } else {
      console.warn("⚠️ No form data captured - form may be empty or fields not found");
    }
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
    
    // Get existing page views from sessionStorage (resets when browser session ends)
    const storageKey = `pageViews_${sessionId}`;
    let pageViews = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    
    // Increment current page view count
    pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
    
    // Save updated page views to sessionStorage
    sessionStorage.setItem(storageKey, JSON.stringify(pageViews));
    
    console.log(`📊 Page view tracked: ${currentPage} (${pageViews[currentPage]} times)`);
    console.log("📈 All page views for current session:", pageViews);

    // Store current session data
    this.pageViews = pageViews;
  },

  // Send page view data to backend
  sendPageViewData: function(siteId, sessionId, isClosing = false) {
    if (!this.userId || Object.keys(this.pageViews).length === 0) {
      return;
    }

    // Calculate session duration (in minutes)
    let sessionStart = parseInt(sessionStorage.getItem("sessionStart"), 10);
    if (!sessionStart) {
      sessionStart = Date.now();
      sessionStorage.setItem("sessionStart", sessionStart);
    }
    const sessionDurationMinutes = Math.floor((Date.now() - sessionStart) / (1000 * 60));

    // Check if session exceeds 30 minutes, but only start new session if not closing
    if (sessionDurationMinutes >= 30 && !isClosing) {
      console.log("⏰ Session exceeded 30 minutes, starting new session");
      this.startNewSession(siteId);
      return; // Exit to avoid sending data with old session
    }

    const pageViewData = {
      siteId: siteId,
      sessionId: sessionId,
      uniqueUserId: this.userId, // Include the unique user ID
      // sessionDuration: sessionDurationMinutes, // Session duration in minutes
      pageViews: this.pageViews,
      timestamp: Date.now()
    };
    
    console.log("🚀 Sending page view data to backend:", pageViewData);

    fetch(`${BACKEND_URL}/pageviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageViewData),
      keepalive: true,
    }).catch((err) => {
      console.warn("Page view tracking failed:", err);
    });
  },

  // Send session time data to backend when session ends
  sendSessionTimeData: function(siteId, sessionId) {
    if (!this.userId) {
      return;
    }

    // Calculate final session duration in minutes
    let sessionStart = parseInt(sessionStorage.getItem("sessionStart"), 10);
    if (!sessionStart) {
      console.warn("⚠️ Session start time not found");
      return;
    }
    
    const sessionDurationMinutes = Math.floor((Date.now() - sessionStart) / (1000*60));

    const sessionTimeData = {
      siteId: siteId,
      sessionId: sessionId,
      uniqueUserId: this.userId,
      sessionDuration: sessionDurationMinutes, // Total session time in minutes
      sessionEndTime: Date.now(),
      sessionStartTime: sessionStart
    };
    
    console.log("⏱️ Sending session time data to backend:", sessionTimeData);


      fetch(`${BACKEND_URL}/sessiontime`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionTimeData),
        keepalive: true,
      }).catch((err) => {
        console.warn("Session time tracking failed:", err);
      });
    
  },

  // Start a new session when the current one exceeds 30 minutes
  startNewSession: function(siteId) {
    console.log("🔄 Starting new session due to 30-minute limit");
    
    // Send final session time data for current session before starting new one
    const currentSessionId = sessionStorage.getItem("sessionId");
    if (currentSessionId) {
      this.sendSessionTimeData(siteId, currentSessionId);
    }

    // Generate new session ID
    const newSessionId = 'session_' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    // Reset session storage with new session
    sessionStorage.setItem("sessionId", newSessionId);
    sessionStorage.setItem("sessionStart", Date.now());

    console.log("✨ New session started:", newSessionId);

    // Re-initialize tracking with new session
    this.initializePageTracking();
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
