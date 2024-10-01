import Sprite from "./Sprite.js";
import Boundary from "./Boundary.js";
import { collisions } from "./data/collisions.js";

const canvas = document.querySelector("canvas");

canvas.width = 1024;
canvas.height = 576;

const offset = {
  x: -715,
  y: -595,
};

let boundaries = [];

const extractBoundaryCoordinates = () => {
  let collisionData = [];

  for (let i = 0; i < collisions.length; i += 70) {
    collisionData.push(collisions.slice(i, i + 70));
  }

  collisionData.forEach((row, rowIndex) => {
    row.forEach((item, colIndex) => {
      if (item === 1025) {
        boundaries.push(
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
};

extractBoundaryCoordinates();

const c = canvas.getContext("2d");

const image = new Image();
const playerDown = new Image();

image.src = "../assets/img/Pellet_Town-zoomed.png";
playerDown.src = "../assets/img/player-sprites/playerDown.png";

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image,
});

const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerDown.width / 2,
    y: canvas.height / 2 - playerDown.height,
  },
  image: playerDown,
  frames: {
    max: 4,
  },
});

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
  lastKey: "",
};

const animate = () => {
  requestAnimationFrame(animate);

  movePlayerIfKeyPressed();

  background.draw(c);

  boundaries.forEach((boundary) => {
    boundary.draw(c);
  });

  player.draw(c);
};

const movables = [background, ...boundaries];

const isColliding = (sprite1, sprite2) => {
  return (
    sprite1.position.x + sprite1.width >= sprite2.position.x &&
    sprite1.position.x <= sprite2.position.x + sprite2.width &&
    sprite1.position.y <= sprite2.position.y + sprite2.height &&
    sprite1.position.y + sprite1.height > sprite2.position.y
  );
};

const movePlayerIfKeyPressed = () => {
  const lastKey = keys.lastKey;

  if (keys["w"].pressed && lastKey === "w") {
    let moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
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
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
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
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
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
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
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

animate();

window.addEventListener("keydown", (e) => {
  if (keys[e.key]) keys[e.key].pressed = true;
  keys.lastKey = e.key;
});

window.addEventListener("keyup", (e) => {
  if (keys[e.key]) keys[e.key].pressed = false;
});
