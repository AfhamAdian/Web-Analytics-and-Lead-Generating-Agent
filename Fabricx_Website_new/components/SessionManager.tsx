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
    eventCount,
    manualSave
  } = useSessionRecorder();
  
  const [isMounted, setIsMounted] = useState(false);
  const hasStartedRef = useRef(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  
  // Tracking engagement metrics
  const buttonClickCount = useRef(0);
  const maxScrollDepth = useRef(0);
  const hasReachedScrollThreshold = useRef(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
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
        debugLog('Stopping recording due to inactivity');
        stopRecording();
      }
    }, 10 * 60 * 1000); // 10 minutes
  };

  // Start auto-save timer when recording begins
  const startAutoSaveTimer = () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Auto-save and stop recording after 120 seconds
    autoSaveTimerRef.current = setTimeout(async () => {
      if (isRecording && sessionId) {
        debugLog('🕐 Auto-saving and stopping recording after 120 seconds');
        await stopRecording(); // This will automatically save the session
      }
    }, 120 * 1000); // 120 seconds
  };

  // Check if we should start recording based on engagement criteria
  const checkEngagementThreshold = async () => {
    if (hasStartedRef.current || isRecording) return;

    const shouldStart = buttonClickCount.current >= 2 || hasReachedScrollThreshold.current;
    
    if (shouldStart) {
      debugLog(`🎬 Starting session recording! Criteria met - Clicks: ${buttonClickCount.current}, Scroll threshold reached: ${hasReachedScrollThreshold.current}`);
      await startRecording();
      hasStartedRef.current = true;
      resetInactivityTimer();
      startAutoSaveTimer(); // Start the 120s timer
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
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
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
    }
  }, [isRecording]);

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Debug info display (only in development and after mounting)
  if (debugMode && isMounted) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 50,
        minWidth: '250px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#60a5fa' }}>
          📊 Session Recording Debug
        </div>
        <div>Recording: {isRecording ? '🔴 ACTIVE' : hasStartedRef.current ? '⏹️ STOPPED' : '⏳ WAITING FOR ENGAGEMENT'}</div>
        <div>Session ID: {sessionId || 'None'}</div>
        <div>Events Captured: {eventCount}</div>
        <div>Button Clicks: {buttonClickCount.current}/2</div>
        <div>Max Scroll Depth: {maxScrollDepth.current}% (need 70%)</div>
        <div>Last Activity: {Math.round((Date.now() - lastActivityRef.current) / 1000)}s ago</div>
        {!isRecording && !hasStartedRef.current && (
          <div style={{ color: '#fbbf24', marginTop: '4px', fontSize: '11px' }}>
            🎯 Waiting for: 2 button clicks OR 70% scroll depth
          </div>
        )}
        {isRecording && (
          <>
            <div style={{ color: '#10b981', marginTop: '4px', fontSize: '11px' }}>
              🕐 Auto-save: after 120s or on tab close
            </div>
            <div style={{ marginTop: '8px' }}>
              <button
                onClick={manualSave}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                💾 Manual Save
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Invisible component in production
  return null;
};

export default SessionManager;
