'use client';

import { useEffect } from 'react';

/**
 * Enhanced Button Click Tracker
 * Adds additional tracking attributes to buttons and clickable elements
 */
const ButtonClickTracker = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to add tracking attributes to clickable elements
    const enhanceClickableElements = () => {
      const selectors = [
        'button',
        'a[href]',
        '[role="button"]',
        '.btn',
        '.button',
        '[onclick]',
        'input[type="button"]',
        'input[type="submit"]',
        '[data-track-click]'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
          if (!element.hasAttribute('data-tracked')) {
            // Add tracking attributes
            element.setAttribute('data-tracked', 'true');
            element.setAttribute('data-element-type', element.tagName.toLowerCase());
            element.setAttribute('data-element-index', index.toString());
            
            // Add text content for identification
            const textContent = element.textContent?.trim() || element.getAttribute('aria-label') || '';
            if (textContent) {
              element.setAttribute('data-element-text', textContent.substring(0, 50));
            }

            // Add class information
            if (element.className) {
              element.setAttribute('data-element-classes', element.className);
            }

            // Add href for links
            if (element.tagName === 'A' && element.hasAttribute('href')) {
              element.setAttribute('data-element-href', element.getAttribute('href') || '');
            }
          }
        });
      });
    };

    // Enhance elements on initial load
    enhanceClickableElements();

    // Set up mutation observer to track dynamically added elements
    const observer = new MutationObserver((mutations) => {
      let shouldReenhance = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              shouldReenhance = true;
            }
          });
        }
      });

      if (shouldReenhance) {
        // Debounce the enhancement to avoid excessive calls
        setTimeout(enhanceClickableElements, 100);
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Enhanced click tracking with more detailed event information
    const handleEnhancedClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if it's a trackable element
      if (target.hasAttribute('data-tracked')) {
        const clickData = {
          timestamp: Date.now(),
          elementType: target.getAttribute('data-element-type'),
          elementText: target.getAttribute('data-element-text'),
          elementClasses: target.getAttribute('data-element-classes'),
          elementHref: target.getAttribute('data-element-href'),
          elementIndex: target.getAttribute('data-element-index'),
          mouseX: event.clientX,
          mouseY: event.clientY,
          screenX: event.screenX,
          screenY: event.screenY,
          pageX: event.pageX,
          pageY: event.pageY,
          url: window.location.href,
          userAgent: navigator.userAgent
        };

        // Store click data for potential analysis
        console.log('[ButtonClickTracker] Enhanced click data:', clickData);
        
        // Optionally send to analytics endpoint
        try {
          // You could send this to your analytics service
          window.dispatchEvent(new CustomEvent('fabricx-click-tracked', { 
            detail: clickData 
          }));
        } catch (error) {
          console.warn('Error dispatching click event:', error);
        }
      }
    };

    // Add enhanced click listener
    document.addEventListener('click', handleEnhancedClick, true);

    // Cleanup function
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleEnhancedClick, true);
    };
  }, []);

  return null; // This component renders nothing
};

export default ButtonClickTracker;
