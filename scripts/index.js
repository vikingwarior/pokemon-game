import Sprite from "./Sprite.js";
import Boundary from "./Boundary.js";

import { collisions } from "./data/collisions.js";
import { battleZones } from "./data/battleZones.js";

const canvas = document.querySelector("canvas");

canvas.width = 1024;
canvas.height = 576;

const offset = {
  x: -715,
  y: -595,
};

const extractBoundaryCoordinates = (boundaryArray) => {
  let boundaryCoordinates = [];
  let boundaryData = [];

  for (let i = 0; i < boundaryArray.length; i += 70) {
    boundaryData.push(boundaryArray.slice(i, i + 70));
  }

  boundaryData.forEach((row, rowIndex) => {
    row.forEach((item, colIndex) => {
      if (item === 1025) {
        boundaryCoordinates.push(
          new Boundary({
            position: {
              x: colIndex * Boundary.width + offset.x,
              y: rowIndex * Boundary.height + offset.y,
            },
          })
        );
      }
    });
  });

  return boundaryCoordinates;
};

let collisionBoundaries = extractBoundaryCoordinates(collisions);
let battleZoneBoundaries = extractBoundaryCoordinates(battleZones);

const c = canvas.getContext("2d");

// Background Sprites
const image = new Image();
const foregroundImage = new Image();
const battleZoneImage = new Image();

image.src = "../assets/img/Pellet_Town-zoomed.png";
foregroundImage.src = "../assets/img/foreground_objects.png";
battleZoneImage.src = "../assets/img/battleBackground.png";

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const battleZone = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleZoneImage,
});

// Player Sprites
const playerUp = new Image();
const playerLeft = new Image();
const playerDown = new Image();
const playerRight = new Image();

playerUp.src = "../assets/img/player-sprites/playerUp.png";
playerLeft.src = "../assets/img/player-sprites/playerLeft.png";
playerDown.src = "../assets/img/player-sprites/playerDown.png";
playerRight.src = "../assets/img/player-sprites/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerDown.width / 2,
    y: canvas.height / 2 - playerDown.height,
  },
  image: playerDown,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUp,
    left: playerLeft,
    down: playerDown,
    right: playerRight,
  },
});

// Monster Sprites
const draggleImage = new Image();
const embyImage = new Image();

draggleImage.src = "../assets/img/monster-sprites/draggleSprite.png";
embyImage.src = "../assets/img/monster-sprites/embySprite.png";

const draggle = new Sprite({
  position: {
    x: 800,
    y: 100,
  },
  frames: {
    max: 4,
    hold: 45,
  },
  image: draggleImage,
  animate: true,
  isEnemy: true,
});

const emby = new Sprite({
  position: {
    x: 290,
    y: 325,
  },
  frames: {
    max: 4,
    hold: 45,
  },
  image: embyImage,
  animate: true,
});

// Key Presses Tracker Object
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
  lastKey: "",
};

const runOpenWorld = () => {
  const animationId = requestAnimationFrame(runOpenWorld);

  movePlayerIfKeyPressed(animationId);

  background.draw(c);

  collisionBoundaries.forEach((boundary) => {
    boundary.draw(c);
  });

  battleZoneBoundaries.forEach((boundary) => {
    boundary.draw(c);
  });

  player.draw(c);

  foreground.draw(c);
};

const tackleBtn = document.getElementById("tackle");
tackleBtn.addEventListener("click", () => {
  draggle.attack({
    attack: {
      name: "tackle",
      type: "normal",
      damage: 10,
    },
    recipient: emby,
  });
});

const battleAnimationLoop = () => {
  const animationId = requestAnimationFrame(battleAnimationLoop);
  battleZone.draw(c);
  draggle.draw(c);
  emby.draw(c);
};

const movables = [
  background,
  foreground,
  ...collisionBoundaries,
  ...battleZoneBoundaries,
];

const isColliding = (sprite1, sprite2) => {
  return (
    sprite1.position.x + sprite1.width >= sprite2.position.x &&
    sprite1.position.x <= sprite2.position.x + sprite2.width &&
    sprite1.position.y <= sprite2.position.y + sprite2.height &&
    sprite1.position.y + sprite1.height > sprite2.position.y
  );
};

const movePlayerIfKeyPressed = (animationId) => {
  const lastKey = keys.lastKey;
  let battleInitiated = false;

  player.animate = false;

  if (
    keys["w"].pressed ||
    keys["a"].pressed ||
    keys["s"].pressed ||
    keys["d"].pressed
  ) {
    for (let i = 0; i < battleZoneBoundaries.length; i++) {
      const battleZone = battleZoneBoundaries[i];
      if (isColliding(player, battleZone) && Math.random() < 0.01) {
        cancelAnimationFrame(animationId);
        battleInitiated = true;

        // Flash the screen(Transition to battle)
        gsap.to("#overlay", {
          duration: 0.3,
          repeat: 3,
          yoyo: true,
          opacity: 1,
          onComplete: () => {
            gsap.to("#overlay", {
              duration: 0.3,
              opacity: 1,
              onComplete: () => {
                gsap.to("#overlay", {
                  opacity: 0,
                  duration: 0.3,
                });

                battleAnimationLoop();
              },
            });
          },
        });
        break;
      }
    }
  }

  if (battleInitiated) return;

  if (keys["w"].pressed && lastKey === "w") {
    let moving = true;

    player.animate = true;
    player.image = player.sprites.up;

    for (let i = 0; i < collisionBoundaries.length; i++) {
      const boundary = collisionBoundaries[i];
      if (
        isColliding(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y + 3,
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    moving &&
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys["s"].pressed && lastKey === "s") {
    let moving = true;

    player.animate = true;
    player.image = player.sprites.down;

    for (let i = 0; i < collisionBoundaries.length; i++) {
      const boundary = collisionBoundaries[i];
      if (
        isColliding(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y - 3,
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    moving &&
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys["a"].pressed && lastKey === "a") {
    let moving = true;

    player.animate = true;
    player.image = player.sprites.left;

    for (let i = 0; i < collisionBoundaries.length; i++) {
      const boundary = collisionBoundaries[i];
      if (
        isColliding(player, {
          ...boundary,
          position: {
            x: boundary.position.x + 3,
            y: boundary.position.y,
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    moving &&
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys["d"].pressed && lastKey === "d") {
    let moving = true;

    player.animate = true;
    player.image = player.sprites.right;

    for (let i = 0; i < collisionBoundaries.length; i++) {
      const boundary = collisionBoundaries[i];
      if (
        isColliding(player, {
          ...boundary,
          position: {
            x: boundary.position.x - 3,
            y: boundary.position.y,
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    moving &&
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
};

battleAnimationLoop();
// runOpenWorld();

window.addEventListener("keydown", (e) => {
  if (keys[e.key]) keys[e.key].pressed = true;
  keys.lastKey = e.key;
});

window.addEventListener("keyup", (e) => {
  if (keys[e.key]) keys[e.key].pressed = false;
});
