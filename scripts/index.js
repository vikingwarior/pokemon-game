import Sprite from './Sprite.js';
import Boundary from './Boundary.js';
import { collisions } from './data/collisions.js';

const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;

const offset = {
    x: -736,
    y: -605
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

    c.drawImage(playerDown, // image
        0, // sx -> start clipping on the X axis from the image
        0, // sy -> start clipping on the Y axis from the image
        playerDown.width / 4, // ex -> end clipping on the X axis from the image
        playerDown.height, // ey -> end clipping on the Y axis from the image
        canvas.width / 2 - playerDown.width / 8, // x coordinate on the canvas
        canvas.height / 2 - playerDown.height / 2, // y coordinate on the canvas
        playerDown.width / 4, // width of the image
        playerDown.height // height of the image
    );

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


