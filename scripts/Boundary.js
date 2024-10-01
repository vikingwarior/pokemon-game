class Boundary {
  static height = 48;
  static width = 48;
  constructor({ position }) {
    this.height = 48;
    this.width = 48;
    this.position = position;
  }

  draw(canvasPlane) {
    const { x, y } = this.position;
    canvasPlane.fillStyle = "rgb(0, 0, 0, 0)";
    canvasPlane.fillRect(x, y, this.width, this.height);
  }
}

export default Boundary;
