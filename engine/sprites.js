class Sprites {
  constructor(config) {
    //Set up the image
    this.spriteType = config.spriteType;
    if (this.spriteType !== 'invisible') {
      this.image = new Image();
      this.image.src = config.src;
      this.image.onload = () => {
        this.isLoaded = true;
      }
    }
    
    this.ctx = config.ctx;

    this.rect = new Rect({top: config.y, bottom: config.y + 64, left: config.x, right:  config.x + 64})
    // 64 is sprite size
  }

  draw(player) {
    if (this.spriteType === 'invisible')
      return;
      
    let offsetX = (player.rect.left + 32) - 1280 / 2; // player.rect.left, top + 32 to calculate center of player
    let offsetY = (player.rect.top + 32) - 720 / 2;  // 

    this.isLoaded && this.ctx.drawImage(this.image,
      0,0,
      64,64,
      this.rect.left - offsetX, this.rect.top - offsetY,
      64,64
    )
  }
}