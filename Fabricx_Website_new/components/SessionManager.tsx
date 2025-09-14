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
    eventCount 
  } = useSessionRecorder();
  
  const [isMounted, setIsMounted] = useState(false);
  const hasStartedRef = useRef(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

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
        debugLog('Button clicked:', target.textContent?.trim() || target.tagName);
        
        // Start recording if not already recording
        if (!isRecording && !hasStartedRef.current) {
          debugLog('🎬 Starting session recording on button click!');
          await startRecording();
          hasStartedRef.current = true;
          resetInactivityTimer();
        } else if (isRecording) {
          // Reset inactivity timer if already recording
          resetInactivityTimer();
          debugLog('Session recording already active, resetting inactivity timer');
        }
      }
    };

    // Add click listener to document with high priority
    document.addEventListener('click', handleClick, { capture: true });
    
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [isRecording, startRecording, trackButtonClicks, debugMode]);

  // Handle user activity to reset inactivity timer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      if (isRecording) {
        resetInactivityTimer();
      }
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isRecording]);

  // Auto-start recording on component mount (disabled - only start on button click)
  useEffect(() => {
    // Commenting out auto-start functionality
    // Recording will only start when a button is clicked
    debugLog('SessionManager initialized - waiting for button click to start recording');
  }, [debugMode]);

  // Initialize inactivity timer when recording starts
  useEffect(() => {
    if (isRecording) {
      resetInactivityTimer();
    }
  }, [isRecording]);

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
        <div>Recording: {isRecording ? '🔴 ACTIVE' : hasStartedRef.current ? '⏹️ STOPPED' : '⏳ WAITING FOR CLICK'}</div>
        <div>Session ID: {sessionId || 'None'}</div>
        <div>Events: {eventCount}</div>
        <div>Last Activity: {Math.round((Date.now() - lastActivityRef.current) / 1000)}s ago</div>
        {!isRecording && !hasStartedRef.current && (
          <div style={{ color: '#fbbf24', marginTop: '4px' }}>👆 Click any button to start recording</div>
        )}
      </div>
    );
  }

  // Invisible component in production
  return null;
};

export default SessionManager;
