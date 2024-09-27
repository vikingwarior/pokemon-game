class Sprite {
  constructor({ position, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, laps: 0 };
    this.moving = false;

    image.onload = () => {
      this.width = image.width / frames.max;
      this.height = image.height;
    };
  }

  draw(canvasPlane) {
    const { x, y } = this.position;

    canvasPlane.drawImage(
      this.image, // image
      this.frames.val * this.width, // sx -> start clipping X coordinate
      0, // sy -> start clipping Y coordinate
      this.width, // ex -> end clipping X coordinate
      this.height, // ey -> end clipping on the Y coordinate
      x, // x axis offset
      y, // y axis offset
      this.width, // width of the image
      this.height // height of the image
    );

    if (!this.moving) return;

    if (this.frames.laps++ % 15 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

export default Sprite;
