const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext('2d');

c.fillStyle = "black";
c.fillRect(0, 0, c.width, c.height);

const image = new Image();
image.src = '../assets/img/Pellet_Town-zoomed.png';
image.onload = () => {
    c.drawImage(image, -750, -550);
}