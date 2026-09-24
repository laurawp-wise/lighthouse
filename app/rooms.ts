export type Direction = "north" | "east" | "south" | "west";

export interface Room {
  name: string;
  mood: string;
  description: string;
  image: string;
  imageAlt: string;
  exits: Partial<Record<Direction, string>>;
}

export const rooms: Record<string, Room> = {
  stairs: {
    name: "Spiral Stair",
    mood: "Windswept",
    description: "An iron stair coils upward through the hollow tower. Salt wind whistles through a narrow window in the stone.",
    image: "assets/spiral-stair.png",
    imageAlt: "An iron spiral staircase winding through the weathered stone lighthouse tower.",
    exits: { east: "lamp", south: "kitchen" },
  },
  lamp: {
    name: "Lamp Room",
    mood: "Radiant",
    description: "The great lens turns slowly, casting a warm blade across the black sea. Brass levers gleam beside a logbook left open to its final page.",
    image: "assets/lamp-room.png",
    imageAlt: "A glowing Fresnel lens, brass controls and open logbook inside the lamp room.",
    exits: { west: "stairs", south: "rocks" },
  },
  kitchen: {
    name: "Keeper's Kitchen",
    mood: "Nostalgic",
    description: "A cold kettle rests on the stove beside a chipped blue cup. The smell of smoke and old coffee lingers in the close air.",
    image: "assets/keepers-kitchen.png",
    imageAlt: "The keeper's worn kitchen with an iron stove, kettle, blue cup and hanging oilskins.",
    exits: { north: "stairs", east: "rocks" },
  },
  rocks: {
    name: "Rocks",
    mood: "Storm-lashed",
    description: "Black rocks shine under the rain as waves break white around them. Above you, the lighthouse beam sweeps patiently through the dark.",
    image: "assets/rocks.png",
    imageAlt: "Storm waves breaking over black rocks beneath the sweeping lighthouse beam.",
    exits: { north: "lamp", west: "kitchen" },
  },
};

export const blockedReasons: Record<Direction, string> = {
  north: "A sheer wall blocks the way north.",
  east: "The sea cuts off the way east.",
  south: "The tide bars the way south.",
  west: "Jagged rocks block the way west.",
};

export const directionArrows: Record<Direction, string> = {
  north: "↑ North",
  east: "→ East",
  south: "↓ South",
  west: "← West",
};

export const keyDirections: Record<string, Direction> = {
  ArrowUp: "north",
  ArrowRight: "east",
  ArrowDown: "south",
  ArrowLeft: "west",
};
