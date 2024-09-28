import Sprite from './Sprite.js';
import Boundary from './Boundary.js';
import { collisions } from './data/collisions.js';

const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;

const offset = {
    x: -715,
    y: -565
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
                            y: rowIndex * Boundary.height + offset.y
                        }
                    }));
            }
        });
    });
}

extractBoundaryCoordinates();

const c = canvas.getContext('2d');

const image = new Image();
const playerDown = new Image();

image.src = '../assets/img/Pellet_Town-zoomed.png';
playerDown.src = '../assets/img/player-sprites/playerDown.png';

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image
});

const player = new Sprite({
    position: {
        x: canvas.width / 2 - playerDown.width / 2 ,
        y: canvas.height / 2 - playerDown.height
    },
    image: playerDown,
    frames: {
        max: 4
    }
});

const keys = {
    'w': { pressed: false },
    'a': { pressed: false },
    's': { pressed: false },
    'd': { pressed: false },
    lastKey: ''
};

const animate = () => {
    requestAnimationFrame(animate);

    movePlayerIfKeyPressed();

    background.draw(c);

    boundaries.forEach(boundary => {
        boundary.draw(c);
    });

    player.draw(c);
};

const movePlayerIfKeyPressed = () => {
    const lastKey = keys.lastKey;

    if (keys['w'].pressed && lastKey === 'w') background.position.y += 6;
    else if (keys['s'].pressed && lastKey === 's') background.position.y -= 6;
    else if (keys['a'].pressed && lastKey === 'a') background.position.x += 6;
    else if (keys['d'].pressed && lastKey === 'd') background.position.x -= 6;
}

animate();

window.addEventListener('keydown', (e) => {
    if (keys[e.key]) keys[e.key].pressed = true;
    keys.lastKey = e.key;
});

window.addEventListener('keyup', (e) => {
    if (keys[e.key]) keys[e.key].pressed = false;
});


