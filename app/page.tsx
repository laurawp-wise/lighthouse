"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { blockedReasons, directionArrows, keyDirections, rooms, type Direction } from "./rooms";

export default function Lighthouse() {
  const [currentRoom, setCurrentRoom] = useState("rocks");
  const [fading, setFading] = useState(false);
  const [message, setMessage] = useState("");
  const moving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const room = rooms[currentRoom];

  useEffect(() => {
    document.body.dataset.room = currentRoom;
  }, [currentRoom]);

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  const move = useCallback((direction: Direction) => {
    if (moving.current) return;
    const destination = rooms[currentRoom].exits[direction];
    if (!destination) {
      setMessage(blockedReasons[direction]);
      return;
    }
    moving.current = true;
    setMessage("");
    setFading(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => {
      setCurrentRoom(destination);
      // Keep the new content hidden for a frame before the entrance transition.
      frame.current = requestAnimationFrame(() => {
        frame.current = requestAnimationFrame(() => {
          setFading(false);
          moving.current = false;
          setMessage(`You are in ${rooms[destination].name}.`);
        });
      });
    }, reducedMotion ? 0 : 220);
  }, [currentRoom]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const direction = keyDirections[event.key];
      if (!direction) return;
      event.preventDefault();
      move(direction);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [move]);

  return (
    <>
      <main aria-labelledby="room-name">
        <div id="room-content" className={fading ? "is-fading" : undefined}>
          <figure className="room-art">
            {/* Preserve the original artwork rendering and avoid an image service dependency. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="room-image" src={`/${room.image}`} alt={room.imageAlt} />
          </figure>
          <section className="room-panel">
            <div className="topline">
              <p className="eyebrow">The Last Light · <span id="mood">{room.mood}</span></p>
              <div className="map" aria-label="Lighthouse map">
                {(["stairs", "lamp", "kitchen", "rocks"] as const).map((id, index) => (
                  <div key={id} className="map-room" data-room={id}
                    aria-label={rooms[id].name}
                    aria-current={id === currentRoom ? "location" : undefined}>
                    <span>{["ST", "LR", "KK", "RK"][index]}</span>
                  </div>
                ))}
              </div>
            </div>
            <h1 id="room-name">{room.name}</h1>
            <div className="rule" aria-hidden="true" />
            <p id="description">{room.description}</p>
            <nav className="navigation" aria-label="Move to another room">
              <span className="label">Explore next</span>
              <div id="directions">
                {(Object.keys(room.exits) as Direction[]).map((direction, index) => {
                  const destination = rooms[room.exits[direction]!].name;
                  return (
                    <button key={index} className="exit-button" type="button"
                      aria-label={`Go ${direction} to ${destination}`}
                      onClick={() => move(direction)}>
                      <span className="exit-direction">{directionArrows[direction]}</span>
                      <span className="exit-destination">{destination}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
            <p id="message" role="status" aria-live="polite">{message}</p>
          </section>
        </div>
      </main>
      <p className="hint">Choose a path or use the arrow keys</p>
    </>
  );
}
