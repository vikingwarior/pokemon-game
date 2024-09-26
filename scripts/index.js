const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext('2d');

c.fillStyle = "black";
c.fillRect(0, 0, c.width, c.height);

const image = new Image();
const playerDown = new Image();

image.src = '../assets/img/Pellet_Town-zoomed.png';
playerDown.src = '../assets/img/player-sprites/playerDown.png';

image.onload = () => {
    c.drawImage(image, -736, -605);
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
}