class Sprites {
  constructor(config) {
    //Set up the image
    this.ctx = config.ctx;
    this.spriteType = config.spriteType;
    this.src = config.src;

    this.x = config.x;
    this.y = config.y;
    this.player = config.player;

    this.loadDefaultSprite();
  }

  loadDefaultSprite() {
    this.image = new Image();
    this.image.src = this.src;
    this.image.onload = this.createDefaultHitbox.bind(this);
  }

  createDefaultHitbox() {
    let imageOffsetY = this.spriteType === 'object' ? TILE_SIZE : 0;
      
    this.rect = new Rect(this.x, this.y - imageOffsetY, this.image.width, this.image.height);

    this.init();
  }

  init() {
    SPRITE_COUNTER += 1;
  };

  draw() {
    if (this.spriteType === 'invisible' || !this.rect) // if invisible sprite or sprite is not loaded
      return;
    let offsetX = (this.player.rect.x + TILE_SIZE / 2) - SCREEN_WIDTH / 2;  // player.rect.left, top + TILE_SIZE / 2 to calculate center of player
    let offsetY = (this.player.rect.y + TILE_SIZE / 2) - SCREEN_HEIGHT / 2;  // 

    this.ctx.drawImage(this.image,
      0,0,
      this.image.width,this.image.height,
      this.rect.x - offsetX, this.rect.y - offsetY,
      this.image.width,this.image.height
    )
  }
}