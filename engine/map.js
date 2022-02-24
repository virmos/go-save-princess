class Map extends Sprites {
  constructor(config) {
    super(config);
  }

  createDefaultHitbox() { this.init(); }

  init() { this.isLoaded = true; }

  draw() {
    let offsetX = (this.player.rect.x + TILE_SIZE / 2) - SCREEN_WIDTH / 2;  // player.rect.left, top + 32 to calculate center of player
    let offsetY = (this.player.rect.y + TILE_SIZE / 2) - SCREEN_HEIGHT / 2;  // 

    this.isLoaded && this.ctx.drawImage(this.image,
      0,0,
      MAP_WIDTH,MAP_HEIGHT,
      -offsetX, -offsetY,
      MAP_WIDTH,MAP_HEIGHT,
    )
  }
}