class Sprites {
  constructor(config) {
    //Set up the image
    this.ctx = config.ctx;
    this.image = new Image();
    this.image.src = config.src;
    this.spriteType = config.spriteType;

    this.x = config.x;
    this.y = config.y;

    this.image.onload = () => {
      let imageOffsetY = this.spriteType === 'object' ? TILE_SIZE : 0;
      
      this.rect = new Rect({top: this.y - imageOffsetY, bottom: this.y + this.image.height - imageOffsetY, 
        left: this.x, right:  this.x + this.image.width});

      this.init();
    }
  }

  init() {
    this.isLoaded = true;
    SPRITE_COUNTER += 1;
  };

  draw(player) {
    if (this.spriteType === 'invisible')
      return;
      
    let offsetX = (player.rect.left + TILE_SIZE / 2) - SCREEN_WIDTH / 2;  // player.rect.left, top + TILE_SIZE / 2 to calculate center of player
    let offsetY = (player.rect.top + TILE_SIZE / 2) - SCREEN_HEIGHT / 2;  // 

    this.ctx.drawImage(this.image,
      0,0,
      this.image.width,this.image.height,
      this.rect.left - offsetX, this.rect.top - offsetY,
      this.image.width,this.image.height
    )
  }
}