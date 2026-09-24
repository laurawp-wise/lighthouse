"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { directionArrows, keyDirections, rooms, type Direction } from "./rooms";
import { createGame, movePlayer } from "./game";

export default function Lighthouse() {
  const [game, setGame] = useState(createGame);
  const currentRoom = game.currentRoom;
  const [fading, setFading] = useState(false);
  const [message, setMessage] = useState("");
  const moving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const room = rooms[currentRoom];
  const navigationMessage = message || (game.hasVisitedKitchen
    ? "The Lamp Room is unlocked."
    : "Visit the kitchen to unlock the Lamp Room.");

  useEffect(() => {
    document.body.dataset.room = currentRoom;
  }, [currentRoom]);

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  const move = useCallback((direction: Direction) => {
    if (moving.current) return;
    const result = movePlayer(game, direction);
    if (result.state.currentRoom === currentRoom) {
      setMessage(result.message);
      return;
    }
    moving.current = true;
    setMessage("");
    setFading(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => {
      setGame(result.state);
      // Keep the new content hidden for a frame before the entrance transition.
      frame.current = requestAnimationFrame(() => {
        frame.current = requestAnimationFrame(() => {
          setFading(false);
          moving.current = false;
          setMessage(!game.hasVisitedKitchen && result.state.hasVisitedKitchen
            ? "Lamp Room unlocked. You can go in now."
            : result.message);
        });
      });
    }, reducedMotion ? 0 : 220);
  }, [game, currentRoom]);

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
              <p id="message" className={game.hasVisitedKitchen ? "notice notice-open" : "notice notice-locked"}
                role="status" aria-live="polite" aria-atomic="true">{navigationMessage}</p>
              <div id="directions">
                {(Object.keys(room.exits) as Direction[]).map((direction, index) => {
                  const destination = rooms[room.exits[direction]!].name;
                  const locked = movePlayer(game, direction).state.currentRoom === currentRoom;
                  return (
                    <button key={index} className={`exit-button${locked ? " exit-locked" : ""}`} type="button"
                      aria-label={locked ? `${destination} locked. Visit the kitchen to unlock.` : `Go ${direction} to ${destination}`}
                      aria-describedby={locked ? "message" : undefined}
                      onClick={() => move(direction)}>
                      <span className="exit-direction">{directionArrows[direction]}{locked && <span className="lock-badge">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <rect x="3" y="7" width="10" height="7" rx="2" />
                          <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                        </svg>Locked
                      </span>}</span>
                      <span className="exit-destination">{destination}</span>
                      <span className="exit-help">{locked ? "Visit kitchen first" : "Tap to enter"}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </section>
        </div>
      </main>
      <p className="hint">Choose a path or use the arrow keys</p>
    </>
  );
}
