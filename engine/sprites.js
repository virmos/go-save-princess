class Sprites {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    this.ctx = config.ctx;

    this.rect = new Rect({top: config.y, bottom: config.y + 64, left: config.x, right:  config.x + 64})
    // 64 is sprite size
  }

  draw() {
    
    this.isLoaded && this.ctx.drawImage(this.image,
      0,0,
      64,64,
      this.rect.left, this.rect.top,
      64,64
    )
  }

  update() {
    this.draw();
  }
}