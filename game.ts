type Direction = "north" | "east" | "south" | "west";

interface Room {
  name: string;
  mood: string;
  description: string;
  image: string;
  imageAlt: string;
  exits: Partial<Record<Direction, string>>;
}

const rooms: Record<string, Room> = {
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

const blockedReasons: Record<Direction, string> = {
  north: "A sheer wall blocks the way north.",
  east: "The sea cuts off the way east.",
  south: "The tide bars the way south.",
  west: "Jagged rocks block the way west.",
};

const directionArrows: Record<Direction, string> = {
  north: "↑ North",
  east: "→ East",
  south: "↓ South",
  west: "← West",
};

const keyDirections: Record<string, Direction> = {
  ArrowUp: "north",
  ArrowRight: "east",
  ArrowDown: "south",
  ArrowLeft: "west",
};

let currentRoom = "rocks";

const roomName = document.querySelector<HTMLElement>("#room-name")!;
const mood = document.querySelector<HTMLElement>("#mood")!;
const description = document.querySelector<HTMLElement>("#description")!;
const directions = document.querySelector<HTMLElement>("#directions")!;
const message = document.querySelector<HTMLElement>("#message")!;
const roomContent = document.querySelector<HTMLElement>("#room-content")!;
const roomImage = document.querySelector<HTMLImageElement>("#room-image")!;
const mapRooms = document.querySelectorAll<HTMLElement>(".map-room");
let moving = false;

function render(): void {
  const room = rooms[currentRoom];
  document.body.dataset.room = currentRoom;
  roomName.textContent = room.name;
  mood.textContent = room.mood;
  description.textContent = room.description;
  roomImage.src = room.image;
  roomImage.alt = room.imageAlt;
  directions.textContent = (Object.keys(room.exits) as Direction[])
    .map((direction) => directionArrows[direction])
    .join("  ·  ");
  mapRooms.forEach((mapRoom) => {
    if (mapRoom.dataset.room === currentRoom) {
      mapRoom.setAttribute("aria-current", "location");
    } else {
      mapRoom.removeAttribute("aria-current");
    }
  });
}

function move(direction: Direction): void {
  if (moving) return;
  const destination = rooms[currentRoom].exits[direction];

  if (!destination) {
    message.textContent = blockedReasons[direction];
    return;
  }

  moving = true;
  roomContent.classList.add("is-fading");
  message.textContent = "";

  window.setTimeout(() => {
    currentRoom = destination;
    render();
    requestAnimationFrame(() => {
      roomContent.classList.remove("is-fading");
      moving = false;
    });
  }, 220);
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
  const direction = keyDirections[event.key];
  if (!direction) return;

  event.preventDefault();
  move(direction);
});

render();
