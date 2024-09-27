class Sprite {
    constructor({ position, image }) {
        this.position = position;
        this.image = image;
    }

    draw(canvasPlane) {
        const { x, y } = this.position;
        canvasPlane.drawImage(this.image, x, y);
    }
}

export default Sprite;