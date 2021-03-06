class Weapon extends Sprite {
  constructor(config, groups) {
    config.x = config.player.x;
    config.y = config.player.y;
    config.src = `graphics/weapons/${config.player.weaponType}/${config.player.weaponDirection}.png`;
    console.log(config.src)
    config.spriteType = 'weapon';
    super(config, groups);
  }

  createDefaultHitbox() {
    let player = this.player;
    let weaponDirection = player.weaponDirection;
    
    let offsetX = 10; // to make it beautiful
    let offsetY = 16;
    if (weaponDirection === 'up') {
      // midbottom weapon == midtop player
      this.x = player.x + player.image.width / 2 - this.image.width / 2 + offsetX + 5; // + 5 is hardcoded for link
      this.y = player.y - this.image.height + offsetY + 3; // + 3 is hardcoded for link
    } else if (weaponDirection === 'down') {
      // midtop weapon == midbottom player
      this.x = player.x + player.image.width / 2 - this.image.width / 2 + offsetX + 5; // + 5 is hardcoded for link
      this.y = player.y + player.image.height - 3; // - 3 is hardcoded for link
    } else if (weaponDirection === 'left') {
      // midright weapon == midleft player
      this.x = player.x - this.image.width + 5; // + 5 is hardcoded for link
      this.y = player.y + player.image.height / 2 - this.image.height / 2 + offsetY;
    } else if (weaponDirection === 'right') {
      // midleft weapon == midright player
      this.x = player.x + player.image.width - 5; // - 5 is hardcoded for link
      this.y = player.y + player.image.height / 2 - this.image.height / 2 + offsetY;
    }
    this.rect = new Rect(this.x, this.y, this.image.width, this.image.height);

    this.init();
  }

  init() { 
    this.groups.forEach(group => group.push(this));
   }

  update(state) {  }
}