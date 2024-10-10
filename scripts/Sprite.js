class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 15 },
    sprites,
    animate = false,
    isEnemy = false,
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, laps: 0 };
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;

    this.movementDelta = 20;
    this.opponentHealthBarId = "#enemyHealthBar";

    if (isEnemy) {
      this.movementDelta = -20;
      this.opponentHealthBarId = "#playerHealthBar";
    }

    image.onload = () => {
      this.width = image.width / frames.max;
      this.height = image.height;
    };
  }

  draw(canvasPlane) {
    const { x, y } = this.position;
    canvasPlane.save();
    canvasPlane.globalAlpha = this.opacity;
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
    canvasPlane.restore();

    if (!this.animate) return;

    if (this.frames.laps++ % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  attack({ attack, recipient }) {
    const tl = gsap.timeline();
    recipient.health -= attack.damage;

    switch (attack.name) {
      case "Tackle":
        this.useTackle(tl, recipient);
        break;

      case "Fireball":
        this.useFireBall(tl, recipient);
        break;
    }
  }

  useTackle(tl, recipient) {
    tl.to(this.position, {
      x: this.position.x - this.movementDelta,
    })
      .to(this.position, {
        x: this.position.x + this.movementDelta * 2,
        duration: 0.1,
        onComplete: () => {
          gsap.to(this.opponentHealthBarId, {
            width: recipient.health + "%",
          });

          gsap.to(recipient.position, {
            x: recipient.position.x - 10,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
          });

          gsap.to(recipient, {
            opacity: 0,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
          });
        },
      })
      .to(this.position, {
        x: this.position.x,
      });
  }

  useFireBall(tl, recipient){

  }
}

export default Sprite;
