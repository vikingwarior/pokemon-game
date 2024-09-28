class Boundary {
    static height = 48;
    static width = 48;

    constructor({position}) {
        this.position = position;
    }

    draw(canvasPlane) {
        const { x, y } = this.position;
        canvasPlane.fillStyle = 'red';
        canvasPlane.fillRect(x, y, Boundary.width, Boundary.height);
    }

    // Add methods here
}

export default Boundary;