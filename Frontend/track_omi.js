(function () {
  try {
    // Get site ID from script tag - this must match the database site_id
    const scriptTag = document.currentScript;
    const siteId = scriptTag?.getAttribute("site-id");

    // Validate site ID exists
    if (!siteId) {
      console.error("❌ Analytics Error: Invalid or missing data-site-id attribute");
      return;
    }

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
})();





