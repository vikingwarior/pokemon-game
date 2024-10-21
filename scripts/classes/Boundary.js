class Boundary {
  static height = 48;
  static width = 48;
  constructor({ position, canvasPlane }) {
    this.height = 48;
    this.width = 48;
    this.position = position;
    this.canvasPlane = canvasPlane;
  }

  draw() {
    const { x, y } = this.position;
    this.canvasPlane.fillStyle = "rgb(0, 0, 0, 0)";
    this.canvasPlane.fillRect(x, y, this.width, this.height);
  }
}

export default Boundary;
