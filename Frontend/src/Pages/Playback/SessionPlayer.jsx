import React, { useEffect, useRef } from "react";
import Player from "rrweb-player";
import "rrweb-player/dist/style.css";

// Custom styles for rrweb player
const playerStyles = `
  .rr-player {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
  }
  .rr-player__frame {
    flex: 1 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: auto !important;
  }
  .rr-player iframe {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    object-fit: contain !important;
  }
  .rr-player .replayer-wrapper {
    width: 100% !important;
    height: 100% !important;
    overflow: auto !important;
  }
`;

function SessionPlayer({ events }) {
  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);

  useEffect(() => {
    if (events && events.length > 0 && playerRef.current) {
      // Clear any existing player
      playerRef.current.innerHTML = '';
      
      // Get container dimensions
      const container = playerRef.current;
      const containerWidth = container.offsetWidth || 800;
      const containerHeight = container.offsetHeight || 600;
      
      const playerInstance = new Player({
        target: container, // where to render
        props: {
          events,                   // your JSON from DB
          showController: true,
          width: containerWidth,
          height: containerHeight - 60, // Account for controls
          autoPlay: false,
          speedOption: [0.5, 1, 1.5, 2, 4, 8],
          skipInactive: false,
          showWarning: true,
          mouseTail: true,
          insertStyleRules: [
            '.replayer-wrapper { width: 100% !important; height: 100% !important; overflow: auto !important; }',
            'iframe { object-fit: contain !important; }'
          ]
        },
      });
      
      playerInstanceRef.current = playerInstance;
      
      // Style adjustments after player creation
      setTimeout(() => {
        const playerElement = container.querySelector('.rr-player');
        const iframe = container.querySelector('iframe');
        const replayerWrapper = container.querySelector('.replayer-wrapper');
        
        if (playerElement) {
          playerElement.style.width = '100%';
          playerElement.style.height = '100%';
          playerElement.style.maxWidth = '100%';
          playerElement.style.maxHeight = '100%';
          playerElement.style.display = 'flex';
          playerElement.style.flexDirection = 'column';
        }
        
        if (replayerWrapper) {
          replayerWrapper.style.width = '100%';
          replayerWrapper.style.height = '100%';
          replayerWrapper.style.overflow = 'auto';
          replayerWrapper.style.display = 'flex';
          replayerWrapper.style.justifyContent = 'center';
          replayerWrapper.style.alignItems = 'flex-start';
        }
        
        if (iframe) {
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.style.transform = 'none'; // Remove scaling to show full content
          iframe.style.transformOrigin = 'center';
          iframe.style.backgroundColor = '#f0f0f0';
          iframe.style.maxWidth = 'none';
          iframe.style.maxHeight = 'none';
        }
      }, 100);
    }
    
    // Cleanup function
    return () => {
      if (playerInstanceRef.current) {
        // Clean up player instance if needed
        playerInstanceRef.current = null;
      }
    };
  }, [events]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: playerStyles }} />
      <div 
        ref={playerRef} 
        className="w-full h-full"
        style={{ 
          minHeight: '400px',
          overflow: 'auto',
          position: 'relative'
        }}
      ></div>
    </>
  );
}

export default SessionPlayer;
