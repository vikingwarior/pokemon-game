import Sprite from "./classes/Sprite.js";
import Boundary from "./classes/Boundary.js";
import Monster from "./classes/Monster.js";

import { collisions } from "./data/collisions.js";
import { battleZones } from "./data/battleZones.js";

import Attacks from "./data/Attacks.js";
import { Draggle, Emby } from "./data/MonsterData.js";
import { audio } from "./data/Audio.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

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
            canvasPlane: c,
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

// Background Sprites
const image = new Image();
const foregroundImage = new Image();
const battleZoneImage = new Image();

image.src = "../assets/img/Pellet_Town-zoomed.png";
foregroundImage.src = "../assets/img/foreground_objects.png";
battleZoneImage.src = "../assets/img/battleBackground.png";

const background = new Sprite({
  canvasPlane: c,
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  canvasPlane: c,
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const battleZone = new Sprite({
  canvasPlane: c,
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

let clicked = false
window.addEventListener("keydown", () => {
  if (!clicked && !battleAnimationLoopId) {
    clicked = true;
    audio.openWorld.play();
  }
});

const player = new Sprite({
  canvasPlane: c,
  position: {
    x: canvas.width / 2 - playerDown.width / 2,
    y: canvas.height / 2 - playerDown.height,
  },
  image: playerDown,
  frames: {
    max: 4,
    hold: 15,
  },
  sprites: {
    up: playerUp,
    left: playerLeft,
    down: playerDown,
    right: playerRight,
  },
  animate: true,
});

// Tracking for moving objects
const movables = [
  background,
  foreground,
  ...collisionBoundaries,
  ...battleZoneBoundaries,
];

// Returns true if given sprites are colliding
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

        audio.openWorld.stop();
        audio.initBattle.play();

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
                audio.initBattle.stop();
                audio.battle.play();
                battleInterfaceContainer.removeAttribute("hidden");
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

window.addEventListener("keydown", (e) => {
  if (keys[e.key]) keys[e.key].pressed = true;
  keys.lastKey = e.key;
});

window.addEventListener("keyup", (e) => {
  if (keys[e.key]) keys[e.key].pressed = false;
});

// Key Press Tracker Object
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

  background.draw();

  collisionBoundaries.forEach((boundary) => {
    boundary.draw();
  });

  battleZoneBoundaries.forEach((boundary) => {
    boundary.draw();
  });

  player.draw();

  foreground.draw();
};

// Battle Logic start

const battleInterfaceContainer = document.querySelector("div.battleInterface");
const attackTypeDiv = document.querySelector("div.attackInfo");
const attackInfoDiv = document.querySelector("div.attackBarDialogue");

let draggle = new Monster(Draggle);
let emby = new Monster(Emby);
let attackQueue = [];
let spritesToRender = [draggle, emby];

let battleAnimationLoopId;

const initBattle = () => {
  draggle.reset();
  embydraggle.reset();
  attackQueue = [];

  document.querySelectorAll("button").forEach((attackBtn) => {
    attackBtn.addEventListener("click", () => {
      emby.attack({
        attack: Attacks[attackBtn.innerHTML],
        recipient: draggle,
        attackSprites: spritesToRender,
      });

      if (draggle.health <= 0) {
        attackQueue.push(() => draggle.faint());
        attackQueue.push(() => transitionToMap());

      } else if (emby.health <= 0) {
        emby.faint();
        attackQueue.push(() => transitionToMap());
      }

      attackQueue.push(() => {
        draggle.attack({
          attack: Attacks.Tackle,
          recipient: emby,
          attackSprites: spritesToRender,
        });
      });
    });

    attackBtn.addEventListener("mouseenter", () => {
      attackTypeDiv.innerHTML = `${Attacks[attackBtn.innerHTML].type}`;

      attackTypeDiv.style.color = Attacks[attackBtn.innerHTML].color;
    });

    attackBtn.addEventListener("mouseleave", () => {
      attackTypeDiv.innerHTML = `Attack Type`;

      attackTypeDiv.style.color = "black";
    });
  });
};

const battleAnimationLoop = () => {
  battleAnimationLoopId = requestAnimationFrame(battleAnimationLoop);
  battleZone.draw();

  spritesToRender.forEach((sprite) => sprite.draw());
};

document.querySelectorAll("button").forEach((attackBtn) => {
  attackBtn.addEventListener("click", () => {
    emby.attack({
      attack: Attacks[attackBtn.innerHTML],
      recipient: draggle,
      attackSprites: spritesToRender,
    });

    if (draggle.health <= 0) {
      attackQueue.push(() => draggle.faint());
      attackQueue.push(() => transitionToMap());
      return;
    } else if (emby.health <= 0) {
      emby.faint();
      attackQueue.push(() => transitionToMap());
      return;
    }

    attackQueue.push(() => {
      draggle.attack({
        attack: Attacks.Tackle,
        recipient: emby,
        attackSprites: spritesToRender,
      });
    });
  });

  attackBtn.addEventListener("mouseenter", () => {
    attackTypeDiv.innerHTML = `${Attacks[attackBtn.innerHTML].type}`;

    attackTypeDiv.style.color = Attacks[attackBtn.innerHTML].color;
  });

  attackBtn.addEventListener("mouseleave", () => {
    attackTypeDiv.innerHTML = `Attack Type`;

    attackTypeDiv.style.color = "black";
  });
});

const transitionToMap = () => {
  gsap.to("#overlay", {
    opacity: 1,
    onComplete: () => {
      cancelAnimationFrame(battleAnimationLoopId);
      runOpenWorld();
      gsap.to("#overlay", { opacity: 0 });
      audio.battle.stop();
      audio.openWorld.play();

      battleInterfaceContainer.setAttribute("hidden", "true");
      initBattle();
    },
  });
};

attackInfoDiv.addEventListener("click", (e) => {
  if (attackQueue.length > 0) {
    attackQueue[0]();
    attackQueue.shift();
  } else e.target.setAttribute("hidden", "true");
});

// Start game
runOpenWorld();
