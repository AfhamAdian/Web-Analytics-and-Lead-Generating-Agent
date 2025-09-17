'use client';

import { useEffect, useRef, useState } from 'react';
import { useSessionRecorder } from '@/lib/useSessionRecorder';

interface SessionManagerProps {
  autoStart?: boolean;
  trackButtonClicks?: boolean;
  debugMode?: boolean;
}

/**
 * Session Manager Component
 * Handles automatic session recording and tracking
 * Starts recording after 2 button clicks OR 70% scroll depth
 */
const SessionManager = ({ 
  autoStart = true, 
  trackButtonClicks = true,
  debugMode = false 
}: SessionManagerProps) => {
  const { 
    isRecording, 
    sessionId, 
    startRecording, 
    stopRecording, 
    saveSession,
    eventCount,
    events
  } = useSessionRecorder();
  
  const hasStartedRef = useRef(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  
  // Tracking engagement metrics
  const buttonClickCount = useRef(0);
  const maxScrollDepth = useRef(0);
  const hasReachedScrollThreshold = useRef(false);
  
  // Recording timer state
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveCountdownRef = useRef<number>(15);

  // Handle client-side mounting
  useEffect(() => {
    // Component initialized
  }, []);

  // Debug logging function
  const debugLog = (message: string, ...args: any[]) => {
    if (debugMode) {
      console.log(`[SessionManager] ${message}`, ...args);
    }
  };

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    lastActivityRef.current = Date.now();
    
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Stop recording after 10 minutes of inactivity
    inactivityTimerRef.current = setTimeout(() => {
      if (isRecording) {
        console.log('⏰ Stopping recording due to 10 minutes of inactivity');
        debugLog('Stopping recording due to inactivity');
        stopRecording();
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    // Note: DO NOT clear autoSaveTimerRef here - it's separate from inactivity
  };

  // 15 s timer 79-125
  // Start auto-save timer when recording begins
  const startAutoSaveTimer = () => {
    // Clear any existing timer first
    if (autoSaveTimerRef.current) {
      console.log('🔄 Clearing existing auto-save timer before starting new one');
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    console.log('🕐 Starting 15-second auto-save timer...');
    
    // Auto-save and stop recording after 15 seconds
    const timerId = setTimeout(async () => {
      console.log('⏰ 15 seconds elapsed - triggering auto-save');
      
      // Clear the timer reference since it's about to execute
      autoSaveTimerRef.current = null;
      
      if (isRecording && sessionId && events.length > 0) {
        debugLog('🕐 Auto-saving and stopping recording after 15 seconds');
        console.log('💾 Auto-save: Saving session with', events.length, 'events');
        
        try {
          // Save the session first
          await saveSession(events, sessionId);
          console.log('✅ Auto-save completed successfully');
          
          // Then stop recording
          await stopRecording();
        } catch (error) {
          console.error('❌ Auto-save failed:', error);
          // Still try to stop recording even if save fails
          await stopRecording();
        }
      } else {
        console.warn('❌ Auto-save skipped - no recording, sessionId, or events', {
          isRecording,
          sessionId: sessionId ? 'exists' : 'missing',
          eventCount: events.length
        });
      }
    }, 15 * 1000); // 15 seconds
    // 15 seconds
    autoSaveTimerRef.current = timerId;
    console.log('✅ Auto-save timer set with ID:', timerId);
  };

  // Check if we should start recording based on engagement criteria
  const checkEngagementThreshold = async () => {
    if (hasStartedRef.current || isRecording) return;

    const shouldStart = buttonClickCount.current >= 2 || hasReachedScrollThreshold.current;
    
    if (shouldStart) {
      console.log('🎬 Screen recording started after 2 button clicks!');
      debugLog(`🎬 Starting session recording! Criteria met - Clicks: ${buttonClickCount.current}, Scroll threshold reached: ${hasReachedScrollThreshold.current}`);
      await startRecording();
      hasStartedRef.current = true;
      resetInactivityTimer();
      // Note: startAutoSaveTimer() is now called automatically via useEffect when isRecording becomes true
    }
  };

  // Calculate scroll depth percentage
  const calculateScrollDepth = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
    return Math.min(scrollDepth, 100);
  };

  // Handle button clicks across the site
  useEffect(() => {
    if (!trackButtonClicks || typeof window === 'undefined') return;

    const handleClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if clicked element is a button or has button-like behavior
      const isButton = target.tagName === 'BUTTON' || 
                      target.tagName === 'A' ||
                      target.getAttribute('role') === 'button' ||
                      target.classList.contains('btn') ||
                      target.classList.contains('button') ||
                      target.closest('button') !== null ||
                      target.closest('a') !== null;

      if (isButton) {
        buttonClickCount.current += 1;
        debugLog(`Button clicked (${buttonClickCount.current}/2):`, target.textContent?.trim() || target.tagName);
        
        // Check if we should start recording
        await checkEngagementThreshold();
        
        // Reset inactivity timer if already recording
        if (isRecording) {
          resetInactivityTimer();
        }
      }
    };

    // Add click listener to document with high priority
    document.addEventListener('click', handleClick, { capture: true });
    
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [isRecording, startRecording, trackButtonClicks, debugMode]);

  // Handle scroll tracking and user activity
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = async () => {
      const currentScrollDepth = calculateScrollDepth();
      
      if (currentScrollDepth > maxScrollDepth.current) {
        maxScrollDepth.current = currentScrollDepth;
        
        // Check if 70% scroll threshold is reached
        if (currentScrollDepth >= 70 && !hasReachedScrollThreshold.current) {
          hasReachedScrollThreshold.current = true;
          debugLog(`📜 70% scroll depth reached! (${currentScrollDepth}%)`);
          
          // Check if we should start recording
          await checkEngagementThreshold();
        }
      }
      
      // Reset inactivity timer if recording
      if (isRecording) {
        resetInactivityTimer();
      }
    };

    const handleActivity = () => {
      if (isRecording) {
        resetInactivityTimer();
      }
    };

    // Add scroll listener
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add other activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      document.removeEventListener('scroll', handleScroll);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      // Clean up inactivity timer but NOT auto-save timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      // NOTE: Removed auto-save timer cleanup from here to prevent interference
      // The auto-save timer should only be cleared when recording stops or component unmounts
    };
  }, [isRecording]);

  // Auto-start recording on component mount (disabled - only start on engagement)
  useEffect(() => {
    // Recording will only start when engagement criteria are met:
    // - 2 button clicks OR 70% scroll depth
    debugLog('SessionManager initialized - waiting for user engagement to start recording');
  }, [debugMode]);

  // Initialize inactivity timer when recording starts
  useEffect(() => {
    if (isRecording) {
      resetInactivityTimer();
      // Note: Auto-save timer is now handled by dedicated useEffect
    }
  }, [isRecording]);

  // Recording timer effect
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      autoSaveCountdownRef.current = 15;
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          autoSaveCountdownRef.current = Math.max(0, 15 - newTime);
          
          // Log countdown every 5 seconds for debugging
          if (newTime % 5 === 0 && newTime <= 15) {
            console.log(`⏱️ Auto-save countdown: ${15 - newTime} seconds remaining`);
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
      autoSaveCountdownRef.current = 15;
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    };
  }, [isRecording]);

  // Dedicated auto-save timer effect
  useEffect(() => {
    if (isRecording) {
      // Start the auto-save timer when recording begins
      if (!autoSaveTimerRef.current) {
        console.log('🎯 Starting dedicated auto-save timer for recording session');
        startAutoSaveTimer();
      }
    } else {
      // Clear the auto-save timer when recording stops
      if (autoSaveTimerRef.current) {
        console.log('🛑 Recording stopped - clearing auto-save timer');
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    }

    return () => {
      // Cleanup only when effect is destroyed (not on every re-run)
      if (!isRecording && autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [isRecording]);

  // Monitor auto-save timer state for debugging
  useEffect(() => {
    if (!isRecording) return;
    
    const checkTimer = () => {
      if (isRecording && !autoSaveTimerRef.current) {
        console.warn('⚠️ Recording is active but auto-save timer is missing! Restarting timer...');
        startAutoSaveTimer();
      }
    };

    const interval = setInterval(checkTimer, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [isRecording]);

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        console.log('🧹 Cleanup: Cleared inactivity timer');
      }
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        console.log('🧹 Cleanup: Cleared auto-save timer');
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        console.log('🧹 Cleanup: Cleared recording timer');
      }
    };
  }, []);

  // Manual save function
  const handleManualSave = async () => {
    if (isRecording && sessionId && events.length > 0) {
      debugLog('💾 Manual save triggered by user');
      console.log('💾 Manual save: Saving session with', events.length, 'events');
      await saveSession(events, sessionId);
      console.log('✅ Manual save completed successfully');
    }
  };

  console.log("this is it " + process.env.NEXT_PUBLIC_MODE);
  if(process.env.NEXT_PUBLIC_MODE === 'production') {
    return null; // Disable UI in production
  } else {
  // BANNER UI (disabled for now)
  // Render recording banner and controls
    return (
      <>
        {/* Recording Status Banner */}
        {(isRecording || debugMode) && (
          <div className={`fixed top-0 left-0 right-0 z-50 ${
            isRecording 
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200 shadow-md'
          } px-4 py-2`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isRecording ? 'bg-white animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="font-semibold">
                    {isRecording ? '🎬 Recording Session' : '⏹️ Recording Stopped'}
                  </span>
                </div>
                
                {sessionId && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs opacity-60">ID:</span>
                    <span className="text-sm font-mono bg-black/20 px-2 py-1 rounded">
                      {sessionId.slice(-8)}
                    </span>
                  </div>
                )}
                
                {isRecording && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs opacity-60">Events:</span>
                    <span className="text-sm font-bold bg-black/20 px-2 py-1 rounded">
                      {eventCount}
                    </span>
                  </div>
                )}
                
                {isRecording && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs opacity-60">Duration:</span>
                    <span className="text-sm font-mono bg-black/20 px-2 py-1 rounded">
                      {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
                
                {isRecording && (
                  <div className="text-xs opacity-80 bg-black/20 px-2 py-1 rounded">
                    Auto-save in {Math.max(0, 15 - recordingTime)}s
                  </div>
                )}
              </div>
              
              {/* Control Buttons */}
              {isRecording && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleManualSave}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    💾 Save Now
                  </button>
                  <button
                    onClick={stopRecording}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    ⏹️ Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Push content down when banner is visible */}
        {(isRecording || debugMode) && (
          <div className="h-12"></div>
        )}
      </>
    );
  }

};

export default SessionManager;
