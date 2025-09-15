================================================
FILE: src/App.js
================================================
import React, { useState } from 'react';
import { useSessionRecorder } from './hooks/useSessionRecorder';
import RecordingControls from './components/RecordingControls';
import SessionPlayer from './components/SessionPlayer';
import DemoArea from './components/DemoArea';
import SessionManager from './components/SessionManager';
import StatusDisplay from './components/StatusDisplay';
import Instructions from './components/Instructions';
import './App.css';

// Import rrweb-player CSS
import 'rrweb-player/dist/style.css';

/**
 * Main App Component
 * Orchestrates all session recording functionality
 */
function App() {
  const { 
    events, 
    isRecording, 
    startRecording, 
    stopRecording,
    clearEvents,
    loadEvents 
  } = useSessionRecorder();
  
  const [showPlayer, setShowPlayer] = useState(false);

  const handleLoadEvents = (loadedEvents) => {
    loadEvents(loadedEvents);
    // Automatically show player when events are loaded
    if (loadedEvents && loadedEvents.length > 0) {
      setShowPlayer(true);
    }
  };

  const togglePlayer = () => {
    setShowPlayer(!showPlayer);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🎬 rrweb Session Recording Demo
        </h1>
        
        {/* Recording Controls */}
        <RecordingControls
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          eventsCount={events.length}
        />
        
        {/* Session Management */}
        <SessionManager
          events={events}
          onLoadEvents={handleLoadEvents}
        />
        
        {/* Player Toggle */}
        <div className="mb-6">
          <button
            onClick={togglePlayer}
            disabled={events.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              events.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showPlayer ? '👁️ Hide Player' : '👀 Show Player'}
          </button>
        </div>

        {/* Status Display */}
        <StatusDisplay
          eventsCount={events.length}
          isRecording={isRecording}
        />

        {/* Demo Area */}
        <DemoArea />

        {/* Session Player */}
        <SessionPlayer
          events={events}
          isVisible={showPlayer}
        />

        {/* Instructions */}
        <Instructions />
      </div>
    </div>
  );
}

export default App;



================================================
FILE: src/index.js
================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



================================================
FILE: src/components/DemoArea.jsx
================================================
import React, { useState } from 'react';

/**
 * Interactive demo area for testing recording
 * Contains various UI elements to interact with
 */
const DemoArea = () => {
  const [clickCount, setClickCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('');

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Demo Area - Interact to Record</h2>
      
      <div className="space-y-4">
        {/* Click Counter */}
        <button
          onClick={() => setClickCount(prev => prev + 1)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Click Me! ({clickCount} clicks)
        </button>
        
        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Type something here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
        
        {/* Textarea */}
        <textarea
          placeholder="Write some text here..."
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Checkbox and Radio */}
        <div className="flex items-center space-x-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
              className="mr-2"
            />
            Checkbox option
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="demo-radio"
              value="radio1"
              checked={radioValue === 'radio1'}
              onChange={(e) => setRadioValue(e.target.value)}
              className="mr-2"
            />
            Radio option 1
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="demo-radio"
              value="radio2"
              checked={radioValue === 'radio2'}
              onChange={(e) => setRadioValue(e.target.value)}
              className="mr-2"
            />
            Radio option 2
          </label>
        </div>
      </div>
    </div>
  );
};

export default DemoArea;



================================================
FILE: src/components/Instructions.jsx
================================================
import React from 'react';

/**
 * Instructions component
 * Displays usage instructions to users
 */
const Instructions = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
      <h3 className="font-semibold text-yellow-800 mb-2">📋 How to Use:</h3>
      <ol className="list-decimal list-inside text-yellow-700 space-y-1">
        <li>Click "Start Recording" to begin capturing interactions</li>
        <li>Interact with the demo elements (click, type, select, etc.)</li>
        <li>Click "Stop Recording" when finished</li>
        <li>Click "Show Player" to replay the session</li>
        <li>Use "Download Session" to save the recording as JSON</li>
        <li>Use "Load Session" to replay a previously saved session</li>
      </ol>
    </div>
  );
};

export default Instructions;



================================================
FILE: src/components/RecordingControls.jsx
================================================
import React from 'react';

/**
 * Recording control buttons component
 * Handles start/stop recording actions
 */
const RecordingControls = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  eventsCount 
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        onClick={onStartRecording}
        disabled={isRecording}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isRecording 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {isRecording ? '🔴 Recording...' : '▶️ Start Recording'}
      </button>
      
      <button
        onClick={onStopRecording}
        disabled={!isRecording}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          !isRecording 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        ⏹️ Stop Recording
      </button>

      <div className="flex items-center px-4 py-2 bg-blue-100 rounded-lg">
        <span className="text-blue-800 font-medium">
          Events: {eventsCount}
        </span>
      </div>
    </div>
  );
};

export default RecordingControls;



================================================
FILE: src/components/SessionManager.jsx
================================================
import React from 'react';

/**
 * Session management component
 * Handles save/load session functionality
 */
const SessionManager = ({ events, onLoadEvents }) => {
  const downloadSession = () => {
    if (events.length === 0) return;
    
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `session-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const loadSessionFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedEvents = JSON.parse(e.target.result);
        
        // Validate that it's a proper rrweb events array
        if (!Array.isArray(loadedEvents)) {
          throw new Error('Invalid format: expected an array of events');
        }
        
        if (loadedEvents.length === 0) {
          alert('The session file is empty (no events found)');
          return;
        }
        
        // Basic validation of event structure
        const hasValidEvents = loadedEvents.some(event => 
          event && typeof event === 'object' && 
          'type' in event && 'timestamp' in event
        );
        
        if (!hasValidEvents) {
          throw new Error('Invalid format: events do not have required properties');
        }
        
        onLoadEvents(loadedEvents);
        alert(`Session loaded successfully! ${loadedEvents.length} events ready for playback.`);
        console.log('Session loaded:', loadedEvents.length, 'events');
      } catch (error) {
        console.error('Error loading session:', error);
        alert(`Failed to load session file: ${error.message}`);
      }
    };
    reader.readAsText(file);
    
    // Clear file input
    event.target.value = '';
  };

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={downloadSession}
        disabled={events.length === 0}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          events.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        💾 Download Session
      </button>
      
      <label className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 cursor-pointer transition-colors">
        📁 Load Session
        <input
          type="file"
          accept=".json"
          onChange={loadSessionFromFile}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default SessionManager;



================================================
FILE: src/components/SessionPlayer.jsx
================================================
import React, { useRef, useEffect, useState } from 'react';

/**
 * Session replay player component
 * Renders the rrweb player for session playback
 */
const SessionPlayer = ({ events, isVisible }) => {
  const playerRef = useRef(null);
  const [playerInstance, setPlayerInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1);

  useEffect(() => {
    if (isVisible && events.length > 0 && playerRef.current) {
      // Clear previous player
      playerRef.current.innerHTML = '';
      
      try {
        // Import rrweb-player dynamically
        import('rrweb-player').then((rrwebPlayerModule) => {
          const rrwebPlayer = rrwebPlayerModule.default;
          
          const player = new rrwebPlayer({
            target: playerRef.current,
            props: {
              events,
              width: 800,
              height: 600,
              autoPlay: false,
              speedOption: [0.5, 1, 2, 4, 8],
              showController: true,
              tags: {
                'user-click': 'Click',
                'user-input': 'Input',
              },
            },
          });
          
          setPlayerInstance(player);
          
          // Listen to player events
          player.addEventListener('ui-update-current-time', (event) => {
            // Handle time updates if needed
          });
          
          player.addEventListener('ui-update-player-state', (event) => {
            setIsPlaying(event.payload === 'playing');
          });
          
        }).catch((error) => {
          console.error('Failed to load rrweb-player:', error);
          // Fallback to demo placeholder
          playerRef.current.innerHTML = `
            <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; border: 2px dashed #ccc;">
              <h3>Session Player</h3>
              <p>Ready to replay ${events.length} events</p>
              <p style="color: #666;"><small>rrweb-player not available. Events are recorded but playback requires rrweb-player.</small></p>
              <div style="margin-top: 15px;">
                <button style="padding: 8px 16px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  ▶️ Play (Demo)
                </button>
                <button style="padding: 8px 16px; margin: 5px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  ⏸️ Pause (Demo)
                </button>
              </div>
            </div>
          `;
        });
        
      } catch (error) {
        console.error('Error initializing player:', error);
        // Fallback UI
        playerRef.current.innerHTML = `
          <div style="background: #f8d7da; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #f5c6cb;">
            <h3>Playback Error</h3>
            <p>Unable to initialize session player</p>
            <p style="color: #721c24;"><small>Error: ${error.message}</small></p>
          </div>
        `;
      }
    }
    
    // Cleanup function
    return () => {
      if (playerInstance) {
        try {
          playerInstance.destroy();
        } catch (error) {
          console.warn('Error destroying player:', error);
        }
        setPlayerInstance(null);
      }
    };
  }, [isVisible, events]);

  const handlePlay = () => {
    if (playerInstance) {
      playerInstance.play();
    }
  };

  const handlePause = () => {
    if (playerInstance) {
      playerInstance.pause();
    }
  };

  const handleSpeedChange = (speed) => {
    if (playerInstance) {
      playerInstance.setSpeed(speed);
      setCurrentSpeed(speed);
    }
  };

  const handleRestart = () => {
    if (playerInstance) {
      playerInstance.goto(0);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Session Replay</h2>
        <div className="text-sm text-gray-300">
          {events.length} events recorded
        </div>
      </div>
      
      {/* Custom Playback Controls */}
      {events.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-800 rounded-lg">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isPlaying 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            ▶️ Play
          </button>
          
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              !isPlaying 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            ⏸️ Pause
          </button>
          
          <button
            onClick={handleRestart}
            className="px-3 py-1 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            ⏮️ Restart
          </button>
          
          <div className="flex items-center gap-2 ml-4">
            <span className="text-white text-sm">Speed:</span>
            {[0.5, 1, 2, 4, 8].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  currentSpeed === speed
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div
        ref={playerRef}
        className="bg-white rounded-lg min-h-[400px] flex items-center justify-center"
      />
      
      {events.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p>No recorded session to replay.</p>
          <p className="text-sm">Start recording to capture session events.</p>
        </div>
      )}
    </div>
  );
};

export default SessionPlayer;



================================================
FILE: src/components/StatusDisplay.jsx
================================================
import React from 'react';

/**
 * Status display component
 * Shows current recording status and statistics
 */
const StatusDisplay = ({ eventsCount, isRecording }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-center">Session Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600">{eventsCount}</div>
          <div className="text-sm text-gray-600">Events Recorded</div>
        </div>
        <div>
          <div className={`text-2xl font-bold ${isRecording ? 'text-red-600' : 'text-gray-400'}`}>
            {isRecording ? '🔴 RECORDING' : '⏹️ STOPPED'}
          </div>
          <div className="text-sm text-gray-600">Status</div>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;



================================================
FILE: src/hooks/useSessionRecorder.js
================================================
import { useState, useRef, useEffect } from 'react';

// Import rrweb
let record = null;
try {
  // Use dynamic import for better error handling
  const rrweb = require('rrweb');
  record = rrweb.record;
} catch (error) {
  console.warn('rrweb not available:', error);
  // Fallback for demo purposes
  record = (config) => {
    console.log('Demo mode: rrweb not available');
    // Create a mock recording that generates some demo events
    let eventCount = 0;
    const interval = setInterval(() => {
      config.emit({
        type: 3, // Mutation event
        data: { source: 0, texts: [], attributes: [], removes: [], adds: [] },
        timestamp: Date.now(),
        id: eventCount++
      });
      if (eventCount > 50) clearInterval(interval); // Stop after 50 events
    }, 100);
    
    return () => clearInterval(interval); // Return stop function
  };
}

/**
 * Custom hook for managing session recording
 * Handles start/stop recording and event storage
 */
export const useSessionRecorder = () => {
  const [events, setEvents] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const stopFn = useRef(null);
  const eventsRef = useRef([]);

  const startRecording = () => {
    if (isRecording) return; // Prevent multiple recordings
    
    eventsRef.current = []; // Clear previous events
    setEvents([]);
    
    try {
      // Start rrweb recording
      stopFn.current = record({
        emit(event) {
          eventsRef.current.push(event);
          // Update state less frequently to avoid performance issues
          if (eventsRef.current.length % 10 === 0 || event.type === 2) {
            // Update UI every 10 events or on full snapshots
            setEvents([...eventsRef.current]);
          }
        },
        // Optional: Add configuration here
        checkoutEveryNms: 10 * 1000, // Take full snapshot every 10 seconds
        // maskTextSelector: '.sensitive',
      });
      
      setIsRecording(true);
      console.log('Recording started...');
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording: ' + error.message);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (stopFn.current && isRecording) {
      try {
        stopFn.current();
        stopFn.current = null;
        setIsRecording(false);
        // Final update with all events
        setEvents([...eventsRef.current]);
        console.log('Recording stopped. Events:', eventsRef.current.length);
      } catch (error) {
        console.error('Failed to stop recording:', error);
        setIsRecording(false);
      }
    }
  };

  const clearEvents = () => {
    eventsRef.current = [];
    setEvents([]);
  };

  const loadEvents = (loadedEvents) => {
    if (Array.isArray(loadedEvents) && loadedEvents.length > 0) {
      eventsRef.current = loadedEvents;
      setEvents(loadedEvents);
      console.log('Events loaded successfully:', loadedEvents.length, 'events');
    } else {
      console.error('Invalid events format');
    }
  };

  // Cleanup effect to stop recording when component unmounts
  useEffect(() => {
    return () => {
      if (stopFn.current && isRecording) {
        stopFn.current();
      }
    };
  }, [isRecording]);

  return {
    events,
    isRecording,
    startRecording,
    stopRecording,
    clearEvents,
    loadEvents
  };
};
