import { audio } from "../data/Audio.js";
import Sprite from "./Sprite.js";

class Monster extends Sprite {
  constructor({
    name,
    isEnemy = false,
    canvasPlane,
    position,
    image,
    frames,
    sprites,
    animate,
    attacks,
  }) {
    super({
      canvasPlane,
      position,
      image,
      frames,
      sprites,
      animate,
    });

    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;

    this.opponentHealthBarId = "#enemyHealthBar";

    if (isEnemy) {
      this.movementDelta = -20;
      this.opponentHealthBarId = "#playerHealthBar";
    }

    this.attackContainer = document.querySelector("div.attackSelection");

    !isEnemy && this.generateAttacksForMonster(attacks);
  }

  generateAttacksForMonster(attacks) {
    this.attackContainer.innerHTML = "";
    attacks.forEach((attack) => {
      const attackBtn = document.createElement("button");
      attackBtn.innerHTML = attack.name;
      this.attackContainer.appendChild(attackBtn);
    });
  }

  faint() {
    audio.battle.stop();
    
    const attackBarDialogueElem = document.querySelector(
      "div.attackBarDialogue"
    );

    attackBarDialogueElem.innerHTML = `${this.name} Fainted!`;
    attackBarDialogueElem.removeAttribute("hidden");

    gsap.to(this.position, {
      y: this.position.y + 20,
    });

    gsap.to(this, {
      opacity: 0,
    });

    audio.victory.play();
  }

  reset() {
    this.health = 100;

    document
      .querySelector("div.attackBarDialogue")
      .setAttribute("hidden", "true");

    gsap.to(this, {
      opacity: 1,
    });

    gsap.to(this.position, {
      y: this.position.y - 20,
    });

    gsap.to("#playerHealthBar", {
      width: "100%",
    });

    gsap.to("#enemyHealthBar", {
      width: "100%",
    });
  }

  attack({ attack, recipient, attackSprites }) {
    const tl = gsap.timeline();
    recipient.health -= attack.damage;

    const attackInfoDiv = document.querySelector("div.attackBarDialogue");

    // Queue attack sequence:
    attackInfoDiv.innerHTML = `${this.name} used ${attack.name}`;
    attackInfoDiv.removeAttribute("hidden");

    switch (attack.name) {
      case "Tackle":
        this.useTackle(tl, recipient);
        break;

      case "Fireball":
        audio.initFireball.play();
        this.useFireBall(recipient, attackSprites);
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
          audio.tackleHit.play();
          this.loadOpponentHitAnimation(recipient);
        },
      })
      .to(this.position, {
        x: this.position.x,
      });
  }

  useFireBall(recipient, attackSprites) {
    const fireballImage = new Image();
    fireballImage.src = "../assets/img/monster-sprites/fireball.png";

    const fireball = new Sprite({
      canvasPlane: this.canvasPlane,
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      image: fireballImage,
      frames: {
        max: 4,
        hold: 10,
      },
      animate: true,
    });

    attackSprites.splice(1, 0, fireball);

    gsap.to(fireball.position, {
      x: recipient.position.x,
      y: recipient.position.y,
      onComplete: () => {
        attackSprites.splice(1, 1);
        this.loadOpponentHitAnimation(recipient);
        audio.fireballHit.play();
      },
    });
  }

  loadOpponentHitAnimation(recipient) {
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
  }
}

export default Monster;
