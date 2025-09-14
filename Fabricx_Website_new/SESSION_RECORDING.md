# Session Recording Documentation

## Overview
This implementation adds comprehensive session recording to the Fabricx website using rrweb. Sessions are automatically recorded when users interact with buttons and saved as JSON files when sessions end.

## Features

### 🎬 Button-Triggered Session Recording
- **Click-to-start**: Recording begins only when a user clicks any button, link, or clickable element
- **Button click detection**: Any button, link, or clickable element triggers recording start
- **Inactivity timeout**: Sessions automatically stop after 10 minutes of inactivity

### 💾 Auto-save Functionality
- **Page unload detection**: Sessions are saved when users close the tab or navigate away
- **Server-side storage**: JSON files are saved to the `sessions/` folder
- **Fallback to localStorage**: If server save fails, data is stored locally
- **Reliable data transmission**: Uses `sendBeacon` API for better reliability during page unload

### 📊 Session Data Structure
Each saved session includes:
```json
{
  "sessionId": "session-2025-09-15T10-30-00-000Z-abc123def",
  "events": [...], // rrweb events array
  "startTime": 1726398600000,
  "endTime": 1726398900000,
  "duration": 300000,
  "eventCount": 1250,
  "userAgent": "Mozilla/5.0...",
  "url": "https://fabricx.ai/",
  "timestamp": "2025-09-15T10:30:00.000Z",
  "savedAt": "2025-09-15T10:35:00.000Z",
  "ip": "192.168.1.1"
}
```

## File Structure

```
Fabricx_Website_new/
├── app/
│   ├── api/
│   │   └── sessions/
│   │       └── route.ts          # API endpoint for saving/retrieving sessions
│   └── layout.tsx                # Root layout with session tracking
├── components/
│   ├── SessionManager.tsx        # Main session recording component
│   └── ButtonClickTracker.tsx    # Enhanced click tracking
├── lib/
│   └── useSessionRecorder.ts     # Custom hook for session recording
└── sessions/                     # Saved session JSON files
    ├── session-2025-09-15T10-30-00-000Z-abc123def.json
    └── session-2025-09-15T10-35-00-000Z-def456ghi.json
```

## Components

### SessionManager
- Handles automatic recording start/stop
- Manages inactivity detection
- Auto-saves sessions on page unload
- Shows debug info in development mode

### ButtonClickTracker
- Enhances all clickable elements with tracking attributes
- Provides detailed click analytics
- Works with dynamically added elements

### useSessionRecorder Hook
- Core recording functionality using rrweb
- Event collection and management
- Auto-save capabilities
- Session metadata handling

## API Endpoints

### POST /api/sessions
Saves a session recording
```javascript
fetch('/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(sessionData)
});
```

### GET /api/sessions
Lists all saved sessions (without event data for performance)
```javascript
fetch('/api/sessions')
  .then(res => res.json())
  .then(sessions => console.log(sessions));
```

## Usage

The session recording is automatically enabled when you include the components in your layout. No additional setup required!

### Debug Mode
In development, you'll see a debug overlay showing:
- Recording status (🔴 = recording, ⏹️ = stopped)
- Current session ID
- Number of events captured
- Time since last activity

### Configuration Options
```tsx
<SessionManager 
  autoStart={false}             // Don't start recording automatically (click-to-start)
  trackButtonClicks={true}      // Track button clicks and start recording
  debugMode={true}              // Show debug overlay
/>
```

## Session File Location
All session recordings are saved in:
```
/sessions/session-[timestamp]-[randomId].json
```

## Privacy & Performance
- **No sensitive data**: Text inputs can be masked using rrweb's built-in masking
- **Efficient recording**: Events are batched and state updates are throttled
- **Automatic cleanup**: Sessions stop after inactivity to prevent excessive data collection
- **Fallback storage**: Uses localStorage if server storage fails

## Troubleshooting

### Common Issues
1. **Sessions not saving**: Check if the `sessions/` directory has write permissions
2. **Recording not starting**: Ensure rrweb packages are installed correctly
3. **Debug overlay not showing**: Verify `NODE_ENV` is set to 'development'

### Checking Session Files
```bash
# List all session files
ls -la sessions/

# View session summary
jq '.sessionId, .eventCount, .duration, .url' sessions/session-*.json
```

### Manual Session Analysis
Session files can be used with rrweb-player for manual playback:
```javascript
import rrwebPlayer from 'rrweb-player';

// Load session data
const sessionData = await fetch('/api/sessions/session-id').then(r => r.json());

// Create player
new rrwebPlayer({
  target: document.getElementById('player'),
  props: {
    events: sessionData.events,
    width: 1024,
    height: 768
  }
});
```

## Next Steps
- Set up automated session analysis
- Implement session replay dashboard
- Add user journey analytics
- Create heatmap generation from session data
