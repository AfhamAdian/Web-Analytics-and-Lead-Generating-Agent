'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// Define types for rrweb events
interface RRWebEvent {
  type: number;
  data: any;
  timestamp: number;
  id?: number;
}

interface RecorderConfig {
  emit: (event: RRWebEvent) => void;
  checkoutEveryNms?: number;
  maskTextSelector?: string;
}

// Import rrweb dynamically to avoid SSR issues
let record: any = null;

const loadRRWeb = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const rrweb = await import('rrweb');
    record = rrweb.record;
    return rrweb.record;
  } catch (error) {
    console.warn('rrweb not available:', error);
    return null;
  }
};

/**
 * Custom hook for managing session recording with auto-save functionality
 */
export const useSessionRecorder = () => {
  const [events, setEvents] = useState<RRWebEvent[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const stopFn = useRef<(() => void) | null>(null);
  const eventsRef = useRef<RRWebEvent[]>([]);
  const sessionStartTime = useRef<number>(0);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substr(2, 9);
    return `session-${timestamp}-${random}`;
  }, []);

  // Save session to server/local storage
  const saveSession = useCallback(async (sessionEvents: RRWebEvent[], sessionIdToSave: string) => {
    if (sessionEvents.length === 0) return;

    const sessionData = {
      sessionId: sessionIdToSave,
      events: sessionEvents,
      startTime: sessionStartTime.current,
      endTime: Date.now(),
      duration: Date.now() - sessionStartTime.current,
      eventCount: sessionEvents.length,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    try {
      // Try to save to server first
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error('Failed to save to server');
      }

      console.log('Session saved to server:', sessionIdToSave);
    } catch (error) {
      console.warn('Failed to save to server, saving locally:', error);
      
      // Fallback: save to localStorage
      try {
        const existingSessions = JSON.parse(localStorage.getItem('fabricx-sessions') || '[]');
        existingSessions.push(sessionData);
        localStorage.setItem('fabricx-sessions', JSON.stringify(existingSessions));
        console.log('Session saved locally:', sessionIdToSave);
      } catch (localError) {
        console.error('Failed to save session:', localError);
      }
    }
  }, []);

  // Start recording session
  const startRecording = useCallback(async () => {
    if (isRecording || typeof window === 'undefined') return;

    const recordFn = record || await loadRRWeb();
    if (!recordFn) {
      console.error('Failed to load rrweb');
      return;
    }

    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    sessionStartTime.current = Date.now();
    
    eventsRef.current = [];
    setEvents([]);
    
    try {
      const stopFunction = recordFn({
        emit(event: RRWebEvent) {
          eventsRef.current.push(event);
          // Update state less frequently to avoid performance issues
          if (eventsRef.current.length % 20 === 0 || event.type === 2) {
            setEvents([...eventsRef.current]);
          }
        },
        checkoutEveryNms: 30 * 1000, // Take full snapshot every 30 seconds
        // Optional: mask sensitive data
        // maskTextSelector: '.sensitive, input[type="password"]',
      });
      
      stopFn.current = stopFunction;
      
      setIsRecording(true);
      console.log('Session recording started:', newSessionId);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  }, [isRecording, generateSessionId]);

  // Stop recording session
  const stopRecording = useCallback(async () => {
    if (!isRecording || !stopFn.current) return;

    try {
      stopFn.current();
      stopFn.current = null;
      setIsRecording(false);
      
      // Final update with all events
      const finalEvents = [...eventsRef.current];
      setEvents(finalEvents);
      
      console.log('Recording stopped. Events:', finalEvents.length);
      
      // Auto-save session
      if (finalEvents.length > 0 && sessionId) {
        await saveSession(finalEvents, sessionId);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  }, [isRecording, sessionId, saveSession]);

  // Handle page visibility change (when user switches tabs or minimizes)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.hidden && isRecording) {
        // Don't stop recording when tab becomes hidden, just log it
        console.log('Tab became hidden, recording continues...');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRecording]);

  // Handle page unload (when user closes tab or navigates away)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = async () => {
      if (isRecording && eventsRef.current.length > 0 && sessionId) {
        // Use sendBeacon for reliable data sending during page unload
        const sessionData = {
          sessionId,
          events: eventsRef.current,
          startTime: sessionStartTime.current,
          endTime: Date.now(),
          duration: Date.now() - sessionStartTime.current,
          eventCount: eventsRef.current.length,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        };

        try {
          // Try using sendBeacon for better reliability
          const success = navigator.sendBeacon('/api/sessions', JSON.stringify(sessionData));
          if (!success) {
            // Fallback to localStorage
            const existingSessions = JSON.parse(localStorage.getItem('fabricx-sessions') || '[]');
            existingSessions.push(sessionData);
            localStorage.setItem('fabricx-sessions', JSON.stringify(existingSessions));
          }
        } catch (error) {
          console.error('Failed to save session on unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRecording, sessionId]);

  // Auto-cleanup on component unmount
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
    sessionId,
    startRecording,
    stopRecording,
    saveSession,
    eventCount: events.length
  };
};
