import K from "../kaboom";
import enemySprite from "../../assets/images/sprites/enemy.png";
import ghosts from "../../assets/images/sprites/pac-man-ghosts-blue.png";
import ghostDeath from "../../assets/audio/effects/pacman/ghost-dead.mp3";
import explosion from "../../assets/images/sprites/explosion.png";
import { getRandomNumber } from "../helpers/math";

K.loadSprite("enemy", enemySprite);
K.loadSprite("ghost", ghosts, { sliceX: 4, sliceY: 1 });
K.loadSprite("explosion", explosion, {
  sliceX: 20,
  sliceY: 1,
  anims: {
    boom: { from: 1, to: 19, speed: 32 },
  },
});
K.loadSound("ghost-dead", ghostDeath);

export class Enemy {
  constructor(player) {
    this.sprite = K.add([
      K.sprite("ghost", { frame: 1 }),
      K.pos(),
      K.area(),
      K.scale(1),
      K.body(),
      K.color(),
      // enemyMovement(player),
      "enemy",
    ]);

    const value1 = K.height() - this.sprite.height - 10;

    const posY = getRandomNumber(value1, 10);

    const posX = player.sprite.pos.x + 300;

    this.sprite.pos.x = posX;
    this.sprite.pos.y = posY;

    this.health = 100;

    this.sprite.add([moveEnemyTowardsPosition(player, this)]);

    this.sprite.onCollide("bullet", (bullet) => this.takeDamage(bullet.damage));
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 50) {
      this.sprite.color = { r: 255, g: 100, b: 100 };
    }

    if (this.health <= 0) {
      K.play("ghost-dead");
      const explosion = K.add([K.sprite("explosion"), K.pos(this.sprite.pos)]);
      this.sprite.destroy();
      explosion.play("boom");
    }
  }
}

function enemyMovement(player) {
  return {
    add() {},
    update() {
      this.move(-50, 0);
    },
  };
}

function moveEnemyTowardsPosition(player, enemy) {
  return {
    add() {},
    update() {
      const enemyPosition = enemy.sprite.pos;
      const playerPosition = player.sprite.pos;
      const direction = K.vec2(
        playerPosition.x - enemyPosition.x,
        playerPosition.y - enemyPosition.y
      );

      const normalizedDirection = K.vec2(direction.x, direction.y);

      enemy.sprite.move(normalizedDirection);
    },
  };
}
