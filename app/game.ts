import { blockedReasons, rooms, type Direction } from "./rooms.ts";

export interface GameState {
  readonly currentRoom: string;
  readonly hasVisitedKitchen: boolean;
}

export interface MoveResult {
  state: GameState;
  message: string;
}

export function createGame(): GameState {
  return { currentRoom: "rocks", hasVisitedKitchen: false };
}

// Pure movement rules: no browser, React, timers, or mutation of the input state.
export function movePlayer(state: GameState, direction: Direction): MoveResult {
  const destination = rooms[state.currentRoom].exits[direction];
  if (!destination) {
    return { state, message: blockedReasons[direction] };
  }

  if (destination === "lamp" && !state.hasVisitedKitchen) {
    return { state, message: "The lamp room door is locked." };
  }

  return {
    state: {
      currentRoom: destination,
      hasVisitedKitchen: state.hasVisitedKitchen || destination === "kitchen",
    },
    message: `You are in ${rooms[destination].name}.`,
  };
}
