class Weapon extends Sprite {
  constructor(config) {
    config.x = config.player.x;
    config.y = config.player.y;
    config.src = `graphics/weapons/${config.player.weaponType}/${config.player.weaponDirection}.png`;
    config.spriteType = 'weapon';
    super(config);

    this.player = config.player;
  }

  createDefaultHitbox() {
    let player = this.player;
    let weaponDirection = player.weaponDirection;
    
    let offsetX = 10; // to make it beautiful
    let offsetY = 16;
    if (weaponDirection === 'up') {
      // midbottom weapon == midtop player
      this.x = player.x + player.image.width / 2 - this.image.width / 2 + offsetX;
      this.y = player.y - this.image.height + offsetY;
    } else if (weaponDirection === 'down') {
      // midtop weapon == midbottom player
      this.x = player.x + player.image.width / 2 - this.image.width / 2 + offsetX;
      this.y = player.y + player.image.height;
    } else if (weaponDirection === 'left') {
      // midright weapon == midleft player
      this.x = player.x - this.image.width;
      this.y = player.y + player.image.height / 2 - this.image.height / 2 + offsetY;
    } else if (weaponDirection === 'right') {
      // midleft weapon == midright player
      this.x = player.x + player.image.width;
      this.y = player.y + player.image.height / 2 - this.image.height / 2 + offsetY;
    }
    this.rect = new Rect(this.x, this.y, this.image.width, this.image.height);

    this.init();
  }

  init() {  }

  delete() {
    this.image = null;
    this.rect = null;
  }

  update(state) {  }
}