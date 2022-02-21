class Map {
  constructor(config) {
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    this.ctx = config.ctx;
  }

  draw(player) {
    let offsetX = (player.rect.left + TILE_SIZE / 2) - SCREEN_WIDTH / 2;  // player.rect.left, top + 32 to calculate center of player
    let offsetY = (player.rect.top + TILE_SIZE / 2) - SCREEN_HEIGHT / 2;  // 

    this.isLoaded && this.ctx.drawImage(this.image,
      0,0,
      MAP_WIDTH,MAP_HEIGHT,
      -offsetX, -offsetY,
      MAP_WIDTH,MAP_HEIGHT,
    )
  }
}