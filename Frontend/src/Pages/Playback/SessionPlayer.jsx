import React, { useEffect, useRef } from "react";
import Player from "rrweb-player";
import "rrweb-player/dist/style.css";

function SessionPlayer({ events }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (events && events.length > 0 && playerRef.current) {
      new Player({
        target: playerRef.current, // where to render
        props: {
          events,                   // your JSON from DB
          showController: true,
          width: 800,
          height: 600,
        },
      });
    }
  }, [events]);

  return <div ref={playerRef}></div>;
}

export default SessionPlayer;
