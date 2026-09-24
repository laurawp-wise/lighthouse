import assert from "node:assert/strict";
import { test } from "node:test";
import { createGame, movePlayer } from "../app/game.ts";
import { keyDirections } from "../app/rooms.ts";

test("pressing up from the Rocks at the start stays on the Rocks with the locked-door message", () => {
  const initial = createGame();
  const result = movePlayer(initial, keyDirections.ArrowUp);

  assert.deepEqual(result, {
    state: initial,
    message: "The lamp room door is locked.",
  });
});

test("after visiting the Keeper's Kitchen, pressing up from the Rocks enters the Lamp Room", () => {
  const kitchen = movePlayer(createGame(), keyDirections.ArrowLeft);
  assert.equal(kitchen.state.currentRoom, "kitchen");

  const rocks = movePlayer(kitchen.state, keyDirections.ArrowRight);
  assert.equal(rocks.state.currentRoom, "rocks");

  const lamp = movePlayer(rocks.state, keyDirections.ArrowUp);
  assert.equal(lamp.state.currentRoom, "lamp");
  assert.equal(lamp.message, "You are in Lamp Room.");
});

test("the Lamp Room is also locked from the Spiral Stair before a kitchen visit", () => {
  const state = { currentRoom: "stairs", hasVisitedKitchen: false };
  assert.deepEqual(movePlayer(state, "east"), {
    state,
    message: "The lamp room door is locked.",
  });
});

test("visiting the kitchen unlocks either entrance and does not mutate previous state", () => {
  const initial = Object.freeze(createGame());
  const kitchen = movePlayer(initial, "west").state;
  assert.equal(kitchen.hasVisitedKitchen, true);
  assert.deepEqual(initial, { currentRoom: "rocks", hasVisitedKitchen: false });
  const stairs = movePlayer(kitchen, "north").state;
  assert.equal(movePlayer(stairs, "east").state.currentRoom, "lamp");
});

test("blocked directions retain state and their existing explanation", () => {
  const state = createGame();
  assert.deepEqual(movePlayer(state, "south"), {
    state,
    message: "The tide bars the way south.",
  });
});
