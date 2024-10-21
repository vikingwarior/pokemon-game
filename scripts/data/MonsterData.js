import Attacks from "./Attacks.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const draggleImage = new Image();
const embyImage = new Image();

draggleImage.src = "../assets/img/monster-sprites/draggleSprite.png";
embyImage.src = "../assets/img/monster-sprites/embySprite.png";

export const Draggle = {
  canvasPlane: c,
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
  name: "Draggle",
  attacks: [Attacks.Tackle]
};

export const Emby = {
  canvasPlane: c,
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
  name: "Emby",
  attacks: [Attacks.Tackle, Attacks.Fireball],
};
