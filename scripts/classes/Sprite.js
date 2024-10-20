class Sprite {
  constructor({
    canvasPlane,
    position,
    image,
    frames = { max: 1, hold: 15 },
    sprites,
    animate = false,
    
  }) {
    this.canvasPlane = canvasPlane;
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, laps: 0 };
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;

    this.movementDelta = 20;

    image.onload = () => {
      this.width = image.width / frames.max;
      this.height = image.height;
    };
  }

  draw() {
    const { x, y } = this.position;
    this.canvasPlane.save();
    this.canvasPlane.globalAlpha = this.opacity;
    this.canvasPlane.drawImage(
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
    this.canvasPlane.restore();

    if (!this.animate) return;

    if (this.frames.laps++ % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

export default Sprite;
