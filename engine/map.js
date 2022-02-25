class Map extends Sprite {
  constructor(config) {
    config.spriteType = 'map';
    config.x = 0;
    config.y = 0;
    super(config, null);
  }

  createDefaultHitbox() { this.init(); }

  init() { this.isLoaded = true; }

  draw() {
    let offsetX = (this.player.x + TILE_SIZE / 2) - SCREEN_WIDTH / 2;   // during loading, 
    let offsetY = (this.player.y + TILE_SIZE / 2) - SCREEN_HEIGHT / 2;  // player.rect null

    this.isLoaded && this.ctx.drawImage(this.image,
      this.x, this.y,
      MAP_WIDTH,MAP_HEIGHT,
      -offsetX, -offsetY,
      MAP_WIDTH,MAP_HEIGHT,
    )
  }
}